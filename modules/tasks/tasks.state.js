// modules/tasks/tasks.state.js
const KEY = "tasks";

export function loadTasks() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}
