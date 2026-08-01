// Knowledge Graph renderer — vanilla D3 force-directed graph (ported from the Claude mono [CA-KG]
// React+d3 spec, and from the prior vis-network renderer's chrome/sidebar). d3 v7 loads as a global
// from cdnjs at runtime (NOT an ESM import). Renders into an <svg> inside the scaffold's .kg-network.
import { isRTL } from '../shared/rtl.js';
import { escapeHtml } from '../shared/escape.js';
import { COLOR_BY_TYPE, FALLBACK_COLOR, CANONICAL_TYPE_MAP, HEBREW_LABEL_BY_CANONICAL } from '../shared/colors.js';
import { renderAIPanel } from '../shared/ai-query.js';

const D3_URL = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js';
const D3_FALLBACK = 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js';

const UI_STRINGS = {
  en: {
    selectNode: 'Click a node to inspect it.', searchResults: 'Search Results', noResults: 'No results for',
    type: 'Type', meaning: 'Meaning', valueType: 'Value Type', connections: 'Connections', noRelations: 'No connections.',
    subtitle: 'CBSA interactive graph', search: 'Search', clear: 'Clear', showAll: 'Show all',
    placeholder: 'Search node, type, meaning', tabInfo: 'Info', tabAnalytics: 'Analytics', tabAI: 'AI Query',
    nodes: 'Nodes', edges: 'Edges', types: 'Types', density: 'Density', mostConnected: 'Most Connected',
    outgoing: 'Outgoing', incoming: 'Incoming', entitiesToReview: 'Entities to review',
    reviewPrompt: 'Readings beyond the sources — to keep, rename, or reject one, mention it in the chat.'
  },
  he: {
    selectNode: 'לחצו על צומת כדי לראות פרטים.', searchResults: 'תוצאות חיפוש', noResults: 'לא נמצאו תוצאות עבור',
    type: 'סוג', meaning: 'משמעות', valueType: 'סוג ערך', connections: 'קשרים', noRelations: 'אין קשרים.',
    subtitle: 'גרף ידע אינטראקטיבי CBSA', search: 'חיפוש', clear: 'נקה', showAll: 'הצג הכל',
    placeholder: 'חיפוש צומת, סוג, משמעות', tabInfo: 'מידע', tabAnalytics: 'ניתוח', tabAI: 'שאילתת AI',
    nodes: 'צמתים', edges: 'קשרים', types: 'סוגים', density: 'צפיפות', mostConnected: 'הכי מקושרים',
    outgoing: 'יוצאים', incoming: 'נכנסים', entitiesToReview: 'ישויות לבדיקה',
    reviewPrompt: 'קריאות מעבר למקורות — לשמור, לשנות שם או לדחות אחת, ציין/י בצ׳אט.'
  }
};

const AI_STARTERS = [
  { en: 'What are the key relationships in this graph?', he: 'מהם הקשרים המרכזיים בגרף?' },
  { en: 'Which entities are most connected?', he: 'אילו ישויות הכי מקושרות?' },
  { en: 'How do contexts relate to values?', he: 'כיצד ההקשרים מתקשרים לערכים?' },
  { en: 'Explain the context-effect relationships.', he: 'הסבירו את קשרי אפקט-ההקשר.' },
  { en: 'What patterns emerge across the graph?', he: 'אילו דפוסים עולים בגרף?' }
];

export async function renderKG(root, data, host, env) {
  // --- scaffold (same chrome as before; only the graph area swaps canvas→svg) ---
  root.style.position = 'relative';
  if (!root.style.height) root.style.height = '100%';
  root.innerHTML =
    '<div class="kg-toolbar"></div>' +
    '<div class="kg-body">' +
      '<div class="kg-sidebar"></div>' +
      '<div class="kg-network"><div class="kg-loading">' + (env.rtl ? 'טוען גרף…' : 'loading graph…') + '</div></div>' +
    '</div>';
  const toolbar = root.querySelector('.kg-toolbar');
  const container = root.querySelector('.kg-network');
  const sidebar = root.querySelector('.kg-sidebar');

  // --- load d3 (race-safe); fall back to a static list view if it can't load ---
  let d3;
  try {
    d3 = await env.loadScript(D3_URL, 'd3', { fallbackUrl: D3_FALLBACK });
  } catch (e) {
    return renderEmbeddedKGFallback(root, data, env);
  }
  container.innerHTML = '';

  // --- data ---
  const allNodes = Array.isArray(data.nodes) ? data.nodes.slice() : [];
  const allEdges = Array.isArray(data.edges) ? data.edges.slice() : [];
  const title = data.title || 'Knowledge Graph';
  const anyRTL = !!env.rtl;
  const ui = UI_STRINGS[anyRTL ? 'he' : 'en'];

  // --- type / colour helpers (engine-agnostic; ported verbatim) ---
  const dynamicTypeColors = {};
  const dynamicPalette = [
    { background: 'rgba(244,67,54,0.7)', border: '#F44336' }, { background: 'rgba(76,175,80,0.7)', border: '#4CAF50' },
    { background: 'rgba(33,150,243,0.7)', border: '#2196F3' }, { background: 'rgba(255,152,0,0.7)', border: '#FF9800' },
    { background: 'rgba(156,39,176,0.7)', border: '#9C27B0' }, { background: 'rgba(121,85,72,0.7)', border: '#795548' }
  ];
  let dynamicIndex = 0;
  function getDynamicColor(typeKey) {
    if (!typeKey) return FALLBACK_COLOR;
    if (!dynamicTypeColors[typeKey]) { dynamicTypeColors[typeKey] = dynamicPalette[dynamicIndex % dynamicPalette.length]; dynamicIndex++; }
    return dynamicTypeColors[typeKey];
  }
  function resolveType(rawType) {
    if (!rawType) return 'General';
    const t = String(rawType).trim();
    if (CANONICAL_TYPE_MAP[t]) return CANONICAL_TYPE_MAP[t];
    if (COLOR_BY_TYPE[t]) return t;
    const lower = t.toLowerCase();
    if (lower === 'value' || lower === 'cultural value') return 'Cultural Value';
    if (lower === 'asset') return 'Asset';
    return t;
  }
  function resolveColor(node) {
    if (node.color && node.color.background) return node.color;
    const canonical = resolveType(node.type);
    if (COLOR_BY_TYPE[canonical]) return COLOR_BY_TYPE[canonical];
    if (COLOR_BY_TYPE[node.type]) return COLOR_BY_TYPE[node.type];
    return getDynamicColor(canonical);
  }
  function getNodeSize(node) {
    const canonical = resolveType(node.type);
    if (canonical === 'Asset') return 16;
    if (canonical === 'Cultural Value' || canonical === 'Value' || node.value_type) return 11;
    return 9;
  }

  // --- adjacency / degree (built from allEdges; the sidebar reads THESE, not the d3-mutated links) ---
  const nodeById = new Map(allNodes.map((n) => [n.id, n]));
  const adjacency = new Map();
  const degreeMap = new Map();
  const outEdges = new Map();
  const inEdges = new Map();
  allNodes.forEach((n) => { adjacency.set(n.id, new Set()); degreeMap.set(n.id, 0); outEdges.set(n.id, []); inEdges.set(n.id, []); });
  allEdges.forEach((edge) => {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, new Set());
    if (!adjacency.has(edge.to)) adjacency.set(edge.to, new Set());
    adjacency.get(edge.from).add(edge.to); adjacency.get(edge.to).add(edge.from);
    degreeMap.set(edge.from, (degreeMap.get(edge.from) || 0) + 1);
    degreeMap.set(edge.to, (degreeMap.get(edge.to) || 0) + 1);
    if (!outEdges.has(edge.from)) outEdges.set(edge.from, []);
    if (!inEdges.has(edge.to)) inEdges.set(edge.to, []);
    outEdges.get(edge.from).push({ to: edge.to, label: edge.label || '' });
    inEdges.get(edge.to).push({ from: edge.from, label: edge.label || '' });
  });

  // --- node preprocessing + type order ---
  const typeDisplayMap = {};
  allNodes.forEach((node) => {
    const canonical = resolveType(node.type);
    if (anyRTL) node.display_type = isRTL(node.type) ? node.type : (HEBREW_LABEL_BY_CANONICAL[canonical] || canonical);
    else node.display_type = COLOR_BY_TYPE[canonical] ? canonical : node.type;
    node._resolved_color = resolveColor(node);
    if (!typeDisplayMap[node.type]) typeDisplayMap[node.type] = node.display_type || node.type;
  });
  const typeOrder = [];
  const seenTypes = new Set();
  allNodes.forEach((node) => { if (!seenTypes.has(node.type)) { seenTypes.add(node.type); typeOrder.push(node.type); } });

  // --- state ---
  let isolatedType = null, searchInputValue = '', appliedSearch = '', selectedId = null, activeTab = 'info';

  // --- visibility pipeline (engine-agnostic; ported verbatim) ---
  const norm = (v) => String(v || '').toLowerCase().trim();
  function nodeMatches(node, query) {
    const q = norm(query); if (!q) return true;
    return norm([node.name, node.type, node.display_type, node.meaning, node.value_type, node.meta ? JSON.stringify(node.meta) : ''].join(' ')).includes(q);
  }
  function getDirectMatchIds(query) { const q = norm(query); const ids = new Set(); if (!q) return ids; allNodes.forEach((n) => { if (nodeMatches(n, q)) ids.add(n.id); }); return ids; }
  function getExpandedIds(matchIds) { const e = new Set(matchIds); allEdges.forEach((ed) => { if (matchIds.has(ed.from) || matchIds.has(ed.to)) { e.add(ed.from); e.add(ed.to); } }); return e; }
  function getTypeFocusedIds(typeName) {
    if (!typeName) return null; const ids = new Set();
    allNodes.forEach((n) => { if (n.type === typeName) ids.add(n.id); });
    allEdges.forEach((ed) => { const fn = nodeById.get(ed.from), tn = nodeById.get(ed.to); if ((fn && fn.type === typeName) || (tn && tn.type === typeName)) { ids.add(ed.from); ids.add(ed.to); } });
    return ids;
  }
  function computeVisibleState() {
    const directMatchIds = getDirectMatchIds(appliedSearch);
    const expandedSearchIds = appliedSearch ? getExpandedIds(directMatchIds) : null;
    const focusedTypeIds = getTypeFocusedIds(isolatedType);
    const visibleNodes = allNodes.filter((n) => { if (expandedSearchIds && !expandedSearchIds.has(n.id)) return false; if (focusedTypeIds && !focusedTypeIds.has(n.id)) return false; return true; });
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
    const visibleEdges = allEdges.filter((e) => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to));
    return { directMatchIds, visibleNodes, visibleEdges, visibleNodeIds };
  }
  const getDirectMatches = (state) => state.visibleNodes.filter((n) => state.directMatchIds.has(n.id));

  // --- SVG + d3 setup ---
  const svg = d3.select(container).append('svg').attr('class', 'kg-svg');
  const defs = svg.append('defs');
  function addMarker(id, color) {
    defs.append('marker').attr('id', id).attr('viewBox', '0 -5 10 10').attr('refX', 20).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', color);
  }
  addMarker('kg-arrow', '#94a3b8');
  addMarker('kg-arrow-sel', '#334155');
  const zoomLayer = svg.append('g').attr('class', 'kg-zoom-layer');
  const gEdges = zoomLayer.append('g').attr('class', 'kg-edges');
  const gEdgeLabels = zoomLayer.append('g').attr('class', 'kg-edge-labels');
  const gNodes = zoomLayer.append('g').attr('class', 'kg-nodes');

  let currentTransform = d3.zoomIdentity;
  const zoomBehavior = d3.zoom().scaleExtent([0.2, 4]).on('zoom', function (ev) { zoomLayer.attr('transform', ev.transform); currentTransform = ev.transform; });
  svg.call(zoomBehavior);
  svg.on('click', function () { if (selectedId) { selectedId = null; update(true); } });

  let sim = null, simNodes = [], simLinks = [];
  let nodeSel = null, edgeSel = null, edgeLabelSel = null;

  function getSize() { const r = container.getBoundingClientRect(); return { w: Math.max(Math.round(r.width) || 0, 60), h: Math.max(Math.round(r.height) || 0, 60) }; }
  // Aspect-aware force params so the graph FILLS the container instead of sitting in a centered band:
  // a wide-short container pulls nodes vertically inward (spread horizontally) + longer links; a
  // tall-narrow container pulls them horizontally inward (narrow → spread vertically).
  function forceParams(w, h) {
    const aspect = (w || 1) / Math.max(h || 1, 1);
    if (aspect > 1.3) return { linkDist: 165, sx: 0.03, sy: 0.12 };   // wide-short
    if (aspect < 0.8) return { linkDist: 120, sx: 0.14, sy: 0.03 };   // tall-narrow
    return { linkDist: 140, sx: 0.06, sy: 0.06 };                     // balanced
  }
  function truncate(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function buildSimulation(state, w, h) {
    if (sim) sim.stop();
    simNodes = state.visibleNodes.map((n) => Object.assign({}, n));
    const idset = new Set(simNodes.map((n) => n.id));
    simLinks = state.visibleEdges.filter((e) => idset.has(e.from) && idset.has(e.to))
      .map((e) => ({ source: e.from, target: e.to, from: e.from, to: e.to, label: e.label || '' }));
    const fp = forceParams(w, h);
    sim = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simLinks).id((d) => d.id).distance(fp.linkDist))  // [CA-KG] §4d: 130–152
      .force('charge', d3.forceManyBody().strength(-350))                            // [CA-KG] §4d: -300…-450
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('x', d3.forceX(w / 2).strength(fp.sx))   // aspect-aware: shape the graph to the container
      .force('y', d3.forceY(h / 2).strength(fp.sy))
      .force('collide', d3.forceCollide().radius((d) => getNodeSize(d) + 6));
    // Synchronous warm-up so nodes have explicit x/y before the first paint (headless-safe).
    sim.stop();
    for (let i = 0; i < 300; i++) sim.tick();
  }

  function arcPath(d) {
    const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
    const dr = Math.sqrt(dx * dx + dy * dy) * 1.2 || 1;     // guard coincident nodes (dr=0)
    return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
  }
  function edgeMid(d) {
    const mx = (d.source.x + d.target.x) / 2, my = (d.source.y + d.target.y) / 2;
    const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: mx + (-dy / len) * 12, y: my + (dx / len) * 12 };   // perpendicular offset ≈ arc apex
  }
  function tickPositions() {
    if (edgeSel) edgeSel.attr('d', arcPath);
    if (edgeLabelSel) edgeLabelSel.attr('x', (d) => edgeMid(d).x).attr('y', (d) => edgeMid(d).y);
    if (nodeSel) nodeSel.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');
  }

  function dragBehavior() {
    return d3.drag()
      .on('start', function (ev, d) { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', function (ev, d) { d.fx = ev.x; d.fy = ev.y; })
      .on('end', function (ev, d) { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; });
  }

  function drawGraph(state) {
    // edges
    edgeSel = gEdges.selectAll('path.kg-edge').data(simLinks, (d) => d.from + '__' + d.to + '__' + (d.label || ''));
    edgeSel.exit().remove();
    edgeSel = edgeSel.enter().append('path').attr('class', 'kg-edge').merge(edgeSel);
    // edge labels (only labelled edges)
    edgeLabelSel = gEdgeLabels.selectAll('text.kg-edge-label').data(simLinks.filter((d) => d.label), (d) => d.from + '__' + d.to + '__' + d.label);
    edgeLabelSel.exit().remove();
    edgeLabelSel = edgeLabelSel.enter().append('text').attr('class', 'kg-edge-label').attr('text-anchor', 'middle').merge(edgeLabelSel);
    edgeLabelSel.text((d) => d.label);
    // nodes
    nodeSel = gNodes.selectAll('g.kg-node').data(simNodes, (d) => d.id);
    nodeSel.exit().remove();
    const enter = nodeSel.enter().append('g').attr('class', 'kg-node');
    enter.append('circle');
    enter.append('text').attr('text-anchor', 'middle');
    nodeSel = enter.merge(nodeSel);
    nodeSel.select('circle').attr('fill', (d) => (d._resolved_color || FALLBACK_COLOR).background);
    nodeSel.select('text').attr('dy', (d) => getNodeSize(d) + 13).text((d) => truncate(d.name, 20));
    nodeSel.call(dragBehavior());
    nodeSel.on('click', function (ev, d) { ev.stopPropagation(); selectedId = d.id; activeTab = 'info'; update(true); });
    nodeSel.on('mouseenter', function (ev, d) { d3.select(this).select('circle').attr('r', getNodeSize(d) + 4); });
    nodeSel.on('mouseleave', function (ev, d) { d3.select(this).select('circle').attr('r', selectedId === d.id ? getNodeSize(d) + 4 : getNodeSize(d)); });
    tickPositions();
    restyle(state);
  }

  // Selection/search highlight + dim (per-element attributes; no simulation rebuild).
  function restyle(state) {
    if (!nodeSel) return;
    const selectedNeighbors = selectedId ? (adjacency.get(selectedId) || new Set()) : new Set();
    nodeSel.each(function (d) {
      const isSel = selectedId === d.id, isNeighbor = selectedId ? selectedNeighbors.has(d.id) : false, isMatch = state.directMatchIds.has(d.id);
      let opacity = 1;
      if (selectedId) opacity = (isSel || isNeighbor) ? 1 : 0.22; else if (appliedSearch) opacity = isMatch ? 1 : 0.44;
      const g = d3.select(this);
      g.attr('opacity', opacity);
      g.select('circle')
        .attr('r', isSel ? getNodeSize(d) + 4 : getNodeSize(d))
        .attr('stroke', (isSel || isMatch) ? '#0f172a' : (d._resolved_color || FALLBACK_COLOR).border)
        .attr('stroke-width', isSel ? 4 : isMatch ? 3 : 2);
    });
    edgeSel.each(function (d) {
      const selEdge = selectedId && (d.from === selectedId || d.to === selectedId);
      const nearby = selectedId && (selectedNeighbors.has(d.from) || selectedNeighbors.has(d.to));
      let opacity = 0.9, width = 1.5;
      if (selectedId) { opacity = selEdge ? 1 : nearby ? 0.55 : 0.14; width = selEdge ? 2.6 : 1.5; } else if (appliedSearch) opacity = 0.4;
      d3.select(this).attr('stroke-opacity', opacity).attr('stroke-width', width)
        .attr('stroke', selEdge ? '#334155' : '#848484')
        .attr('marker-end', selEdge ? 'url(#kg-arrow-sel)' : 'url(#kg-arrow)');
    });
    if (edgeLabelSel) edgeLabelSel.attr('opacity', (selectedId || appliedSearch) ? 0.5 : 0.85);
  }

  function focusNode(id) {
    const n = simNodes.find((x) => x.id === id); if (!n) return;
    const sz = getSize();
    const scale = Math.min(Math.max(currentTransform.k || 1, 1), 1.4);
    svg.transition().duration(260).call(zoomBehavior.transform, d3.zoomIdentity.translate(sz.w / 2 - n.x * scale, sz.h / 2 - n.y * scale).scale(scale));
  }
  function fitToBounds() {
    if (!simNodes.length) return;
    const xs = simNodes.map((n) => n.x), ys = simNodes.map((n) => n.y);
    const minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    const sz = getSize(), pad = Math.max(24, Math.round(Math.min(sz.w, sz.h) * 0.06));   // % of the smaller dim, not fixed px
    const gw = Math.max(maxX - minX, 1), gh = Math.max(maxY - minY, 1);
    const scale = Math.min(1.6, Math.max(0.2, Math.min((sz.w - 2 * pad) / gw, (sz.h - 2 * pad) / gh)));
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(sz.w / 2 - cx * scale, sz.h / 2 - cy * scale).scale(scale));
  }

  // Re-tune the aspect-aware forces to the current size, re-settle, and re-fit. Called on every real
  // size change (ResizeObserver, sidebar collapse, inline↔fullscreen) so the graph re-fills the box.
  function retuneAndFit() {
    try {
      const sz = getSize();
      if (sim) {
        const fp = forceParams(sz.w, sz.h);
        sim.force('center', d3.forceCenter(sz.w / 2, sz.h / 2));
        if (sim.force('x')) sim.force('x').x(sz.w / 2).strength(fp.sx);
        if (sim.force('y')) sim.force('y').y(sz.h / 2).strength(fp.sy);
        if (sim.force('link')) sim.force('link').distance(fp.linkDist);
        sim.alpha(0.3).restart();
      }
      fitToBounds();
    } catch (e) {}
  }

  // --- toolbar (ported verbatim) ---
  function renderToolbar(state) {
    const directMatches = getDirectMatches(state);
    toolbar.innerHTML =
      '<div class="kg-toolbar-main"><div class="kg-title-block"><div class="kg-title">' + escapeHtml(title) + '</div><div class="kg-subtitle">' + escapeHtml(ui.subtitle) + '</div></div>' +
      '<div class="kg-status-pills"><span class="kg-pill">' + escapeHtml(ui.nodes) + ': ' + state.visibleNodes.length + '</span><span class="kg-pill">' + escapeHtml(ui.edges) + ': ' + state.visibleEdges.length + '</span>' +
      (appliedSearch ? '<span class="kg-pill kg-pill-accent">' + directMatches.length + '</span>' : '') + (selectedId ? '<span class="kg-pill kg-pill-strong">●</span>' : '') + '</div></div>' +
      '<div class="kg-toolbar-controls"><div class="kg-search-wrap"><input class="kg-search-input" type="text" placeholder="' + escapeHtml(ui.placeholder) + '" value="' + escapeHtml(searchInputValue) + '" />' +
      '<button class="kg-search-btn" type="button">' + escapeHtml(ui.search) + '</button><button class="kg-clear-btn" type="button">' + escapeHtml(ui.clear) + '</button></div>' +
      '<div class="kg-filter-row">' + typeOrder.map((type) => {
        const displayLabel = typeDisplayMap[type] || type;
        const color = (allNodes.find((n) => n.type === type) || {})._resolved_color;
        const dotHtml = color ? '<span class="kg-filter-dot" style="background:' + color.border + '"></span> ' : '';
        return '<button class="kg-filter-btn ' + (isolatedType === type ? 'is-active' : '') + '" data-type="' + escapeHtml(type) + '">' + dotHtml + escapeHtml(displayLabel) + '</button>';
      }).join('') + (isolatedType ? '<button class="kg-filter-btn kg-show-all" type="button">' + escapeHtml(ui.showAll) + '</button>' : '') + '</div></div>';

    const input = toolbar.querySelector('.kg-search-input');
    if (input) {
      input.addEventListener('input', function () { searchInputValue = this.value || ''; });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') applySearch(); });
    }
    const sb = toolbar.querySelector('.kg-search-btn'); if (sb) sb.addEventListener('click', applySearch);
    const cb = toolbar.querySelector('.kg-clear-btn'); if (cb) cb.addEventListener('click', function () { searchInputValue = ''; appliedSearch = ''; selectedId = null; update(); });
    toolbar.querySelectorAll('[data-type]').forEach((btn) => btn.addEventListener('click', function () { const t = this.getAttribute('data-type'); isolatedType = isolatedType === t ? null : t; selectedId = null; update(); }));
    const sa = toolbar.querySelector('.kg-show-all'); if (sa) sa.addEventListener('click', function () { isolatedType = null; selectedId = null; update(); });
  }
  function applySearch() { appliedSearch = searchInputValue.trim(); const d = allNodes.filter((n) => nodeMatches(n, appliedSearch)); selectedId = d.length ? d[0].id : null; activeTab = 'info'; update(); }

  // --- sidebar (ported verbatim; only network.focus → focusNode) ---
  function renderSidebar(state) {
    sidebar.innerHTML =
      '<div class="kg-tab-bar">' +
        '<button class="kg-tab' + (activeTab === 'info' ? ' is-active' : '') + '" data-tab="info">' + escapeHtml(ui.tabInfo) + '</button>' +
        '<button class="kg-tab' + (activeTab === 'analytics' ? ' is-active' : '') + '" data-tab="analytics">' + escapeHtml(ui.tabAnalytics) + '</button>' +
        '<button class="kg-tab' + (activeTab === 'ai' ? ' is-active' : '') + '" data-tab="ai">' + escapeHtml(ui.tabAI) + '</button>' +
      '</div><div class="kg-tab-content"></div>';
    const contentEl = sidebar.querySelector('.kg-tab-content');
    if (activeTab === 'info') contentEl.innerHTML = renderInfoTab(state);
    else if (activeTab === 'analytics') contentEl.innerHTML = renderAnalyticsTab(state);
    else renderAIPanel(contentEl, env, {
      title: { en: 'Graph Query', he: 'שאילתת גרף' }, starters: AI_STARTERS,
      buildPrompt: (q) => 'You are analysing a CBSA heritage Knowledge Graph. Answer ONLY from the graph data below, concisely (<=120 words). If the graph does not support an answer, say so.\n\nGRAPH DATA (JSON):\n' + JSON.stringify({ nodes: allNodes, edges: allEdges, title }) + '\n\nQUESTION: ' + q
    });

    sidebar.querySelectorAll('.kg-tab').forEach((btn) => btn.addEventListener('click', function () { activeTab = this.getAttribute('data-tab'); renderSidebar(state); }));
    sidebar.querySelectorAll('[data-node-id]').forEach((btn) => btn.addEventListener('click', function () {
      const nodeId = this.getAttribute('data-node-id'); if (!nodeId) return;
      selectedId = nodeId; activeTab = 'info'; update(true); focusNode(nodeId);
    }));
  }

  function renderInfoTab(state) {
    const selectedNode = selectedId ? nodeById.get(selectedId) : null;
    const directMatches = getDirectMatches(state);
    if (!selectedNode) {
      let html = '<div class="kg-panel-section"><div class="kg-panel-title">Knowledge Graph</div><div class="kg-panel-text">' + escapeHtml(ui.selectNode) + '</div></div>';
      if (appliedSearch) {
        html += '<div class="kg-panel-section"><div class="kg-section-label">' + escapeHtml(ui.searchResults) + '</div>';
        if (directMatches.length) directMatches.forEach((n) => { html += '<button class="kg-result-btn" data-node-id="' + escapeHtml(n.id) + '"><span class="kg-result-name">' + escapeHtml(n.name) + '</span><span class="kg-result-type">' + escapeHtml(n.display_type || n.type) + '</span></button>'; });
        else html += '<div class="kg-empty">' + escapeHtml(ui.noResults) + ' "' + escapeHtml(appliedSearch) + '"</div>';
        html += '</div>';
      }
      return html;
    }
    const nodeColor = selectedNode._resolved_color || FALLBACK_COLOR;
    const out = outEdges.get(selectedNode.id) || [], inc = inEdges.get(selectedNode.id) || [];
    let html = '<div class="kg-panel-section"><div class="kg-panel-title">' + escapeHtml(selectedNode.name) + '</div>' +
      '<div class="kg-meta-row"><strong>' + escapeHtml(ui.type) + ':</strong> <span class="kg-type-badge" style="background:' + nodeColor.border + '"></span> <span>' + escapeHtml(selectedNode.display_type || selectedNode.type || '—') + '</span></div>' +
      '<div class="kg-meta-row"><strong>' + escapeHtml(ui.meaning) + ':</strong> <span>' + escapeHtml(selectedNode.meaning || '—') + '</span></div>' +
      (selectedNode.value_type ? '<div class="kg-meta-row"><strong>' + escapeHtml(ui.valueType) + ':</strong> <span>' + escapeHtml(selectedNode.value_type) + '</span></div>' : '');
    if (selectedNode.meta) Object.keys(selectedNode.meta).forEach((key) => { html += '<div class="kg-meta-row"><strong>' + escapeHtml(key) + ':</strong> <span>' + escapeHtml(selectedNode.meta[key]) + '</span></div>'; });
    if (selectedNode.epistemic && selectedNode.epistemic !== 'sourced') {
      const epiMark = selectedNode.epistemic === 'interpretive' ? '💭' : '〰️';
      const epiText = selectedNode.epistemic === 'interpretive' ? 'Interpretive — my reading, not explicit in the sources' : 'Inferred — connected from multiple sources';
      html += '<div class="kg-meta-row kg-epistemic-row"><strong>' + epiMark + ' ' + escapeHtml(epiText) + '</strong>';
      if (selectedNode.epistemic_note) html += '<div class="kg-epistemic-note">' + escapeHtml(selectedNode.epistemic_note) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    if (out.length) { html += '<div class="kg-panel-section"><div class="kg-section-label">' + escapeHtml(ui.outgoing) + '</div>'; out.forEach((e) => { const t = nodeById.get(e.to); if (t) html += '<button class="kg-result-btn" data-node-id="' + escapeHtml(e.to) + '"><span class="kg-result-name">' + escapeHtml(t.name) + '</span><span class="kg-edge-label">' + escapeHtml(e.label) + '</span></button>'; }); html += '</div>'; }
    if (inc.length) { html += '<div class="kg-panel-section"><div class="kg-section-label">' + escapeHtml(ui.incoming) + '</div>'; inc.forEach((e) => { const s = nodeById.get(e.from); if (s) html += '<button class="kg-result-btn" data-node-id="' + escapeHtml(e.from) + '"><span class="kg-result-name">' + escapeHtml(s.name) + '</span><span class="kg-edge-label">' + escapeHtml(e.label) + '</span></button>'; }); html += '</div>'; }
    if (!out.length && !inc.length) html += '<div class="kg-panel-section"><div class="kg-empty">' + escapeHtml(ui.noRelations) + '</div></div>';
    return html;
  }

  function renderAnalyticsTab(state) {
    const nodeCount = state.visibleNodes.length, edgeCount = state.visibleEdges.length;
    const typeCount = new Set(state.visibleNodes.map((n) => resolveType(n.type))).size;
    const maxEdges = nodeCount > 1 ? nodeCount * (nodeCount - 1) / 2 : 1;
    const density = (edgeCount / maxEdges).toFixed(3);
    let html = '<div class="kg-stat-grid">' +
      '<div class="kg-stat-card"><div class="kg-stat-value">' + nodeCount + '</div><div class="kg-stat-label">' + escapeHtml(ui.nodes) + '</div></div>' +
      '<div class="kg-stat-card"><div class="kg-stat-value">' + edgeCount + '</div><div class="kg-stat-label">' + escapeHtml(ui.edges) + '</div></div>' +
      '<div class="kg-stat-card"><div class="kg-stat-value">' + typeCount + '</div><div class="kg-stat-label">' + escapeHtml(ui.types) + '</div></div>' +
      '<div class="kg-stat-card"><div class="kg-stat-value">' + density + '</div><div class="kg-stat-label">' + escapeHtml(ui.density) + '</div></div></div>';
    const epiNon = state.visibleNodes.filter((n) => n.epistemic && n.epistemic !== 'sourced');
    if (epiNon.length) {
      const nInt = epiNon.filter((n) => n.epistemic === 'interpretive').length, nInf = epiNon.length - nInt;
      html += '<div class="kg-panel-section"><div class="kg-section-label">' + escapeHtml(ui.entitiesToReview) + '</div>';
      html += '<div class="kg-epistemic-summary">' + (nInt ? '💭 ' + nInt : '') + (nInt && nInf ? ' · ' : '') + (nInf ? '〰️ ' + nInf : '') + '</div>';
      html += '<div class="kg-review-prompt">' + escapeHtml(ui.reviewPrompt) + '</div>';
      epiNon.slice().sort((a, b) => (a.epistemic === 'interpretive' ? 0 : 1) - (b.epistemic === 'interpretive' ? 0 : 1)).forEach((node) => {
        const ic = node.epistemic === 'interpretive' ? '💭' : '〰️';
        html += '<button class="kg-result-btn kg-review-item" data-node-id="' + escapeHtml(node.id) + '"><span class="kg-review-icon">' + ic + '</span><span class="kg-result-name">' + escapeHtml(node.name) + '</span></button>';
      });
      html += '</div>';
    }
    const sorted = state.visibleNodes.slice().sort((a, b) => (degreeMap.get(b.id) || 0) - (degreeMap.get(a.id) || 0)).slice(0, 5);
    html += '<div class="kg-panel-section"><div class="kg-section-label">' + escapeHtml(ui.mostConnected) + '</div>';
    sorted.forEach((node) => { const deg = degreeMap.get(node.id) || 0; html += '<button class="kg-result-btn" data-node-id="' + escapeHtml(node.id) + '"><span class="kg-result-name">' + escapeHtml(node.name) + '</span><span class="kg-result-type">' + deg + '</span></button>'; });
    html += '</div>';
    return html;
  }

  function renderLegend() {
    const existing = container.querySelector('.kg-legend'); if (existing) existing.remove();
    const typesInData = []; const seenCanonical = new Set();
    allNodes.forEach((node) => {
      const canonical = resolveType(node.type);
      if (!seenCanonical.has(canonical)) { seenCanonical.add(canonical); const displayLabel = anyRTL ? (HEBREW_LABEL_BY_CANONICAL[canonical] || canonical) : canonical; const color = node._resolved_color || resolveColor(node); typesInData.push({ label: displayLabel, color: color.border }); }
    });
    const legend = document.createElement('div');
    legend.className = 'kg-legend';
    legend.innerHTML = typesInData.map((t) => '<span class="kg-legend-item"><span class="kg-legend-dot" style="background:' + t.color + '"></span>' + escapeHtml(t.label) + '</span>').join('');
    container.appendChild(legend);
  }

  // --- main cycle ---
  let lastVisibleSet = null, legendRendered = false;
  function update(styleOnly) {
    const state = computeVisibleState();
    const visibleKey = state.visibleNodes.map((n) => n.id).sort().join(',');
    const setChanged = visibleKey !== lastVisibleSet;
    if (setChanged || !lastVisibleSet) {
      const sz = getSize();
      buildSimulation(state, sz.w, sz.h);
      drawGraph(state);
      sim.on('tick', tickPositions);
      sim.alpha(0.3).restart();
      lastVisibleSet = visibleKey;
      setTimeout(function () { try { fitToBounds(); } catch (e) {} }, 60);
    } else {
      restyle(state);
    }
    renderToolbar(state); renderSidebar(state);
    if (!legendRendered) { renderLegend(); legendRendered = true; }
  }

  // Collapse toggle — hide the panel to give the graph the full width.
  let sidebarCollapsed = false;
  const toggle = document.createElement('button');
  toggle.className = 'kg-collapse-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Toggle panel');
  function renderToggle() { toggle.textContent = sidebarCollapsed ? (env.rtl ? '‹' : '›') : (env.rtl ? '›' : '‹'); }
  toggle.addEventListener('click', function () {
    sidebarCollapsed = !sidebarCollapsed;
    root.classList.toggle('kg-collapsed', sidebarCollapsed);
    renderToggle();
    setTimeout(retuneAndFit, 80);
  });
  renderToggle();
  container.appendChild(toggle);

  // --- responsive: small container (e.g. inline GPT/Claude artifact) → graph-first ---
  // The renderer's ResizeObserver toggles `.kg-compact` on the root by the container's real
  // size, and auto-collapses the sidebar so the graph gets the height (the chrome is slimmed
  // by .kg-compact CSS). When the host expands (fullscreen), it auto-restores the full chrome.
  let lastCompact = null;
  function applyResponsive() {
    const r = root.getBoundingClientRect();
    const compact = (r.width || 0) < 820 || (r.height || 0) < 560;
    root.classList.toggle('kg-compact', compact);
    if (compact !== lastCompact) {        // auto-sync the sidebar only on a compact-state change
      sidebarCollapsed = compact;         // compact → collapse (graph full area); large → expand
      root.classList.toggle('kg-collapsed', sidebarCollapsed);
      renderToggle();
      lastCompact = compact;
    }
  }

  // Size-aware recenter + refit. Container is often 0-size at mount and grows without a window
  // resize event (same lesson as the dashboards' map). On a real size change → recenter + refit.
  if (typeof ResizeObserver !== 'undefined') {
    let t = null;
    const ro = new ResizeObserver(function (entries) {
      const r = entries[0] && entries[0].contentRect;
      if (!r || r.width < 5 || r.height < 5) return;
      if (t) clearTimeout(t);
      t = setTimeout(function () { applyResponsive(); retuneAndFit(); }, 80);
    });
    ro.observe(container);
    if (root && root !== container) ro.observe(root);
  }

  update();
  setTimeout(function () { try { applyResponsive(); } catch (e) {} }, 150);
}

// Static fallback when d3 can't load — never blank.
function renderEmbeddedKGFallback(root, data, env) {
  const nodes = (data.nodes || []), edges = (data.edges || []);
  const esc = (s) => escapeHtml(s);
  root.innerHTML =
    '<div class="kg-fallback"><div class="kg-fallback-note">' + (env.rtl ? 'הגרף לא נטען — תצוגת רשימה' : 'Graph engine unavailable — list view') + '</div>' +
    '<div class="kg-fallback-cols"><div><b>' + (env.rtl ? 'צמתים' : 'Nodes') + ' (' + nodes.length + ')</b><ul>' +
    nodes.map((n) => { const c = (COLOR_BY_TYPE[n.type] || FALLBACK_COLOR).border; return '<li><span class="kg-fb-dot" style="background:' + c + '"></span>' + esc(n.name) + ' <i>' + esc(n.type || '') + '</i></li>'; }).join('') +
    '</ul></div><div><b>' + (env.rtl ? 'קשרים' : 'Edges') + ' (' + edges.length + ')</b><ul>' +
    edges.map((e) => '<li>' + esc(e.from != null ? e.from : e.source) + ' → ' + esc(e.to != null ? e.to : e.target) + (e.label ? ' (' + esc(e.label) + ')' : '') + '</li>').join('') +
    '</ul></div></div></div>';
  return { ok: true, live: env.live, type: 'kg', fallback: true };
}
