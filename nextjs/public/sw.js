// Palu Vlogs Service Worker — PWA Cache & Offline Support
const CACHE_NAME = 'paluvlogs-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/assets/images/logo.jpg',
  '/assets/images/hero_team.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Service worker precache error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip caching for API, admin, chrome extensions, or non-GET requests
  if (
    req.method !== 'GET' ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/admin') ||
    url.protocol.startsWith('chrome-extension')
  ) {
    return;
  }

  // Network-first strategy with cache fallback
  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        // Cache successful static asset responses
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.pathname.match(/\.(png|jpg|jpeg|svg|css|js|woff2)$/) || url.pathname === '/')
        ) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, clone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(req).then((cached) => {
          if (cached) return cached;
          if (req.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
