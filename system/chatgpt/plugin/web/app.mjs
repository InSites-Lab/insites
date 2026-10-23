import { App } from '@modelcontextprotocol/ext-apps';
import { messageText, modelContextText, questionText, PROBE_QUESTION } from '../shared/context.mjs';
import { VERSION } from '../shared/version.mjs';

const app = new App({ name: 'InSites', version: VERSION }, {}, { autoResize: true, strict: true });
const root = document.querySelector('#runtime');
const status = document.querySelector('#delivery');
const input = document.querySelector('#question');
const ask = document.querySelector('#ask');
const selection = document.querySelector('#selection');
let data, connected = false, busy = false, activeTab = '';
const hebrew = () => data && /[\u0590-\u05ff]/.test(data.title || data.asset?.name || data.collection?.name || '');
const label = (en, he) => hebrew() ? he : en;
function localize() {
  document.documentElement.dir = hebrew() ? 'rtl' : 'ltr';
  document.documentElement.lang = hebrew() ? 'he' : 'en';
  document.querySelector('#heading').textContent = label('Ask in the InSites conversation', 'שאלה בשיחת InSites');
  ask.textContent = label('Ask in chat', 'שאל בשיחה');
  document.querySelector('#copy').textContent = label('Copy question and context', 'העתק שאלה והקשר');
  document.querySelector('#fullscreen').textContent = label('Fullscreen', 'מסך מלא');
  input.placeholder = label('Your question about this view', 'השאלה שלך על התצוגה');
  selection.replaceChildren(new Option(label('Whole view', 'כל התצוגה'), ''));
  const items = data.type === 'kg' ? data.nodes : data.type === 'collection' ? data.sites : [];
  for (const item of items) selection.add(new Option(item.name, item.id));
}
function setStatus(en, he) { status.textContent = label(en, he); }
async function send(question) {
  if (busy || !data) return;
  let text, context;
  try { text = questionText(question); context = modelContextText(data, selection.value, activeTab); }
  catch { setStatus('Enter a question of 1-2000 characters.', 'כתוב שאלה באורך של 1 עד 2000 תווים.'); return; }
  if (!connected) { setStatus('Chat connection unavailable. Copy the question and context.', 'חיבור לשיחה אינו זמין. אפשר להעתיק את השאלה וההקשר.'); return; }
  busy = true; ask.disabled = true;
  setStatus('Sending to the conversation…', 'שולח לשיחה…');
  try {
    // Wait for this exact selection's context before triggering a reply.
    // Never silently fall back to a visible JSON message or stale context.
    try {
      if (!app.getHostCapabilities()?.updateModelContext?.text) throw new Error('Model context delivery is unavailable');
      await app.updateModelContext({ content: [{ type: 'text', text: context }] }, { timeout: 10000 });
    } catch {
      setStatus('View context could not be delivered. The question was not sent. You can copy the question and context explicitly.', 'לא ניתן להעביר את הקשר התצוגה. השאלה לא נשלחה. אפשר לבחור בהעתקת השאלה וההקשר.');
      return;
    }
    const result = await app.sendMessage({ role: 'user', content: [{ type: 'text', text }] }, { timeout: 10000 });
    if (result.isError) setStatus('The host rejected the message. It was not confirmed as sent.', 'המארח דחה את ההודעה. השליחה לא אושרה.');
    else setStatus('Host accepted the message. Look for the question and reply in the conversation.', 'המארח קיבל את ההודעה. בדוק את השאלה והתשובה בשיחה.');
  } catch {
    setStatus('Delivery could not be confirmed. Check the conversation before retrying or copying.', 'לא ניתן לאשר מסירה. בדוק את השיחה לפני ניסיון נוסף או העתקה.');
  } finally { busy = false; ask.disabled = false; }
}
async function show(next) {
  if (!next || !['probe', 'kg', 'assessment', 'collection'].includes(next.type)) return;
  data = next; root.replaceChildren(); localize(); ask.disabled = false;
  if (data.type === 'probe') {
    const p = document.createElement('p'); p.textContent = 'Synthetic connection test. Give this conversation a private marker before pressing Ask in chat. This widget does not receive the marker.'; root.append(p);
    input.value = PROBE_QUESTION;
    return;
  }
  try {
    // Pinned runtime owns the renderer. The adapter owns conversation delivery.
    // Empty host intentionally prevents any one-off model call in the renderer.
    const mounted = window.AtarRuntime.mount(root, structuredClone(data), {});
    const ready = await mounted.ready;
    if (!mounted.ok || ready?.ok === false) throw new Error('Renderer unavailable');
  } catch { setStatus('View unavailable. Report this load failure in chat; the question box is still available.', 'התצוגה אינה זמינה. דווח על כשל הטעינה בשיחה; תיבת השאלה עדיין זמינה.'); }
}
app.ontoolresult = result => {
  if (result.isError) { setStatus('The server rejected the data.', 'השרת דחה את הנתונים.'); return; }
  void show(result._meta?.insitesData);
};
app.ontoolcancelled = () => setStatus('Tool call cancelled.', 'הפעלת הכלי בוטלה.');
ask.addEventListener('click', () => void send(input.value));
input.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void send(input.value); });
document.querySelector('#copy').addEventListener('click', async () => {
  if (!data) return;
  let text;
  try { text = messageText(data, input.value, selection.value, activeTab); }
  catch { setStatus('Enter a question of 1-2000 characters.', 'כתוב שאלה באורך של 1 עד 2000 תווים.'); return; }
  try { await navigator.clipboard.writeText(text); setStatus('Copied. Paste into this conversation.', 'הועתק. הדבק בשיחה הזו.'); }
  catch { setStatus('Clipboard unavailable. Select the text below and copy it manually.', 'הלוח אינו זמין. בחר את הטקסט למטה והעתק ידנית.'); const out = document.querySelector('#manual-copy'); out.hidden = false; out.value = text; out.select(); }
});
document.querySelector('#fullscreen').addEventListener('click', () => app.requestDisplayMode({ mode: 'fullscreen' }).catch(() => setStatus('Fullscreen is unavailable in this host.', 'מסך מלא אינו זמין במארח זה.')));
// The 0.3.8 runtime uses a copy/one-off query panel. Capture its Ask action
// before its handler, without editing the runtime or invoking a model.
root.addEventListener('click', e => {
  const button = e.target.closest('.atar-ai-ask');
  if (button) { e.preventDefault(); e.stopImmediatePropagation(); const question = button.closest('.atar-ai')?.querySelector('.atar-ai-input')?.value; if (question) { input.value = question; void send(question); } return; }
  const tab = e.target.closest('[data-tab]'); if (tab) activeTab = tab.dataset.tab;
  const node = e.target.closest('.kg-node'); if (node?.__data__?.id && [...selection.options].some(o => o.value === node.__data__.id)) selection.value = node.__data__.id;
}, true);
new MutationObserver(() => { for (const button of root.querySelectorAll('.atar-ai-ask')) { const text = label('Ask in chat', 'שאל בשיחה'); if (button.textContent !== text) button.textContent = text; } }).observe(root, { childList: true, subtree: true });
try { await app.connect(undefined, { timeout: 10000 }); connected = true; setStatus('Connected to the host.', 'מחובר למארח.'); }
catch { setStatus('Chat connection unavailable. Copy mode remains available after data loads.', 'חיבור לשיחה אינו זמין. העתקה זמינה לאחר טעינת הנתונים.'); }
