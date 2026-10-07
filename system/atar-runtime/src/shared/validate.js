// Validate before renderer filters or layout can silently discard records.
export function validate(type, data) {
  function need(ok, message) { if (!ok) throw new Error(message); }
  function ids(items, label) {
    const seen = new Set();
    items.forEach(function (item) {
      need(item && typeof item.id === 'string' && item.id.length > 0, label + ': missing ID');
      need(!seen.has(item.id), label + ': duplicate ID ' + item.id);
      seen.add(item.id);
    });
    return seen;
  }
  if (type === 'kg') {
    need(data.nodes.length > 0, 'Graph needs at least one node');
    const known = ids(data.nodes, 'Node');
    data.nodes.forEach(function (n) {
      need(typeof n.name === 'string' && n.name.length > 0, 'Node needs a name');
      need(['sourced', 'inferred', 'interpretive', 'unlabeled'].includes(n.epistemic), 'Unknown epistemic status');
    });
    data.edges.forEach(function (e) {
      need(known.has(e.from) && known.has(e.to), 'Edge endpoint does not exist: ' + e.from + ' / ' + e.to);
    });
  }
  if (type === 'collection') {
    ids(data.sites, 'Site');
    if (data.collection.itemCount != null) need(data.collection.itemCount === data.sites.length, 'Collection itemCount mismatch');
    data.sites.forEach(function (s) {
      Object.values(s.values).forEach(function (status) { need(status == null || ['e', 'i', 'a', 'u'].includes(status), 'Unknown collection value status'); });
    });
  }
  if (type === 'assessment') {
    ids(data.contexts, 'Context'); ids(data.values, 'Value');
  }
  const tabs = data.tabs || [];
  ids(tabs, 'Tab');
  const reserved = ['overview','map','timeline','ctxval','themes','integrity','comparative','significance','values','aiquery'];
  tabs.forEach(function (t) {
    need(!reserved.includes(t.id), 'Reserved tab ID: ' + t.id);
    need(['table','cards','matrix','prose','custom'].includes(t.type), 'Unknown tab type: ' + t.type);
  });
}
