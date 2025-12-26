// core/ui.js
function formatDate(dateString) {
  if (!dateString) return "";
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function showScreen(screenId) {
  console.log("🎯 showScreen:", screenId);
  document.querySelectorAll(".screen").forEach(el => {
    el.classList.remove("active");
  });
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add("active");
  }
}

// ✅ IZLOŽI GLOBALNO — NEMA export!
window.showScreen = showScreen;
window.formatDate = formatDate;
// ✅ DODAJ OVO — DINAMIČKA PROMJENA JEZIKA BEZ RELOADA
window.renderLanguage = function(lang) {
  // Spremi jezik
  window.currentLang = lang;
  
  // Ažuriraj sve elemente s tekstom
  document.querySelectorAll('[data-i18n]').?.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (window.I18N?.[lang]?.[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = window.I18N[lang][key];
      } else {
        el.textContent = window.I18N[lang][key];
      }
    }
  });

  // Ako koristiš label-e s ID-ovima (kao u tasks), ažuriraj ih
  const labels = ['tTitleL', 'tNoteL', 'tCatL', 'tDateL', 'tTimeL', 'tRemL', 'calendarLabel', 'popupTitle', 'popupDateLabel'];
  labels.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.I18N?.[lang]) {
      // Mapiraj ID u ključ (npr. "tTitleL" → "tTitle")
      const key = id.endsWith('L') ? id.slice(0, -1) : id;
      if (window.I18N[lang][key]) {
        el.textContent = window.I18N[lang][key];
      }
    }
  });

  // Ažuriraj gumbove
  const btns = ['saveTask', 'btnByDay'];
  btns.forEach(id => {
    const btn = document.getElementById(id);
    if (btn && window.I18N?.[lang]?.[id]) {
      btn.textContent = window.I18N[lang][id];
    }
  });
};