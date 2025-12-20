// modules/tasks/tasks.ui.js
import { formatDate } from "../../core/ui.js";

export function renderTasks({ tasks, taskListEl }) {
  taskListEl.innerHTML = "";

  tasks
    .filter(t => t.status === "active")
    .forEach(t => {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <strong>${t.title}</strong><br>
        ${formatDate(t.date)} ${t.time}<br>
        <div class="actions">
          <button onclick="updateStatus(${t.id}, 'done')">✅</button>
          <button onclick="updateStatus(${t.id}, 'cancelled')">❌</button>
          <button onclick="editTask(${t.id})">✏️</button>
          <button onclick="deleteTask(${t.id})">🗑️</button>
        </div>
      `;
      taskListEl.appendChild(el);
    });
}
