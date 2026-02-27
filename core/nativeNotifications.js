// core/nativeNotifications.js

const Capacitor = window.Capacitor;
const LocalNotifications =
  window.Capacitor?.Plugins?.LocalNotifications;

function isAndroid() {
  return Capacitor.getPlatform() === 'android';
}

export function isNative() {
  return Capacitor.isNativePlatform();
}

// ===== ANDROID ALARM MANAGER =====

async function scheduleAlarmManager(id, at, title, body) {
  const AlarmNotifications =
  window.Capacitor?.Plugins?.AlarmNotifications;

  if (!AlarmNotifications)
    throw new Error('AlarmNotifications plugin not available');

  return AlarmNotifications.schedule({ id, at, title, body });
}

async function cancelAlarmManager(id) {
  const { Plugins } = await import('@capacitor/core');
  const AlarmNotifications = Plugins.AlarmNotifications;

  if (!AlarmNotifications)
    throw new Error('AlarmNotifications plugin not available');

  return AlarmNotifications.cancel({ id });
}

// ===== CHANNEL =====

const CHANNEL_ID = 'lifekompas-obligations';

async function ensureChannel() {
  if (!isAndroid()) return;

  await LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: 'LifeKompas – Obveze',
    description: 'Podsjetnici za obveze',
    importance: 5,
    sound: 'default',
    visibility: 1
  });
}

// ===== SCHEDULE =====

export async function scheduleNativeNotification(obligation, triggerTime) {

  console.log("🔥 scheduleNativeNotification CALLED");

  if (!isNative()) {
    console.log("❌ not native platform");
    return;
  }

  if (isAndroid()) {
    await scheduleAlarmManager(
      Number(obligation.id),
      Number(triggerTime),
      '🧭 LifeKompas',
      obligation.title
    );
    return;
  }

  // iOS
  console.log("🔥 requesting notification permission");

await LocalNotifications.requestPermissions();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: Number(obligation.id),
        title: '🧭 LifeKompas',
        body: obligation.title,
        schedule: { at: new Date(triggerTime) },
        sound: 'default',
        extra: { obligationId: obligation.id }
      }
    ]
  });
}

// ===== CANCEL =====

export async function cancelNativeNotification(obligationId) {
  if (!isNative()) return;

  if (isAndroid()) {
    await cancelAlarmManager(Number(obligationId));
    return;
  }

  await LocalNotifications.cancel({
    notifications: [{ id: Number(obligationId) }]
  });
}

// ===== TEST =====

export async function testNativeNotification() {
  if (!isNative()) return;

  if (isAndroid()) {
    await scheduleAlarmManager(
      333333,
      Date.now() + 2000,
      '🧪 LifeKompas TEST',
      'AlarmManager radi ✅'
    );
    return;
  }

  await LocalNotifications.requestPermissions();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 333333,
        title: '🧪 LifeKompas TEST',
        body: 'LocalNotifications rade ✅',
        schedule: { at: new Date(Date.now() + 2000) },
        sound: 'default'
      }
    ]
  });
}