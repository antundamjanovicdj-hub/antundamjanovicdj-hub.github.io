const Capacitor = window.Capacitor;

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
  const LN = await getLocalNotifications();
  if (!LN) return;

  if (!obligation?.dateTime) return;

  const eventTime = new Date(obligation.dateTime).getTime();
  const reminderMinutes = obligation.reminder ? parseInt(obligation.reminder, 10) : 0;

  const triggerTime = eventTime - reminderMinutes * 60 * 1000;

  // iOS/Android safety: ne schedule u prošlosti
  // iOS safety window
if (triggerTime <= Date.now() + 60000) {
  console.log("⛔ trigger too close — skip reschedule");
  return;
}

  const id = Math.floor(Number(obligation.id) % 2147483647);

  // 🔥 CRITICAL iOS FIX — uvijek očisti stari ID
await LN.cancel({
  notifications: [{ id }]
});

  console.log("⏰ scheduleObligationNotification", { id, triggerTime, obligation });

  await LN.schedule({
  notifications: [{
    id,
    title: "⏰ Obveza",
    body: obligation.title || "Obveza",

    schedule: {
      at: new Date(triggerTime),
      allowWhileIdle: true
    },

    sound: "default",
    smallIcon: "ic_stat_icon_config_sample",
    importance: 5,
    visibility: 1,

    extra: { obligationId: obligation.id }
  }]
});
}

export async function cancelObligationNotification(id) {
  const LN = await getLocalNotifications();
  if (!LN) return;

  const intId = Math.floor(Number(id) % 2147483647);

  console.log("🧹 cancelObligationNotification", { intId, id });

  await LN.cancel({
    notifications: [{ id: intId }]
  });
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
  const LN = await getLocalNotifications();
  if (!LN) return;

  if (!contact?.birthDate) return;

  console.log("🎂 scheduleBirthdayNotification CALLED", contact);

  const parts = String(contact.birthDate).split('-');

  let day, month;

  // ISO YYYY-MM-DD
  if (parts[0] && parts[0].length === 4) {
    day = parts[2];
    month = parts[1];
  } else {
    // DD-MM-YYYY
    day = parts[0];
    month = parts[1];
  }

  const now = new Date();
  const time = (contact.birthdayTime || "09:00").split(':');
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

  // ako je već prošlo (ili je preblizu) → sljedeća godina
  if (nextBirthday.getTime() <= Date.now() + 60 * 1000) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  const id = Math.floor(Number(contact.id) % 2147483647);

  console.log("🎂 scheduling birthday", { id, at: nextBirthday });

  await LN.schedule({
    notifications: [{
      id,
      title: "🎂 Rođendan",
      body: `${contact.firstName || ''} ${contact.lastName || ''} danas slavi rođendan!`.trim(),
      schedule: { at: nextBirthday },
      sound: "default",
      extra: { contactId: contact.id }
    }]
  });
}

export async function cancelBirthdayNotification(contactId) {
  const LN = await getLocalNotifications();
  if (!LN) return;

  const id = Math.floor(Number(contactId) % 2147483647);

  console.log("🧹 cancelBirthdayNotification", { id, contactId });

  await LN.cancel({
    notifications: [{ id }]
  });
}

// ===== EXPOSE GLOBAL BRIDGE (Contacts module) =====
window.requestNotificationPermission = requestNotificationPermission;
window.scheduleBirthdayNotification = scheduleBirthdayNotification;
window.cancelBirthdayNotification = cancelBirthdayNotification;