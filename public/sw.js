// This is a custom service worker to handle push notifications.
// next-pwa will automatically inject its precaching logic into this file.

self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    const title = data.title || 'Unitask';
    const options = {
      body: data.message,
      icon: '/icons/icon-192x192.jpg',
      badge: '/icons/icon-192x192.jpg',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/dashboard', // URL to open on click
      },
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error handling push event:', error);
    const options = {
      body: 'Has recibido una nueva notificación.',
      icon: '/icons/icon-192x192.jpg',
      badge: '/icons/icon-192x192.jpg',
    };
    event.waitUntil(self.registration.showNotification('Unitask', options));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it.
      for (const client of clientList) {
        // A bit of a hack to check for the correct path
        const clientPath = new URL(client.url).pathname;
        const urlPath = new URL(urlToOpen, self.location.origin).pathname;
        if (clientPath === urlPath && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window.
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
