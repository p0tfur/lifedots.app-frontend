const CACHE_NAME = 'lifedots-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/privacy.html',
  '/about.html',
  '/terms.html',
  '/css/styles.css',
  '/css/input.css',
  '/js/app.js',
  '/js/utils.js',
  '/js/config.js',
  '/js/pwa.js',
  '/assets/logo.svg',
  '/assets/favicon-16x16.png',
  '/assets/favicon-32x32.png',
  '/assets/apple-touch-icon.png',
  '/manifest.json'
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

// Helper function to check if URL should be cached
function shouldCacheURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-cacheable requests
  if (!shouldCacheURL(event.request.url)) {
    return;
  }

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
            
            // Double check URL is still valid for caching
            if (shouldCacheURL(event.request.url)) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('[ServiceWorker] Caching new resource:', event.request.url);
                  cache.put(event.request, responseToCache);
                })
                .catch(error => {
                  console.error('[ServiceWorker] Cache put failed:', error);
                });
            }
            
            return response;
          })
          .catch((error) => {
            console.error('[ServiceWorker] Fetch failed:', error);
            // Return a custom offline page or fallback content here if needed
          });
      })
  );
});
