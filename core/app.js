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

  const platform = {
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent)
  };

  const tasksCtrl = createTasksController({ T, AppState, platform, els });

  // ✅ OMOGUĆI BRISANJE IZ POPUPA
  window.popupDeleteTask = tasksCtrl.deleteTask;

  tasksCtrl.load();
  tasksCtrl.applyLangToTasksUI();

  showScreen("screen-lang");

  // IZBOR JEZIKA
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

  if (els.backMenu) {
    els.backMenu.onclick = () => {
      document.body.className = "home";
      showScreen("screen-lang");
    };
  }

  if (els.btnTasks) {
    els.btnTasks.onclick = () => showScreen("screen-tasks");
  }

  if (els.backTasks) {
    els.backTasks.onclick = () => showScreen("screen-menu");
  }

  if (els.saveTask) {
    els.saveTask.onclick = () => tasksCtrl.onSaveTask();
  }

  // POPUP: PRIKAZ OBVEZA PO DANU
  if (els.btnByDay) {
    els.btnByDay.onclick = () => {
      if (!els.dayPopup) return;

      const today = new Date().toISOString().split('T')[0];
      els.popupDate.value = today;

      els.dayPopup.classList.add("active");
      tasksCtrl.renderPopup(today);
    };
  }

  // ZATVORI POPUP
  if (els.closeDayPopup) {
    els.closeDayPopup.onclick = () => {
      if (els.dayPopup) els.dayPopup.classList.remove("active");
    };
  }

  // PROMJENA DATUMA U POPUPU
  if (els.popupDate) {
    els.popupDate.onchange = (e) => {
      tasksCtrl.renderPopup(e.target.value);
    };
  }
});