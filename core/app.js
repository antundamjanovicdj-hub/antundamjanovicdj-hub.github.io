// core/app.js
import { I18N } from "./i18n.js";
import { showScreen } from "./ui.js";

// Fallback AppState
let AppState = window.AppState || {
  lang: 'hr',
  set lang(val) {
    localStorage.setItem('userLang', val);
    this._lang = val;
  },
  get lang() {
    return this._lang || localStorage.getItem('userLang') || 'hr';
  }
};

// Inicijaliziraj _lang iz localStorage
AppState._lang = localStorage.getItem('userLang') || 'hr';
window.AppState = AppState;

document.addEventListener("DOMContentLoaded", () => {
  const T = I18N;
  const $ = (id) => document.getElementById(id);

  showScreen("screen-lang");

  // ✅ JEDNOSTAVAN EVENT LISTENER — BEZ KONTROLERA
  document.getElementById("screen-lang").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;

    const lang = btn.dataset.lang;
    AppState.lang = lang;

    // Privremeno: samo promijeni tekst izbornika
    const menuBtn = $("btnTasks");
    if (menuBtn) {
      menuBtn.querySelector(".menu-text").textContent = T[lang]?.tasks || "Tasks";
    }

    document.body.className = "static";
    showScreen("screen-menu");
  });

  // Natrag na jezik
  if ($("backMenu")) {
    $("backMenu").onclick = () => {
      document.body.className = "home";
      showScreen("screen-lang");
    };
  }
});