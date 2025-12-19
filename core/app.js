// core/app.js
import { AppState } from "./state.js";
import { getPlatformFlags } from "./platform.js";
import { showScreen } from "./ui.js";
import { createTasksController } from "../modules/tasks/tasks.controller.js";
import { openDayPopup, closeDayPopup } from "../modules/tasks/tasks.popup.js";

const T = window.I18N || {};

const $ = (id) => document.getElementById(id);

const els = {
  // language / navigation
  backMenu: $("backMenu"),
  btnTasks: $("btnTasks"),
  backTasks: $("backTasks"),
  btnByDay: $("btnByDay"),

  // task form labels
  tTitleL: $("tTitleL"),
  tNoteL: $("tNoteL"),
  tCatL: $("tCatL"),
  tDateL: $("tDateL"),
  tTimeL: $("tTimeL"),
  tRemL: $("tRemL"),

  // task form inputs
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

  // popup
  dayPopup: $("dayPopup"),
  popupTitle: $("popupTitle"),
  closeDayPopup: $("closeDayPopup"),
  popupDateLabel: $("popupDateLabel"),
  popupDate: $("popupDate"),
  popupTasks: $("popupTasks"),

  // reminder hint (može biti null)
  reminderHint: $("reminderHint")
};

const platform = getPlatformFlags();

const tasksCtrl = createTasksController({
  T,
  AppState,
  platform,
  els
});

/* ===== LANGUAGE ===== */
document.querySelectorAll("[data-lang]").forEach(btn => {
  btn.addEventListener("click", () => {
    AppState.lang = btn.dataset.lang;
    tasksCtrl.applyLangToTasksUI();
    document.body.className = "static";
    showScreen("screen-menu");
  });
});

/* ===== NAVIGATION ===== */
if (els.backMenu) {
  els.backMenu.onclick = () => {
    document.body.className = "home";
    showScreen("screen-lang");
  };
}

if (els.btnTasks) {
  els.btnTasks.onclick = () => {
    tasksCtrl.load();
    showScreen("screen-tasks");
  };
}

if (els.backTasks) {
  els.backTasks.onclick = () => {
    showScreen("screen-menu");
  };
}

/* ===== SAVE ===== */
if (els.saveTask) {
  els.saveTask.onclick = tasksCtrl.onSaveTask;
}

/* ===== POPUP ===== */
if (els.btnByDay) {
  els.btnByDay.onclick = () =>
    openDayPopup({
      loadTasksFn: tasksCtrl.load,
      popupDateEl: els.popupDate,
      renderPopupTasksFn: (date) => tasksCtrl.renderPopup(date),
      dayPopupEl: els.dayPopup
    });
}

if (els.closeDayPopup) {
  els.closeDayPopup.onclick = () =>
    closeDayPopup({ dayPopupEl: els.dayPopup });
}

if (els.dayPopup) {
  els.dayPopup.addEventListener("click", (e) => {
    if (e.target === els.dayPopup) {
      closeDayPopup({ dayPopupEl: els.dayPopup });
    }
  });
}

if (els.popupDate) {
  els.popupDate.onchange = () =>
    tasksCtrl.renderPopup(els.popupDate.value);
}

/* ===== GLOBALS (inline buttons) ===== */
window.updateStatus = tasksCtrl.updateStatus;
window.editTask = tasksCtrl.editTask;
window.deleteTask = tasksCtrl.deleteTask;

/* ===== START ===== */
window.onload = () => {
  tasksCtrl.applyLangToTasksUI();
};
