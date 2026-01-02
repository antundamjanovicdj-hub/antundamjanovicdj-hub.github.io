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

export async function scheduleObligationNotification(obligation) {
  if (!canUseNotifications()) return;
  if (!obligation?.dateTime || !obligation?.reminder) return;

  const triggerTime =
    new Date(obligation.dateTime).getTime() -
    Number(obligation.reminder) * 60 * 1000;

  if (triggerTime <= Date.now()) return;

  const registration = await navigator.serviceWorker.ready;

  registration.showNotification('LifeKompas – Obveza', {
    body: obligation.title,
    tag: `obligation-${obligation.id}`,
    timestamp: triggerTime,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      obligationId: obligation.id
    }
  });
}