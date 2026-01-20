self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', event => {
  const data = event.notification.data;
  event.notification.close();

  const map = {
    'snooze-15': 15,
    'snooze-30': 30,
    'snooze-60': 60
  };

  if (map[event.action]) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clients => {
          if (clients[0]) {
            clients[0].postMessage({
              type: 'SNOOZE',
              obligationId: data.obligationId,
              minutes: map[event.action]
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
// ===== TEST NOTIFICATION HANDLER =====
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    self.registration.showNotification("LifeKompas test", {
  body: "Ovo je testna notifikacija iz Service Workera.",
  icon: "icon-192.png",
  requireInteraction: true
});
  }
});