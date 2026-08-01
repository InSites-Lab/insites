import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------
// Atar Runtime - Claude artifact shell (typed).
// The bot fills only DATA (which carries `type`); everything else is fixed.
// Loads the runtime from jsdelivr/npm via a React-direct <script> append, so
// window.claude.complete stays in scope and the live AI Query works.
// type: 'kg' | 'assessment' | 'collection'  (see data-contract.md for schemas)
// ---------------------------------------------------------------
const RUNTIME_URL = 'https://cdn.jsdelivr.net/npm/atar-runtime@0.3.4/dist/atar-runtime.umd.js';

// >>> the bot replaces DATA with the assessment/collection/KG object (see data-contract.md) >>>
const DATA = {
  type: 'kg',
  title: 'Knowledge Graph',
  nodes: [
    { id: 'asset', name: 'Heritage Asset', type: 'Asset', meaning: 'The primary subject' },
    { id: 'place', name: 'Location', type: 'Place', meaning: 'Where it stands' },
    { id: 'val', name: 'Historical Value', type: 'Cultural Value', value_type: 'Historical', meaning: 'Why it matters' }
  ],
  edges: [
    { source: 'asset', target: 'place', label: 'located_in' },
    { source: 'asset', target: 'val', label: 'embodies' }
  ]
};

export default function App() {
  const ref = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    function go() {
      const live = typeof window !== 'undefined' && window.claude && typeof window.claude.complete === 'function';
      const host = live ? { complete: window.claude.complete.bind(window.claude) } : {};
      try { window.AtarRuntime.mount(ref.current, DATA, host); setStatus('ok'); }
      catch (e) { setStatus('mount-error: ' + (e && e.message ? e.message : e)); }
    }
    if (window.AtarRuntime) { go(); return; }
    const s = document.createElement('script');
    s.src = RUNTIME_URL;
    s.onload = go;
    s.onerror = () => setStatus('load-error');
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{ height: '82vh', minHeight: 540, position: 'relative' }}>
      <div ref={ref} style={{ height: '100%' }} />
      {status === 'load-error' && <EmbeddedFallback data={DATA} />}
    </div>
  );
}

// Minimal in-prompt fallback so a runtime load failure is never a blank artifact.
function EmbeddedFallback({ data }) {
  const items = data.type === 'kg' ? (data.nodes || []) : (data.sites || data.values || []);
  return (
    <div style={{ font: '14px system-ui', padding: 16 }}>
      <p style={{ color: '#b45309', fontWeight: 700 }}>Runtime unavailable - showing a basic list.</p>
      <ul>{items.map((it, i) => <li key={i}>{it.name || it.label || JSON.stringify(it)}</li>)}</ul>
    </div>
  );
}
