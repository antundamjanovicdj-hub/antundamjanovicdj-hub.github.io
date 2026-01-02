// core/nativeNotifications.js
// Stub – aktivira se tek u native appu (Capacitor)

export function isNative() {
  return !!window.Capacitor;
}

export async function scheduleNativeNotification(obligation, triggerTime) {
  // Ovdje će kasnije ići Capacitor Local Notifications
  // Trenutno namjerno prazno
}

export async function cancelNativeNotification(obligationId) {
  // placeholder
}