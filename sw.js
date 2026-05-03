const CACHE_NAME = 'coffee-notelm-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/coffee_data.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap'
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在快取核心檔案...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 啟動階段：清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('清理舊快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 攔截請求：優先使用快取，沒快取才找網路
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
