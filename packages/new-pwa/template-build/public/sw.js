// Service Worker for offline PWA functionality
const CACHE_NAME = "jspsych-offline-v1";

// Local files to cache (relative paths)
const localUrlsToCache = ["./", "./index.html", "./admin/index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Get base URL for resolving relative paths
      const baseForUrls =
        self.registration && self.registration.scope ? self.registration.scope : self.location.href;

      // Cache local files individually with try/catch
      for (const urlPath of localUrlsToCache) {
        try {
          const url = new URL(urlPath, baseForUrls);
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response.clone());
          }
        } catch (error) {
          console.warn(`Failed to cache local file ${urlPath}:`, error);
        }
      }
    }),
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200) {
          return response;
        }

        // Only cache same-origin GET requests with http(s) protocol
        if (event.request.method !== "GET") {
          return response;
        }

        // Guard against invalid URL parsing
        try {
          const requestUrl = new URL(event.request.url);
          const isHttpScheme = requestUrl.protocol === "http:" || requestUrl.protocol === "https:";

          if (!isHttpScheme) {
            return response;
          }
        } catch (error) {
          // Invalid URL, don't cache
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
