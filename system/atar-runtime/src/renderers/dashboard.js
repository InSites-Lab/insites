// Assessment Dashboard renderer — ported from the earlier standalone ChatGPT runtime.
// Mechanical port: IIFE/boot/injectStyles/norm removed; reads the pre-normalized `data` arg;
// renders into the `root` scaffold (root.querySelector, not document.getElementById);
// shared escapeHtml; map via shared/map.js (Leaflet cdnjs + vector fallback); live AI Query tab.
import { escapeHtml } from '../shared/escape.js';
import { renderAIPanel } from '../shared/ai-query.js';
import { createMap } from '../shared/map.js';

var COLORS = {
  bg: '#f5f7fa', bgCard: '#ffffff', border: '#dfe4ea', text: '#1e293b', textDim: '#475569',
  textMuted: '#94a3b8', accent: '#2563eb', accentLight: '#dbeafe', green: '#16a34a', greenLight: '#d1fae5',
  amber: '#f59e0b', amberLight: '#fef3c7', red: '#ef4444', redLight: '#fee2e2', purple: '#8b5cf6',
  purpleLight: '#ede9fe', blue: '#3b82f6', blueLight: '#dbeafe', slate: '#64748b', headerBg: '#1e293b'
};

var CHANGE_COLORS = { structure: '#f59e0b', use: '#3b82f6', setting: '#10b981', infrastructure: '#8b5cf6' };

var RATING_COLORS = {
  high: { bg: '#d1fae5', text: '#065f46', border: '#10b981', emoji: '🟢' },
  medium: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b', emoji: '🟡' },
  'low-medium': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b', emoji: '🟡' },
  low: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444', emoji: '🔴' }
};

var EVIDENCE_ICONS = { sourced: '✅', inferred: '〰️', uncertain: '💭' };

var CONTEXT_EMOJIS = {
  historical: '🏛️', spatial: '🗺️', social: '👥', political: '⚖️',
  economic: '💰', technological: '⚙️', environmental: '🌿', cultural: '🎨', religious: '🕌'
};

var UI = {
  en: {
    overview: 'Overview', map: 'Map', timeline: 'Timeline', contextsValues: 'Contexts & Values', themes: 'Themes',
    integrity: 'Integrity', comparative: 'Comparative', significance: 'Significance', aiQuery: 'AI Query',
    values: 'Values', contexts: 'Contexts', evidenceRate: 'Evidence Rate', dataGaps: 'Data Gaps', sources: 'Sources',
    description: 'Description', integrityRange: 'Integrity Range', noData: 'No data available',
    noCoords: 'Location not specified in source material', coordSource: 'Coordinates',
    timelineEmpty: 'No timeline events recorded', attribute: 'Attribute', assocValues: 'Associated Values',
    siteSig: 'Significance', implication: 'Implication', aspect: 'Aspect', valueExpr: 'Value Expression', rating: 'Rating',
    vulnAnalysis: 'Vulnerability Analysis', vulnLegend: '🔴 = loss severely damages this value, 🟡 = moderate, ⚪ = minor',
    comparatorSummary: 'Summary', period: 'Period', architect: 'Architect', rarity: 'Rarity', documentation: 'Documentation',
    condition: 'Condition', sigStatement: 'Statement of Cultural Significance', clearHighlight: 'Clear filter',
    valueThemes: 'Value Themes', contextThemes: 'Context Themes', threatThemes: 'Threat Themes',
    processQuality: 'Process Quality', strengths: 'Strengths', quickBoosts: 'Quick Boosts', nextSteps: 'Next Steps',
    terrain: 'Terrain', satellite: 'Satellite', streets: 'Streets', attributeTable: 'Attribute Table', naraGrid: 'Nara Grid'
  },
  he: {
    overview: 'סקירה', map: 'מפה', timeline: 'ציר זמן',
    contextsValues: 'הקשרים וערכים', themes: 'נושאים',
    integrity: 'שלמות', comparative: 'השוואה', significance: 'משמעות',
    aiQuery: 'שאילתת AI',
    values: 'ערכים', contexts: 'הקשרים', evidenceRate: 'שיעור עדות',
    dataGaps: 'פערי מידע', sources: 'מקורות', description: 'תיאור',
    integrityRange: 'טווח שלמות', noData: 'אין נתונים זמינים',
    noCoords: 'מיקום לא צוין בחומר המקור', coordSource: 'קואורדינטות',
    timelineEmpty: 'לא נרשמו אירועי ציר זמן', attribute: 'מאפיין',
    assocValues: 'ערכים קשורים', siteSig: 'משמעות', implication: 'משמעות',
    aspect: 'היבט', valueExpr: 'ביטוי ערכי', rating: 'דירוג',
    vulnAnalysis: 'ניתוח פגיעות', vulnLegend: '🔴 = אבדן חמור, 🟡 = בינוני, ⚪ = קל',
    comparatorSummary: 'סיכום', period: 'תקופה', architect: 'אדריכל',
    rarity: 'נדירות', documentation: 'תיעוד', condition: 'מצב',
    sigStatement: 'הצהרת משמעות תרבותית', clearHighlight: 'נקה סינון',
    valueThemes: 'נושאי ערכים', contextThemes: 'נושאי הקשרים', threatThemes: 'נושאי איומים',
    processQuality: 'איכות תהליך', strengths: 'חוזקות', quickBoosts: 'שיפורים מהירים',
    nextSteps: 'צעדים הבאים', terrain: 'שטח', satellite: 'לווין', streets: 'רחובות',
    attributeTable: 'טבלת מאפיינים', naraGrid: 'רשת נארה'
  }
};

var TAB_DEFS = [
  { id: 'overview', icon: '📊' }, { id: 'map', icon: '🗺️' }, { id: 'timeline', icon: '⏳' },
  { id: 'ctxval', icon: '🔗' }, { id: 'themes', icon: '🎨' }, { id: 'integrity', icon: '🛡️' },
  { id: 'comparative', icon: '🔍' }, { id: 'significance', icon: '✨' }
];

var TAB_LABELS = {
  overview: 'overview', map: 'map', timeline: 'timeline', ctxval: 'contextsValues', themes: 'themes',
  integrity: 'integrity', comparative: 'comparative', significance: 'significance', aiquery: 'aiQuery'
};

var VULN_SYMBOLS = { 3: '●', 2: '◐', 1: '○', 0: '·' };

var AI_STARTERS = [
  { en: 'Summarize the significance of this asset', he: 'סכמו את המשמעות של הנכס' },
  { en: 'What are the main gaps in this assessment?', he: 'מהם הפערים המרכזיים בהערכה?' },
  { en: 'How do values connect to contexts?', he: 'כיצד הערכים מתקשרים להקשרים?' },
  { en: 'What does the integrity assessment reveal?', he: 'מה חושפת הערכת השלמות?' },
  { en: 'How does this asset compare to its comparators?', he: 'כיצד הנכס משתווה לאתרים המקבילים?' }
];

export function renderDashboard(root, data, host, env) {
  var ui = UI[env.lang] || UI.en;
  var state = { activeTab: 'overview', highlight: null, mapHandle: null };

  // ── Entity name map (auto-link in dynamic tabs) ──
  var entityNameMap = {};
  if (data.asset && data.asset.name) entityNameMap[data.asset.name] = '__asset__';
  (data.comparative.sites || []).forEach(function (s) { if (s.name) entityNameMap[s.name] = s.name; });

  /* ── render helpers ── */
  function ratingBadge(rating) {
    var r = RATING_COLORS[rating] || RATING_COLORS.medium;
    return '<span class="db-rating" style="background:' + r.bg + ';color:' + r.text + ';">' + r.emoji + ' ' + escapeHtml(rating) + '</span>';
  }
  function critPill(label, value) {
    var cls = 'db-pill ', v = String(value).toLowerCase();
    if (v === 'high') cls += 'db-pill-green';
    else if (v === 'moderate' || v === 'medium') cls += 'db-pill-amber';
    else if (v === 'low') cls += 'db-pill-red';
    else cls += 'db-pill-slate';
    return '<span class="' + cls + '">' + escapeHtml(label) + ': ' + escapeHtml(value) + '</span>';
  }
  function valuePill(val, clickable) {
    var cls = 'db-pill db-pill-accent' + (clickable ? ' db-pill-clickable' : '');
    var attr = clickable ? ' data-nav-value="' + escapeHtml(val) + '"' : '';
    return '<span class="' + cls + '"' + attr + '>' + escapeHtml(val) + '</span>';
  }
  function isHighlighted(type, id) { return !!state.highlight && state.highlight.type === type && state.highlight.id === id; }
  function isValueHighlighted(valueId) {
    if (!state.highlight) return false;
    if (state.highlight.type === 'value' && state.highlight.id === valueId) return true;
    if (state.highlight.type === 'context') {
      var ctx = data.contexts.filter(function (c) { return c.id === state.highlight.id; })[0];
      if (ctx) {
        var val = data.values.filter(function (v) { return v.id === valueId; })[0];
        if (val && ctx.relatedValues.indexOf(val.category) !== -1) return true;
        if (ctx.relatedValues.indexOf(valueId) !== -1) return true;
      }
    }
    return false;
  }
  function highlightBanner() {
    if (!state.highlight) return '';
    var label = state.highlight.type + ': ' + state.highlight.id;
    return '<div class="db-highlight-banner"><span>🔗 ' + escapeHtml(label) + '</span>' +
      '<button class="db-highlight-clear" data-action="clear-highlight">' + escapeHtml(ui.clearHighlight) + '</button></div>';
  }
  function vulnCell(level) {
    var sym = VULN_SYMBOLS[level] != null ? VULN_SYMBOLS[level] : '';
    return '<span class="db-vuln-cell db-vuln-' + level + '">' + sym + ' ' + level + '</span>';
  }

  /* ── 1. Overview ── */
  function renderOverview() {
    var html = '';
    html += '<div class="db-kpi-row">';
    html += '<div class="db-kpi"><div class="db-kpi-value">' + data.kpis.valuesCount + '</div><div class="db-kpi-label">' + escapeHtml(ui.values) + '</div></div>';
    html += '<div class="db-kpi"><div class="db-kpi-value">' + data.kpis.contextsCount + '</div><div class="db-kpi-label">' + escapeHtml(ui.contexts) + '</div></div>';
    html += '<div class="db-kpi"><div class="db-kpi-value">' + data.kpis.evidenceRate + '%</div><div class="db-kpi-label">' + escapeHtml(ui.evidenceRate) + '</div></div>';
    html += '<div class="db-kpi"><div class="db-kpi-value">' + data.kpis.gapsCount + '</div><div class="db-kpi-label">' + escapeHtml(ui.dataGaps) + '</div></div>';
    html += '</div>';

    if (data.asset.description) {
      html += '<div class="db-card"><div class="db-card-title">' + escapeHtml(ui.description) + '</div>';
      html += '<p style="font-size:0.9rem;color:' + COLORS.textDim + '">' + escapeHtml(data.asset.description) + '</p></div>';
    }
    if (data.nara.length > 0) {
      html += '<div class="db-card"><div class="db-card-title">' + escapeHtml(ui.integrityRange) + '</div><div class="db-integrity-range">';
      data.nara.forEach(function (n) {
        var r = RATING_COLORS[n.rating] || RATING_COLORS.medium;
        html += '<span class="db-integrity-chip" style="background:' + r.bg + ';color:' + r.text + ';border-color:' + r.border + '">' + r.emoji + ' ' + escapeHtml(n.aspect) + '</span>';
      });
      html += '</div></div>';
    }
    if (data.dataQuality.gaps.length > 0) {
      html += '<div class="db-card"><div class="db-card-title">' + escapeHtml(ui.dataGaps) + '</div><ul class="db-list">';
      data.dataQuality.gaps.forEach(function (g) { html += '<li>' + escapeHtml(g) + '</li>'; });
      html += '</ul></div>';
    }
    if (data.dataQuality.sources.length > 0) {
      html += '<div class="db-card"><div class="db-card-title">' + escapeHtml(ui.sources) + '</div><ul class="db-list">';
      data.dataQuality.sources.forEach(function (s) { html += '<li>' + escapeHtml(s) + '</li>'; });
      html += '</ul></div>';
    }
    if (data.pq.boosts.length > 0 || data.pq.next.length > 0) {
      html += '<div class="db-card"><div class="db-card-title">' + escapeHtml(ui.processQuality) + '</div>';
      if (data.pq.boosts.length > 0) {
        html += '<div class="db-section-label">' + escapeHtml(ui.quickBoosts) + '</div><ul class="db-list">';
        data.pq.boosts.forEach(function (b) { html += '<li>' + escapeHtml(b) + '</li>'; });
        html += '</ul>';
      }
      if (data.pq.next.length > 0) {
        html += '<div class="db-section-label">' + escapeHtml(ui.nextSteps) + '</div><ul class="db-list">';
        data.pq.next.forEach(function (n) { html += '<li>' + escapeHtml(n) + '</li>'; });
        html += '</ul>';
      }
      html += '</div>';
    }
    return html;
  }

  /* ── 2. Map ── */
  function hasCoords() { var c = data.coordinates; return !!(c && c.lat != null && c.lng != null); }
  function renderMap() {
    if (!hasCoords()) return '<div class="db-map-placeholder">📍 ' + escapeHtml(ui.noCoords) + '</div>';
    var coordSrc = data.asset.coordinateSource || 'unknown';
    return '<div class="db-map"></div><div class="db-coord-note">📍 ' + escapeHtml(ui.coordSource) + ': ' + escapeHtml(coordSrc) + '</div>';
  }
  function initMap() {
    if (!hasCoords()) return;
    var container = root.querySelector('.db-map');
    if (!container) return;
    if (state.mapHandle) { state.mapHandle.destroy(); state.mapHandle = null; }

    var c = data.coordinates;
    var assetPopup = '<strong>' + escapeHtml(data.asset.name || '') + '</strong>';
    if (data.asset.type) assetPopup += '<br>' + escapeHtml(data.asset.type);
    if (data.asset.period) assetPopup += '<br>' + escapeHtml(data.asset.period);
    if (data.asset.description) assetPopup += '<br><em>' + escapeHtml(data.asset.description) + '</em>';

    var points = [{ id: '__asset__', lat: c.lat, lng: c.lng, color: '#2563eb', radius: 10, popupHtml: assetPopup, label: data.asset.name || '' }];
    data.comparatorCoords.forEach(function (comp) {
      if (comp.lat == null || comp.lng == null) return;
      points.push({
        id: comp.name, lat: comp.lat, lng: comp.lng, color: '#94a3b8', radius: 7, label: comp.name,
        popupHtml: '<strong>' + escapeHtml(comp.name) + '</strong>',
        onClick: function (id) { navigateTo('comparative', { type: 'comparator', id: id }); }
      });
    });
    state.mapHandle = createMap(container, { points: points, fit: true }, env);
  }

  /* ── 3. Timeline ── */
  function renderTimeline() {
    if (data.timeline.length === 0) return '<div class="db-card db-empty">' + escapeHtml(ui.timelineEmpty) + '</div>';
    var sorted = data.timeline.slice().sort(function (a, b) { return a.yearStart - b.yearStart; });
    var minYear = sorted[0].yearStart, maxYear = sorted[sorted.length - 1].yearStart, span = maxYear - minYear || 1;
    var html = '<div class="db-card"><div class="db-timeline">';
    sorted.forEach(function (evt, i) {
      var dotColor = CHANGE_COLORS[evt.changeType] || COLORS.slate;
      if (i > 0) {
        var gap = evt.yearStart - sorted[i - 1].yearStart;
        var pxGap = Math.max(8, Math.min(60, Math.round((gap / span) * 200)));
        html += '<div class="db-tl-spacer" style="height:' + pxGap + 'px"></div>';
      }
      html += '<div class="db-tl-event"><div class="db-tl-dot" style="background:' + dotColor + '"></div>';
      html += '<div class="db-tl-year">' + escapeHtml(evt.year) + '</div>';
      html += '<div class="db-tl-label">' + escapeHtml(evt.label) + ' <span class="db-pill db-pill-slate" style="border-left:3px solid ' + dotColor + '">' + escapeHtml(evt.changeType) + '</span></div></div>';
    });
    html += '</div></div>';
    var presentTypes = {};
    sorted.forEach(function (evt) { presentTypes[evt.changeType] = true; });
    html += '<div class="db-tl-legend">';
    Object.keys(CHANGE_COLORS).forEach(function (type) {
      if (!presentTypes[type]) return;
      html += '<span><span class="db-tl-legend-dot" style="background:' + CHANGE_COLORS[type] + '"></span>' + escapeHtml(type) + '</span>';
    });
    html += '</div>';
    return html;
  }

  /* ── 4. Contexts & Values ── */
  function renderCtxVal() {
    var html = highlightBanner();
    html += '<div class="db-section-label">' + escapeHtml(ui.contexts) + ' (' + data.contexts.length + ')</div>';
    data.contexts.forEach(function (ctx) {
      var emoji = CONTEXT_EMOJIS[ctx.type] || '🔹';
      var hl = isHighlighted('context', ctx.id) ? ' is-highlight' : '';
      html += '<div class="db-ctx-card' + hl + '" data-ctx-id="' + escapeHtml(ctx.id) + '">';
      html += '<div class="db-ctx-title">' + emoji + ' ' + escapeHtml(ctx.label) + '</div>';
      if (ctx.timespan) html += '<div class="db-ctx-timespan">' + escapeHtml(ctx.timespan) + '</div>';
      if (ctx.relatedValues.length > 0) {
        html += '<div class="db-ctx-pills">';
        ctx.relatedValues.forEach(function (rv) { html += valuePill(rv, true); });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '<div class="db-section-label">' + escapeHtml(ui.values) + ' (' + data.values.length + ')</div>';
    data.values.forEach(function (val) {
      var hl = isValueHighlighted(val.id) ? ' is-highlight' : '';
      html += '<div class="db-val-card' + hl + '" data-val-id="' + escapeHtml(val.id) + '">';
      html += '<div class="db-val-head"><span class="db-val-name">' + escapeHtml(val.name) + '</span>';
      html += '<span class="db-pill db-pill-accent">' + escapeHtml(val.category) + '</span>';
      var evIcon = EVIDENCE_ICONS[val.evidence] || '❓';
      html += '<span title="' + escapeHtml(val.evidence) + '">' + evIcon + '</span></div>';
      if (val.summary) html += '<div class="db-val-summary">' + escapeHtml(val.summary) + '</div>';
      html += '</div>';
    });
    if (data.attrTable.length > 0) {
      html += '<div class="db-section-label">' + escapeHtml(ui.attributeTable) + '</div>';
      html += '<div class="db-card db-scroll-x"><table class="db-table"><thead><tr><th>' + escapeHtml(ui.attribute) + '</th><th>' + escapeHtml(ui.assocValues) + '</th><th>' + escapeHtml(ui.siteSig) + '</th><th>🔑 ' + escapeHtml(ui.implication) + '</th></tr></thead><tbody>';
      data.attrTable.forEach(function (row) {
        html += '<tr><td class="db-td-strong">' + escapeHtml(row.attribute) + '</td>';
        html += '<td>' + (row.values || []).map(function (v) { return valuePill(v, false); }).join('') + '</td>';
        html += '<td>' + escapeHtml(row.sig) + '</td><td class="db-td-dim">' + escapeHtml(row.impl) + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }
    return html;
  }

  /* ── 5. Themes ── */
  function renderThemes() {
    if (!data.hasThemes) return '<div class="db-card db-empty">' + escapeHtml(ui.noData) + '</div>';
    var themes = data.themes, cats = [];
    if ((themes.valueThemes || []).length > 0) cats.push({ key: 'valueThemes', label: ui.valueThemes, items: themes.valueThemes });
    if ((themes.contextThemes || []).length > 0) cats.push({ key: 'contextThemes', label: ui.contextThemes, items: themes.contextThemes });
    if ((themes.threatThemes || []).length > 0) cats.push({ key: 'threatThemes', label: ui.threatThemes, items: themes.threatThemes });
    var activeSub = cats[0] ? cats[0].key : '';
    var html = '<div class="db-theme-sub-tabs">';
    cats.forEach(function (cat) {
      var active = cat.key === activeSub ? ' is-active' : '';
      html += '<button class="db-theme-sub-tab' + active + '" data-theme-sub="' + cat.key + '">' + escapeHtml(cat.label) + ' (' + cat.items.length + ')</button>';
    });
    html += '</div>';
    cats.forEach(function (cat) {
      var display = cat.key === activeSub ? 'block' : 'none';
      html += '<div class="db-theme-group" data-theme-group="' + cat.key + '" style="display:' + display + '">';
      cat.items.forEach(function (theme) {
        var dotColor = theme.color || COLORS.accent;
        html += '<div class="db-theme-card"><div class="db-theme-head"><span class="db-theme-dot" style="background:' + escapeHtml(dotColor) + '"></span>' + escapeHtml(theme.label) + '</div>';
        if (theme.description) html += '<div class="db-theme-desc">' + escapeHtml(theme.description) + '</div>';
        var memberIds = theme.valueIds || theme.contextIds || theme.vulnerabilities || [];
        memberIds.forEach(function (mid) { html += '<span class="db-pill db-pill-accent db-pill-clickable" data-nav-member="' + escapeHtml(mid) + '">' + escapeHtml(mid) + '</span>'; });
        html += '</div>';
      });
      html += '</div>';
    });
    return html;
  }

  /* ── 6. Integrity ── */
  function renderIntegrity() {
    var html = '';
    if (data.naraSummary) html += '<div class="db-card db-nara-summary">' + escapeHtml(data.naraSummary) + '</div>';
    if (data.nara.length > 0) {
      html += '<div class="db-section-label">' + escapeHtml(ui.naraGrid) + '</div>';
      data.nara.forEach(function (n) {
        var r = RATING_COLORS[n.rating] || RATING_COLORS.medium;
        html += '<div class="db-nara-card"><div class="db-nara-left-bar" style="background:' + r.border + '"></div>';
        html += '<div class="db-nara-body"><div class="db-nara-main"><div class="db-nara-aspect">' + escapeHtml(n.aspect) + '</div>';
        html += '<div class="db-nara-desc">' + escapeHtml(n.desc) + '</div>';
        if (n.valueExpression) html += '<div class="db-nara-ve">' + escapeHtml(ui.valueExpr) + ': ' + escapeHtml(n.valueExpression) + '</div>';
        html += '</div><div>' + ratingBadge(n.rating) + '</div></div></div>';
      });
    }
    if (data.vuln.length > 0) {
      html += '<div class="db-section-label">🔴 ' + escapeHtml(ui.vulnAnalysis) + '</div>';
      html += '<div class="db-vuln-legend">' + escapeHtml(ui.vulnLegend) + '</div>';
      var aspects = ['Form & Design', 'Materials', 'Use & Function', 'Setting'];
      var naraAspectShort = ['form', 'material', 'use', 'setting'];
      html += '<div class="db-card db-scroll-x"><table class="db-table db-vuln-table"><thead><tr><th></th>';
      aspects.forEach(function (a, i) {
        var naraMatch = data.nara.filter(function (n) { return n.aspect.toLowerCase().indexOf(naraAspectShort[i]) !== -1; })[0];
        var ratingStr = naraMatch ? ' (' + naraMatch.rating + ')' : '';
        html += '<th>' + escapeHtml(a) + '<br><span class="db-vuln-rating">' + escapeHtml(ratingStr) + '</span></th>';
      });
      html += '</tr></thead><tbody>';
      data.vuln.forEach(function (row) {
        html += '<tr><td class="db-td-strong db-vuln-rowlabel">' + escapeHtml(row.value) + '</td>';
        html += '<td>' + vulnCell(row.form) + '</td><td>' + vulnCell(row.material) + '</td><td>' + vulnCell(row.use) + '</td><td>' + vulnCell(row.setting) + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }
    return html;
  }

  /* ── 7. Comparative ── */
  function renderComparative() {
    var sites = data.comparative.sites;
    if (sites.length === 0) return '<div class="db-card db-empty">' + escapeHtml(ui.noData) + '</div>';
    var html = '';
    if (data.comparative.summary) {
      html += '<div class="db-card"><div class="db-card-title">' + escapeHtml(ui.comparatorSummary) + '</div>';
      html += '<p style="font-size:0.9rem;color:' + COLORS.textDim + '">' + escapeHtml(data.comparative.summary) + '</p></div>';
    }
    sites.forEach(function (site) {
      var hl = isHighlighted('comparator', site.name) ? ' is-highlight' : '';
      html += '<div class="db-comp-card' + hl + '" data-comp-name="' + escapeHtml(site.name) + '"><div class="db-comp-name">' + escapeHtml(site.name) + '</div>';
      html += '<div class="db-comp-meta">';
      if (site.period) html += escapeHtml(ui.period) + ': ' + escapeHtml(site.period);
      if (site.arch) html += ' &middot; ' + escapeHtml(ui.architect) + ': ' + escapeHtml(site.arch);
      html += '</div><div class="db-comp-pills">';
      html += critPill(ui.rarity, site.crit.rarity) + critPill(ui.documentation, site.crit.documentation) + critPill(ui.condition, site.crit.condition);
      html += '</div>';
      if (site.dist) html += '<div class="db-comp-dist">' + escapeHtml(site.dist) + '</div>';
      html += '</div>';
    });
    return html;
  }

  /* ── 8. Significance ── */
  function renderSignificance() {
    if (!data.significance) return '<div class="db-card db-empty">' + escapeHtml(ui.noData) + '</div>';
    return '<div class="db-card-title db-sig-title">' + escapeHtml(ui.sigStatement) + '</div><div class="db-sig-block">' + escapeHtml(data.significance) + '</div>';
  }

  /* ── Dynamic tab renderers ── */
  function linkifyCell(cellText) {
    var escaped = escapeHtml(cellText), match = entityNameMap[String(cellText)];
    if (match == null) return escaped;
    if (match === '__asset__') return '<button class="db-link-btn" data-nav-entity="map">' + escaped + '</button>';
    return '<button class="db-link-btn" data-nav-entity="comparative" data-nav-entity-id="' + escapeHtml(match) + '">' + escaped + '</button>';
  }
  function renderGenericTable(t) {
    if (!t || !t.columns || !t.rows) return '';
    var html = '<div class="db-card db-scroll-x"><table class="db-table"><thead><tr>';
    t.columns.forEach(function (col) { html += '<th>' + escapeHtml(col) + '</th>'; });
    html += '</tr></thead><tbody>';
    t.rows.forEach(function (row) { html += '<tr>'; (row || []).forEach(function (cell) { html += '<td>' + linkifyCell(cell) + '</td>'; }); html += '</tr>'; });
    html += '</tbody></table></div>';
    return html;
  }
  function renderGenericCards(t) {
    if (!t || !t.cards) return '';
    var html = '<div class="db-card-grid">';
    t.cards.forEach(function (card) {
      var level = String(card.level || '').toLowerCase(), borderColor = COLORS.accent;
      if (level === 'well-grounded' || level === 'strong') borderColor = COLORS.green;
      else if (level === 'supported' || level === 'moderate') borderColor = COLORS.amber;
      else if (level === 'asserted' || level === 'weak') borderColor = COLORS.red;
      html += '<div class="db-card" style="border-left:4px solid ' + borderColor + '"><div class="db-gcard-title">' + escapeHtml(card.title || '') + '</div>';
      if (card.subtitle) html += '<div class="db-gcard-sub">' + escapeHtml(card.subtitle) + '</div>';
      if (card.body) html += '<div class="db-gcard-body">' + escapeHtml(card.body) + '</div>';
      if (card.badges && card.badges.length > 0) { html += '<div class="db-gcard-badges">'; card.badges.forEach(function (b) { html += '<span class="db-pill db-pill-accent">' + escapeHtml(b) + '</span>'; }); html += '</div>'; }
      html += '</div>';
    });
    html += '</div>';
    return html;
  }
  function renderGenericMatrix(t) {
    if (!t || !t.rowLabels || !t.colLabels || !t.cells) return '';
    var cellColors = { 3: '#fecaca', 2: '#fef3c7', 1: '#f1f5f9', 0: '#f8fafc' };
    var html = '<div class="db-card db-scroll-x"><table class="db-table db-vuln-table"><thead><tr><th></th>';
    t.colLabels.forEach(function (col) { html += '<th>' + escapeHtml(col) + '</th>'; });
    html += '</tr></thead><tbody>';
    t.rowLabels.forEach(function (rowLabel, ri) {
      html += '<tr><td class="db-td-strong db-vuln-rowlabel">' + linkifyCell(rowLabel) + '</td>';
      (t.cells[ri] || []).forEach(function (val) { var v = val != null ? val : 0; html += '<td><span class="db-vuln-cell" style="background:' + (cellColors[v] || cellColors[0]) + '">' + v + '</span></td>'; });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }
  function renderGenericProse(t) {
    if (!t || !t.sections) return '';
    var html = '';
    t.sections.forEach(function (section) {
      html += '<div class="db-card">';
      if (section.title) html += '<h3 class="db-prose-title">' + escapeHtml(section.title) + '</h3>';
      if (section.body) html += '<p class="db-prose-body">' + escapeHtml(section.body).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>';
      html += '</div>';
    });
    return html;
  }
  function renderDynamicTab(tab) {
    var html = '<div class="db-section-label">' + escapeHtml(tab.label) + '</div>';
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

  var TAB_RENDERERS = {
    overview: renderOverview, map: renderMap, timeline: renderTimeline, ctxval: renderCtxVal,
    themes: renderThemes, integrity: renderIntegrity, comparative: renderComparative, significance: renderSignificance
  };

  /* ── AI Query tab ── */
  function mountAI() {
    var mountEl = root.querySelector('.db-ai-mount');
    if (!mountEl) return;
    renderAIPanel(mountEl, env, {
      title: { en: 'Dashboard Query', he: 'שאילתת לוח' },
      starters: AI_STARTERS,
      buildPrompt: function (q) {
        return 'You are analysing a CBSA heritage Assessment Dashboard. Answer ONLY from the data below, concisely (<=150 words). If the data does not support an answer, say so.\n\nDASHBOARD DATA (JSON):\n' +
          JSON.stringify(data) + '\n\nQUESTION: ' + q;
      }
    });
  }

  /* ── main render ── */
  function render() {
    if (state.mapHandle) { state.mapHandle.destroy(); state.mapHandle = null; }

    var visibleTabs = TAB_DEFS.filter(function (t) { return !(t.id === 'themes' && !data.hasThemes); });
    var dynamicTabs = (data.tabs || []).map(function (t) { return { id: t.id, icon: t.icon || '📄', label: t.label }; });
    visibleTabs = visibleTabs.concat(dynamicTabs);
    visibleTabs.push({ id: 'aiquery', icon: '🤖' }); // AI Query always last

    if (!visibleTabs.some(function (t) { return t.id === state.activeTab; })) state.activeTab = visibleTabs[0].id;

    var sidebar = '<div class="db-sidebar"><div class="db-sidebar-header">CBSA Dashboard</div><div role="tablist">';
    visibleTabs.forEach(function (tab) {
      var isActive = tab.id === state.activeTab;
      var label = TAB_LABELS[tab.id] ? (ui[TAB_LABELS[tab.id]] || tab.id) : (tab.label || tab.id);
      sidebar += '<button class="db-sidebar-tab' + (isActive ? ' is-active' : '') + '" data-tab="' + tab.id + '" role="tab" aria-selected="' + isActive + '">';
      sidebar += '<span class="db-tab-indicator"></span><span class="db-tab-icon">' + tab.icon + '</span><span>' + escapeHtml(label) + '</span></button>';
    });
    sidebar += '</div></div>';

    var header = '<div class="db-header"><div class="db-header-name">' + escapeHtml(data.asset.name || 'CBSA Dashboard') + '</div>';
    var metaParts = [];
    if (data.asset.location) metaParts.push(data.asset.location);
    if (data.asset.type) metaParts.push(data.asset.type);
    if (data.asset.period) metaParts.push(data.asset.period);
    if (metaParts.length > 0) header += '<div class="db-header-meta">' + escapeHtml(metaParts.join(' · ')) + '</div>';
    header += '</div>';

    var content;
    if (state.activeTab === 'aiquery') {
      content = '<div class="db-ai-mount"></div>';
    } else {
      var renderer = TAB_RENDERERS[state.activeTab];
      if (renderer) content = renderer();
      else { var dynTab = (data.tabs || []).filter(function (t) { return t.id === state.activeTab; })[0]; content = dynTab ? renderDynamicTab(dynTab) : ''; }
    }

    root.innerHTML = '<div class="db-shell">' + sidebar + '<div class="db-main">' + header + '<div class="db-content">' + content + '</div></div></div>';
    attachEvents();
    if (state.activeTab === 'map') initMap();
    if (state.activeTab === 'aiquery') mountAI();
  }

  /* ── events ── */
  function attachEvents() {
    root.querySelectorAll('.db-sidebar-tab[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () { var tab = this.getAttribute('data-tab'); if (tab && tab !== state.activeTab) { state.activeTab = tab; render(); } });
    });
    root.querySelectorAll('[data-action="clear-highlight"]').forEach(function (btn) {
      btn.addEventListener('click', function () { state.highlight = null; render(); });
    });
    root.querySelectorAll('.db-ctx-card[data-ctx-id]').forEach(function (card) {
      card.addEventListener('click', function () {
        var id = this.getAttribute('data-ctx-id');
        state.highlight = (state.highlight && state.highlight.type === 'context' && state.highlight.id === id) ? null : { type: 'context', id: id };
        render();
      });
    });
    root.querySelectorAll('.db-val-card[data-val-id]').forEach(function (card) {
      card.addEventListener('click', function () {
        var id = this.getAttribute('data-val-id');
        state.highlight = (state.highlight && state.highlight.type === 'value' && state.highlight.id === id) ? null : { type: 'value', id: id };
        render();
      });
    });
    root.querySelectorAll('[data-nav-value]').forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.stopPropagation();
        var val = this.getAttribute('data-nav-value');
        var matchVal = data.values.filter(function (v) { return v.category === val || v.id === val; })[0];
        if (matchVal) navigateTo('ctxval', { type: 'value', id: matchVal.id });
      });
    });
    root.querySelectorAll('.db-theme-sub-tab[data-theme-sub]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = this.getAttribute('data-theme-sub');
        root.querySelectorAll('.db-theme-sub-tab').forEach(function (s) { s.classList.remove('is-active'); });
        this.classList.add('is-active');
        root.querySelectorAll('.db-theme-group').forEach(function (g) { g.style.display = g.getAttribute('data-theme-group') === key ? 'block' : 'none'; });
      });
    });
    root.querySelectorAll('[data-nav-entity]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var targetTab = this.getAttribute('data-nav-entity'), entityId = this.getAttribute('data-nav-entity-id');
        if (targetTab === 'comparative' && entityId) navigateTo('comparative', { type: 'comparator', id: entityId });
        else navigateTo(targetTab, null);
      });
    });
    root.querySelectorAll('[data-nav-member]').forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.stopPropagation();
        var mid = this.getAttribute('data-nav-member');
        var matchVal = data.values.filter(function (v) { return v.id === mid; })[0];
        if (matchVal) { navigateTo('ctxval', { type: 'value', id: matchVal.id }); return; }
        var matchCtx = data.contexts.filter(function (c) { return c.id === mid; })[0];
        if (matchCtx) navigateTo('ctxval', { type: 'context', id: matchCtx.id });
      });
    });
  }

  function navigateTo(tabId, highlight) { state.activeTab = tabId; state.highlight = highlight || null; render(); }

  render();
}
