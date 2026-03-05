// core/notifications.js

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

// 🔧 FIX: Safe ID generation helper
function safeNotificationId(id) {
  // Handle NaN, undefined, null, and overflow
  const numId = Number(id);
  if (isNaN(numId) || !isFinite(numId)) {
    return Math.floor(Date.now() % 2147483647);
  }
  return Math.floor(Math.abs(numId) % 2147483647);
}

/* =====================================================
   PERMISSION
   ===================================================== */

export async function requestNotificationPermission() {
  const LN = await getLocalNotifications();
  if (!LN) return false;

  try {
    const perm = await LN.requestPermissions();
    console.log("Notification permission:", perm.display);
    return perm.display === 'granted';
  } catch (err) {
    console.error("Notification permission error:", err);
    return false;
  }
}

/* =====================================================
   OBLIGATIONS
   ===================================================== */

export async function scheduleObligationNotification(obligation) {
  const LN = await getLocalNotifications();
  if (!LN) return;

  if (!obligation?.dateTime) return;

  // 🔧 FIX: Safe date parsing
  const eventDate = new Date(obligation.dateTime);
  if (isNaN(eventDate.getTime())) {
    console.warn("Invalid obligation dateTime:", obligation.dateTime);
    return;
  }

  const eventTime = eventDate.getTime();
  const reminderMinutes = obligation.reminder ? parseInt(obligation.reminder, 10) : 0;

  // 🔧 FIX: Handle NaN reminder
  const safeReminderMinutes = isNaN(reminderMinutes) ? 0 : reminderMinutes;
  const triggerTime = eventTime - safeReminderMinutes * 60 * 1000;

  // iOS/Android safety: ne schedule u prošlosti
  // iOS safety window
  if (triggerTime <= Date.now() + 60000) {
    console.log("⛔ trigger too close — skip reschedule");
    return;
  }

  // 🔧 FIX: Safe ID generation
  const id = safeNotificationId(obligation.id);

  // 🔥 CRITICAL iOS FIX — uvijek očisti stari ID
  try {
    await LN.cancel({
      notifications: [{ id }]
    });
  } catch (cancelErr) {
    console.warn("Cancel notification error (non-critical):", cancelErr);
  }

  console.log("⏰ scheduleObligationNotification", { id, triggerTime, obligation });

  try {
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
  } catch (scheduleErr) {
    console.error("Schedule notification error:", scheduleErr);
  }
}

export async function cancelObligationNotification(id) {
  const LN = await getLocalNotifications();
  if (!LN) return;

  // 🔧 FIX: Safe ID generation
  const intId = safeNotificationId(id);

  console.log("🧹 cancelObligationNotification", { intId, id });

  try {
    await LN.cancel({
      notifications: [{ id: intId }]
    });
  } catch (err) {
    console.warn("Cancel notification error:", err);
  }
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

  try {
    await LN.schedule({
      notifications: [{
        id: Math.floor(Date.now() / 1000) % 2147483647,
        title: "LifeKompas test",
        body: "Test notifikacija radi.",
        schedule: {
          at: new Date(Date.now() + 3000)
        }
      }]
    });
  } catch (err) {
    console.error("Test notification error:", err);
  }
}

/* =====================================================
   RESCHEDULE ALL
   ===================================================== */

export async function rescheduleAllObligations(obligations) {
  if (!Array.isArray(obligations)) return;

  for (const ob of obligations) {
    if (!ob?.reminder || !ob?.dateTime) continue;

    // 🔧 FIX: Safe date parsing
    const eventDate = new Date(ob.dateTime);
    if (isNaN(eventDate.getTime())) continue;

    const eventTime = eventDate.getTime();
    const reminderMinutes = parseInt(ob.reminder, 10) || 0;

    const triggerTime = eventTime - reminderMinutes * 60 * 1000;

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

  // 🔧 FIX: Validate parts
  if (parts.length < 3) {
    console.warn("Invalid birthDate format:", contact.birthDate);
    return;
  }

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

  // 🔧 FIX: Validate day and month
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);

  if (isNaN(dayNum) || isNaN(monthNum) || dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
    console.warn("Invalid day/month in birthDate:", contact.birthDate);
    return;
  }

  const now = new Date();
  const time = (contact.birthdayTime || "09:00").split(':');
  const hours = parseInt(time[0], 10) || 9;
  const minutes = parseInt(time[1], 10) || 0;

  let nextBirthday = new Date(
    now.getFullYear(),
    monthNum - 1,
    dayNum,
    hours,
    minutes,
    0
  );

  // ako je već prošlo (ili je preblizu) → sljedeća godina
  if (nextBirthday.getTime() <= Date.now() + 60 * 1000) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  // 🔧 FIX: Safe ID generation
  const id = safeNotificationId(contact.id);

  console.log("🎂 scheduling birthday", { id, at: nextBirthday });

  try {
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
  } catch (err) {
    console.error("Birthday notification schedule error:", err);
  }
}

export async function cancelBirthdayNotification(contactId) {
  const LN = await getLocalNotifications();
  if (!LN) return;

  // 🔧 FIX: Safe ID generation
  const id = safeNotificationId(contactId);

  console.log("🧹 cancelBirthdayNotification", { id, contactId });

  try {
    await LN.cancel({
      notifications: [{ id }]
    });
  } catch (err) {
    console.warn("Cancel birthday notification error:", err);
  }
}

// ===== EXPOSE GLOBAL BRIDGE (Contacts module) =====
window.requestNotificationPermission = requestNotificationPermission;
window.scheduleBirthdayNotification = scheduleBirthdayNotification;
window.cancelBirthdayNotification = cancelBirthdayNotification;