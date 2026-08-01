import { escapeHtml } from './escape.js';

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
      try { navigator.clipboard.writeText(q); btn.textContent = '✓'; } catch (e) {}
    });
    out.appendChild(btn);
  }
}
