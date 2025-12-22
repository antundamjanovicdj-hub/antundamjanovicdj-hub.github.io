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
    const card = document.createElement("div");
    card.className = "task-card clean";
    card.dataset.taskId = task.id;

    const dateText = task.date
      ? new Date(task.date).toLocaleDateString()
      : "—";

    card.innerHTML = `
      <div class="task-content">
        <div class="task-title">${task.title}</div>
        <div class="task-date">${dateText} ${task.time || ""}</div>
        ${task.note ? `<div class="task-note">${task.note}</div>` : ""}
      </div>

      <div class="task-actions-bar">
        <button class="task-action done" title="Potvrdi">✔</button>
        <button class="task-action edit" title="Uredi">✏</button>
        <button class="task-action cancel" title="Otkaži">✖</button>
        <button class="task-action delete" title="Izbriši">🗑</button>
      </div>
    `;

    taskListEl.appendChild(card);
  });

  taskListEl.querySelectorAll(".task-action").forEach(btn => {
    btn.onclick = (e) => {
      const card = e.target.closest(".task-card");
      const id = Number(card.dataset.taskId);
      const action = btn.classList[1];

      if (typeof window.handleTaskAction === "function") {
        window.handleTaskAction({ id, action });
      }
    };
  });
}

window.renderTasks = renderTasks;