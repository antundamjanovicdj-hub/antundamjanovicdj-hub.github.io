// core/app.js
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

  // ✅ SAMO ZA TEST — onemogući task kontroler
const tasksCtrl = createTasksController({ T, AppState, platform, els });

window.popupDeleteTask = tasksCtrl.deleteTask;
window.handleTaskAction = tasksCtrl.handleTaskAction;

// ✅ UČITAJ PODATKE SAMO JEDNOM NA POČETKU
tasksCtrl.load();
tasksCtrl.applyLangToTasksUI();

  showScreen("screen-lang");

  function onLangSelect(e) {
    console.log("Lang select triggered", e.type, e.target);
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
  }

  const langScreen = document.getElementById("screen-lang");
  langScreen.addEventListener("touchstart", onLangSelect, { passive: true });
  langScreen.addEventListener("click", onLangSelect);

  // Ostali handleri...
  if (els.backMenu) {
    const onBackMenu = () => {
      document.body.className = "home";
      showScreen("screen-lang");
    };
    els.backMenu.addEventListener("touchstart", onBackMenu, { passive: true });
    els.backMenu.addEventListener("click", onBackMenu);
  }

  if (els.btnTasks) {
    const onBtnTasks = () => showScreen("screen-tasks");
    els.btnTasks.addEventListener("touchstart", onBtnTasks, { passive: true });
    els.btnTasks.addEventListener("click", onBtnTasks);
  }

  if (els.backTasks) {
    const onBackTasks = () => showScreen("screen-menu");
    els.backTasks.addEventListener("touchstart", onBackTasks, { passive: true });
    els.backTasks.addEventListener("click", onBackTasks);
  }

  if (els.saveTask) {
    const onSave = () => tasksCtrl.onSaveTask();
    els.saveTask.addEventListener("touchstart", onSave, { passive: true });
    els.saveTask.addEventListener("click", onSave);
  }

  if (els.btnByDay) {
    const onByDay = () => {
      if (!els.dayPopup) return;
      const today = new Date().toISOString().split('T')[0];
      els.popupDate.value = today;
      els.dayPopup.classList.add("active");
      tasksCtrl.renderPopup(today);
    };
    els.btnByDay.addEventListener("touchstart", onByDay, { passive: true });
    els.btnByDay.addEventListener("click", onByDay);
  }

  const closePopup = () => {
    const popup = document.getElementById("dayPopup");
    if (popup) popup.classList.remove("active");
  };

  if (els.closeDayPopup) {
    els.closeDayPopup.addEventListener("touchstart", closePopup, { passive: true });
    els.closeDayPopup.addEventListener("click", closePopup);
  }

  document.addEventListener("touchstart", (e) => {
    const popup = document.getElementById("dayPopup");
    const btnByDay = document.getElementById("btnByDay");
    if (!popup || !popup.classList.contains("active")) return;
    if (!popup.contains(e.target) && e.target !== btnByDay) {
      closePopup();
    }
  }, { passive: true });

  if (els.popupDate) {
    els.popupDate.addEventListener("change", (e) => {
      tasksCtrl.renderPopup(e.target.value);
    });
  }
});