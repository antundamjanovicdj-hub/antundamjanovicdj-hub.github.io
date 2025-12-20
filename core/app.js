// core/app.js
import { I18N } from "./i18n.js"; // ✅ UVOZ IZ MODULA
import { showScreen } from "./ui.js";
import { createTasksController } from "../modules/tasks/tasks.controller.js";
import { openDayPopup, closeDayPopup } from "../modules/tasks/tasks.popup.js";

// Fallback AppState
let AppState = window.AppState || {
  lang: 'hr',
  set lang(val) {
    localStorage.setItem('userLang', val);
    window.AppState = window.AppState || {};
    window.AppState.lang = val;
  },
  get lang() {
    return localStorage.getItem('userLang') || 'hr';
  }
};
window.AppState = AppState;

document.addEventListener("DOMContentLoaded", () => {
  const T = I18N; // ✅ KORISTI UVEZENU VARIJABLU
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

  const getPlatformFlags = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    return { isIOS, isAndroid };
  };
  const platform = getPlatformFlags();

  let tasksCtrl = null;

  showScreen("screen-lang");

  // ✅ EVENT DELEGATION
  document.getElementById("screen-lang").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;

    const lang = btn.dataset.lang;
    AppState.lang = lang;

    if (!tasksCtrl) {
      const localizedT = T[lang] || T.hr;
      tasksCtrl = createTasksController({ T: { [lang]: localizedT }, AppState, platform, els });
      window.updateStatus = tasksCtrl.updateStatus;
      window.editTask = tasksCtrl.editTask;
      window.deleteTask = tasksCtrl.deleteTask;
      window.popupDeleteTask = tasksCtrl.popupDeleteTask;
    }

    if (els.btnTasks) {
      const menuText = els.btnTasks.querySelector(".menu-text");
      if (menuText) menuText.textContent = T[lang]?.tasks || "Tasks";
    }

    document.body.className = "static";
    showScreen("screen-menu");
  });

  // Ostali handleri...
  if (els.backMenu) els.backMenu.onclick = () => {
    document.body.className = "home";
    showScreen("screen-lang");
  };

  if (els.btnTasks) els.btnTasks.onclick = () => {
    if (tasksCtrl?.load) tasksCtrl.load();
    showScreen("screen-tasks");
  };

  if (els.backTasks) els.backTasks.onclick = () => showScreen("screen-menu");

  if (els.saveTask) els.saveTask.onclick = () => {
    if (tasksCtrl?.onSaveTask) tasksCtrl.onSaveTask();
  };

  if (els.btnByDay) els.btnByDay.onclick = () => {
    openDayPopup({
      loadTasksFn: () => tasksCtrl?.load?.(),
      popupDateEl: els.popupDate,
      renderPopupTasksFn: (d) => tasksCtrl?.renderPopup?.(d),
      dayPopupEl: els.dayPopup
    });
  };

  if (els.closeDayPopup) els.closeDayPopup.onclick = () => closeDayPopup({ dayPopupEl: els.dayPopup });

  if (els.popupDate) els.popupDate.onchange = () => {
    if (tasksCtrl?.renderPopup) tasksCtrl.renderPopup(els.popupDate.value);
  };
});
