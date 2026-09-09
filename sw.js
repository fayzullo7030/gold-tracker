const CACHE = "gold-tracker-v4";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Всегда проверяем свежую версию страницы
  if (
    request.mode === "navigate" ||
    url.pathname.endsWith(".html")
  ) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((response) => {
          const copy = response.clone();

          caches.open(CACHE).then((cache) => {
            cache.put(request, copy);
          });

          return response;
        })
        .catch(() =>
          caches.match(request)
            .then((cached) =>
              cached || caches.match("./index.html")
            )
        )
    );

    return;
  }

  // Данные о золоте всегда получаем свежими
  if (
    url.pathname.endsWith("/data.json") ||
    url.pathname.endsWith("data.json")
  ) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .catch(() => caches.match(request))
    );

    return;
  }

  // Остальные файлы можно брать из кэша
  event.respondWith(
    caches.match(request).then((cached) => {

      const fresh = fetch(request)
        .then((response) => {

          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE).then((cache) => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => cached);

      return cached || fresh;
    })
  );
});
