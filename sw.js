// Minimal service worker — required by Chrome/Edge for the "Install app" prompt to appear.
// It does not cache anything itself; the app always loads fresh data from the network/Supabase.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Pass-through: always fetch from network, never intercept/cache.
  event.respondWith(fetch(event.request));
});
