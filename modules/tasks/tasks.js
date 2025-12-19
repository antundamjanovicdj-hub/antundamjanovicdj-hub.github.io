const T = window.I18N;

let tasks = [];
let editTaskId = null;

// PAMETNI REMINDERI (u minutama)
const SMART_REMINDERS = {
  health: 1440,     // 1 dan
  finance: 2880,    // 2 dana
  family: 60,       // 1 sat
  personal: 30      // 30 min
};

// ELEMENTI
const taskTitle = document.getElementById("taskTitle");
const taskNote = document.getElementById("taskNote");
const taskCategory = document.getElementById("taskCategory");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskReminder = document.getElementById("taskReminder");
const addToCalendar = document.getElementById("addToCalendar");
const saveTask = document.getElementById("saveTask");
const taskList = document.getElementById("taskList");
const calendarInfo = document.getElementById("calendarInfo");

// SMART REMINDER LOGIKA
taskCategory.addEventListener("change", () => {
  const cat = taskCategory.value;
  const suggested = SMART_REMINDERS[cat];

  if (suggested && taskReminder.value === "0") {
    taskReminder.value = suggested.toString();
  }
});

// LOAD
function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  renderTasks();
}

// SAVE
saveTask.onclick = () => {
  const data = {
    id: editTaskId || Date.now(),
    title: taskTitle.value,
    note: taskNote.value,
    cat: taskCategory.value,
    date: taskDate.value,
    time: taskTime.value,
    reminder: +taskReminder.value,
    status: "active",
    seq: Date.now()
  };

  if (editTaskId) {
    tasks = tasks.map(t => t.id === editTaskId ? data : t);
    editTaskId = null;
  } else {
    tasks.push(data);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  if (addToCalendar.checked) {
    exportToCalendar(data);
    calendarInfo.textContent = T[lang].calendarAdded;
  } else {
    calendarInfo.textContent = "";
  }

  taskTitle.value = "";
  taskNote.value = "";
  taskDate.value = "";
  taskTime.value = "";
  taskReminder.value = "0";
  addToCalendar.checked = true;

  renderTasks();
};

// RENDER
function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(t => t.status === "active")
    .forEach(t => {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <strong>${t.title}</strong><br>
        ${t.date || ""} ${t.time || ""}
        <div class="actions">
          <button onclick="updateStatus(${t.id},'done')">✅</button>
          <button onclick="updateStatus(${t.id},'cancelled')">❌</button>
          <button onclick="editTask(${t.id})">✏️</button>
          <button onclick="deleteTask(${t.id})">🗑</button>
        </div>
      `;
      taskList.appendChild(el);
    });
}

// STATUS
window.updateStatus = (id, status) => {
  tasks = tasks.map(t => t.id === id ? { ...t, status } : t);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
};

// EDIT
window.editTask = (id) => {
  const t = tasks.find(x => x.id === id);
  if (!t) return;

  editTaskId = id;
  taskTitle.value = t.title;
  taskNote.value = t.note;
  taskCategory.value = t.cat;
  taskDate.value = t.date;
  taskTime.value = t.time;
  taskReminder.value = t.reminder || "0";
};

// DELETE
window.deleteTask = (id) => {
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
};

// INIT
loadTasks();

