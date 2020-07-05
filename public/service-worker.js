const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/srcJs/index2.js",
    "/dist/bundle.js",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/dist/icon_72x72.png",
    "/dist/icon_96x96.png",
    "/dist/icon_128x128.png",
    "/dist/icon_144x144.png",
    "/dist/icon_152x152.png",
    "/dist/icon_192x192.png",
    "/dist/icon_384x384.png",
    "/dist/icon_512x512.png",
    "/dist/manifest.json"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// install the service worker
self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});


// delete old keys
self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// intercept requests to the api, cache them, and send back data from the api if successful, otherwise send back data from the cache
self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        return cache.match(evt.request);
                    });
            }).catch(err => console.log(err))
        );

        return;
    }

    //serve static assets from the cache
    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            return response || fetch(evt.request);
        })
    );

});