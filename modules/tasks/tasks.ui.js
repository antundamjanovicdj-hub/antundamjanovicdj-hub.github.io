// modules/tasks/tasks.ui.js
function renderTasks({ tasks, taskListEl }) {
  if (!taskListEl) return;

  taskListEl.innerHTML = "";

  const activeTasks = tasks
    .filter(t => t.status === "active")
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time || "").localeCompare(b.time || "");
    });

  if (activeTasks.length === 0) {
    taskListEl.innerHTML = `<p class="empty-tasks">Nema aktivnih obveza.</p>`;
    return;
  }

  activeTasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-card";
    item.dataset.taskId = task.id;

    const dateText = task.date
      ? new Date(task.date).toLocaleDateString()
      : "—";

    item.innerHTML = `
      <div class="task-header">
        <div class="task-title">${task.title}</div>
        <div class="task-date">${dateText} ${task.time || ""}</div>
      </div>

      <div class="task-meta">
        <span class="task-cat">${task.cat}</span>
      </div>

      ${task.note ? `<div class="task-note">${task.note}</div>` : ""}

      <div class="task-actions">
        <button class="task-btn done" title="Završeno">✓</button>
        <button class="task-btn edit" title="Uredi">✎</button>
        <button class="task-btn cancel" title="Otkaži">✗</button>
        <button class="task-btn delete" title="Izbriši">🗑</button>
      </div>
    `;

    taskListEl.appendChild(item);
  });

  taskListEl.querySelectorAll(".task-btn").forEach(btn => {
    btn.onclick = (e) => {
      const card = e.target.closest(".task-card");
      const id = Number(card.dataset.taskId);
      const action = e.target.classList[1];

      if (typeof window.handleTaskAction === "function") {
        window.handleTaskAction({ id, action });
      }
    };
  });
}

// ✅ GLOBAL
window.renderTasks = renderTasks;
