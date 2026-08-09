import { escapeHtml } from './escape.js';

// Clipboard access is often denied inside artifact/Preview iframes even when
// navigator.clipboard exists. Try the modern API first, then fall back to the
// user-gesture-compatible execCommand path. Resolve only after a real result.
function legacyCopyText(text) {
  var area = null;
  var ok = false;
  try {
    area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.setAttribute('aria-hidden', 'true');
    area.style.position = 'fixed';
    area.style.inset = '0 auto auto -9999px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, area.value.length);
    ok = typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch (e) {}
  if (area && area.parentNode) area.parentNode.removeChild(area);
  return !!ok;
}

function copyText(text) {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return Promise.resolve(navigator.clipboard.writeText(text))
        .then(function () { return true; })
        .catch(function () { return legacyCopyText(text); });
    }
  } catch (e) {}
  return Promise.resolve(legacyCopyText(text));
}

// Live AI call — Promise.race timeout, NEVER AbortController (DataCloneError across the artifact boundary).
export function aiQuery(host, prompt, opts) {
  opts = opts || {};
  if (!host || typeof host.complete !== 'function') return Promise.reject({ kind: 'no-host' });
  var ms = opts.timeoutMs || 20000;
  var timeout = new Promise(function (_, rej) { setTimeout(function () { rej({ kind: 'timeout' }); }, ms); });
  return Promise.race([Promise.resolve(host.complete(prompt)), timeout]);
}

// Render the AI-Query tab into `el`.
// cfg: { starters: [{en,he}], buildPrompt(question)->string, title?: {en,he} }
export function renderAIPanel(el, env, cfg) {
  var L = env.lang;
  var t = function (o) { return (o && (o[L] || o.en)) || ''; };
  var starters = cfg.starters || [];
  el.innerHTML =
    '<div class="atar-ai">' +
      '<div class="atar-ai-head">🤖 ' + escapeHtml(t(cfg.title) || (L === 'he' ? 'שאילתא' : 'AI Query')) + '</div>' +
      '<div class="atar-ai-starters">' +
        starters.map(function (s, i) { return '<button class="atar-ai-starter" data-i="' + i + '">' + escapeHtml(t(s)) + '</button>'; }).join('') +
      '</div>' +
      '<textarea class="atar-ai-input" rows="2" placeholder="' + (L === 'he' ? 'שאל/י שאלה…' : 'Ask a question…') + '"></textarea>' +
      '<button class="atar-ai-ask">' + (L === 'he' ? 'שאל' : 'Ask') + '</button>' +
      '<div class="atar-ai-out"></div>' +
    '</div>';

  var input = el.querySelector('.atar-ai-input');
  var out = el.querySelector('.atar-ai-out');
  el.querySelectorAll('.atar-ai-starter').forEach(function (b) {
    b.addEventListener('click', function () { input.value = t(starters[+b.dataset.i]); input.focus(); });
  });
  el.querySelector('.atar-ai-ask').addEventListener('click', ask);

  function ask() {
    var q = (input.value || '').trim();
    if (!q) return;
    if (!env.live) { return showCopy(q); }
    out.innerHTML = '<div class="atar-ai-loading">…</div>';
    aiQuery(env.host, cfg.buildPrompt(q))
      .then(function (r) { out.textContent = r; })
      .catch(function () { showCopy(q); });
  }

  function showCopy(q) {
    out.innerHTML = '';
    var note = document.createElement('div');
    note.className = 'atar-ai-copy';
    note.textContent = '💬 ' + (L === 'he'
      ? 'העתק/י את השאלה לצ׳אט לתשובה על בסיס מלוא ההקשר.'
      : 'Copy this question to the chat for an answer grounded in the full context.');
    out.appendChild(note);
    var btn = document.createElement('button');
    btn.className = 'atar-ai-copybtn';
    btn.textContent = L === 'he' ? 'העתק שאלה' : 'Copy question';
    btn.addEventListener('click', function () {
      btn.disabled = true;
      btn.textContent = L === 'he' ? 'מעתיק…' : 'Copying…';
      copyText(q).then(function (ok) {
        btn.disabled = false;
        if (ok) {
          btn.textContent = L === 'he' ? '✓ הועתק' : '✓ Copied';
          return;
        }
        btn.textContent = L === 'he' ? 'העתקה נכשלה' : 'Copy failed';
        note.textContent = '⚠ ' + (L === 'he'
          ? 'העתקה אוטומטית נחסמה. השאלה סומנה להעתקה ידנית.'
          : 'Automatic copy was blocked. The question is selected for manual copying.');
        input.focus();
        input.select();
      });
    });
    out.appendChild(btn);
  }
}
