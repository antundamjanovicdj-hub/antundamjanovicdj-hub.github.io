const Capacitor = window.Capacitor;
import {
  scheduleNativeNotification,
  cancelNativeNotification
} from './nativeNotifications.js';

/* =====================================================
   LAZY LOAD CAPACITOR LOCAL NOTIFICATIONS
   ===================================================== */

let LocalNotifications = null;

async function getLocalNotifications() {
  if (LocalNotifications) return LocalNotifications;

  if (!window.Capacitor?.isNativePlatform?.()) return null;

  LocalNotifications =
    window.Capacitor?.Plugins?.LocalNotifications || null;

  return LocalNotifications;
}

/* =====================================================
   PERMISSION
   ===================================================== */

export async function requestNotificationPermission() {
  const LN = await getLocalNotifications();
  if (!LN) return false;

  const perm = await LN.requestPermissions();
  console.log("Notification permission:", perm.display);

  return perm.display === 'granted';
}

/* =====================================================
   OBLIGATIONS
   ===================================================== */

export async function scheduleObligationNotification(obligation) {
  if (!obligation?.dateTime) return;

  const eventTime = new Date(obligation.dateTime).getTime();

  const reminderMinutes =
    obligation.reminder ? parseInt(obligation.reminder, 10) : 0;

  const triggerTime =
    eventTime - reminderMinutes * 60 * 1000;

  if (triggerTime <= Date.now()) return;

  console.log("🔥 scheduleNativeNotification CALLED");

  await scheduleNativeNotification(
    obligation,
    triggerTime
  );
}

export async function cancelObligationNotification(id) {
  await cancelNativeNotification(id);
}

export async function rescheduleObligationNotification(obligation) {
  await cancelObligationNotification(obligation.id);
  await scheduleObligationNotification(obligation);
}

/* =====================================================
   TEST NOTIFICATION
   ===================================================== */

export async function sendTestNotification() {
  const LN = await getLocalNotifications();
  if (!LN) return;

  await LN.schedule({
    notifications: [{
      id: Math.floor(Date.now() / 1000),
      title: "LifeKompas test",
      body: "Test notifikacija radi.",
      schedule: {
        at: new Date(Date.now() + 3000)
      }
    }]
  });
}

/* =====================================================
   RESCHEDULE ALL
   ===================================================== */

export async function rescheduleAllObligations(obligations) {
  for (const ob of obligations) {
    if (!ob.reminder || !ob.dateTime) continue;

    const eventTime = new Date(ob.dateTime).getTime();
    const reminderMinutes = parseInt(ob.reminder, 10) || 0;

    const triggerTime =
      eventTime - reminderMinutes * 60 * 1000;

    if (triggerTime <= Date.now()) continue;

    await scheduleObligationNotification(ob);
  }
}

/* =====================================================
   BIRTHDAY NOTIFICATIONS
   ===================================================== */

export async function scheduleBirthdayNotification(contact) {
  if (!contact?.birthDate) return;

  let parts = contact.birthDate.split('-');

  let day, month;

  // ISO YYYY-MM-DD
  if (parts[0].length === 4) {
    day = parts[2];
    month = parts[1];
  }
  // DD-MM-YYYY
  else {
    day = parts[0];
    month = parts[1];
  }

  const now = new Date();

  const time =
    (contact.birthdayTime || "09:00").split(':');

  const hours = parseInt(time[0], 10);
  const minutes = parseInt(time[1], 10);

  let nextBirthday = new Date(
    now.getFullYear(),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    hours,
    minutes,
    0
  );

  if (nextBirthday.getTime() < Date.now()) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  const LN = await getLocalNotifications();
  if (!LN) return;

  await LN.schedule({
    notifications: [{
      id: Math.floor(contact.id % 2147483647),
      title: "🎂 Rođendan",
      body: `${contact.firstName} ${contact.lastName} danas slavi rođendan!`,
      schedule: { at: nextBirthday },
      importance: 5,
      visibility: 1,
      extra: { contactId: contact.id }
    }]
  });
}

export async function cancelBirthdayNotification(contactId) {
  const LN = await getLocalNotifications();
  if (!LN) return;

  const intId = Math.floor(contactId % 2147483647);

  await LN.cancel({
    notifications: [{ id: intId }]
  });
}