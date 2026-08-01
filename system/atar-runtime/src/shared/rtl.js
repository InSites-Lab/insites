// Hebrew/Arabic Unicode ranges (escaped) — matches the GPT runtime's isRTL.
var RTL_RE = new RegExp('[\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC]');

export function isRTL(s) {
  return RTL_RE.test(s || '');
}

// Decide RTL from a small, type-appropriate probe of the data's display strings.
export function detectRTL(type, data) {
  const probe = [];
  if (type === 'kg') {
    (data.nodes || []).slice(0, 8).forEach((n) => probe.push(n && n.name, n && n.meaning));
    probe.push(data.title);
  } else if (type === 'collection') {
    probe.push(data.collection && data.collection.name);
    (data.sites || []).slice(0, 3).forEach((s) => probe.push(s && s.name));
  } else {
    probe.push(data.asset && data.asset.name);
    (data.contexts || []).slice(0, 2).forEach((c) => probe.push(c && c.label));
  }
  return probe.some(isRTL);
}
