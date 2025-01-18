const CACHE_NAME = 'lifedots-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './privacy.html',
  './about.html',
  './css/styles.css',
  './css/input.css',
  './js/app.js',
  './js/utils.js',
  './js/config.js',
  './js/pwa.js',
  './assets/logo.svg',
  './assets/favicon-16x16.png',
  './assets/favicon-32x32.png',
  './assets/apple-touch-icon.png',
  './manifest.json'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting on install');
        self.skipWaiting();
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('[ServiceWorker] Return cache for:', event.request.url);
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('[ServiceWorker] Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});
