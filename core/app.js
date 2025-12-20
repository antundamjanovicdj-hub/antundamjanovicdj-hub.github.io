// core/app.js
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
  const T = window.I18N;
  if (!T) {
    console.error("I18N not loaded!");
    return;
  }

  const $ = (id) => document.getElementById(id);

  // ✅ DEFINIRAJ 'els' ispravno, bez sintaktičkih grešaka
  const els = {
  backMenu: $("backMenu"),
  btnTasks: $("btnTasks"),
  backTasks: $("backTasks"),
  btnByDay: $("btnByDay"),

  tTitleL: $("tTitleL"),
  tNoteL: $("tNoteL"),
  tCatL: $("tCatL"),
  tDateL: $("tDateL"),
  tTimeL: $("tTimeL"),
  tRemL: $("tRemL"),

  taskTitle: $("taskTitle"),
  taskNote: $("taskNote"),
  taskCategory: $("taskCategory"),
  taskDate: $("taskDate"),
  taskTime: $("taskTime"),
  taskReminder: $("taskReminder"),
  addToCalendar: $("addToCalendar"),

  calendarLabel: $("calendarLabel"),
  calendarInfo: $("calendarInfo"),
  saveTask: $("saveTask"),
  taskList: $("taskList"),

  dayPopup: $("dayPopup"),
  popupTitle: $("popupTitle"),
  closeDayPopup: $("closeDayPopup"),
  popupDateLabel: $("popupDateLabel"),
  popupDate: $("popupDate"),
  popupTasks: $("popupTasks"),

  reminderHint: $("reminderHint")
};

  showScreen("screen-lang");

  // ✅ EVENT ZA IZBOR JEZIKA
  document.getElementById("screen-lang").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;

    const lang = btn.dataset.lang;
    AppState.lang = lang;

    // Ažuriraj tekst gumba u izborniku
    if (els.btnTasks) {
      const menuText = els.btnTasks.querySelector(".menu-text");
      if (menuText) menuText.textContent = T[lang]?.tasks || "Tasks";
    }

    document.body.className = "static";
    showScreen("screen-menu");
  });

  // Gumb "←" iz izbornika
  if (els.backMenu) {
    els.backMenu.onclick = () => {
      document.body.className = "home";
      showScreen("screen-lang");
    };
  }

  // Gumb "Obveze"
  if (els.btnTasks) {
    els.btnTasks.onclick = () => {
      showScreen("screen-tasks");
    };
  }

  // Gumb "←" iz obveza
  if (els.backTasks) {
    els.backTasks.onclick = () => showScreen("screen-menu");
  }

  // Ostali gumbi (bez funkcionalnosti dok ne implementiraš tasks)
  if (els.saveTask) {
    els.saveTask.onclick = () => {
      alert("Funkcionalnost 'Obveze' još nije implementirana.");
    };
  }

  if (els.btnByDay) {
    els.btnByDay.onclick = () => {
      alert("Pregled po danima još nije implementiran.");
    };
  }

  if (els.closeDayPopup) {
    els.closeDayPopup.onclick = () => {
      els.dayPopup?.classList.remove("active");
    };
  }
});