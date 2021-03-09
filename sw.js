const staticCacheName = "static-app-v4";
const dynamicCacheName = "dyn-app-v4";
const urlAssets = [
    "index.html",
    "/js/app.js",
    "/css/style.css",
    "offlnie.html",
];
self.addEventListener("install", async (event) => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(urlAssets);
});

self.addEventListener("activate", async (event) => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter((name) => name !== staticCacheName)
            .filter((name) => name !== dynamicCacheName)
            .map((name) => caches.delete(name))
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached ?? (await fetch(request));
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response;
    } catch (e) {
        const instance = await cache.match(request);
        return instance ?? (await caches.match("/offline.html"));
    }
}
