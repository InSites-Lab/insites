// Canonical = the Claude mono full-field spec; normalize() also accepts the GPT abbreviated keys.
// Each branch returns a fully-derived, presentation-ready object so the renderers stay purely
// presentational (no internal re-normalization). Missing fields default — never throw.
export function normalize(type, data) {
  if (type === 'kg') return normKG(data);
  if (type === 'collection') return normCollection(data);
  if (type === 'assessment') return normDashboard(data);
  return data;
}

function normKG(d) {
  d = d || {};
  var nodes = (d.nodes || []).map(function (n) { return Object.assign({}, n); });
  var edges = (d.edges || []).map(function (e) {
    return Object.assign({}, e, {
      from: e.from != null ? e.from : e.source,
      to: e.to != null ? e.to : e.target
    });
  });
  return Object.assign({}, d, { nodes: nodes, edges: edges, title: d.title || d.name || '' });
}

// ── Assessment dashboard (single site) — ported from dashboard-runtime.js norm() ──
// Dual-key: ys↔yearStart, ct↔changeType, rv↔relatedValues, ts↔timespan, cat↔category,
// ev↔evidence, attr/vals/sig/impl, ve↔valueExpression, nara↔authenticity.grid, comparators↔sites.
function normDashboard(src) {
  var d = src || {};
  var data = {};

  data.asset = d.asset || {};
  data.dataQuality = d.dataQuality || { sources: [], gaps: [] };
  if (!data.dataQuality.sources) data.dataQuality.sources = [];
  if (!data.dataQuality.gaps) data.dataQuality.gaps = [];

  data.timeline = (d.timeline || []).map(function (t) {
    return {
      year: t.year || '',
      yearStart: t.ys || t.yearStart || 0,
      label: t.label || '',
      changeType: t.ct || t.changeType || 'structure'
    };
  });

  data.contexts = (d.contexts || []).map(function (c) {
    return {
      id: c.id || '',
      type: c.type || '',
      label: c.label || '',
      relatedValues: c.rv || c.relatedValues || [],
      timespan: c.ts || c.timespan || ''
    };
  });

  data.values = (d.values || []).map(function (v) {
    return {
      id: v.id || '',
      name: v.name || '',
      category: v.cat || v.category || '',
      evidence: v.ev || v.evidence || 'uncertain',
      summary: v.summary || ''
    };
  });

  data.attrTable = (d.attrTable || d.attributeTable || []).map(function (a) {
    return {
      attribute: a.attr || a.attribute || '',
      values: a.vals || a.values || [],
      sig: a.sig || a.significance || '',
      impl: a.impl || a.implication || ''
    };
  });

  data.nara = (d.nara || (d.authenticity && d.authenticity.grid) || []).map(function (n) {
    return {
      aspect: n.aspect || '',
      desc: n.desc || n.description || '',
      valueExpression: n.ve || n.valueExpression || '',
      rating: n.rating || 'medium'
    };
  });
  data.naraSummary = d.naraSummary || (d.authenticity && d.authenticity.summary) || '';

  var comp = d.comparative || {};
  data.comparative = {
    summary: comp.summary || '',
    sites: (comp.sites || comp.comparators || []).map(function (s) {
      var crit = s.crit || s.criteria || {};
      return {
        name: s.name || '',
        period: s.period || '',
        arch: s.arch || s.architect || '',
        dist: s.dist || s.distinction || '',
        crit: {
          rarity: crit.rarity || 'unknown',
          documentation: crit.documentation || 'unknown',
          condition: crit.condition || 'unknown'
        },
        coordinates: s.coordinates || null
      };
    })
  };

  data.significance = d.significance || '';
  if (typeof d.significance === 'object' && d.significance !== null) {
    data.significance = d.significance.statement || '';
  }

  data.vuln = (d.vuln || d.vulnerability || []).map(function (v) {
    return {
      value: v.value || '',
      form: v.form != null ? v.form : 0,
      material: v.material != null ? v.material : 0,
      use: v.use != null ? v.use : 0,
      setting: v.setting != null ? v.setting : 0
    };
  });

  var pq = d.pq || d.processQuality || {};
  data.pq = {
    strengths: pq.strengths || 0,
    boosts: pq.boosts || pq.quickBoosts || [],
    next: pq.next || pq.nextSteps || []
  };

  data.stages = d.stages || d.stagesCompleted || [];
  data.kg = d.kg || null;
  data.tabs = d.tabs || [];

  data.coordinates = d.coordinates || (d.asset && d.asset.coordinates) || null;
  data.comparatorCoords = d.comparatorCoords || [];
  if (data.comparatorCoords.length === 0) {
    data.comparative.sites.forEach(function (s) {
      if (s.coordinates && s.coordinates.lat != null) {
        data.comparatorCoords.push({ name: s.name, lat: s.coordinates.lat, lng: s.coordinates.lng });
      }
    });
  }

  data.themes = d.themes || null;
  var hasThemes = false;
  if (data.themes) {
    var vt = (data.themes.valueThemes || []).length;
    var ct = (data.themes.contextThemes || []).length;
    var tt = (data.themes.threatThemes || []).length;
    hasThemes = (vt + ct + tt) >= 2;
  }
  data.hasThemes = hasThemes;

  data.kpis = {
    valuesCount: data.values.length,
    contextsCount: data.contexts.length,
    evidenceRate: data.values.length > 0
      ? Math.round(data.values.filter(function (v) { return v.evidence === 'sourced'; }).length / data.values.length * 100)
      : 0,
    gapsCount: data.dataQuality.gaps.length
  };

  return data;
}

// ── Collection dashboard (multiple sites) — ported from collection-dashboard-runtime.js norm() ──
function normCollection(src) {
  var d = src || {};
  var data = {};

  data.collection = d.collection || {};
  data.sites = (d.sites || []).map(function (s) {
    return {
      id: s.id || '',
      name: s.name || '',
      region: s.region || '',
      lat: s.lat != null ? s.lat : null,
      lng: s.lng != null ? s.lng : null,
      depth: (s.depth || 'thin').toLowerCase(),
      type: s.type || '',
      typeCategory: s.typeCategory || '',
      period: s.period || '',
      periodCategory: s.periodCategory || '',
      description: s.description || '',
      significanceSummary: s.significanceSummary || '',
      highlight: s.highlight || '',
      values: s.values || {},
      valueSpecs: s.valueSpecs || {},
      integrity: s.integrity || '',
      integrityNote: s.integrityNote || '',
      threats: s.threats || [],
      comparativeBasis: s.comparativeBasis || '',
      claimScope: s.claimScope || ''
    };
  });

  data.themes = d.themes || [];
  data.arguments = d.arguments || [];
  data.managementClusters = d.managementClusters || {};

  var cs = d.collectionSummary || {};
  data.collectionSummary = {
    narrative: cs.narrative || '',
    patterns: cs.patterns || [],
    gaps: cs.gaps || [],
    distinctives: cs.distinctives || []
  };

  data.tabs = d.tabs || [];
  data.kg = d.kg || null;

  var regionMap = {};
  data.sites.forEach(function (s) { if (s.region) regionMap[s.region] = (regionMap[s.region] || 0) + 1; });
  data.regionCounts = regionMap;
  data.regionList = Object.keys(regionMap).sort();

  var typeMap = {};
  data.sites.forEach(function (s) { var t = s.typeCategory || s.type || 'Unknown'; typeMap[t] = (typeMap[t] || 0) + 1; });
  data.typeCounts = typeMap;

  var periodMap = {};
  data.sites.forEach(function (s) { var p = s.periodCategory || s.period || 'Unknown'; periodMap[p] = (periodMap[p] || 0) + 1; });
  data.periodCounts = periodMap;

  var depthMap = { rich: 0, medium: 0, thin: 0 };
  data.sites.forEach(function (s) { if (depthMap[s.depth] != null) depthMap[s.depth]++; else depthMap.thin++; });
  data.depthCounts = depthMap;

  var vtSet = {};
  data.sites.forEach(function (s) { Object.keys(s.values || {}).forEach(function (k) { vtSet[k] = true; }); });
  data.valueTypes = Object.keys(vtSet).sort();

  var periods = data.sites.map(function (s) { return s.period; }).filter(Boolean);
  data.timeSpanLabel = periods.length > 0 ? periods[0] + ' – ' + periods[periods.length - 1] : '—';

  return data;
}
