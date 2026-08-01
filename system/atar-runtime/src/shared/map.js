// Shared map renderer. Leaflet loads DIRECTLY from cdnjs (like vis-network — no iframe-srcDoc;
// the Claude artifact CSP whitelists cdnjs <script>). Leaflet's layout CSS is embedded in
// styles/map.css (NOT a cross-origin <link>, which the artifact CSP may block). OSM tiles.
// On Leaflet-load failure OR tile failure → a zero-network d3-free SVG equirectangular VectorMap,
// so a map is ALWAYS rendered.
import { escapeHtml } from './escape.js';

const LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
const LEAFLET_JS_FALLBACK = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';
const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTR = '© OpenStreetMap contributors';

// createMap(container, cfg, env) → handle (methods become live once the map is ready).
// cfg = {
//   points: [{ id, lat, lng, color, radius, fillOpacity, popupHtml, onClick(id) }],
//   center?: [lat,lng], zoom?, fit?: true, tileTimeout?: 4500, afterReady?(handle)
// }
// handle = { mode, applyStyle(id,{opacity,radius}), focus(id), invalidate(), destroy() }
export function createMap(container, cfg, env) {
  cfg = cfg || {};
  var points = (cfg.points || []).filter(function (p) { return p && p.lat != null && p.lng != null; });

  var handle = {
    mode: 'pending',
    ready: false,
    _markers: {},
    _pendingFocus: null,
    _styleQueue: [],
    applyStyle: function (id, style) {
      if (this.ready && this._applyStyle) this._applyStyle(id, style);
      else this._styleQueue.push([id, style]);
    },
    focus: function (id) { this._pendingFocus = id; if (this.ready && this._focus) this._focus(id); },
    invalidate: function () { if (this.ready && this._invalidate) this._invalidate(); },
    destroy: function () { try { if (this._destroy) this._destroy(); } catch (e) {} }
  };

  if (!points.length) { return handle; }

  if (typeof container.__atarMapToken === 'undefined') container.__atarMapToken = 0;
  var token = ++container.__atarMapToken;

  env.loadScript(LEAFLET_JS, 'L', { fallbackUrl: LEAFLET_JS_FALLBACK, timeout: 8000 })
    .then(function (L) {
      if (container.__atarMapToken !== token) return; // a newer render superseded this one
      // CRITICAL: force CPU (left/top) tile positioning instead of GPU translate3d. In the Claude
      // artifact iframe (and headless Chromium) Leaflet's translate3d placement is corrupted —
      // 256px tiles land on a 512px grid, so only a sparse diagonal block fills (verified: any3d=false
      // → clean 256px grid covers the container; any3d=true → scattered). left/top positioning is
      // immune. Set before any L.map() so panes/tiles are built without 3d transforms.
      L.Browser.any3d = false;
      // Create the map ONLY once the container has a real size. The container is 0-size for a
      // frame after innerHTML, and L.map() caches the container size at construction — building it
      // at 0-size then fixing up with invalidateSize leaves the tile pixel-origin mismatched
      // (tiles render for the wrong area). Waiting for a real size makes the map correct from birth.
      whenSized(container, function () {
        if (container.__atarMapToken !== token) return;
        buildLeaflet(L, container, points, cfg, env, handle, token);
      });
    })
    .catch(function () {
      if (container.__atarMapToken !== token) return;
      buildVector(container, points, cfg, env, handle);
    });

  return handle;
}

// Call cb once the element has a SUBSTANTIAL, STABLE layout size (or after a safety cap).
// "Substantial + stable" (≥80px and unchanged for 2 frames) matters: building Leaflet at a
// transient tiny size makes it cache a near-tile-sized viewport and render only a small centred
// block that invalidateSize doesn't always recover (the bug seen in the Claude artifact).
function whenSized(el, cb) {
  var done = false, tries = 0, lastW = -1, lastH = -1, stable = 0;
  var raf = (typeof requestAnimationFrame === 'function') ? requestAnimationFrame : function (f) { setTimeout(f, 16); };
  function check() {
    if (done) return;
    var w = el.clientWidth, h = el.clientHeight;
    if (w >= 80 && h >= 80) {
      stable = (w === lastW && h === lastH) ? stable + 1 : 0;
      lastW = w; lastH = h;
      if (stable >= 1) { done = true; cb(); return; } // two consecutive equal substantial frames
    }
    if (++tries > 240) { done = true; cb(); return; } // ~4s safety — build anyway
    raf(check);
  }
  raf(check);
}

function finishReady(handle, cfg) {
  handle.ready = true;
  handle._styleQueue.forEach(function (q) { if (handle._applyStyle) handle._applyStyle(q[0], q[1]); });
  handle._styleQueue = [];
  if (handle._pendingFocus != null && handle._focus) handle._focus(handle._pendingFocus);
  if (typeof cfg.afterReady === 'function') { try { cfg.afterReady(handle); } catch (e) {} }
}

function buildLeaflet(L, container, points, cfg, env, handle, token) {
  handle.mode = 'leaflet';
  container.innerHTML = '';
  container.classList.add('atar-map-leaflet');

  var map = L.map(container, {
    zoomControl: true, attributionControl: true, scrollWheelZoom: true,
    fadeAnimation: false, zoomAnimation: false, markerZoomAnimation: false // transform-based anims; off for the same reason as any3d
  });
  container.__atarLeafletMap = map; // debug/inspection hook

  var latlngs = points.map(function (p) { return [p.lat, p.lng]; });

  // SET THE VIEW BEFORE ADDING THE TILE LAYER. Order matters: if tiles are added while the map has
  // no/default view and the view is set afterwards, the initial-view tiles linger as orphans and the
  // grid renders scattered (verified). Setting the view first → the tile layer loads exactly the
  // target tiles, one clean grid. getBoundsZoom works here because whenSized guaranteed a real size.
  if (cfg.fit !== false && latlngs.length > 1) {
    var b = L.latLngBounds(latlngs).pad(0.12);
    map.setView(b.getCenter(), Math.min(12, map.getBoundsZoom(b)), { animate: false });
  } else {
    map.setView(latlngs[0] || cfg.center || [31.5, 35], cfg.zoom || (latlngs.length === 1 ? 13 : 7), { animate: false });
  }

  var tiles = L.tileLayer(OSM_URL, { maxZoom: 19, attribution: OSM_ATTR, crossOrigin: true });
  var tileLoaded = 0, tileErrors = 0;
  tiles.on('tileload', function () { tileLoaded++; });
  tiles.on('tileerror', function () { tileErrors++; });
  tiles.addTo(map);

  points.forEach(function (p) {
    var m = L.circleMarker([p.lat, p.lng], {
      radius: p.radius || 8,
      fillColor: p.color || '#2563eb',
      fillOpacity: p.fillOpacity != null ? p.fillOpacity : 0.85,
      color: '#fff', weight: 2
    }).addTo(map);
    if (p.popupHtml) m.bindPopup(p.popupHtml);
    if (typeof p.onClick === 'function') { (function (pt) { m.on('click', function () { pt.onClick(pt.id); }); })(p); }
    handle._markers[p.id] = { marker: m, point: p };
  });

  handle._applyStyle = function (id, style) {
    var entry = handle._markers[id]; if (!entry) return;
    var s = {};
    if (style.opacity != null) s.fillOpacity = style.opacity;
    entry.marker.setStyle(s);
    if (style.radius != null) entry.marker.setRadius(style.radius);
  };
  handle._focus = function (id) {
    var entry = handle._markers[id]; if (!entry) return;
    map.setView(entry.marker.getLatLng(), 14);
    entry.marker.openPopup();
  };
  handle._invalidate = function () { try { map.invalidateSize(); } catch (e) {} };
  handle._destroy = function () {
    if (handle._ro) { try { handle._ro.disconnect(); } catch (e) {} }
    try { map.remove(); } catch (e) {}
  };

  // The artifact container resizes (tab show, panel grow, window resize) WITHOUT a window resize
  // event. On a real size CHANGE, invalidateSize() to refill tiles — keep center/zoom (no re-fit,
  // which would orphan tiles). Fills the new size without disturbing the user's view.
  if (typeof ResizeObserver !== 'undefined') {
    var t = null, lastW = 0, lastH = 0;
    handle._ro = new ResizeObserver(function (entries) {
      var r = entries[0] && entries[0].contentRect;
      if (!r || r.width < 5 || r.height < 5) return;
      var changed = Math.abs(r.width - lastW) > 2 || Math.abs(r.height - lastH) > 2;
      lastW = r.width; lastH = r.height;
      if (!changed) return;
      if (t) clearTimeout(t);
      t = setTimeout(function () { try { map.invalidateSize(false); } catch (e) {} }, 80);
    });
    handle._ro.observe(container);
  }

  // Tile-failure → vector fallback (zero-network). If nothing loaded in time, swap.
  setTimeout(function () {
    if (container.__atarMapToken !== token) return;
    if (tileLoaded === 0) {
      handle._destroy();
      handle.ready = false; handle._markers = {};
      buildVector(container, points, cfg, env, handle);
    }
  }, cfg.tileTimeout || 4500);

  finishReady(handle, cfg);
}

// ── Zero-network SVG equirectangular fallback ──
function buildVector(container, points, cfg, env, handle) {
  handle.mode = 'vector';
  container.classList.remove('atar-map-leaflet');
  container.classList.add('atar-map-vector');

  var lats = points.map(function (p) { return p.lat; });
  var lngs = points.map(function (p) { return p.lng; });
  var minLat = Math.min.apply(null, lats), maxLat = Math.max.apply(null, lats);
  var minLng = Math.min.apply(null, lngs), maxLng = Math.max.apply(null, lngs);

  // Min span floor so a single point / tight cluster does not divide by zero or over-zoom.
  var MIN_LAT_SPAN = 2.2, MIN_LNG_SPAN = 3.5;
  var latSpan = maxLat - minLat, lngSpan = maxLng - minLng;
  if (latSpan < MIN_LAT_SPAN) { var cLat = (minLat + maxLat) / 2; minLat = cLat - MIN_LAT_SPAN / 2; maxLat = cLat + MIN_LAT_SPAN / 2; }
  if (lngSpan < MIN_LNG_SPAN) { var cLng = (minLng + maxLng) / 2; minLng = cLng - MIN_LNG_SPAN / 2; maxLng = cLng + MIN_LNG_SPAN / 2; }
  // Pad 12%.
  var padLat = (maxLat - minLat) * 0.12, padLng = (maxLng - minLng) * 0.12;
  minLat -= padLat; maxLat += padLat; minLng -= padLng; maxLng += padLng;

  var W = 800, H = 480;
  function px(lng) { return (lng - minLng) / (maxLng - minLng) * W; }
  function py(lat) { return (maxLat - lat) / (maxLat - minLat) * H; }

  var L = env.lang === 'he';
  var note = L ? 'מפה לא מקוונת (אריחים לא נטענו)' : 'Offline map (tiles unavailable)';

  // Graticule lines (whole-degree) for spatial reference.
  var grid = '';
  var lng0 = Math.ceil(minLng), lng1 = Math.floor(maxLng);
  for (var gx = lng0; gx <= lng1; gx++) { var x = px(gx); grid += '<line x1="' + x.toFixed(1) + '" y1="0" x2="' + x.toFixed(1) + '" y2="' + H + '" class="atar-vmap-grid"/>'; }
  var lat0 = Math.ceil(minLat), lat1 = Math.floor(maxLat);
  for (var gy = lat0; gy <= lat1; gy++) { var y = py(gy); grid += '<line x1="0" y1="' + y.toFixed(1) + '" x2="' + W + '" y2="' + y.toFixed(1) + '" class="atar-vmap-grid"/>'; }

  var dots = points.map(function (p) {
    var x = px(p.lng), y = py(p.lat);
    var r = p.radius || 8;
    var fill = p.color || '#2563eb';
    var fo = p.fillOpacity != null ? p.fillOpacity : 0.85;
    var label = escapeHtml(p.label || (p.popupTitle || ''));
    return '<g class="atar-vmap-pt" data-id="' + escapeHtml(p.id) + '" style="cursor:' + (p.onClick ? 'pointer' : 'default') + '">' +
      '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + fill + '" fill-opacity="' + fo + '" stroke="#fff" stroke-width="2"/>' +
      (label ? '<text x="' + (x + r + 3).toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" class="atar-vmap-lbl">' + label + '</text>' : '') +
      '</g>';
  }).join('');

  container.innerHTML =
    '<div class="atar-vmap-wrap">' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" class="atar-vmap-svg" role="img">' +
        '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="atar-vmap-bg"/>' + grid + dots +
      '</svg>' +
      '<div class="atar-vmap-note">📍 ' + escapeHtml(note) + '</div>' +
    '</div>';

  // Wire clicks + record ids for style queue (opacity dimming on filter).
  handle._markers = {};
  points.forEach(function (p) {
    var g = container.querySelector('.atar-vmap-pt[data-id="' + cssEscape(p.id) + '"]');
    handle._markers[p.id] = { el: g, point: p };
    if (g && typeof p.onClick === 'function') { (function (pt) { g.addEventListener('click', function () { pt.onClick(pt.id); }); })(p); }
  });

  handle._applyStyle = function (id, style) {
    var entry = handle._markers[id]; if (!entry || !entry.el) return;
    var circle = entry.el.querySelector('circle');
    if (circle && style.opacity != null) circle.setAttribute('fill-opacity', style.opacity);
    if (circle && style.radius != null) circle.setAttribute('r', style.radius);
  };
  handle._focus = function (id) {
    var entry = handle._markers[id]; if (!entry || !entry.el) return;
    entry.el.classList.add('is-focus');
    Object.keys(handle._markers).forEach(function (k) { if (k !== id && handle._markers[k].el) handle._markers[k].el.classList.remove('is-focus'); });
  };
  handle._invalidate = function () {};
  handle._destroy = function () {};

  finishReady(handle, cfg);
}

// Minimal CSS.escape shim (attribute-selector safe) — ids in this domain are simple, but guard anyway.
function cssEscape(s) {
  return String(s == null ? '' : s).replace(/["\\\]]/g, '\\$&');
}
