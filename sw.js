self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', event => {
  const data = event.notification.data;
  event.notification.close();

  if (event.action === 'snooze-15') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clients => {
          if (clients[0]) {
            clients[0].postMessage({
              type: 'SNOOZE',
              obligationId: data.obligationId,
              minutes: 15
            });
          }
        })
    );
    return;
  }

  event.waitUntil(
    self.clients.openWindow('/')
  );
});