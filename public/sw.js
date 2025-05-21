const CACHE_NAME = 'daily-todo-dashboard-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// インストール時の処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// アクティベート時の処理
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// フェッチ時の処理
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // キャッシュから応答を返す
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            // キャッシュ可能なリソースのみをキャッシュ
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// 更新チェック
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 更新チェック関数
async function checkForUpdates() {
  try {
    const response = await fetch('/index.html', { cache: 'no-store' });
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match('/index.html');
    
    if (cachedResponse) {
      const cachedText = await cachedResponse.text();
      const newText = await response.text();
      
      if (cachedText !== newText) {
        // 新しいバージョンが利用可能
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'UPDATE_AVAILABLE'
            });
          });
        });
      }
    }
  } catch (error) {
    console.error('Update check failed:', error);
  }
}

// 定期的な更新チェック
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // クライアントに更新通知を送信
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE'
          });
        });
      }),
      // キャッシュの更新
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      })
    ])
  );
}); 