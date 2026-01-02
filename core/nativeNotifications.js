// core/nativeNotifications.js
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export function isNative() {
  return Capacitor.isNativePlatform();
}

export async function scheduleNativeNotification(obligation, triggerTime) {
  if (!isNative()) return;

  await LocalNotifications.requestPermissions();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: obligation.id,
        title: 'LifeKompas – Obveza',
        body: obligation.title,
        schedule: { at: new Date(triggerTime) },
        sound: 'default',
        extra: {
          obligationId: obligation.id
        }
      }
    ]
  });
}

export async function cancelNativeNotification(obligationId) {
  if (!isNative()) return;

  await LocalNotifications.cancel({
    notifications: [{ id: obligationId }]
  });
}