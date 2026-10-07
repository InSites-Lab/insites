import { detectRTL } from './shared/rtl.js';
import { normalize } from './shared/normalize.js';
import { validate } from './shared/validate.js';
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

function noticeText(state, rtl) {
  if (rtl) return { loading: 'טוען…', ready: 'מוכן', error: 'התצוגה נכשלה — דווחו בצ׳אט.' }[state];
  return { loading: 'Loading… / 加载中…', ready: 'Ready / 已就绪', error: 'Display failed — tell me in chat. / 显示失败，请在聊天中告诉我。' }[state];
}

function mountError(container, msg, rtl) {
  try {
    container.innerHTML = '';
    const error = document.createElement('div');
    error.className = 'atar-error'; error.setAttribute('role', 'alert');
    error.dir = rtl ? 'rtl' : 'ltr';
    error.textContent = noticeText('error', rtl) + ' (' + String(msg) + ')';
    container.appendChild(error);
  } catch (e) {}
  return { ok: false, error: String(msg) };
}

export function mount(container, data, host) {
  if (!container) return { ok: false, error: 'no container' };
  data = data || {};
  host = host || {};
  try { ensureStyles(); } catch (e) {}

  const type = inferType(data);
  let rtl = false;
  try { rtl = detectRTL(type, data); } catch (e) {}
  const render = RENDERERS[type];
  if (!render) return mountError(container, 'unknown data.type: ' + type, rtl);

  let norm, root;
  try {
    norm = normalize(type, data);
    validate(type, norm);
    rtl = detectRTL(type, norm);
    root = buildScaffold(container, type, rtl);
  } catch (e) {
    return mountError(container, (e && e.message) || e, rtl);
  }

  const notice = document.createElement('div');
  notice.className = 'atar-status'; notice.setAttribute('role', 'status');
  notice.dir = rtl ? 'rtl' : 'ltr'; notice.dataset.state = 'loading';
  notice.style.cssText = 'box-sizing:border-box;height:32px;padding:6px 10px;font:13px system-ui;';
  notice.textContent = noticeText('loading', rtl);
  container.insertBefore(notice, root);
  root.style.height = 'calc(100% - 32px)';

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
    // KG awaits D3. Report ready only after actual nodes/controls exist.
    let timer;
    const timeout = new Promise(function (_, reject) { timer = setTimeout(function () { reject(new Error('Rendering timed out')); }, 22000); });
    const ready = Promise.race([Promise.resolve(out), timeout]).then(function () {
      clearTimeout(timer);
      if (notice.parentNode !== container) return { ok: false, error: 'View replaced' };
      const complete = type === 'kg'
        ? root.querySelectorAll('.kg-network svg .kg-node').length === norm.nodes.length
        : root.querySelector(type === 'assessment' ? '.db-sidebar-tab' : '.cd-sidebar-tab');
      if (!complete || root.querySelector('.kg-fallback,.atar-error')) throw new Error('Interactive rendering incomplete');
      notice.dataset.state = 'ready'; notice.textContent = noticeText('ready', rtl);
      return { ok: true };
    }).catch(function (e) {
      clearTimeout(timer);
      if (notice.parentNode === container) {
        notice.dataset.state = 'error'; notice.classList.add('atar-error');
        notice.setAttribute('role', 'alert');
        notice.textContent = noticeText('error', rtl) + ' (' + String((e && e.message) || e) + ')';
        return { ok: false, error: String((e && e.message) || e) };
      }
      return { ok: false, error: 'View replaced' };
    });
    return { ok: true, live: env.live, type: type, ready: ready };
  } catch (e) {
    return mountError(container, (e && e.message) || e, rtl);
  }
}
