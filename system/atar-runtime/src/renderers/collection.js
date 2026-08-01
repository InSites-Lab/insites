// Collection Dashboard renderer — ported from the earlier standalone ChatGPT runtime.
// Mechanical port: IIFE/boot/injectStyles/norm removed; reads pre-normalized `data`; renders into the
// `root` scaffold; shared escapeHtml; map via shared/map.js (Leaflet cdnjs + vector fallback); live AI tab.
import { escapeHtml } from '../shared/escape.js';
import { renderAIPanel } from '../shared/ai-query.js';
import { createMap } from '../shared/map.js';

var COLORS = {
  bg: '#f5f7fa', bgCard: '#ffffff', border: '#dfe4ea', text: '#1e293b', textDim: '#475569', textMuted: '#94a3b8',
  accent: '#2563eb', accentLight: '#dbeafe', green: '#10b981', greenLight: '#d1fae5', amber: '#f59e0b',
  amberLight: '#fef3c7', red: '#ef4444', redLight: '#fee2e2', purple: '#8b5cf6', purpleLight: '#ede9fe',
  blue: '#3b82f6', blueLight: '#dbeafe', slate: '#64748b', headerBg: '#1e293b',
  depthRich: '#d97706', depthMedium: '#0369a1', depthThin: '#a8a29e'
};
var DEPTH_COLORS = { rich: COLORS.depthRich, medium: COLORS.depthMedium, thin: COLORS.depthThin };
var DEPTH_RADIUS = { rich: 10, medium: 7, thin: 5 };
var VALUE_CELL_COLORS = { e: { bg: COLORS.greenLight, text: '#065f46' }, i: { bg: COLORS.amberLight, text: '#92400e' }, a: { bg: '#f1f5f9', text: COLORS.textMuted } };
var THEME_DOT_COLORS = [COLORS.accent, COLORS.purple, COLORS.green, COLORS.amber, COLORS.red, COLORS.blue, COLORS.slate, '#d946ef', '#14b8a6', '#f97316'];

var UI = {
  en: {
    overview: 'Overview', map: 'Map', values: 'Values', themes: 'Themes', aiQuery: 'AI Query', noThemes: 'No themes identified',
    sites: 'Sites', regions: 'Regions', timeSpan: 'Time Span', depth: 'Depth', depthDist: 'Depth Distribution',
    byRegion: 'By Region', byType: 'By Type', byPeriod: 'By Period', byDepth: 'By Depth', collectionSummary: 'Collection Summary',
    patterns: 'Patterns', gapsLabel: 'Gaps', distinctives: 'Distinctives', all: 'All', rich: 'Rich', medium: 'Medium', thin: 'Thin',
    region: 'Region', description: 'Description', threats: 'Threats', site: 'Site', type: 'Type', period: 'Period',
    explicit: 'Explicit', implied: 'Implied', absent: 'Absent', valueSpecs: 'Value Specifications', backToTab: '← Back',
    noCoords: 'No coordinates available for this collection', terrain: 'Terrain', satellite: 'Satellite', streets: 'Streets',
    narrative: 'Narrative', noValueData: 'No value data available'
  },
  he: {
    overview: 'סקירה', map: 'מפה', values: 'ערכים', themes: 'נושאים', aiQuery: 'שאילתת AI', noThemes: 'לא זוהו נושאים',
    sites: 'אתרים', regions: 'אזורים', timeSpan: 'טווח זמן', depth: 'עומק', depthDist: 'התפלגות עומק',
    byRegion: 'לפי אזור', byType: 'לפי סוג', byPeriod: 'לפי תקופה', byDepth: 'לפי עומק', collectionSummary: 'סיכום אוסף',
    patterns: 'דפוסים', gapsLabel: 'פערים', distinctives: 'ייחודים', all: 'הכל', rich: 'עשיר', medium: 'בינוני', thin: 'דל',
    region: 'אזור', description: 'תיאור', threats: 'איומים', site: 'אתר', type: 'סוג', period: 'תקופה',
    explicit: 'מפורש', implied: 'משתמע', absent: 'חסר', valueSpecs: 'פירוט ערכים', backToTab: '← חזרה',
    noCoords: 'אין קואורדינטות זמינות לאוסף זה', terrain: 'שטח', satellite: 'לווין', streets: 'רחובות',
    narrative: 'נרטיב', noValueData: 'אין נתוני ערכים זמינים'
  }
};

var TAB_DEFS = [
  { id: 'overview', icon: '📊' }, { id: 'map', icon: '🗺️' }, { id: 'values', icon: '🎨' }, { id: 'themes', icon: '🎯' }
];
var TAB_LABELS = { overview: 'overview', map: 'map', values: 'values', themes: 'themes', aiquery: 'aiQuery' };

var AI_STARTERS = [
  { en: 'What value patterns are shared across sites?', he: 'אילו דפוסי ערך משותפים לאתרים?' },
  { en: 'How does the geographic distribution look?', he: 'כיצד נראית ההתפלגות הגאוגרפית?' },
  { en: 'Compare the assessment methodologies used', he: 'השוו את שיטות ההערכה שננקטו' },
  { en: 'Where are the biggest data gaps?', he: 'היכן פערי המידע הגדולים ביותר?' },
  { en: 'What management clusters emerge?', he: 'אילו אשכולות ניהול עולים?' }
];

export function renderCollection(root, data, host, env) {
  var ui = UI[env.lang] || UI.en;
  var state = { activeTab: 'overview', previousTab: null, depthFilter: 'all', expandedSite: null, mapHandle: null, pendingFocus: null };

  var siteNameMap = {};
  data.sites.forEach(function (s) { siteNameMap[s.name] = s.id; });

  /* ── helpers ── */
  function barChart(items, color, maxVal) {
    if (!maxVal) { maxVal = 0; items.forEach(function (it) { if (it.count > maxVal) maxVal = it.count; }); }
    if (maxVal === 0) maxVal = 1;
    var html = '';
    items.forEach(function (it) {
      var pct = Math.round((it.count / maxVal) * 100);
      html += '<div class="cd-bar-row"><span class="cd-bar-label" title="' + escapeHtml(it.label) + '">' + escapeHtml(it.label) + '</span>';
      html += '<span class="cd-bar-track"><span class="cd-bar-fill" style="width:' + pct + '%;background:' + (color || COLORS.accent) + '"></span></span>';
      html += '<span class="cd-bar-count">' + it.count + '</span></div>';
    });
    return html;
  }
  function siteLink(site) { return '<button class="cd-site-link" data-nav-site="' + escapeHtml(site.id) + '">' + escapeHtml(site.name) + '</button>'; }
  function cellHtml(cell) {
    var val = String(cell == null ? '' : cell);
    if (siteNameMap[val]) return '<button class="cd-site-link" data-nav-site="' + escapeHtml(siteNameMap[val]) + '">' + escapeHtml(val) + '</button>';
    return escapeHtml(val);
  }

  /* ── 1. Overview ── */
  function renderOverview() {
    var html = '<div class="cd-kpi-row">';
    html += '<div class="cd-kpi"><div class="cd-kpi-value">' + data.sites.length + '</div><div class="cd-kpi-label">' + escapeHtml(ui.sites) + '</div></div>';
    html += '<div class="cd-kpi"><div class="cd-kpi-value">' + data.regionList.length + '</div><div class="cd-kpi-label">' + escapeHtml(ui.regions) + '</div></div>';
    html += '<div class="cd-kpi"><div class="cd-kpi-value">' + escapeHtml(data.timeSpanLabel) + '</div><div class="cd-kpi-label">' + escapeHtml(ui.timeSpan) + '</div></div>';
    var richPct = data.sites.length > 0 ? Math.round(data.depthCounts.rich / data.sites.length * 100) : 0;
    html += '<div class="cd-kpi"><div class="cd-kpi-value">' + richPct + '%</div><div class="cd-kpi-label">' + escapeHtml(ui.rich) + ' ' + escapeHtml(ui.depth) + '</div></div>';
    html += '</div>';

    var maxSites = data.sites.length || 1;
    html += '<div class="cd-card"><div class="cd-card-title">' + escapeHtml(ui.byRegion) + '</div>';
    var regionItems = data.regionList.map(function (r) { return { label: r, count: data.regionCounts[r] }; });
    regionItems.sort(function (a, b) { return b.count - a.count; });
    html += barChart(regionItems, COLORS.accent, maxSites) + '</div>';

    var typeKeys = Object.keys(data.typeCounts).sort(function (a, b) { return data.typeCounts[b] - data.typeCounts[a]; });
    if (typeKeys.length > 0) {
      html += '<div class="cd-card"><div class="cd-card-title">' + escapeHtml(ui.byType) + '</div>';
      html += barChart(typeKeys.map(function (k) { return { label: k, count: data.typeCounts[k] }; }), COLORS.purple, maxSites) + '</div>';
    }
    var periodKeys = Object.keys(data.periodCounts).sort(function (a, b) { return data.periodCounts[b] - data.periodCounts[a]; });
    if (periodKeys.length > 0) {
      html += '<div class="cd-card"><div class="cd-card-title">' + escapeHtml(ui.byPeriod) + '</div>';
      html += barChart(periodKeys.map(function (k) { return { label: k, count: data.periodCounts[k] }; }), COLORS.amber, maxSites) + '</div>';
    }
    html += '<div class="cd-card"><div class="cd-card-title">' + escapeHtml(ui.byDepth) + '</div>';
    html += barChart([{ label: ui.rich, count: data.depthCounts.rich }, { label: ui.medium, count: data.depthCounts.medium }, { label: ui.thin, count: data.depthCounts.thin }], COLORS.amber, maxSites) + '</div>';

    if (data.collectionSummary.narrative) {
      html += '<div class="cd-card"><div class="cd-card-title">' + escapeHtml(ui.collectionSummary) + '</div>';
      html += '<p class="cd-narrative">' + escapeHtml(data.collectionSummary.narrative) + '</p>';
      if (data.collectionSummary.patterns.length > 0) { html += '<div class="cd-section-label">' + escapeHtml(ui.patterns) + '</div><ul class="cd-list">'; data.collectionSummary.patterns.forEach(function (p) { html += '<li>' + escapeHtml(p) + '</li>'; }); html += '</ul>'; }
      if (data.collectionSummary.gaps.length > 0) { html += '<div class="cd-section-label">' + escapeHtml(ui.gapsLabel) + '</div><ul class="cd-list">'; data.collectionSummary.gaps.forEach(function (g) { html += '<li>' + escapeHtml(g) + '</li>'; }); html += '</ul>'; }
      if (data.collectionSummary.distinctives.length > 0) { html += '<div class="cd-section-label">' + escapeHtml(ui.distinctives) + '</div><ul class="cd-list">'; data.collectionSummary.distinctives.forEach(function (dd) { html += '<li>' + escapeHtml(dd) + '</li>'; }); html += '</ul>'; }
      html += '</div>';
    }
    return html;
  }

  /* ── 2. Map ── */
  function hasAnyCoords() { return data.sites.some(function (s) { return s.lat != null && s.lng != null; }); }
  function renderMap() {
    if (!hasAnyCoords()) return '<div class="cd-map-placeholder">📍 ' + escapeHtml(ui.noCoords) + '</div>';
    var html = '';
    if (state.previousTab) html += '<button class="cd-back-btn" data-action="go-back">' + escapeHtml(ui.backToTab) + '</button>';
    html += '<div class="cd-filter-row">';
    ['all', 'rich', 'medium', 'thin'].forEach(function (f) {
      html += '<button class="cd-filter-btn' + (state.depthFilter === f ? ' is-active' : '') + '" data-depth-filter="' + f + '">' + escapeHtml(ui[f] || f) + '</button>';
    });
    html += '</div><div class="cd-map"></div>';
    return html;
  }
  function buildSitePopup(site) {
    var popup = '<strong>' + escapeHtml(site.name) + '</strong>';
    if (site.region) popup += '<br>' + escapeHtml(ui.region) + ': ' + escapeHtml(site.region);
    popup += '<br>' + escapeHtml(ui.depth) + ': ' + escapeHtml(site.depth);
    if (site.significanceSummary) { var ss = site.significanceSummary.length > 120 ? site.significanceSummary.substring(0, 120) + '…' : site.significanceSummary; popup += '<br>' + escapeHtml(ss); }
    if (site.highlight) popup += '<br><em>' + escapeHtml(site.highlight) + '</em>';
    if (site.description) { var dd = site.description.length > 120 ? site.description.substring(0, 120) + '…' : site.description; popup += '<br><em>' + escapeHtml(dd) + '</em>'; }
    if (site.threats && site.threats.length > 0) popup += '<br>⚠️ ' + escapeHtml(site.threats.join(', '));
    return popup;
  }
  function applyDepthFilter() {
    if (!state.mapHandle) return;
    data.sites.forEach(function (site) {
      if (site.lat == null || site.lng == null) return;
      var depth = site.depth || 'thin';
      if (state.depthFilter === 'all' || depth === state.depthFilter) state.mapHandle.applyStyle(site.id, { opacity: 0.85, radius: DEPTH_RADIUS[depth] || 5 });
      else state.mapHandle.applyStyle(site.id, { opacity: 0.15, radius: 3 });
    });
  }
  function initMap() {
    if (!hasAnyCoords()) return;
    var container = root.querySelector('.cd-map');
    if (!container) return;
    if (state.mapHandle) { state.mapHandle.destroy(); state.mapHandle = null; }
    var points = data.sites.filter(function (s) { return s.lat != null && s.lng != null; }).map(function (site) {
      var depth = site.depth || 'thin';
      return { id: site.id, lat: site.lat, lng: site.lng, color: DEPTH_COLORS[depth] || DEPTH_COLORS.thin, radius: DEPTH_RADIUS[depth] || 5, label: site.name, popupHtml: buildSitePopup(site) };
    });
    state.mapHandle = createMap(container, {
      points: points, fit: true, center: [31.5, 35], zoom: 7,
      afterReady: function (h) {
        applyDepthFilter();
        if (state.pendingFocus) { h.focus(state.pendingFocus); state.pendingFocus = null; }
      }
    }, env);
  }

  /* ── 3. Values ── */
  function renderValues() {
    if (data.sites.length === 0 || data.valueTypes.length === 0) return '<div class="cd-card cd-empty">' + escapeHtml(ui.noValueData) + '</div>';
    var html = '<div class="cd-card cd-scroll-x"><div class="cd-card-title">' + escapeHtml(ui.values) + '</div><table class="cd-table"><thead><tr><th>' + escapeHtml(ui.site) + '</th>';
    data.valueTypes.forEach(function (vt) { html += '<th class="cd-th-center">' + escapeHtml(vt) + '</th>'; });
    html += '</tr></thead><tbody>';
    data.sites.forEach(function (site) {
      var expanded = state.expandedSite === site.id;
      html += '<tr><td>' + siteLink(site) + '</td>';
      data.valueTypes.forEach(function (vt) {
        var val = (site.values && site.values[vt]) || 'a';
        var vc = VALUE_CELL_COLORS[val] || VALUE_CELL_COLORS.a;
        html += '<td class="cd-td-center"><span class="cd-val-cell" style="background:' + vc.bg + ';color:' + vc.text + '">' + escapeHtml(val) + '</span></td>';
      });
      html += '</tr>';
      if (expanded && site.valueSpecs) {
        var specKeys = Object.keys(site.valueSpecs);
        if (specKeys.length > 0) {
          html += '<tr><td colspan="' + (data.valueTypes.length + 1) + '"><div class="cd-expand"><strong>' + escapeHtml(ui.valueSpecs) + ' — ' + escapeHtml(site.name) + '</strong>';
          if (site.highlight) html += '<div class="cd-expand-hl">' + escapeHtml(site.highlight) + '</div>';
          specKeys.forEach(function (k) { html += '<div class="cd-expand-spec"><span class="cd-pill cd-pill-accent">' + escapeHtml(k) + '</span> <span class="cd-expand-spec-text">' + escapeHtml(site.valueSpecs[k]) + '</span></div>'; });
          html += '</div></td></tr>';
        }
      }
    });
    html += '<tr class="cd-table-foot"><td>' + escapeHtml(ui.explicit) + '/' + escapeHtml(ui.implied) + '/' + escapeHtml(ui.absent) + '</td>';
    data.valueTypes.forEach(function (vt) {
      var eC = 0, iC = 0, aC = 0;
      data.sites.forEach(function (s) { var v = (s.values && s.values[vt]) || 'a'; if (v === 'e') eC++; else if (v === 'i') iC++; else aC++; });
      html += '<td class="cd-td-center cd-foot-counts"><span class="cd-c-e">' + eC + '</span>/<span class="cd-c-i">' + iC + '</span>/<span class="cd-c-a">' + aC + '</span></td>';
    });
    html += '</tr></tbody></table></div>';
    return html;
  }

  /* ── 4. Themes ── */
  function renderThemes() {
    if (!data.themes || data.themes.length === 0) return '<div class="cd-card cd-empty">' + escapeHtml(ui.noThemes) + '</div>';
    var html = '';
    data.themes.forEach(function (theme, idx) {
      var dotColor = THEME_DOT_COLORS[idx % THEME_DOT_COLORS.length];
      html += '<div class="cd-card"><div class="cd-theme-head"><span class="cd-theme-dot" style="background:' + dotColor + '"></span><span class="cd-card-title cd-theme-label">' + escapeHtml(theme.label || theme.id || '') + '</span></div>';
      if (theme.description) html += '<p class="cd-theme-desc">' + escapeHtml(theme.description) + '</p>';
      if (theme.sites && theme.sites.length > 0) {
        html += '<div class="cd-theme-sites">';
        theme.sites.forEach(function (siteId) {
          var site = data.sites.filter(function (s) { return s.id === siteId; })[0];
          html += '<button class="cd-pill cd-pill-accent cd-pill-btn" data-nav-site="' + escapeHtml(siteId) + '">' + escapeHtml(site ? site.name : siteId) + '</button>';
        });
        html += '</div>';
      }
      if (theme.evidence) {
        var evidenceKeys = Object.keys(theme.evidence);
        if (evidenceKeys.length > 0) {
          html += '<div class="cd-theme-evidence">';
          evidenceKeys.forEach(function (siteId) {
            var site = data.sites.filter(function (s) { return s.id === siteId; })[0];
            html += '<div class="cd-evidence-row"><strong>' + escapeHtml(site ? site.name : siteId) + ':</strong> ' + escapeHtml(theme.evidence[siteId]) + '</div>';
          });
          html += '</div>';
        }
      }
      html += '</div>';
    });
    return html;
  }

  /* ── Dynamic tab renderers ── */
  function renderGenericTable(t) {
    if (!t || !t.columns || !t.rows) return '';
    var html = '<div class="cd-card cd-scroll-x"><table class="cd-table"><thead><tr>';
    t.columns.forEach(function (col) { html += '<th>' + escapeHtml(col) + '</th>'; });
    html += '</tr></thead><tbody>';
    t.rows.forEach(function (row) { html += '<tr>'; row.forEach(function (cell) { html += '<td>' + cellHtml(cell) + '</td>'; }); html += '</tr>'; });
    html += '</tbody></table></div>';
    return html;
  }
  function renderGenericCards(t) {
    if (!t || !t.cards) return '';
    var levelColors = { high: { bg: COLORS.redLight, text: '#991b1b' }, medium: { bg: COLORS.amberLight, text: '#92400e' }, low: { bg: COLORS.greenLight, text: '#065f46' }, strong: { bg: COLORS.greenLight, text: '#065f46' }, moderate: { bg: COLORS.amberLight, text: '#92400e' }, weak: { bg: COLORS.redLight, text: '#991b1b' } };
    var html = '<div class="cd-card-grid">';
    t.cards.forEach(function (card) {
      html += '<div class="cd-card"><div class="cd-card-title">' + escapeHtml(card.title || '') + '</div>';
      if (card.subtitle) html += '<div class="cd-gcard-sub">' + escapeHtml(card.subtitle) + '</div>';
      if (card.level) { var lc = levelColors[(card.level || '').toLowerCase()] || { bg: '#f1f5f9', text: COLORS.textMuted }; html += '<span class="cd-pill" style="background:' + lc.bg + ';color:' + lc.text + '">' + escapeHtml(card.level) + '</span> '; }
      if (card.badges && card.badges.length > 0) card.badges.forEach(function (b) { html += '<span class="cd-pill cd-pill-slate">' + escapeHtml(b) + '</span> '; });
      if (card.body) html += '<p class="cd-gcard-body">' + escapeHtml(card.body) + '</p>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }
  function renderGenericMatrix(t) {
    if (!t || !t.rowLabels || !t.colLabels || !t.cells) return '';
    var cellColors = ['#f1f5f9', COLORS.amberLight, COLORS.amberLight, COLORS.redLight];
    var cellTextColors = [COLORS.textMuted, '#92400e', '#92400e', '#991b1b'];
    var html = '<div class="cd-card cd-scroll-x"><table class="cd-table"><thead><tr><th></th>';
    t.colLabels.forEach(function (col) { html += '<th class="cd-th-center">' + escapeHtml(col) + '</th>'; });
    html += '</tr></thead><tbody>';
    t.rowLabels.forEach(function (rowLabel, ri) {
      html += '<tr><td class="cd-td-strong">' + cellHtml(rowLabel) + '</td>';
      (t.cells[ri] || []).forEach(function (val) { var v = Math.max(0, Math.min(3, val || 0)); html += '<td class="cd-td-center"><span class="cd-val-cell" style="background:' + cellColors[v] + ';color:' + cellTextColors[v] + '">' + v + '</span></td>'; });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }
  function renderGenericProse(t) {
    if (!t || !t.sections) return '';
    var html = '';
    t.sections.forEach(function (sec) {
      html += '<div class="cd-card">';
      if (sec.title) html += '<div class="cd-card-title">' + escapeHtml(sec.title) + '</div>';
      if (sec.body) html += '<p class="cd-prose-body">' + escapeHtml(sec.body).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>';
      html += '</div>';
    });
    return html;
  }
  function renderDynamicTab(tab) {
    var html = '<div class="cd-section-label">' + escapeHtml(tab.label) + '</div>';
    switch (tab.type) {
      case 'table': html += renderGenericTable(tab.data); break;
      case 'cards': html += renderGenericCards(tab.data); break;
      case 'matrix': html += renderGenericMatrix(tab.data); break;
      case 'prose': html += renderGenericProse(tab.data); break;
      case 'custom': html += (tab.data && tab.data.html) ? tab.data.html : ''; break;
      default: html += '<p>' + escapeHtml(JSON.stringify(tab.data)) + '</p>';
    }
    return html;
  }

  var TAB_RENDERERS = { overview: renderOverview, map: renderMap, values: renderValues, themes: renderThemes };

  /* ── AI Query tab ── */
  function mountAI() {
    var mountEl = root.querySelector('.cd-ai-mount');
    if (!mountEl) return;
    renderAIPanel(mountEl, env, {
      title: { en: 'Collection Query', he: 'שאילתת אוסף' },
      starters: AI_STARTERS,
      buildPrompt: function (q) {
        return 'You are analysing a CBSA heritage Collection Dashboard. Answer ONLY from the data below, concisely (<=150 words). If the data does not support an answer, say so.\n\nCOLLECTION DATA (JSON):\n' +
          JSON.stringify({ collection: data.collection, sites: data.sites, themes: data.themes, collectionSummary: data.collectionSummary }) + '\n\nQUESTION: ' + q;
      }
    });
  }

  /* ── main render ── */
  function render() {
    if (state.mapHandle) { state.mapHandle.destroy(); state.mapHandle = null; }

    var visibleTabs = TAB_DEFS.filter(function (t) { return !(t.id === 'themes' && !(data.themes && data.themes.length)); });
    var dynamicTabs = (data.tabs || []).map(function (t) { return { id: t.id, icon: t.icon || '📄', label: t.label }; });
    visibleTabs = visibleTabs.concat(dynamicTabs);
    visibleTabs.push({ id: 'aiquery', icon: '🤖' });

    if (!visibleTabs.some(function (t) { return t.id === state.activeTab; })) state.activeTab = visibleTabs[0].id;

    var sidebar = '<div class="cd-sidebar" role="tablist"><div class="cd-sidebar-header">Collection Dashboard</div>';
    visibleTabs.forEach(function (tab) {
      var isActive = tab.id === state.activeTab;
      var label = TAB_LABELS[tab.id] ? (ui[TAB_LABELS[tab.id]] || tab.id) : (tab.label || tab.id);
      sidebar += '<button class="cd-sidebar-tab' + (isActive ? ' is-active' : '') + '" data-tab="' + tab.id + '" role="tab" aria-selected="' + (isActive ? 'true' : 'false') + '">';
      sidebar += '<span class="cd-tab-indicator"></span><span class="cd-tab-icon">' + tab.icon + '</span><span>' + escapeHtml(label) + '</span></button>';
    });
    sidebar += '</div>';

    var header = '<div class="cd-header"><div class="cd-header-name">' + escapeHtml(data.collection.name || 'Collection Dashboard') + '</div>';
    var metaParts = [];
    if (data.collection.source) metaParts.push(data.collection.source);
    if (data.collection.depth) metaParts.push(data.collection.depth);
    if (data.collection.date) metaParts.push(data.collection.date);
    if (data.collection.itemCount) metaParts.push(data.collection.itemCount + ' ' + ui.sites.toLowerCase());
    if (metaParts.length > 0) header += '<div class="cd-header-meta">' + escapeHtml(metaParts.join(' · ')) + '</div>';
    header += '</div>';

    var content;
    if (state.activeTab === 'aiquery') {
      content = '<div class="cd-ai-mount"></div>';
    } else {
      var renderer = TAB_RENDERERS[state.activeTab];
      if (renderer) content = renderer();
      else { var dynTab = (data.tabs || []).filter(function (t) { return t.id === state.activeTab; })[0]; content = dynTab ? renderDynamicTab(dynTab) : ''; }
    }

    root.innerHTML = '<div class="cd-shell">' + sidebar + '<div class="cd-main">' + header + '<div class="cd-content">' + content + '</div></div></div>';
    attachEvents();
    if (state.activeTab === 'map') initMap();
    if (state.activeTab === 'aiquery') mountAI();
  }

  /* ── events ── */
  function attachEvents() {
    root.querySelectorAll('.cd-sidebar-tab[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = this.getAttribute('data-tab');
        if (tab && tab !== state.activeTab) { state.previousTab = null; state.expandedSite = null; state.activeTab = tab; render(); }
      });
    });
    root.querySelectorAll('[data-depth-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = this.getAttribute('data-depth-filter');
        state.depthFilter = f;
        root.querySelectorAll('[data-depth-filter]').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-depth-filter') === f); });
        applyDepthFilter();
      });
    });
    root.querySelectorAll('[data-nav-site]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var siteId = this.getAttribute('data-nav-site');
        if (state.activeTab === 'values') { state.expandedSite = (state.expandedSite === siteId) ? null : siteId; render(); return; }
        navigateToSite(siteId);
      });
    });
    root.querySelectorAll('[data-action="go-back"]').forEach(function (btn) { btn.addEventListener('click', goBack); });
  }

  function navigateToSite(siteId) {
    var site = data.sites.filter(function (s) { return s.id === siteId; })[0];
    if (!site || site.lat == null || site.lng == null) return;
    state.previousTab = state.activeTab;
    state.activeTab = 'map'; state.depthFilter = 'all'; state.pendingFocus = siteId;
    render();
  }
  function goBack() { if (state.previousTab) { state.activeTab = state.previousTab; state.previousTab = null; render(); } }

  render();
}
