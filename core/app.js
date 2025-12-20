// core/app.js
import { showScreen } from "./ui.js";
import { createTasksController } from "../modules/tasks/tasks.controller.js";
import { openDayPopup, closeDayPopup } from "../modules/tasks/tasks.popup.js";

// Fallback AppState ako state.js nije učitan ili ne postoji
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
  // Učitaj T iz globalnog I18N (pretpostavka da i18n.js postavlja window.I18N)
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

  // Platform flags — fallback ako platform.js nije dostupan
  const getPlatformFlags = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    return { isIOS, isAndroid };
  };
  const platform = getPlatformFlags();

  let tasksCtrl = null;

  // Pokreni sa zaslonom za jezik
  showScreen("screen-lang");

  // ✅ ROBUSTAN JEZIČNI HANDLER — koristi event delegation
  document.getElementById("screen-lang").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;

    const lang = btn.dataset.lang;
    AppState.lang = lang;

    // Inicijaliziraj kontroller ako nije već inicijaliziran
    if (!tasksCtrl) {
      // Dinamički uvoz I18N za odabrani jezik
      const localizedT = T[lang] || T.hr;
      tasksCtrl = createTasksController({ T: { [lang]: localizedT }, AppState, platform, els });
      window.updateStatus = tasksCtrl.updateStatus;
      window.editTask = tasksCtrl.editTask;
      window.deleteTask = tasksCtrl.deleteTask;
      window.popupDeleteTask = tasksCtrl.popupDeleteTask;
    }

    // Ažuriraj UI
    if (els.btnTasks) {
      const menuText = els.btnTasks.querySelector(".menu-text");
      if (menuText) menuText.textContent = T[lang]?.tasks || "Tasks";
    }

    // Prijeđi na glavni izbornik
    document.body.className = "static";
    showScreen("screen-menu");
  });

  // Ostale funkcionalnosti
  if (els.backMenu) {
    els.backMenu.onclick = () => {
      document.body.className = "home";
      showScreen("screen-lang");
    };
  }

  if (els.btnTasks) {
    els.btnTasks.onclick = () => {
      if (tasksCtrl && typeof tasksCtrl.load === 'function') {
        tasksCtrl.load();
      }
      showScreen("screen-tasks");
    };
  }

  if (els.backTasks) {
    els.backTasks.onclick = () => showScreen("screen-menu");
  }

  if (els.saveTask) {
    els.saveTask.onclick = () => {
      if (tasksCtrl && typeof tasksCtrl.onSaveTask === 'function') {
        tasksCtrl.onSaveTask();
      }
    };
  }

  if (els.btnByDay) {
    els.btnByDay.onclick = () => {
      openDayPopup({
        loadTasksFn: () => tasksCtrl?.load?.(),
        popupDateEl: els.popupDate,
        renderPopupTasksFn: (d) => tasksCtrl?.renderPopup?.(d),
        dayPopupEl: els.dayPopup
      });
    };
  }

  if (els.closeDayPopup) {
    els.closeDayPopup.onclick = () => closeDayPopup({ dayPopupEl: els.dayPopup });
  }

  if (els.popupDate) {
    els.popupDate.onchange = () => {
      if (tasksCtrl && tasksCtrl.renderPopup) {
        tasksCtrl.renderPopup(els.popupDate.value);
      }
    };
  }
});
