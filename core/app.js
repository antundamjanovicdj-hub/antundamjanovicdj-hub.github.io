// core/app.js
import { AppState } from "./state.js";
import { getPlatformFlags } from "./platform.js";
import { showScreen } from "./ui.js";
import { createTasksController } from "../modules/tasks/tasks.controller.js";
import { openDayPopup, closeDayPopup } from "../modules/tasks/tasks.popup.js";

const T = window.I18N; // ostaje kako već imaš

const els = {
 reminderHint: document.getElementById("reminderHint") || null,
  // screens/buttons
  backMenu: document.getElementById("backMenu"),
  btnTasks: document.getElementById("btnTasks"),
  backTasks: document.getElementById("backTasks"),
  btnByDay: document.getElementById("btnByDay"),

  // tasks form
  tTitleL: document.getElementById("tTitleL"),
  tNoteL: document.getElementById("tNoteL"),
  tCatL: document.getElementById("tCatL"),
  tDateL: document.getElementById("tDateL"),
  tTimeL: document.getElementById("tTimeL"),
  tRemL: document.getElementById("tRemL"),

  taskTitle: document.getElementById("taskTitle"),
  taskNote: document.getElementById("taskNote"),
  taskCategory: document.getElementById("taskCategory"),
  taskDate: document.getElementById("taskDate"),
  taskTime: document.getElementById("taskTime"),
  taskReminder: document.getElementById("taskReminder"),
  addToCalendar: document.getElementById("addToCalendar"),
  calendarLabel: document.getElementById("calendarLabel"),
  calendarInfo: document.getElementById("calendarInfo"),
  saveTask: document.getElementById("saveTask"),
  taskList: document.getElementById("taskList"),

  // popup
  dayPopup: document.getElementById("dayPopup"),
  popupTitle: document.getElementById("popupTitle"),
  closeDayPopup: document.getElementById("closeDayPopup"),
  popupDateLabel: document.getElementById("popupDateLabel"),
  popupDate: document.getElementById("popupDate"),
  popupTasks: document.getElementById("popupTasks"),
};

const platform = getPlatformFlags();

const tasksCtrl = createTasksController({ T, AppState, platform, els });

// language buttons
document.querySelectorAll("[data-lang]").forEach(b => {
  b.onclick = () => {
    AppState.lang = b.dataset.lang;
    tasksCtrl.applyLangToTasksUI();

    document.body.className = "static";
    showScreen("screen-menu");
  };
});

// navigation
els.backMenu.onclick = () => {
  document.body.className = "home";
  showScreen("screen-lang");
};

els.btnTasks.onclick = () => {
  tasksCtrl.load();
  showScreen("screen-tasks");
};

els.backTasks.onclick = () => showScreen("screen-menu");

// save
els.saveTask.onclick = tasksCtrl.onSaveTask;

// popup open/close
els.btnByDay.onclick = () =>
  openDayPopup({
    loadTasksFn: tasksCtrl.load,
    popupDateEl: els.popupDate,
    renderPopupTasksFn: (date) => tasksCtrl.renderPopup(date),
    dayPopupEl: els.dayPopup,
  });

els.closeDayPopup.onclick = () => closeDayPopup({ dayPopupEl: els.dayPopup });

els.dayPopup.addEventListener("click", (e) => {
  if (e.target === els.dayPopup) closeDayPopup({ dayPopupEl: els.dayPopup });
});

els.popupDate.onchange = () => tasksCtrl.renderPopup(els.popupDate.value);

// === ključ: zadržavamo globalne funkcije zbog inline onclick ===
window.updateStatus = tasksCtrl.updateStatus;
window.editTask = tasksCtrl.editTask;
window.deleteTask = tasksCtrl.deleteTask;

// initial lang apply
window.onload = () => {
  tasksCtrl.applyLangToTasksUI();
};

