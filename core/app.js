// core/app.js
let AppState = window.AppState || {
  set lang(val) {
    localStorage.setItem('userLang', val);
    this._lang = val;
  },
  get lang() {
    return this._lang || localStorage.getItem('userLang') || 'hr';
  }
};

AppState._lang = localStorage.getItem('userLang');
window.AppState = AppState;

let tasksCtrl = null;

document.addEventListener("DOMContentLoaded", () => {
  const T = window.I18N;
  if (!T) {
    console.error("I18N not loaded!");
    return;
  }

  const showScreen = window.showScreen;
  const createTasksController = window.createTasksController;

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

  tasksCtrl = createTasksController({ T, AppState, platform, els });

  window.popupDeleteTask = tasksCtrl.deleteTask;
  window.handleTaskAction = tasksCtrl.handleTaskAction;

  // ✅ PROVJERI: je li jezik već odabran?
  const savedLang = localStorage.getItem('userLang');
  if (savedLang) {
    // Postavi jezik globalno
    AppState.lang = savedLang;
    document.documentElement.setAttribute('lang', savedLang);
    // Prikaži MENU (ne lang screen)
    showScreen('screen-menu');
  } else {
    // Prikaži izbornik jezika
    showScreen('screen-lang');
  }

  // ===== MENU → TASKS =====
  if (els.btnTasks) {
    els.btnTasks.addEventListener("click", () => {
      tasksCtrl.enableRender();
      tasksCtrl.load();
      if (els.taskList) els.taskList.style.display = "block";
      showScreen('screen-tasks');
    });
  }

  // ===== TASKS ← MENU =====
  if (els.backTasks) {
    els.backTasks.addEventListener("click", () => {
      if (els.taskList) els.taskList.style.display = "none";
      showScreen("screen-menu");
    });
  }

  // ===== MENU ← JEZIK =====
  if (els.backMenu) {
    els.backMenu.addEventListener("click", () => {
      showScreen("screen-lang");
    });
  }

  // ===== SAVE =====
  if (els.saveTask) {
    els.saveTask.addEventListener("click", () => {
      tasksCtrl.onSaveTask();
    });
  }

  // ===== BY DAY =====
  if (els.btnByDay) {
    els.btnByDay.addEventListener("click", () => {
      const today = new Date().toISOString().split("T")[0];
      els.popupDate.value = today;
      els.dayPopup.classList.add("active");
      tasksCtrl.renderPopup(today);
    });
  }

  if (els.closeDayPopup) {
    els.closeDayPopup.addEventListener("click", () => {
      els.dayPopup.classList.remove("active");
    });
  }

  if (els.popupDate) {
    els.popupDate.addEventListener("change", e => {
      tasksCtrl.renderPopup(e.target.value);
    });
  }
});