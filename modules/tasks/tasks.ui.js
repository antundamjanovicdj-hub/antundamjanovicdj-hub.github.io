/ modules/tasks/tasks.ui.js
export function renderTasks({ tasks, taskListEl }) {
  if (!taskListEl) return;

  taskListEl.innerHTML = "";

  const activeTasks = tasks.filter(t => t.status === "active").sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.time || "").localeCompare(b.time || "");
  });

  if (activeTasks.length === 0) {
    taskListEl.innerHTML = `<p>Nema aktivnih obveza.</p>`;
    return;
  }

  activeTasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-item";
    item.dataset.taskId = task.id;

    // Formatiraj datum za prikaz
    const dateDisplay = task.date ? new Date(task.date).toLocaleDateString() : "—";

    item.innerHTML = `
      <div class="task-info">
        <strong>${task.title}</strong><br>
        <small>${dateDisplay} ${task.time || ""}</small><br>
        <small class="task-cat">${task.cat}</small>
        ${task.note ? `<div class="task-note">${task.note}</div>` : ""}
      </div>
      <div class="task-actions">
        <button class="task-btn done" title="Potvrdi">✓</button>
        <button class="task-btn edit" title="Uredi">✎</button>
        <button class="task-btn cancel" title="Otkaži">✗</button>
        <button class="task-btn delete" title="Izbriši">🗑</button>
      </div>
    `;

    taskListEl.appendChild(item);
  });

  // ✅ EVENT DELEGATION ZA SVE AKCIJE
  taskListEl.querySelectorAll(".task-btn").forEach(btn => {
    btn.onclick = (e) => {
      const taskItem = e.target.closest(".task-item");
      const id = Number(taskItem.dataset.taskId);
      const action = e.target.className.split(" ")[1]; // 'done', 'edit', 'cancel', 'delete'

      if (typeof window.handleTaskAction === "function") {
        window.handleTaskAction({ id, action });
      }
    };
  });
}