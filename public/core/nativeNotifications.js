// core/nativeNotifications.js
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export function isNative() {
  return Capacitor.isNativePlatform();
}

const CHANNEL_ID = 'lifekompas-obligations';

async function ensureChannel() {
  await LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: 'LifeKompas – Obveze',
    description: 'Podsjetnici za obveze',
    importance: 5, // HIGH
    sound: 'default',
    visibility: 1 // PUBLIC
  });
}

export async function scheduleNativeNotification(obligation, triggerTime) {
  if (!isNative()) return;

  // 🔑 Android 13+ permission
  await LocalNotifications.requestPermissions();

  // 🔑 Channel (OBAVEZNO)
  await ensureChannel();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: obligation.id,
        title: '🧭 LifeKompas',
        body: obligation.title,
        schedule: { at: new Date(triggerTime) },
        channelId: CHANNEL_ID,
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