// modules/tasks/tasks.controller.js
import { loadTasks, saveTasks } from "./tasks.state.js";
import { renderTasks } from "./tasks.ui.js";
import { exportToCalendar } from "./tasks.calendar.js";
import { renderPopupTasks } from "./tasks.popup.js";

// PAMETNI REMINDERI (u minutama)
const SMART_REMINDERS = {
  health: 1440,    // 1 dan
  finance: 1440,   // 1 dan
  family: 60,      // 1 sat
  personal: 30     // 30 min
};

export function createTasksController({ T, AppState, platform, els }) {
  let tasks = [];
  let editTaskId = null;
  let userTouchedReminder = false;

  /* ================= SMART REMINDER + HINT ================= */

  function showHint(text) {
    els.reminderHint.textContent = text;
    els.reminderHint.classList.remove("hidden");
  }

  function hideHint() {
    els.reminderHint.classList.add("hidden");
  }

  function bindSmartReminder() {
    els.taskReminder.addEventListener("change", () => {
      userTouchedReminder = true;
      hideHint();
    });

    els.taskCategory.addEventListener("change", () => {
      const cat = els.taskCategory.value;
      const suggested = SMART_REMINDERS[cat];

      if (!userTouchedReminder && suggested) {
        els.taskReminder.value = String(suggested);
        showHint(
          T[AppState.lang].smartHint
        );
      }
    });
  }

  /* ================= LOAD / RENDER ================= */

  function load() {
    tasks = loadTasks();
    render();
  }

  function render() {
    renderTasks({ tasks, taskListEl: els.taskList });
  }

  function renderPopupIfOpen() {
    if (els.dayPopup.classList.contains("active")) {
      renderPopupTasks({
        date: els.popupDate.value,
        tasks,
        popupTasksEl: els.popupTasks,
        T,
        lang: AppState.lang
      });
    }
  }

  /* ================= SAVE ================= */

  function onSaveTask() {
    const lang = AppState.lang;

    const data = {
      id: editTaskId || Date.now(),
      title: els.taskTitle.value,
      note: els.taskNote.value,
      cat: els.taskCategory.value,
      date: els.taskDate.value,
      time: els.taskTime.value,
      reminder: +els.taskReminder.value,
      status: "active",
      seq: Date.now()
    };

    if (editTaskId) {
      tasks = tasks.map(t => t.id === editTaskId ? data : t);
      editTaskId = null;
    } else {
      tasks.push(data);
    }

    saveTasks(tasks);

    if (els.addToCalendar.checked) {
      exportToCalendar({ task: data, lang, T, platform });
      els.calendarInfo.textContent = T[lang].calendarAdded;
    } else {
      els.calendarInfo.textContent = "";
    }

    els.taskTitle.value = "";
    els.taskNote.value = "";
    els.taskDate.value = "";
    els.taskTime.value = "";
    els.taskReminder.value = "0";
    els.addToCalendar.checked = true;
    userTouchedReminder = false;
    hideHint();

    render();
    renderPopupIfOpen();
  }

  /* ================= STATUS / EDIT / DELETE ================= */

 function updateStatus(id, status) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;

  const updated = {
    ...t,
    status,
    seq: Date.now()
  };

  tasks = tasks.map(x => x.id === id ? updated : x);
  saveTasks(tasks);

  // 👉 ANDROID: pitaj korisnika
  const shouldCancelCalendar =
    platform.isIOS
      ? true
      : confirm(
          T[AppState.lang].calendarRemoveConfirm ||
          "Želiš li ukloniti ovu obvezu iz kalendara?"
        );

  if (shouldCancelCalendar && t.date && t.time) {
    exportToCalendar({
      task: updated,
      lang: AppState.lang,
      T,
      platform,
      cancel: true
    });
  }

  render();
  renderPopupIfOpen();
}


  function editTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    editTaskId = id;
    userTouchedReminder = true;
    hideHint();

    els.taskTitle.value = t.title;
    els.taskNote.value = t.note;
    els.taskCategory.value = t.cat;
    els.taskDate.value = t.date;
    els.taskTime.value = t.time;
    els.taskReminder.value = t.reminder || "0";
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    render();
    renderPopupIfOpen();
  }

  function renderPopup(date) {
    renderPopupTasks({
      date,
      tasks,
      popupTasksEl: els.popupTasks,
      T,
      lang: AppState.lang
    });
  }

  /* ================= LANG ================= */

  function applyLangToTasksUI() {
    const lang = AppState.lang;

    els.btnTasks.textContent = T[lang].tasks;
    els.tTitleL.textContent = T[lang].tTitle;
    els.tNoteL.textContent = T[lang].tNote;
    els.tCatL.textContent = T[lang].tCat;
    els.tDateL.textContent = T[lang].tDate;
    els.tTimeL.textContent = T[lang].tTime;
    els.tRemL.textContent = T[lang].tRem;
    els.saveTask.textContent = T[lang].tSave;
    els.btnByDay.textContent = T[lang].byDay;
    els.calendarLabel.textContent = T[lang].calendarToggle;

    els.popupTitle.textContent = T[lang].popupTitle;
    els.popupDateLabel.textContent = T[lang].popupDate;

    els.taskCategory.innerHTML = "";
    for (const k in T[lang].cats) {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = T[lang].cats[k];
      els.taskCategory.appendChild(o);
    }

    hideHint();
    renderPopupIfOpen();
  }

  bindSmartReminder();
function popupDeleteTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;

  const ok = confirm(
    T[AppState.lang].popupDeleteConfirm ||
    "Obrisati ovu obvezu?"
  );

  if (!ok) return;

  // ukloni iz liste
  tasks = tasks.filter(x => x.id !== id);
  saveTasks(tasks);

  // pametno uklanjanje iz kalendara (ako postoji)
  if (t.date && t.time) {
    exportToCalendar({
      task: { ...t, seq: Date.now() },
      lang: AppState.lang,
      T,
      platform,
      cancel: true
    });
  }

  render();
  renderPopupIfOpen();
}

  return {
    load,
    onSaveTask,
    applyLangToTasksUI,
    renderPopup,
    updateStatus,
    editTask,
    deleteTask
  };
}
