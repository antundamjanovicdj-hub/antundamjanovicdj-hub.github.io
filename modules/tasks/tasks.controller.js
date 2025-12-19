// modules/tasks/tasks.controller.js
import { loadTasks, saveTasks } from "./tasks.state.js";
import { renderTasks } from "./tasks.ui.js";
import { exportToCalendar } from "./tasks.calendar.js";
import { renderPopupTasks } from "./tasks.popup.js";

const SMART_REMINDERS = {
  health: 1440,   // 1 dan
  finance: 1440,  // 1 dan
  family: 60,     // 1 sat
  personal: 30    // 30 min
};

export function createTasksController({ T, AppState, platform, els }) {
  let tasks = [];
  let editTaskId = null;
  let userTouchedReminder = false;

  /* ================= LOAD ================= */

  function load() {
    tasks = loadTasks().map(t => ({
      ...t,
      // NORMALIZACIJA: bez remindera = nema kalendara
      addToCalendar: t.addToCalendar === true && t.reminder > 0
    }));
    render();
  }

  /* ================= RENDER ================= */

  function render() {
    renderTasks({
      tasks,
      taskListEl: els.taskList
    });
  }

  function renderPopupIfOpen() {
    if (els.dayPopup && els.dayPopup.classList.contains("active")) {
      renderPopupTasks({
        date: els.popupDate.value,
        tasks,
        popupTasksEl: els.popupTasks,
        T,
        lang: AppState.lang
      });
    }
  }

  /* ================= SMART REMINDER ================= */

  function bindSmartReminder() {
    if (!els.taskReminder || !els.taskCategory) return;

    els.taskReminder.addEventListener("change", () => {
      userTouchedReminder = true;
      if (els.reminderHint) {
        els.reminderHint.classList.add("hidden");
      }
    });

    els.taskCategory.addEventListener("change", () => {
      const suggested = SMART_REMINDERS[els.taskCategory.value];

      if (!userTouchedReminder && suggested) {
        els.taskReminder.value = String(suggested);
        if (els.reminderHint) {
          els.reminderHint.textContent = T[AppState.lang].smartHint || "";
          els.reminderHint.classList.remove("hidden");
        }
      }
    });
  }

  /* ================= SAVE ================= */

  function onSaveTask() {
    const reminder = +els.taskReminder.value;

    const data = {
      id: editTaskId || Date.now(),
      title: els.taskTitle.value,
      note: els.taskNote.value,
      cat: els.taskCategory.value,
      date: els.taskDate.value,
      time: els.taskTime.value,
      reminder,
      addToCalendar: els.addToCalendar.checked && reminder > 0,
      status: "active",
      seq: Date.now()
    };

    if (editTaskId) {
      tasks = tasks.map(t => (t.id === editTaskId ? data : t));
      editTaskId = null;
    } else {
      tasks.push(data);
    }

    saveTasks(tasks);

    // 👉 EXPORT U KALENDAR SAMO OVDJE
    if (data.addToCalendar && data.date && data.time) {
      exportToCalendar({
        task: data,
        lang: AppState.lang,
        T,
        platform,
        cancel: false
      });
      if (els.calendarInfo) {
        els.calendarInfo.textContent = T[AppState.lang].calendarAdded || "";
      }
    } else if (els.calendarInfo) {
      els.calendarInfo.textContent = "";
    }

    // reset forme
    els.taskTitle.value = "";
    els.taskNote.value = "";
    els.taskDate.value = "";
    els.taskTime.value = "";
    els.taskReminder.value = "0";
    els.addToCalendar.checked = true;
    userTouchedReminder = false;
    if (els.reminderHint) {
      els.reminderHint.classList.add("hidden");
    }

    render();
    renderPopupIfOpen();
  }

  /* ================= STATUS CHANGE ================= */

  function updateStatus(id, status) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    const updated = {
      ...t,
      status,
      seq: Date.now()
    };

    tasks = tasks.map(x => (x.id === id ? updated : x));
    saveTasks(tasks);

    // 👉 OTKAZIVANJE KALENDARA – SAMO AKO JE STVARNO BIO DODAN
    if (updated.addToCalendar === true) {
      const shouldCancel =
        platform.isIOS ||
        confirm(
          T[AppState.lang].calendarRemoveConfirm ||
          "Želiš li ukloniti ovu obvezu iz kalendara?"
        );

      if (shouldCancel) {
        exportToCalendar({
          task: updated,
          lang: AppState.lang,
          T,
          platform,
          cancel: true
        });
      }
    }

    render();
    renderPopupIfOpen();
  }

  /* ================= EDIT / DELETE ================= */

  function editTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    editTaskId = id;
    userTouchedReminder = true;

    els.taskTitle.value = t.title;
    els.taskNote.value = t.note;
    els.taskCategory.value = t.cat;
    els.taskDate.value = t.date;
    els.taskTime.value = t.time;
    els.taskReminder.value = String(t.reminder || 0);
    els.addToCalendar.checked = t.addToCalendar === true;

    if (els.reminderHint) {
      els.reminderHint.classList.add("hidden");
    }
  }

  function popupDeleteTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;

  const ok = confirm(
    T[AppState.lang].popupDeleteConfirm || "Obrisati ovu obvezu?"
  );
  if (!ok) return;

  tasks = tasks.filter(x => x.id !== id);
  saveTasks(tasks);

  // ako je bio u kalendaru → pametno otkaži
  if (t.addToCalendar === true) {
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

    if (els.reminderHint) {
      els.reminderHint.classList.add("hidden");
    }

    renderPopupIfOpen();
  }

  bindSmartReminder();

  return {
  load,
  onSaveTask,
  applyLangToTasksUI,
  renderPopup,
  updateStatus,
  editTask,
  deleteTask,
  popupDeleteTask
};
