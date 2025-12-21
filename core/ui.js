// core/ui.js

export function showScreen(id) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(s => {
    s.classList.remove("active");
    s.style.pointerEvents = "none";
    s.style.opacity = "0";
  });

  const el = document.getElementById(id);
  if (el) {
    el.classList.add("active");
    el.style.pointerEvents = "auto";
    el.style.opacity = "1";
  }
}

// ✅ DODATA FUNKCIJA formatDate
export function formatDate(dateString, lang = 'hr') {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  if (lang === 'en') {
    options.day = 'numeric';
    options.month = 'short';
  }
  return date.toLocaleDateString(lang, options);
}
/ ✅ IZLOŽI GLOBALNO ZA KOMPATIBILNOST
window.showScreen = showScreen;
window.formatDate = formatDate;