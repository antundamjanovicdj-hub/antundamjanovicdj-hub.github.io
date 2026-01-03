// modules/tasks/tasks.calendar.js
function exportToCalendar({ task, lang, T, platform, cancel }) {
  // Placeholder: iOS ne dozvoljava direktno dodavanje u kalendar iz PWA
  if (platform.isIOS) {
    alert(T[lang].calendarNote || "Obveza iz LifeKompasa");
    return;
  }

  // Android: možeš generirati .ics, ali za sada samo log
  console.log("Calendar export:", { task, cancel });
}

// ✅ IZLOŽI GLOBALNO
window.exportToCalendar = exportToCalendar;