// [CA-EC] canonical entity palette — copied from the GPT KG runtime (COLOR_BY_TYPE).
export const COLOR_BY_TYPE = {
  'Natural Phenomenon':    { background: 'rgba(14,165,233,0.7)',  border: '#0ea5e9' },
  'Structure / Building':  { background: 'rgba(245,158,11,0.7)',  border: '#f59e0b' },
  'Architectural Element': { background: 'rgba(217,119,6,0.7)',   border: '#d97706' },
  'Person':                { background: 'rgba(236,72,153,0.7)',  border: '#ec4899' },
  'Event':                 { background: 'rgba(239,68,68,0.7)',   border: '#ef4444' },
  'Story / Narrative':     { background: 'rgba(139,92,246,0.7)',  border: '#8b5cf6' },
  'Social Group':          { background: 'rgba(59,130,246,0.7)',  border: '#3b82f6' },
  'Cultural Value':        { background: 'rgba(99,102,241,0.7)',  border: '#6366f1' },
  'Value':                 { background: 'rgba(99,102,241,0.7)',  border: '#6366f1' },
  'Place':                 { background: 'rgba(16,185,129,0.7)',  border: '#10b981' },
  'Artwork / Artefact':    { background: 'rgba(244,63,94,0.7)',   border: '#f43f5e' },
  'Tradition / Custom':    { background: 'rgba(20,184,166,0.7)',  border: '#14b8a6' },
  'Historical Period':     { background: 'rgba(100,116,139,0.7)', border: '#64748b' },
  'Religion / Belief':     { background: 'rgba(168,85,247,0.7)',  border: '#a855f7' },
  'Collective Memory':     { background: 'rgba(132,204,22,0.7)',  border: '#84cc16' },
  'Asset':                 { background: 'rgba(229,57,53,0.7)',   border: '#E53935' }
};
export const FALLBACK_COLOR = { background: 'rgba(200,200,200,0.6)', border: '#666666' };

export function resolveColor(type) {
  return COLOR_BY_TYPE[type] || FALLBACK_COLOR;
}

// Hebrew <-> canonical English type mapping (escaped \u to avoid encoding issues) — from the GPT KG runtime.
export const CANONICAL_TYPE_MAP = {};
export const HEBREW_LABEL_BY_CANONICAL = {};
const TYPE_PAIRS = [
  [['Natural Phenomenon'],    ['תופעה טבעית']],
  [['Structure / Building'],  ['מבנה', 'מבנה / אתר']],
  [['Architectural Element'], ['אלמנט אדריכלי']],
  [['Person'],                ['דמות', 'אדם']],
  [['Event'],                 ['אירוע']],
  [['Story / Narrative'],     ['סיפור / נרטיב', 'סיפור', 'נרטיב']],
  [['Social Group'],          ['קבוצה חברתית']],
  [['Cultural Value'],        ['ערך תרבותי', 'ערך']],
  [['Place'],                 ['מקום']],
  [['Artwork / Artefact'],    ['יצירת אמנות / ממצא', 'יצירת אמנות', 'ממצא']],
  [['Tradition / Custom'],    ['מסורת / מנהג', 'מסורת', 'מנהג']],
  [['Historical Period'],     ['תקופה היסטורית']],
  [['Religion / Belief'],     ['דת / אמונה']],
  [['Collective Memory'],     ['זיכרון קולקטיבי']],
  [['Asset'],                 ['נכס מורשת', 'נכס']],
  [['General'],               ['סוג כללי']]
];
TYPE_PAIRS.forEach(function (pair) {
  const canonical = pair[0][0];
  const hebrewVariants = pair[1];
  HEBREW_LABEL_BY_CANONICAL[canonical] = hebrewVariants[0];
  hebrewVariants.forEach(function (he) { CANONICAL_TYPE_MAP[he] = canonical; });
});
