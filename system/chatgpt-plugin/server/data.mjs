import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';

const record = z.record(z.unknown());
const item = z.object({ id: z.string().min(1) }).passthrough();
const tab = z.object({ id: z.string().min(1), label: z.string().min(1), type: z.enum(['table', 'cards', 'matrix', 'prose', 'custom']), data: record }).passthrough();
export const dataSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('kg'), title: z.string().optional(), nodes: z.array(item.extend({ name: z.string().min(1), type: z.string().min(1), epistemic: z.enum(['sourced', 'inferred', 'interpretive', 'unlabeled']).optional() })).min(1), edges: z.array(record) }).passthrough(),
  z.object({ type: z.literal('assessment'), asset: z.object({ name: z.string().min(1) }).passthrough(), contexts: z.array(item).optional(), values: z.array(item).optional(), tabs: z.array(tab).optional() }).passthrough(),
  z.object({ type: z.literal('collection'), collection: z.object({ name: z.string().min(1) }).passthrough(), sites: z.array(item.extend({ name: z.string().min(1), values: z.record(z.enum(['e', 'i', 'a', 'u']).nullable()).optional() })).min(1), themes: z.array(record).optional(), tabs: z.array(tab).optional() }).passthrough()
]);
const arrayRecords = z.array(record);
const stringArray = z.array(z.string());
const displayTabData = {
  table: z.object({ columns: z.array(z.union([z.string(), record])), rows: z.array(z.union([z.array(z.unknown()), record])) }).passthrough(),
  cards: z.object({ cards: arrayRecords }).passthrough(),
  matrix: z.object({ rowLabels: stringArray, colLabels: stringArray, cells: z.array(z.array(z.number().int().min(0).max(3).nullable())) }).passthrough(),
  prose: z.object({ sections: z.array(z.object({ title: z.string().optional(), body: z.string().optional() }).passthrough()) }).passthrough(),
  custom: z.object({ html: z.string() }).passthrough()
};
const reservedTabs = new Set(['overview', 'map', 'timeline', 'ctxval', 'themes', 'integrity', 'comparative', 'significance', 'values', 'aiquery']);
function duplicateIssues(items, path, issues) {
  const ids = new Set();
  for (const item of Array.isArray(items) ? items : []) {
    if (!item || typeof item.id !== 'string' || !item.id.trim()) { issues.push(`${path}: nonempty id required`); continue; }
    if (ids.has(item.id)) issues.push(`${path}: duplicate id`);
    ids.add(item.id);
  }
  return ids;
}
export function validateData(raw) {
  // Bound nesting before invoking schemas or walking attacker-controlled records.
  const pending = [{ value: raw, depth: 0 }];
  while (pending.length) {
    const { value, depth } = pending.pop();
    if (!value || typeof value !== 'object') continue;
    if (depth > 64) return { ok: false, issues: ['DATA: nesting exceeds 64 levels'] };
    for (const [key, nested] of Object.entries(value)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) return { ok: false, issues: ['DATA: forbidden object key'] };
      pending.push({ value: nested, depth: depth + 1 });
    }
  }
  const parsed = dataSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.code}`) };
  const data = parsed.data;
  const issues = [];
  const visit = (value, path = '$') => {
    if (!value || typeof value !== 'object') return;
    for (const [key, nested] of Object.entries(value)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) issues.push(`${path}: forbidden key`);
      if (['lat', 'lng', 'lon'].includes(key) && nested != null && (typeof nested !== 'number' || !Number.isFinite(nested) || Math.abs(nested) > (key === 'lat' ? 90 : 180))) issues.push(`${path}.${key}: invalid coordinate`);
      visit(nested, `${path}.${key}`);
    }
  };
  visit(raw);
  if (data.type === 'kg') {
    const ids = duplicateIssues(data.nodes, 'nodes', issues);
    for (const edge of data.edges) if (!ids.has(edge.source ?? edge.from) || !ids.has(edge.target ?? edge.to)) issues.push('edges: unknown endpoint');
  }
  const lists = data.type === 'assessment' ? ['contexts', 'values', 'tabs'] : data.type === 'collection' ? ['sites', 'tabs', 'themes'] : [];
  for (const field of lists) duplicateIssues(data[field], field, issues);
  for (const t of data.tabs ?? []) if (reservedTabs.has(t.id)) issues.push('tabs: reserved id');
  if (data.type === 'collection') {
    if (data.collection.itemCount != null && data.collection.itemCount !== data.sites.length) issues.push('collection.itemCount: mismatched site count');
    const ids = new Set(data.sites.map(s => s.id));
    for (const theme of data.themes ?? []) for (const id of theme.sites ?? []) if (!ids.has(id)) issues.push('themes: unknown site');
  }
  const check = (value, schema, path) => {
    if (value === undefined || value === null) return;
    const result = schema.safeParse(value);
    if (!result.success) issues.push(`${path}: invalid display structure`);
  };
  for (const field of ['timeline', 'attrTable', 'attributeTable', 'vulnerability', 'vuln', 'nara']) check(data[field], arrayRecords, field);
  for (const field of ['authenticity', 'comparative', 'dataQuality', 'processQuality', 'pq', 'collectionSummary']) check(data[field], record, field);
  if (data.authenticity && typeof data.authenticity === 'object') check(data.authenticity.grid, arrayRecords, 'authenticity.grid');
  if (data.comparative && typeof data.comparative === 'object') for (const field of ['sites', 'comparators']) check(data.comparative[field], arrayRecords, `comparative.${field}`);
  if (data.type === 'assessment' && data.themes != null) {
    check(data.themes, record, 'themes');
    for (const field of ['valueThemes', 'contextThemes', 'threatThemes']) check(data.themes[field], arrayRecords, `themes.${field}`);
  }
  for (const t of data.tabs ?? []) {
    check(t.data, displayTabData[t.type], `tabs.${t.id}.data`);
    if (t.type === 'matrix' && Array.isArray(t.data.cells) && Array.isArray(t.data.rowLabels) && Array.isArray(t.data.colLabels) && (t.data.cells.length !== t.data.rowLabels.length || t.data.cells.some(row => !Array.isArray(row) || row.length !== t.data.colLabels.length))) issues.push(`tabs.${t.id}: matrix dimensions do not match labels`);
  }
  if (issues.length) return { ok: false, issues };
  const sanitizations = [];
  for (const t of data.tabs ?? []) if (t.type === 'custom') {
    if (typeof t.data.html !== 'string') return { ok: false, issues: ['tabs.custom: html string required'] };
    const clean = sanitizeHtml(t.data.html, { allowedTags: sanitizeHtml.defaults.allowedTags, allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['class', 'dir', 'title'] }, allowedSchemes: ['https', 'http', 'mailto'] });
    if (clean !== t.data.html) sanitizations.push(`tabs.${t.id}: unsafe HTML removed`);
    t.data.html = clean;
  }
  return { ok: true, data, sanitizations };
}
export function summarize(data) {
  return { type: data.type, title: data.title ?? data.asset?.name ?? data.collection?.name ?? 'InSites', itemCount: data.nodes?.length ?? data.sites?.length ?? data.values?.length ?? 0, relationCount: data.edges?.length ?? 0, tabCount: data.tabs?.length ?? 0 };
}
