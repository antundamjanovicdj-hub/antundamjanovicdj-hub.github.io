// core/app.js
import { showScreen } from "./ui.js";
import { createTasksController } from "../modules/tasks/tasks.controller.js";

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

AppState._lang = localStorage.getItem('userLang') || 'hr';
window.AppState = AppState;

document.addEventListener("DOMContentLoaded", () => {
  const T = window.I18N;
  if (!T) {
    console.error("I18N not loaded!");
    return;
  }

  const $ = (id) => document.getElementById(id);

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

  // Platform detection (for calendar)
  const platform = {
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent)
  };

  // ✅ KREIRAJ KONTROLER ZA OBAVEZE
  const tasksCtrl = createTasksController({ T, AppState, platform, els });

  // Učitaj podatke i lokalizaciju
  tasksCtrl.load();
  tasksCtrl.applyLangToTasksUI();

  showScreen("screen-lang");

  // ✅ IZBOR JEZIKA
  document.getElementById("screen-lang").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;

    const lang = btn.dataset.lang;
    AppState.lang = lang;

    if (els.btnTasks) {
      const menuText = els.btnTasks.querySelector(".menu-text");
      if (menuText) menuText.textContent = T[lang]?.tasks || "Tasks";
    }

    tasksCtrl.applyLangToTasksUI();
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

  // ✅ GUMB "Obveze"
  if (els.btnTasks) {
    els.btnTasks.onclick = () => {
      showScreen("screen-tasks");
    };
  }

  // Gumb "←" iz obveza
  if (els.backTasks) {
    els.backTasks.onclick = () => showScreen("screen-menu");
  }

  // ✅ SPREMI OBAVEZU
  if (els.saveTask) {
    els.saveTask.onclick = () => tasksCtrl.onSaveTask();
  }

  // ✅ PREGLED PO DANIMA
  if (els.btnByDay) {
    els.btnByDay.onclick = () => {
      if (els.dayPopup) {
        els.dayPopup.classList.add("active");
        tasksCtrl.renderPopup(new Date().toISOString().split('T')[0]);
      }
    };
  }

  // ✅ ZATVORI POPUP
  if (els.closeDayPopup) {
    els.closeDayPopup.onclick = () => {
      if (els.dayPopup) els.dayPopup.classList.remove("active");
    };
  }

  // ✅ DATUM U POPUPU
  if (els.popupDate) {
    els.popupDate.onchange = (e) => {
      tasksCtrl.renderPopup(e.target.value);
    };
  }
});