// core/app.js
// import { I18N } from "./i18n.js"; // ❌ Uklonjeno
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
  const T = window.I18N; // ✅ Koristi globalnu varijablu
  if (!T) {
    console.error("I18N not loaded!");
    return;
  }

  const $ = (id) => document.getElementById(id);

  showScreen("screen-lang");

  // ✅ EVENT DELEGATION
  document.getElementById("screen-lang").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;

    const lang = btn.dataset.lang;
    AppState.lang = lang;

    if (els.btnTasks) {
      const menuText = els.btnTasks.querySelector(".menu-text");
      if (menuText) menuText.textContent = T[lang]?.tasks || "Tasks";
    }

    document.body.className = "static";
    showScreen("screen-menu");
  });

  // Ostali handleri...
  if (els.backMenu) {
    els.backMenu.onclick = () => {
      document.body.className = "home";
      showScreen("screen-lang");
    };
  }

  if (els.btnTasks) {
    els.btnTasks.onclick = () => {
      showScreen("screen-tasks");
    };
  }

  if (els.backTasks) {
    els.backTasks.onclick = () => showScreen("screen-menu");
  }

  if (els.saveTask) {
    els.saveTask.onclick = () => {
      // Ne radi bez tasks.controller.js
    };
  }

  if (els.btnByDay) {
    els.btnByDay.onclick = () => {
      // Ne radi bez tasks.controller.js
    };
  }

  if (els.closeDayPopup) {
    els.closeDayPopup.onclick = () => closeDayPopup({ dayPopupEl: els.dayPopup });
  }

  if (els.popupDate) {
    els.popupDate.onchange = () => {
      // Ne radi bez tasks.controller.js
    };
  }
});