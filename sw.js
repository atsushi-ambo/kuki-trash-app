// Service Worker for 久喜市ゴミ分別アプリ
const CACHE_NAME = 'kuki-garbage-app-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/garbageData.js',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
];

// インストール時にキャッシュを作成
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('キャッシュを開きました');
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエスト時にキャッシュから返す
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // キャッシュにある場合はそれを返す
        if (response) {
          return response;
        }
        
        // ネットワークから取得を試行
        return fetch(event.request)
          .then(function(response) {
            // レスポンスが有効でない場合は何もしない
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // レスポンスをクローンしてキャッシュに保存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(function() {
            // ネットワークエラーの場合、オフラインページまたはデフォルトレスポンスを返す
            return caches.match('/index.html');
          });
      })
  );
});

// 古いキャッシュを削除
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
