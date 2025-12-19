// modules/tasks/tasks.controller.js
import { loadTasks, saveTasks } from "./tasks.state.js";
import { renderTasks } from "./tasks.ui.js";
import { exportToCalendar } from "./tasks.calendar.js";
import { renderPopupTasks } from "./tasks.popup.js";

export function createTasksController({ T, AppState, platform, els }) {
  let tasks = [];
  let editTaskId = null;

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
        lang: AppState.lang,
      });
    }
  }

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

    renderPopupIfOpen();
  }

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
      seq: Date.now(),
    };

    if (editTaskId) {
      tasks = tasks.map(t => (t.id === editTaskId ? data : t));
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

    render();
    renderPopupIfOpen();
  }

  // === global funkcije zbog inline onclick u HTML-u ===
  function updateStatus(id, status) {
    tasks = tasks.map(t => (t.id === id ? { ...t, status } : t));
    saveTasks(tasks);
    render();
    renderPopupIfOpen();
  }

  function editTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    editTaskId = id;
    els.taskTitle.value = t.title;
    els.taskNote.value = t.note;
    els.taskCategory.value = t.cat;
    els.taskDate.value = t.date;
    els.taskTime.value = t.time;
    els.taskReminder.value = t.reminder;
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    render();
    renderPopupIfOpen();
  }

  function renderPopup(date) {
    renderPopupTasks({ date, tasks, popupTasksEl: els.popupTasks, T, lang: AppState.lang });
  }

  return {
    load,
    render,
    applyLangToTasksUI,
    onSaveTask,
    renderPopup,
    // expose for window
    updateStatus,
    editTask,
    deleteTask,
    // tiny getters
    getTasks: () => tasks,
  };
}

