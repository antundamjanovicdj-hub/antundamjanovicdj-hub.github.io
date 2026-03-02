// core/date-utils.js
// LOCAL-FIRST date helpers (LifeKompas standard)

export function getISODateFromDateTime(dateTime) {
  if (!dateTime) return null;

  // already ISO date (YYYY-MM-DD)
  if (dateTime.length === 10) return dateTime;

  const d = new Date(dateTime);
  if (isNaN(d)) return null;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayISO() {


  const now = new Date();

  const local = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, "0");
  const day = String(local.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
