const CACHE="gold-tracker-v1";
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","./index.html","./manifest.webmanifest","./icon.svg"]))));
self.addEventListener("fetch",e=>{if(e.request.method==="GET")e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request)))});
self.addEventListener("message",e=>{if(e.data==="SKIP_WAITING")self.skipWaiting()});
