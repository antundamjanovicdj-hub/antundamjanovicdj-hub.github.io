// core/notifications.js

export function canUseNotifications() {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator
  );
}

export async function requestNotificationPermission() {
  if (!canUseNotifications()) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function showTestNotification() {
  if (!canUseNotifications()) return;

  const registration = await navigator.serviceWorker.ready;

  registration.showNotification('LifeKompas', {
    body: 'Notifikacije su uspješno aktivirane.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  });
}
