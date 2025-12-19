// core/app.js
import { AppState } from "./state.js";
import { getPlatformFlags } from "./platform.js";
import { showScreen } from "./ui.js";
import { createTasksController } from "../modules/tasks/tasks.controller.js";
import { openDayPopup, closeDayPopup } from "../modules/tasks/tasks.popup.js";

const T = window.I18N || {};
const $ = (id) => document.getElementById(id);

let tasksCtrl = null;

/* ===== ELEMENTI ===== */
const els = {
  // navigation / language
  backMenu: $("backMenu"),
  btnTasks: $("btnTasks"),
  backTasks: $("backTasks"),
  btnByDay: $("btnByDay"),

  // labels
  tTitleL: $("tTitleL"),
  tNoteL: $("tNoteL"),
  tCatL: $("tCatL"),
  tDateL: $("tDateL"),
  tTimeL: $("tTimeL"),
  tRemL: $("tRemL"),

  // inputs
  taskTitle: $("taskTitle"),
  taskNote: $("taskNote"),
  taskCategory: $("taskCategory"),
  taskDate: $("taskDate"),
  taskTime: $("taskTime"),
  taskReminder: $("taskReminder"),
  addToCalendar: $("addToCalendar"),

  // buttons / lists
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

  // smart reminder hint (optional)
  reminderHint: $("reminderHint")
};

const platform = getPlatformFlags();

/* ===== LANGUAGE SELECTION (INIT APP) ===== */
document.querySelectorAll("[data-lang]").forEach(btn => {
  btn.addEventListener("click", () => {
    AppState.lang = btn.dataset.lang;

    // INIT CONTROLLER TEK NAKON ODABIRA JEZIKA
    if (!tasksCtrl) {
      tasksCtrl = createTasksController({
        T,
        AppState,
        platform,
        els
      });

      // globali za inline gumbe
      window.updateStatus = tasksCtrl.updateStatus;
      window.editTask = tasksCtrl.editTask;
      window.deleteTask = tasksCtrl.deleteTask;
      window.popupDeleteTask = tasksCtrl.popupDeleteTask;
    }

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
    if (tasksCtrl) {
      tasksCtrl.load();
      showScreen("screen-tasks");
    }
  };
}

if (els.backTasks) {
  els.backTasks.onclick = () => {
    showScreen("screen-menu");
  };
}

/* ===== SAVE TASK ===== */
if (els.saveTask) {
  els.saveTask.onclick = () => {
    if (tasksCtrl) {
      tasksCtrl.onSaveTask();
    }
  };
}

/* ===== POPUP (PREGLED PO DANIMA) ===== */
if (els.btnByDay) {
  els.btnByDay.onclick = () => {
    if (!tasksCtrl) return;

    openDayPopup({
      loadTasksFn: tasksCtrl.load,
      popupDateEl: els.popupDate,
      renderPopupTasksFn: (date) => tasksCtrl.renderPopup(date),
      dayPopupEl: els.dayPopup
    });
  };
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
  els.popupDate.onchange = () => {
    if (tasksCtrl) {
      tasksCtrl.renderPopup(els.popupDate.value);
    }
  };
}

/* ===== START ===== */
window.onload = () => {};
