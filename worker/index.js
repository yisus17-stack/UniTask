self.addEventListener('push', (event) => {
  const data = event.data.json()
  const title = data.title || 'Unitask'
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.jpg',
    badge: '/icons/icon-192x192.jpg',
    data: {
      url: data.url || '/dashboard'
    }
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})
