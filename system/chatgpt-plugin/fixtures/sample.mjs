// Entirely synthetic transport/rendering fixtures; no heritage evidence.
export const kg = {
  type: 'kg', title: 'Synthetic connection graph',
  nodes: [
    { id: 'demo', name: 'Synthetic workshop', type: 'Asset', epistemic: 'sourced', meaning: 'An invented transport fixture; not a source.' },
    { id: 'value', name: 'Workshop memory', type: 'Cultural Value', epistemic: 'interpretive', epistemic_note: 'Synthetic status for UI testing only.' }
  ], edges: [{ source: 'demo', target: 'value', label: 'expresses_value' }]
};
export const assessment = {
  type: 'assessment', asset: { name: 'Synthetic workshop', description: 'An invented rendering fixture.', coordinates: { lat: null, lng: null }, coordinateSource: 'unknown' },
  dataQuality: { sources: [], gaps: ['Synthetic fixture: no heritage sources.'] }, timeline: [], contexts: [], values: [], attributeTable: [],
  authenticity: { grid: [], summary: '' }, comparative: { summary: '', comparators: [] }, significance: { statement: '' }, vulnerability: [],
  processQuality: { strengths: 0, gaps: 1, quickBoosts: [], nextSteps: [] }, themes: { valueThemes: [], contextThemes: [], threatThemes: [] }, tabs: []
};
export const collection = {
  type: 'collection', collection: { name: 'Synthetic collection', itemCount: 2 },
  sites: [{ id: 's1', name: 'Synthetic workshop', values: { 'Workshop memory': 'u' }, lat: null, lng: null }, { id: 's2', name: 'Synthetic storehouse', values: { 'Workshop memory': 'u' }, lat: null, lng: null }],
  themes: [], collectionSummary: { narrative: 'Synthetic rendering fixture.', patterns: [], gaps: [], distinctives: [] }, tabs: []
};
export const probe = { type: 'probe', title: 'InSites connection test', synthetic: true };
export const fixtures = { kg, assessment, collection, probe };
