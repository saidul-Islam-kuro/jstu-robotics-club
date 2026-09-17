const CACHE_NAME = 'jstu-robotics-cache-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/logo.png', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestURL = new URL(event.request.url)

  if (requestURL.origin !== self.location.origin) return

  const isNavigation = event.request.mode === 'navigate'
  const isScriptStyle = ['script', 'style', 'worker', 'font'].includes(event.request.destination)

  if (!isNavigation && isScriptStyle) {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request)
        .then((response) => {
          if (isNavigation || event.request.destination === 'image' || event.request.destination === 'audio') {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => {
          if (isNavigation) return caches.match('/index.html')
          return caches.match('/favicon.svg')
        })
    })
  )
})
