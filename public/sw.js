var cacheName = 'url-sharing-realozproject-201902061845-a';
var filesToCache = [
  "/feed",
  "/account",
  "/css/account.css",
  "/css/basic_component.css",
  "/css/feed.css",
  "/css/folder.css",
  "/css/signup.css",
  "/css/top_page.css",
  "/css/urlput.css",
  "/css/urlset.css",
  "/js/account.js",
  "/js/feed.js",
  "/js/index.js",
  "/common/js/JSXTransformer.js",
  "/common/js/browser.min.js",
  "/common/js/firebase-firestore.js",
  "/common/js/firebase.js",
  "/common/js/jquery-3.3.1.min.js",
  "/common/js/react-dom.development.js",
  "/common/js/react.development.js",
  "/common/js/5.0.0/firebase-auth.js",
  "/common/js/5.0.0/firebase-storage.js",
  "/common/js/5.7.0/firebase-app.js",
  "/common/js/5.7.0/firebase-firestore.js"
];

// service-worker.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('push', function (event) {
    console.log('Received a push message', event);
    var title = "プッシュ通知です！";
    var body = "プッシュ通知はこのようにして送られるのです";

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: 'http://free-images.gatag.net/images/201108090000.jpg',
            tag: 'push-notification-tag'
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    clients.openWindow("/");
}, false);
