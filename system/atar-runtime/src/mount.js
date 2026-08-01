import { detectRTL } from './shared/rtl.js';
import { normalize } from './shared/normalize.js';
import { loadScript } from './shared/cdn-loader.js';
import { pickUI } from './shared/ui-strings.js';
import { renderKG } from './renderers/kg.js';
import { renderDashboard } from './renderers/dashboard.js';
import { renderCollection } from './renderers/collection.js';

const RENDERERS = { kg: renderKG, assessment: renderDashboard, collection: renderCollection };

let stylesInjected = false;
function ensureStyles() {
  if (stylesInjected) return;
  if (typeof document === 'undefined') return;
  if (document.getElementById('atar-runtime-css')) { stylesInjected = true; return; }
  const style = document.createElement('style');
  style.id = 'atar-runtime-css';
  style.textContent = __ATAR_CSS__;
  document.head.appendChild(style);
  stylesInjected = true;
}

function inferType(d) {
  if (d.type) return d.type;
  if (d.nodes && d.edges) return 'kg';
  if (d.sites) return 'collection';
  if (d.asset || d.values || d.timeline) return 'assessment';
  return 'assessment';
}

function buildScaffold(container, type, rtl) {
  container.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'atar-root atar-' + type + (rtl ? ' rtl' : '');
  root.dir = rtl ? 'rtl' : 'ltr';
  root.setAttribute('lang', rtl ? 'he' : 'en');
  container.appendChild(root);
  return root;
}

function mountError(container, msg) {
  try { container.innerHTML = '<div class="atar-error">⚠ atar-runtime: ' + String(msg) + '</div>'; } catch (e) {}
  return { ok: false, error: String(msg) };
}

export function mount(container, data, host) {
  if (!container) return { ok: false, error: 'no container' };
  data = data || {};
  host = host || {};
  try { ensureStyles(); } catch (e) {}

  const type = inferType(data);
  const render = RENDERERS[type];
  if (!render) return mountError(container, 'unknown data.type: ' + type);

  let norm, rtl, root;
  try {
    norm = normalize(type, data);
    rtl = detectRTL(type, norm);
    root = buildScaffold(container, type, rtl);
  } catch (e) {
    return mountError(container, (e && e.message) || e);
  }

  const env = {
    host: host,
    rtl: rtl,
    lang: rtl ? 'he' : 'en',
    live: typeof host.complete === 'function',
    loadScript: loadScript,
    ui: pickUI(type, rtl)
  };

  try {
    const out = render(root, norm, host, env);
    // KG is async (awaits vis-network); surface a late failure into the container.
    if (out && typeof out.then === 'function') {
      out.catch(function (e) { mountError(container, (e && e.message) || e); });
    }
    return { ok: true, live: env.live, type: type };
  } catch (e) {
    return mountError(container, (e && e.message) || e);
  }
}
