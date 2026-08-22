const CACHE = "treino-isa-v3";
const ARQ = ["./", "./index.html", "./app.css", "./data.js", "./poses.js", "./corrida.js", "./medidas.js", "./app.js", "./manifest.json", "./icone.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQ)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res;
  }).catch(() => caches.match("./index.html"))));
});
