// core/app.js
import { AppState } from "./state.js";
import { getPlatformFlags } from "./platform.js";
import { showScreen } from "./ui.js";
import { createTasksController } from "../modules/tasks/tasks.controller.js";
import { openDayPopup, closeDayPopup } from "../modules/tasks/tasks.popup.js";

document.addEventListener("DOMContentLoaded", () => {
  const T = window.I18N;
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

  const platform = getPlatformFlags();
  let tasksCtrl = null;

  showScreen("screen-lang");

  // ✅ JEDINI JEZIČNI HANDLER
  document.querySelectorAll("#screen-lang [data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      AppState.lang = btn.dataset.lang;

      if (!tasksCtrl) {
        tasksCtrl = createTasksController({ T, AppState, platform, els });
        window.updateStatus = tasksCtrl.updateStatus;
        window.editTask = tasksCtrl.editTask;
        window.deleteTask = tasksCtrl.deleteTask;
        window.popupDeleteTask = tasksCtrl.popupDeleteTask;
      }

      tasksCtrl.applyLangToTasksUI();
      els.btnTasks.querySelector(".menu-text").textContent =
        T[AppState.lang].tasks;

      document.body.className = "static";
      showScreen("screen-menu");
    });
  });

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

  els.saveTask.onclick = () => {
    tasksCtrl.onSaveTask();
  };

  els.btnByDay.onclick = () => {
    openDayPopup({
      loadTasksFn: tasksCtrl.load,
      popupDateEl: els.popupDate,
      renderPopupTasksFn: (d) => tasksCtrl.renderPopup(d),
      dayPopupEl: els.dayPopup
    });
  };

  els.closeDayPopup.onclick = () => {
    closeDayPopup({ dayPopupEl: els.dayPopup });
  };

  els.popupDate.onchange = () => {
    tasksCtrl.renderPopup(els.popupDate.value);
  };
});
