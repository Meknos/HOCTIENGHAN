// Service worker — không chặn asset Next.js (CSS/JS) để tránh giao diện bị vỡ.
const CACHE = "hanguk-1a-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET" || !request.url.startsWith("http")) return;

  const url = new URL(request.url);

  // Luôn để trình duyệt fetch trực tiếp — tránh cache CSS/JS cũ gây mất style.
  if (url.pathname.startsWith("/_next/")) return;

  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && request.destination === "document") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
