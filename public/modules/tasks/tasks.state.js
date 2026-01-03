// modules/tasks/tasks.state.js
function loadTasks() {
  const raw = localStorage.getItem("tasks") || "[]";
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Invalid tasks data, resetting");
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ IZLOŽI GLOBALNO
window.loadTasks = loadTasks;
window.saveTasks = saveTasks;