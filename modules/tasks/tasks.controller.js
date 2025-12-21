// modules/tasks/tasks.controller.js
function createTasksController({ T, AppState, platform, els }) {
  const { loadTasks, saveTasks } = window;
  const { renderTasks } = window;
  const { renderPopupTasks } = window;
  const { exportToCalendar } = window;

  let tasks = [];
  let editTaskId = null;
  let userTouchedReminder = false;

  const SMART_REMINDERS = {
    health: 1440,
    finance: 1440,
    family: 60,
    personal: 30
  };

  function load() {
    tasks = loadTasks().map(t => ({
      ...t,
      addToCalendar: t.addToCalendar === true && t.reminder > 0
    }));
    render();
  }

  let allowRender = true;

function render() {
  renderTasks({ tasks, taskListEl: els.taskList });
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

  function bindSmartReminder() {
    if (!els.taskReminder || !els.taskCategory) return;
    els.taskReminder.addEventListener("change", () => {
      userTouchedReminder = true;
      if (els.reminderHint) els.reminderHint.classList.add("hidden");
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

    if (data.addToCalendar && data.date && data.time) {
      exportToCalendar({ task: data, lang: AppState.lang, T, platform, cancel: false });
      if (els.calendarInfo) els.calendarInfo.textContent = T[AppState.lang].calendarAdded || "";
    } else if (els.calendarInfo) {
      els.calendarInfo.textContent = "";
    }

    els.taskTitle.value = "";
    els.taskNote.value = "";
    els.taskDate.value = "";
    els.taskTime.value = "";
    els.taskReminder.value = "0";
    els.addToCalendar.checked = true;
    userTouchedReminder = false;
    if (els.reminderHint) els.reminderHint.classList.add("hidden");

    render();
    renderPopupIfOpen();
  }

  function updateStatus(id, status) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    const updated = { ...t, status, seq: Date.now() };
    tasks = tasks.map(x => (x.id === id ? updated : x));
    saveTasks(tasks);

    if (updated.addToCalendar === true) {
      const shouldCancel = platform.isIOS || confirm(T[AppState.lang].calendarRemoveConfirm || "Ukloniti iz kalendara?");
      if (shouldCancel) {
        exportToCalendar({ task: updated, lang: AppState.lang, T, platform, cancel: true });
      }
    }

    render();
    renderPopupIfOpen();
  }

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

    if (els.reminderHint) els.reminderHint.classList.add("hidden");
  }

  function popupDeleteTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    if (!confirm(T[AppState.lang].popupDeleteConfirm || "Obrisati obvezu?")) return;

    tasks = tasks.filter(x => x.id !== id);
    saveTasks(tasks);

    if (t.addToCalendar === true) {
      exportToCalendar({ task: { ...t, seq: Date.now() }, lang: AppState.lang, T, platform, cancel: true });
    }

    render();
    renderPopupIfOpen();
  }

  function renderPopup(date) {
    renderPopupTasks({ date, tasks, popupTasksEl: els.popupTasks, T, lang: AppState.lang });
  }

  function applyLangToTasksUI() {
  const lang = AppState.lang;

  // ✅ OSIGURAJ DA SE NE POKRENE AUTOMATSKI REMINDER
  userTouchedReminder = true;

  if (els.btnTasks) {
    const menuText = els.btnTasks.querySelector(".menu-text");
    if (menuText) menuText.textContent = T[lang].tasks || "Tasks";
  }

  if (els.tTitleL) els.tTitleL.textContent = T[lang].tTitle || "";
  if (els.tNoteL) els.tNoteL.textContent = T[lang].tNote || "";
  if (els.tCatL) els.tCatL.textContent = T[lang].tCat || "";
  if (els.tDateL) els.tDateL.textContent = T[lang].tDate || "";
  if (els.tTimeL) els.tTimeL.textContent = T[lang].tTime || "";
  if (els.tRemL) els.tRemL.textContent = T[lang].tRem || "";
  if (els.saveTask) els.saveTask.textContent = T[lang].tSave || "";
  if (els.btnByDay) els.btnByDay.textContent = T[lang].byDay || "";
  if (els.calendarLabel) els.calendarLabel.textContent = T[lang].calendarToggle || "";

  if (els.popupTitle) els.popupTitle.textContent = T[lang].popupTitle || "";
  if (els.popupDateLabel) els.popupDateLabel.textContent = T[lang].popupDate || "";

  // ✅ UPDATE KATEGORIJA BEZ TRIGGERA
  if (els.taskCategory) {
    const oldValue = els.taskCategory.value;
    els.taskCategory.innerHTML = "";
    for (const k in T[lang].cats) {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = T[lang].cats[k];
      els.taskCategory.appendChild(o);
    }
    // Vrati stari odabir ako postoji
    if (T[lang].cats[oldValue]) {
      els.taskCategory.value = oldValue;
    }
  }

  if (els.reminderHint) {
    els.reminderHint.classList.add("hidden");
  }

  renderPopupIfOpen();
}

  function handleTaskAction({ id, action }) {
    switch (action) {
      case "done": updateStatus(id, "done"); break;
      case "cancel": updateStatus(id, "cancelled"); break;
      case "delete":
        const t = tasks.find(x => x.id === id);
        if (t && confirm("Obrisati ovu obvezu?")) {
          tasks = tasks.filter(x => x.id !== id);
          saveTasks(tasks);
          if (t.addToCalendar === true) {
            exportToCalendar({ task: { ...t, seq: Date.now() }, lang: AppState.lang, T, platform, cancel: true });
          }
          render();
          renderPopupIfOpen();
        }
        break;
      case "edit":
        editTask(id);
        if (typeof showScreen === "function") showScreen("screen-tasks");
        break;
    }
  }

  //bindSmartReminder();

  return {
    load,
    onSaveTask,
    applyLangToTasksUI,
    renderPopup,
    updateStatus,
    editTask,
    deleteTask: popupDeleteTask,
    popupDeleteTask,
    handleTaskAction
  };
}

// ✅ IZLOŽI GLOBALNO
window.createTasksController = createTasksController;