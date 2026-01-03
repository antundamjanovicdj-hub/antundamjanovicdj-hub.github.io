// core/nativeNotifications.js
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

function isAndroid() {
  return Capacitor.getPlatform() === 'android';
}

async function scheduleAlarmManager(id, at, title, body) {
  const { Plugins } = await import('@capacitor/core');
  const AlarmNotifications = Plugins.AlarmNotifications;
  if (!AlarmNotifications) throw new Error('AlarmNotifications plugin not available');

  return AlarmNotifications.schedule({ id, at, title, body });
}

async function cancelAlarmManager(id) {
  const { Plugins } = await import('@capacitor/core');
  const AlarmNotifications = Plugins.AlarmNotifications;
  if (!AlarmNotifications) throw new Error('AlarmNotifications plugin not available');

  return AlarmNotifications.cancel({ id });
}

function isAndroid() {
  return Capacitor.getPlatform() === 'android';
}

async function scheduleAlarmManager(id, at, title, body) {
  const { Plugins } = await import('@capacitor/core');
  const AlarmNotifications = Plugins.AlarmNotifications;
  if (!AlarmNotifications) throw new Error('AlarmNotifications plugin not available');

  return AlarmNotifications.schedule({ id, at, title, body });
}

async function cancelAlarmManager(id) {
  const { Plugins } = await import('@capacitor/core');
  const AlarmNotifications = Plugins.AlarmNotifications;
  if (!AlarmNotifications) throw new Error('AlarmNotifications plugin not available');

  return AlarmNotifications.cancel({ id });
}

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

  // ✅ ANDROID: uvijek koristi AlarmManager fallback (radi i na Moto E40)
  if (isAndroid()) {
    await scheduleAlarmManager(
      Number(obligation.id),
      Number(triggerTime),
      '🧭 LifeKompas',
      obligation.title
    );
    return;
  }

  // iOS / ostalo: LocalNotifications
  await LocalNotifications.requestPermissions();
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
        extra: { obligationId: obligation.id }
      }
    ]
  });
}

export async function cancelNativeNotification(obligationId) {
  if (!isNative()) return;

  if (isAndroid()) {
    await cancelAlarmManager(Number(obligationId));
    return;
  }

  await LocalNotifications.cancel({
    notifications: [{ id: obligationId }]
  });
}
export async function testNativeNotification() {
  if (!isNative()) return;

  if (isAndroid()) {
    await scheduleAlarmManager(
      333333,
      Date.now() + 2000,
      '🧪 LifeKompas TEST',
      'Ako ovo vidiš – AlarmManager radi ✅'
    );
    return;
  }
}

  await LocalNotifications.requestPermissions();
  await ensureChannel();
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 333333,
        title: '🧪 LifeKompas TEST',
        body: 'Ako ovo vidiš – LocalNotifications rade ✅',
        schedule: { at: new Date(Date.now() + 2000) },
        channelId: CHANNEL_ID,
        sound: 'default'
      }
    ]
  });
}