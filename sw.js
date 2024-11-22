const CACHE_NAME = "reportes-atc-cache-v1";

// Archivos para cachear
const ASSETS = [
    "/",
    "/index.html",
    "/styles.css",
    "/script.js",
    "/manifest.json",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png"
];

// Instalar el Service Worker
self.addEventListener("install", (event) => {
    console.log("Service Worker: Instalando...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Cacheando archivos...");
            return cache.addAll(ASSETS);
        })
    );
});

// Activar el Service Worker
self.addEventListener("activate", (event) => {
    console.log("Service Worker: Activado");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Service Worker: Eliminando cache antigua...");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes
self.addEventListener("fetch", (event) => {
    console.log("Service Worker: Interceptando solicitud:", event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
