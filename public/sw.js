// Minimal Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Always fetch from network without caching
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
}); 