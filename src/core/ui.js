// core/ui.js
function formatDate(dateString) {
  if (!dateString) return "";
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

window.formatDate = formatDate;

// ✅ DINAMIČKA PROMJENA JEZIKA BEZ RELOADA — KOMPATIBILNO
window.renderLanguage = function(lang) {
  // Spremi jezik
  window.currentLang = lang;
  
  // Ažuriraj elemente s [data-i18n]
  const i18nElements = document.querySelectorAll('[data-i18n]');
  if (i18nElements.length > 0) {
    i18nElements.forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      if (window.I18N && window.I18N[lang] && window.I18N[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = window.I18N[lang][key];
        } else {
          el.textContent = window.I18N[lang][key];
        }
      }
    });
  }

  // Ažuriraj label-e po ID-u
  const labels = ['tTitleL', 'tNoteL', 'tCatL', 'tDateL', 'tTimeL', 'tRemL', 'calendarLabel', 'popupTitle', 'popupDateLabel'];
  for (var i = 0; i < labels.length; i++) {
    var id = labels[i];
    var el = document.getElementById(id);
    if (el && window.I18N && window.I18N[lang]) {
      var key = id.endsWith('L') ? id.slice(0, -1) : id;
      if (window.I18N[lang][key]) {
        el.textContent = window.I18N[lang][key];
      }
    }
  }

  // Ažuriraj gumbove
  const btns = ['saveTask', 'btnByDay'];
  for (var j = 0; j < btns.length; j++) {
    var btnId = btns[j];
    var btn = document.getElementById(btnId);
    if (btn && window.I18N && window.I18N[lang] && window.I18N[lang][btnId]) {
      btn.textContent = window.I18N[lang][btnId];
    }
  }
};