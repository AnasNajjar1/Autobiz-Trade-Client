try {
    if ("function" === typeof importScripts) {
      importScripts(
        "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
      );
  
      // Global workbox
      if (workbox) {
        // console.log("Workbox is loaded");
  
        // Disable logging
        workbox.setConfig({ debug: false });
  
        //`generateSW` and `generateSWString` provide the option
        // to force update an exiting service worker.
        // Since we're using `injectManifest` to build SW,
        // manually overriding the skipWaiting();
        self.addEventListener("install", event => {
          self.skipWaiting(); // Skip to activation step - taken care in serviceWorker.ts
        });
  
        self.addEventListener('activate', function(event) {
          event.waitUntil(self.clients.claim());
        });
        // Manual injection point for manifest files.
        // All assets under build/ and 5MB sizes are precached.
        try {
          workbox.precaching.precacheAndRoute([]);
        } catch (e) {
          console.error(e);
        }
        // fetch sales cache first and if found return response
        // at the same time fetch response api and update cache 
        self.addEventListener('fetch', function (event) {
          const { method, url } = event.request;
          if (method === 'GET' && url.includes('/sale?')) {
            event.respondWith(
              caches.open('sale').then(function (cache) {
                return cache.match(event.request).then(function (response) {
                  const fetchPromise = fetch(event.request).then(function (networkResponse) {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                  });
                  return response || fetchPromise;
                });
              }),
            );
          }
        });
  
        // Font caching
        workbox.routing.registerRoute(
          new RegExp("https://fonts.(?:.googlepis|gstatic).com/(.*)"),
          workbox.strategies.cacheFirst({
            cacheName: "googleapis",
            plugins: [
              new workbox.expiration.Plugin({
                maxEntries: 30,
              }),
            ],
          })
        );
      } else {
        console.error("Workbox could not be loaded. No offline support");
      }
    }
  } catch (e) {
    console.error("Unable to install service worker. Possible network error.", e);
  }