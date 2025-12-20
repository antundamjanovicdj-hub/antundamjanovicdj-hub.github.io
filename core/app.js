// core/app.js
import { AppState } from "./state.js";
import { getPlatformFlags } from "./platform.js";
import { showScreen } from "./ui.js";
import { createTasksController } from "../modules/tasks/tasks.controller.js";
import { openDayPopup, closeDayPopup } from "../modules/tasks/tasks.popup.js";

document.addEventListener("DOMContentLoaded", () => {
  const T = window.I18N;
  const $ = (id) => document.getElementById(id);

  /* ===== ELEMENTI ===== */
  const els = {
    // navigation
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

    // smart reminder hint
    reminderHint: $("reminderHint")
  };

  /* ===== PLATFORM ===== */
  const platform = getPlatformFlags();

  /* ===== INIT STATE ===== */
  showScreen("screen-lang");

  let tasksCtrl = null;

  /* ===== LANGUAGE SELECTION ===== */
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      AppState.lang = btn.dataset.lang;

      if (!tasksCtrl) {
        tasksCtrl = createTasksController({
          T,
          AppState,
          platform,
          els
        });

        // globali za inline onclick gumbe
        window.updateStatus = tasksCtrl.updateStatus;
        window.editTask = tasksCtrl.editTask;
        window.deleteTask = tasksCtrl.deleteTask;
        window.popupDeleteTask = tasksCtrl.popupDeleteTask;
      }

      tasksCtrl.applyLangToTasksUI();
     const menuText = els.btnTasks.querySelector(".menu-text");
if (menuText) {
  menuText.textContent = T[AppState.lang].tasks;
}
      document.body.className = "static";
      showScreen("screen-menu");
    });
  });

  /* ===== NAVIGATION ===== */
  els.backMenu.onclick = () => {
    document.body.className = "home";
    showScreen("screen-lang");
  };

  els.btnTasks.onclick = () => {
    tasksCtrl.load();
    showScreen("screen-tasks");
  };

  els.backTasks.onclick = () => {
    showScreen("screen-menu");
  };

  /* ===== SAVE TASK ===== */
  els.saveTask.onclick = () => {
    tasksCtrl.onSaveTask();
  };

  /* ===== POPUP: PREGLED PO DANIMA ===== */
  els.btnByDay.onclick = () => {
    openDayPopup({
      loadTasksFn: tasksCtrl.load,
      popupDateEl: els.popupDate,
      renderPopupTasksFn: (date) => tasksCtrl.renderPopup(date),
      dayPopupEl: els.dayPopup
    });
  };

  els.closeDayPopup.onclick = () => {
    closeDayPopup({ dayPopupEl: els.dayPopup });
  };

  els.dayPopup.addEventListener("click", (e) => {
    if (e.target === els.dayPopup) {
      closeDayPopup({ dayPopupEl: els.dayPopup });
    }
  });

  els.popupDate.onchange = () => {
    tasksCtrl.renderPopup(els.popupDate.value);
  };
});
