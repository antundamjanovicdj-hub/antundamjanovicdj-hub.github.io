const { LocalNotifications } = Capacitor.Plugins;

// ===== PERMISSION =====
export async function requestNotificationPermission() {
  const perm = await LocalNotifications.requestPermissions();
  console.log("Notification permission:", perm.display);
  return perm.display === 'granted';
}

// ===== SCHEDULE OBLIGATION =====
export async function scheduleObligationNotification(obligation) {
  if (!obligation.dateTime) return;

  const eventTime = new Date(obligation.dateTime).getTime();
  let reminderMinutes = obligation.reminder ? parseInt(obligation.reminder, 10) : 0;
  const triggerTime = eventTime - reminderMinutes * 60 * 1000;

  if (triggerTime <= Date.now()) return;

  await LocalNotifications.schedule({
  notifications: [
    {
      id: Math.floor(obligation.id % 2147483647),
      title: "LifeKompas podsjetnik",
      body: obligation.title,
      schedule: { at: new Date(triggerTime) },
      sound: null,
      extra: { obligationId: obligation.id },
      importance: 5,
      visibility: 1
    }
  ]
});

  console.log("Podsjetnik zakazan:", obligation.title);
}

// ===== CANCEL =====
export async function cancelObligationNotification(id) {
  const intId = Math.floor(id % 2147483647);
  await LocalNotifications.cancel({ notifications: [{ id: intId }] });
}

// ===== RESCHEDULE =====
export async function rescheduleObligationNotification(obligation) {
  await cancelObligationNotification(obligation.id);
  await scheduleObligationNotification(obligation);
}

// ===== TEST =====
export async function sendTestNotification() {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: Math.floor(Date.now() / 1000),
        title: "LifeKompas test",
        body: "Test notifikacija radi.",
        schedule: { at: new Date(Date.now() + 3000) }
      }
    ]
  });
}

// ===== RESCHEDULE ALL ON APP START =====
export async function rescheduleAllObligations(obligations) {
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