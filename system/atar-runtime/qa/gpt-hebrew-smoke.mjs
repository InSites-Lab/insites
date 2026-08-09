import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const here = path.dirname(fileURLToPath(import.meta.url));
const bundlePath = path.resolve(here, '..', 'dist', 'atar-runtime.umd.js');
const cssPath = path.resolve(here, '..', 'dist', 'atar-runtime.css');
const packagePath = path.resolve(here, '..', 'package.json');
const kgSourcePath = path.resolve(here, '..', 'src', 'renderers', 'kg.js');
const bundle = fs.readFileSync(bundlePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const packageVersion = JSON.parse(fs.readFileSync(packagePath, 'utf8')).version;
const kgSource = fs.readFileSync(kgSourcePath, 'utf8');

assert.match(css, /\.atar-kg \.kg-node text \{ font-size: 10px;/, 'KG compact node labels must retain the accepted 10px scale');
assert.match(css, /\.atar-kg:not\(\.kg-compact\) \.kg-node text \{ font-size: 7\.5px;/, 'KG wide node labels must use the reduced 7.5px scale');
assert.match(css, /\.atar-kg \.kg-edge \{[^}]*stroke-width: 0\.75px;[^}]*vector-effect: non-scaling-stroke;/, 'KG default edges must remain visually thin at every fit scale');
assert.match(css, /\.atar-kg svg \.kg-edge-label \{ font-size: 9px; font-style: normal;/, 'KG compact edge labels must remain non-italic');
assert.match(css, /\.atar-kg:not\(\.kg-compact\) svg \.kg-edge-label \{ font-size: 6\.5px;/, 'KG wide edge labels must use the reduced 6.5px scale');
assert.match(css, /\.kg-result-btn \.kg-edge-label \{[^}]*font-style: normal;/, 'KG sidebar edge labels must not leak italic SVG styling');
assert.match(kgSource, /canonical === 'Asset'\) return compact \? 14 : 9;/, 'KG asset radius must shrink only in wide mode');
assert.match(kgSource, /node\.value_type\) return compact \? 10 : 6\.5;/, 'KG value radius must shrink only in wide mode');
assert.match(kgSource, /return compact \? 8 : 5\.5;/, 'KG default radius must shrink only in wide mode');
assert.match(kgSource, /getNodeSize\(node\) \+ \(root\.classList\.contains\('kg-compact'\) \? 10 : 5\)/, 'KG wide node labels must sit closer to their nodes');
assert.match(kgSource, /const maxFitScale = root\.classList\.contains\('kg-compact'\) \? 1\.6 : 1\.07;/, 'KG wide fit must start slightly enlarged without restoring oversized glyphs');
assert.match(kgSource, /x: mx \+ \(dy \/ len\) \* curveOffset, y: my \+ \(-dx \/ len\) \* curveOffset/, 'KG relationship label must sit on the rendered arc side');
assert.match(kgSource, /width = selEdge \? 1\.35 : 0\.75;/, 'KG selected edge must remain proportionally thin');

function createRuntime() {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
    runScripts: 'outside-only',
    url: 'https://qa.invalid/'
  });
  const { window } = dom;

  // Exercise the KG's built-in no-network fallback deterministically.
  const appendChild = window.document.head.appendChild.bind(window.document.head);
  window.document.head.appendChild = function appendForQa(element) {
    const result = appendChild(element);
    if (element.tagName === 'SCRIPT' && element.src) {
      window.queueMicrotask(() => element.onerror?.(new window.Event('error')));
    }
    return result;
  };

  window.eval(bundle);
  assert.ok(window.AtarRuntime?.mount, 'UMD bundle must expose window.AtarRuntime.mount');
  assert.equal(window.AtarRuntime?.version, packageVersion, 'UMD runtime version must match package.json');
  return { dom, window, container: window.document.getElementById('root') };
}

function click(window, selector) {
  const element = window.document.querySelector(selector);
  assert.ok(element, `missing interactive element: ${selector}`);
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

function tabLabels(window, selector) {
  return [...window.document.querySelectorAll(selector)].map((el) => el.textContent.trim());
}

async function qaKnowledgeGraph() {
  const { dom, window, container } = createRuntime();
  const result = window.AtarRuntime.mount(container, {
    type: 'kg',
    title: 'מגדל מים לדוגמה',
    nodes: [
      { id: 'asset', name: 'מגדל המים', type: 'Asset', meaning: 'נכס המורשת הנבדק', epistemic: 'sourced' },
      { id: 'group', name: 'קבוצת הבנאים', type: 'Social Group', meaning: 'הקבוצה שהקימה את המבנה', epistemic: 'sourced' },
      { id: 'value', name: 'ערך חברתי', type: 'Cultural Value', meaning: 'עבודה משותפת כביטוי תרבותי', epistemic: 'interpretive', epistemic_note: 'קריאה פרשנית לצורך בדיקה' }
    ],
    edges: [
      { source: 'group', target: 'asset', label: 'בנתה' },
      { source: 'asset', target: 'value', label: 'מבטא' }
    ]
  }, {});

  assert.equal(result.ok, true);
  assert.equal(result.type, 'kg');
  assert.equal(container.querySelector('.atar-root')?.dir, 'rtl');
  assert.equal(container.querySelector('.atar-root')?.getAttribute('lang'), 'he');
  await new Promise((resolve) => window.setTimeout(resolve, 20));
  assert.ok(container.querySelector('.kg-fallback'), 'KG must show its built-in list fallback when both D3 CDNs fail');
  assert.match(container.textContent, /תצוגת רשימה/);
  dom.window.close();
}

function qaAssessmentDashboard() {
  const { dom, window, container } = createRuntime();
  const result = window.AtarRuntime.mount(container, {
    type: 'assessment',
    asset: {
      name: 'מגדל מים לדוגמה',
      location: 'ישראל',
      type: 'מגדל מים',
      period: 'המאה העשרים',
      description: 'Fixture סינתטי לבדיקת RTL ותוכן דו-כיווני.',
      coordinates: { lat: null, lng: null },
      coordinateSource: 'unknown'
    },
    dataQuality: { sources: ['fixture-he.md'], gaps: ['אין קואורדינטות'] },
    timeline: [
      { year: '1923', yearStart: 1923, label: 'הקמת המבנה', changeType: 'structure' },
      { year: '1960s', yearStart: 1960, label: 'יציאה משימוש', changeType: 'use' },
      { year: '2018', yearStart: 2018, label: 'תחילת שימור', changeType: 'structure' }
    ],
    contexts: [
      { id: 'ctx_hist', type: 'historical', label: 'תשתיות מים והתיישבות', relatedValues: ['Historical'], timespan: '1923–2018' },
      { id: 'ctx_social', type: 'social', label: 'עבודה קואופרטיבית', relatedValues: ['Social'], timespan: '1923' },
      { id: 'ctx_tech', type: 'technological', label: 'בטון מזוין', relatedValues: ['Technological'], timespan: '1923' }
    ],
    values: [
      { id: 'v_hist', name: 'תשתית כעדות להתיישבות', category: 'Historical', evidence: 'sourced', summary: 'עדות חומרית להתפתחות מערכת המים.' },
      { id: 'v_social', name: 'עבודה משותפת', category: 'Social', evidence: 'inferred', summary: 'הקמה באמצעות קבוצת עובדים.' },
      { id: 'v_tech', name: 'ניסוי בבטון מזוין', category: 'Technological', evidence: 'uncertain', summary: 'קריאה פרשנית של טכנולוגיית הבנייה.' }
    ],
    attrTable: [
      { attribute: 'מכל הבטון', values: ['Historical', 'Technological'], significance: 'מגלם את מערכת אספקת המים', implication: 'אובדן המכל יחליש את קריאות התפקוד' }
    ],
    authenticity: {
      grid: [
        { aspect: 'צורה ותכנון', description: 'המסה המרכזית נשמרה', valueExpression: 'Historical', rating: 'high' },
        { aspect: 'שימוש', description: 'אספקת המים הופסקה', valueExpression: 'Social', rating: 'low' }
      ],
      summary: 'הצורה נשמרה יותר מן השימוש.'
    },
    comparative: {
      summary: 'העיטור מבחין את ה-fixture ביחס לדוגמה פונקציונלית.',
      sites: [
        { name: 'אתר השוואה', period: '1920s', architect: 'לא ידוע', distinction: 'צורה פונקציונלית', criteria: { rarity: 'moderate', documentation: 'unknown', condition: 'unknown' }, coordinates: { lat: null, lng: null } }
      ]
    },
    significance: 'הנכס מדגים את החיבור בין תשתית מים, התיישבות ועבודה משותפת.',
    vulnerability: [{ value: 'Historical', form: 3, material: 3, use: 2, setting: 1 }],
    processQuality: { strengths: ['ציר זמן'], quickBoosts: ['הוספת תצלום מצב'], nextSteps: ['אימות קואורדינטות'] },
    themes: {
      valueThemes: [{ label: 'מים והתיישבות', members: ['v_hist', 'v_social'] }],
      contextThemes: [{ label: 'טכנולוגיה וחברה', members: ['ctx_social', 'ctx_tech'] }],
      threatThemes: []
    },
    tabs: [
      { id: 'report', label: 'דוח', icon: '📄', type: 'prose', data: { sections: [{ title: 'סקירת הערכה', body: 'תוכן בדיקה.' }] } },
      { id: 'debrief', label: 'תחקיר', icon: '💬', type: 'prose', data: { sections: [{ title: 'הפתעה', body: 'תשובת בדיקה.' }] } },
      { id: 'session', label: 'ניתוח המפגש', icon: '📊', type: 'prose', data: { sections: [{ title: 'מפת אינטראקציות', body: 'ללא שינוי.' }] } }
    ]
  }, {});

  assert.equal(result.ok, true);
  assert.equal(result.type, 'assessment');
  assert.equal(container.querySelector('.atar-root')?.dir, 'rtl');
  assert.equal(container.querySelector('.atar-root')?.getAttribute('lang'), 'he');

  const labels = tabLabels(window, '.db-sidebar-tab');
  for (const label of ['סקירה', 'מפה', 'ציר זמן', 'הקשרים וערכים', 'נושאים', 'שלמות', 'השוואה', 'משמעות', 'דוח', 'תחקיר', 'ניתוח המפגש', 'שאילתת AI']) {
    assert.ok(labels.some((value) => value.includes(label)), `missing assessment tab label: ${label}`);
  }

  click(window, '.db-sidebar-tab[data-tab="ctxval"]');
  assert.match(container.textContent, /🔑 השלכה/, 'Hebrew implication column must not duplicate the significance label');
  click(window, '.db-sidebar-tab[data-tab="report"]');
  assert.match(container.textContent, /סקירת הערכה/);
  click(window, '.db-sidebar-tab[data-tab="map"]');
  assert.match(container.textContent, /מיקום לא צוין/);
  dom.window.close();
}

function qaCollectionDashboard() {
  const { dom, window, container } = createRuntime();
  const result = window.AtarRuntime.mount(container, {
    type: 'collection',
    collection: { name: 'אוסף אתרי בדיקה', source: 'synthetic', depth: 'mixed', date: '2026-08-03', itemCount: 2 },
    sites: [
      { id: 's1', name: 'אתר א׳', region: 'צפון', lat: null, lng: null, depth: 'rich', type: 'מגדל מים', typeCategory: 'תשתית', period: '1920s', periodCategory: 'המנדט', description: 'Fixture ראשון', significanceSummary: 'קשר בין מים להתיישבות', highlight: 'התיעוד העשיר באוסף', values: { Historical: 'e', Social: 'i' }, valueSpecs: { Historical: 'תשתית מים' }, integrity: 'high', integrityNote: 'הצורה נשמרה', threats: [], comparativeBasis: 'טיפולוגי', claimScope: 'local' },
      { id: 's2', name: 'אתר B', region: 'מרכז', lat: null, lng: null, depth: 'medium', type: 'בריכה', typeCategory: 'תשתית', period: '1930s', periodCategory: 'המנדט', description: 'Fixture mixed-direction', significanceSummary: 'מאגר מים', highlight: 'ממחיש שינוי טיפולוגי', values: { Historical: 'e', Social: 'a' }, valueSpecs: { Historical: 'אגירת מים' }, integrity: 'medium', integrityNote: 'השימוש השתנה', threats: ['הזנחה'], comparativeBasis: 'טיפולוגי', claimScope: 'regional' }
    ],
    themes: [{ id: 'water', label: 'מערכות מים', description: 'תמה משותפת', sites: ['s1', 's2'], evidence: { s1: 'תשתית מים', s2: 'אגירת מים' } }],
    collectionSummary: { narrative: 'האוסף מדגים תשתיות מים מתקופות סמוכות.', patterns: ['ערך היסטורי מפורש'], gaps: ['אין קואורדינטות'], distinctives: ['עומק תיעוד שונה'] },
    tabs: [{ id: 'cross', label: 'השוואה רוחבית', icon: '↔️', type: 'table', data: { columns: ['אתר', 'עומק'], rows: [['אתר א׳', 'עשיר'], ['אתר B', 'בינוני']] } }]
  }, {});

  assert.equal(result.ok, true);
  assert.equal(result.type, 'collection');
  assert.equal(container.querySelector('.atar-root')?.dir, 'rtl');
  const labels = tabLabels(window, '.cd-sidebar-tab');
  for (const label of ['סקירה', 'מפה', 'ערכים', 'נושאים', 'השוואה רוחבית', 'שאילתת AI']) {
    assert.ok(labels.some((value) => value.includes(label)), `missing collection tab label: ${label}`);
  }
  click(window, '.cd-sidebar-tab[data-tab="values"]');
  assert.match(container.textContent, /אתר א׳/);
  assert.match(container.textContent, /אתר B/);
  click(window, '.cd-sidebar-tab[data-tab="map"]');
  assert.match(container.textContent, /אין קואורדינטות/);
  dom.window.close();
}

async function qaClipboardFallback() {
  const { dom, window, container } = createRuntime();
  let legacyCopyCalls = 0;
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: { writeText: () => Promise.reject(new Error('clipboard denied in Preview iframe')) }
  });
  window.document.execCommand = function (command) {
    if (command === 'copy') legacyCopyCalls += 1;
    return command === 'copy';
  };

  window.AtarRuntime.mount(container, {
    type: 'assessment',
    asset: { name: 'נכס בדיקה', location: 'ישראל' }
  }, {});

  click(window, '.db-sidebar-tab[data-tab="aiquery"]');
  const input = window.document.querySelector('.atar-ai-input');
  input.value = 'מהי משמעות הנכס?';
  click(window, '.atar-ai-ask');
  click(window, '.atar-ai-copybtn');
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  assert.equal(legacyCopyCalls, 1, 'denied Clipboard API must use the legacy copy fallback');
  assert.match(window.document.querySelector('.atar-ai-copybtn').textContent, /הועתק/,
    'copy button must report success only after a working copy path');
  dom.window.close();
}

function qaUnknownType() {
  const { dom, window, container } = createRuntime();
  const result = window.AtarRuntime.mount(container, { type: 'not-a-product' }, {});
  assert.equal(result.ok, false);
  assert.match(container.textContent, /unknown data\.type/);
  dom.window.close();
}

await qaKnowledgeGraph();
qaAssessmentDashboard();
qaCollectionDashboard();
await qaClipboardFallback();
qaUnknownType();

console.log('OK: atar-runtime Hebrew KG/assessment/collection smoke QA passed.');
