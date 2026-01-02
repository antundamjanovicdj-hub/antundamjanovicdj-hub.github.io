// core/notifications.js

function applyQuietHours(date) {
  const startHour = 22;
  const endHour = 7;

  const d = new Date(date);
  const hour = d.getHours();

  if (hour >= startHour || hour < endHour) {
    d.setHours(endHour, 0, 0, 0);
  }

  return d;
}

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

export async function cancelObligationNotification(obligationId) {
  const { isNative, cancelNativeNotification } =
    await import('./nativeNotifications.js');

  if (isNative()) {
    await cancelNativeNotification(obligationId);
    return;
  }

  if (!canUseNotifications()) return;

  const registration = await navigator.serviceWorker.ready;
  const notifications = await registration.getNotifications({
    tag: `obligation-${obligationId}`
  });

  notifications.forEach(n => n.close());
}

export async function scheduleObligationNotification(obligation, delayMinutes = null) {
  if (!canUseNotifications()) return;

  let triggerTime;

  if (delayMinutes !== null) {
    triggerTime = Date.now() + delayMinutes * 60 * 1000;
  } else {
    if (!obligation?.dateTime || !obligation?.reminder) return;

    let triggerTime =
  new Date(obligation.dateTime).getTime() -
  Number(obligation.reminder) * 60 * 1000;

triggerTime = applyQuietHours(new Date(triggerTime)).getTime();
}

  if (triggerTime <= Date.now()) return;
const { isNative, scheduleNativeNotification } =
  await import('./nativeNotifications.js');

if (isNative()) {
  await scheduleNativeNotification(obligation, triggerTime);
  return;
}

  const registration = await navigator.serviceWorker.ready;

  registration.showNotification('LifeKompas – Obveza', {
  body: obligation.title,
  tag: `obligation-${obligation.id}`,
  timestamp: triggerTime,
  icon: '/icon-192.png',
  badge: '/icon-192.png',
  data: {
    obligationId: obligation.id
  },
  actions: [
    { action: 'snooze-15', title: '⏰ 15 min' },
    { action: 'snooze-30', title: '⏰ 30 min' },
    { action: 'snooze-60', title: '⏰ 60 min' }
  ]
});
}

export async function rescheduleObligationNotification(obligation) {
  await cancelObligationNotification(obligation.id);
  await scheduleObligationNotification(obligation);
}

export async function snoozeObligation(obligation, minutes) {
  await cancelObligationNotification(obligation.id);
  await scheduleObligationNotification(obligation, minutes);
}