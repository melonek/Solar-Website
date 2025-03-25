// sw.js

const CACHE_NAME = 'natures-spark-cache-v1';
const ASSETS_TO_CACHE = [
  '/images/AboutUs/solarek.webp',
  '/images/leafBanner/leaf.webp',
  '/images/universalBanner/Solar-drone-photo-Perth.webp',
  '/images/Green,Blue,Orange-sectionsInPpackages/green.webp',
  '/images/Green,Blue,Orange-sectionsInPpackages/blue.webp',
  '/images/Green,Blue,Orange-sectionsInPpackages/orange.webp'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache each asset individually and log success.
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).then(() => {
            console.log(`[Service Worker] Cached: ${url}`);
          }).catch(err => {
            console.error(`[Service Worker] Failed to cache ${url}:`, err);
          });
        })
      );
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log(`[Service Worker] Deleting cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached asset if found; otherwise fetch from network.
      return response || fetch(event.request);
    })
  );
});
