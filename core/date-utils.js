// core/date-utils.js
// ZERO-RISK helper extraction

export function getISODateFromDateTime(dateTime) {
  return dateTime ? dateTime.slice(0, 10) : null;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}