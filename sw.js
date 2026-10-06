/* The Standard: lets the route map and learning hub open without internet.
   Pages: newest copy from the internet when online, saved copy when offline.
   Change VERSION after an update to clear old saved files. */
const VERSION = "ts-2026-10-06b";
const FONTS = "ts-fonts";
const CORE = ["./route-map.html", "./learning-hub.html", "./404.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "./NotoSans-Regular.woff2", "./NotoSans-Medium.woff2", "./NotoSans-SemiBold.woff2", "./NotoSans-Bold.woff2"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("ts-") && k !== VERSION && k !== FONTS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
const keep = (cacheName, req, res) => { if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(cacheName).then(c => c.put(req, copy)); } return res; };

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (req.mode === "navigate") {
      e.respondWith(fetch(req).then(res => keep(VERSION, req, res))
        .catch(() => caches.match(req, {ignoreSearch: true}).then(m => m || caches.match("./route-map.html"))));
      return;
    }
    e.respondWith(caches.match(req).then(m => m || fetch(req).then(res => keep(VERSION, req, res))));
    return;
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(FONTS).then(c => c.match(req).then(m => {
      const net = fetch(req).then(res => keep(FONTS, req, res)).catch(() => m);
      return m || net;
    })));
  }
});
