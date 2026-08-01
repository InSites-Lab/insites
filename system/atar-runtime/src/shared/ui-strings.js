// Minimal shared UI context. Per-renderer strings live with their renderer (ported from the seeds).
export function pickUI(type, rtl) {
  return { lang: rtl ? 'he' : 'en', rtl: !!rtl, type: type };
}
