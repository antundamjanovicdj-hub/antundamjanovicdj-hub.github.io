// ===== CAPACITOR GUARD =====
let LocalNotifications = null;
const IS_CAPACITOR =
  !!(window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.LocalNotifications);

if (IS_CAPACITOR) {
  LocalNotifications = Capacitor.Plugins.LocalNotifications;
}

  // Clear delivered notifications when app becomes active (Android badge fix)
  // Badge clearing removed – let Android handle notification lifecycle

// ===== PERMISSION =====
export async function requestNotificationPermission() {
  if (!LocalNotifications) return false;
  const perm = await LocalNotifications.requestPermissions();
  console.log("Notification permission:", perm.display);
  return perm.display === 'granted';
}

// ===== SCHEDULE OBLIGATION =====
export async function scheduleObligationNotification(obligation) {
  if (!LocalNotifications) return;
  if (!obligation.dateTime) return;

  const eventTime = new Date(obligation.dateTime).getTime();
  let reminderMinutes = obligation.reminder ? parseInt(obligation.reminder, 10) : 0;
  const triggerTime = eventTime - reminderMinutes * 60 * 1000;
  if (triggerTime <= Date.now()) return;

  await LocalNotifications.schedule({
    notifications: [{
      id: Math.floor(obligation.id % 2147483647),
      title: "LifeKompas podsjetnik",
      body: obligation.title,
      schedule: { at: new Date(triggerTime) },
      sound: null,
      extra: { obligationId: obligation.id },
      importance: 5,
      visibility: 1
    }]
  });
}

// ===== CANCEL =====
export async function cancelObligationNotification(id) {
  if (!LocalNotifications) return;
  const intId = Math.floor(id % 2147483647);
  await LocalNotifications.cancel({ notifications: [{ id: intId }] });
}

// ===== RESCHEDULE =====
export async function rescheduleObligationNotification(obligation) {
  if (!LocalNotifications) return;
  await cancelObligationNotification(obligation.id);
  await scheduleObligationNotification(obligation);
}

// ===== TEST =====
export async function sendTestNotification() {
  if (!LocalNotifications) return;
  await LocalNotifications.schedule({
    notifications: [{
      id: Math.floor(Date.now() / 1000),
      title: "LifeKompas test",
      body: "Test notifikacija radi.",
      schedule: { at: new Date(Date.now() + 3000) }
    }]
  });
}

// ===== RESCHEDULE ALL ON APP START =====
export async function rescheduleAllObligations(obligations) {
  if (!LocalNotifications) return;
  for (const ob of obligations) {
    if (!ob.reminder) continue;
    if (!ob.dateTime) continue;

    const eventTime = new Date(ob.dateTime).getTime();
    const reminderMinutes = parseInt(ob.reminder, 10) || 0;
    const triggerTime = eventTime - reminderMinutes * 60 * 1000;
    if (triggerTime <= Date.now()) continue;

    await scheduleObligationNotification(ob);
  }
}

// ===== BIRTHDAY NOTIFICATIONS =====

export async function scheduleBirthdayNotification(contact) {
  if (!LocalNotifications) return;
  if (!contact.birthDate) return;

  // birthDate format: DD-MM-YYYY or YYYY-MM-DD
  let parts;
  if (contact.birthDate.includes('-')) {
    parts = contact.birthDate.split('-');
  } else {
    return;
  }

  let day, month;

  // ISO format YYYY-MM-DD
  if (parts[0].length === 4) {
    day = parts[2];
    month = parts[1];
  } 
  // HR format DD-MM-YYYY
  else {
    day = parts[0];
    month = parts[1];
  }

  const now = new Date();
  const time = (contact.birthdayTime || "09:00").split(':');
const hours = parseInt(time[0],10);
const minutes = parseInt(time[1],10);

let nextBirthday = new Date(
  now.getFullYear(),
  parseInt(month,10)-1,
  parseInt(day,10),
  hours, minutes, 0
);

  if (nextBirthday.getTime() < Date.now()) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  await LocalNotifications.schedule({
  notifications: [{
    id: Math.floor(contact.id % 2147483647),
    title: "🎂 Rođendan",
    body: `${contact.firstName} ${contact.lastName} danas slavi rođendan!`,
    schedule: {
  at: nextBirthday
},
    importance: 5,
    visibility: 1,
    extra: { contactId: contact.id }
  }]
});
}

export async function cancelBirthdayNotification(contactId) {
  if (!LocalNotifications) return;
  const intId = Math.floor(contactId % 2147483647);
  await LocalNotifications.cancel({ notifications: [{ id: intId }] });
}