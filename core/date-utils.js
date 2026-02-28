// core/date-utils.js
// ZERO-RISK helper extraction

export function getISODateFromDateTime(dateTime) {
  if (!dateTime) return null;

  // already ISO date (YYYY-MM-DD)
  if (dateTime.length === 10) return dateTime;

  const d = new Date(dateTime);
  if (isNaN(d)) return null;

  return d.toISOString().slice(0, 10);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
