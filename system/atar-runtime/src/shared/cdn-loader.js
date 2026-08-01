// Race-safe loader for runtime libraries from cdnjs (the Claude-whitelisted host).
// Dedupes concurrent requests per URL; rejects on timeout / missing global; one retry on fallbackUrl.
const cache = {};

export function loadScript(url, globalName, opts) {
  opts = opts || {};
  if (cache[url]) return cache[url];

  cache[url] = new Promise(function (resolve, reject) {
    if (globalName && window[globalName]) { resolve(window[globalName]); return; }
    var settled = false;
    var timer = setTimeout(function () {
      if (!settled) { settled = true; reject(new Error('timeout loading ' + url)); }
    }, opts.timeout || 8000);
    var s = document.createElement('script');
    s.async = true;
    s.src = url;
    s.onload = function () {
      if (settled) return;
      clearTimeout(timer);
      if (globalName && !window[globalName]) { settled = true; reject(new Error('loaded but global "' + globalName + '" missing')); return; }
      settled = true;
      resolve(globalName ? window[globalName] : undefined);
    };
    s.onerror = function () {
      if (settled) return;
      clearTimeout(timer); settled = true;
      reject(new Error('failed to load ' + url));
    };
    document.head.appendChild(s);
  }).catch(function (e) {
    if (opts.fallbackUrl && opts.fallbackUrl !== url) {
      delete cache[url];
      return loadScript(opts.fallbackUrl, globalName, Object.assign({}, opts, { fallbackUrl: null }));
    }
    throw e;
  });

  return cache[url];
}
