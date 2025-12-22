// modules/tasks/tasks.ui.js
function renderTasks({ tasks, taskListEl }) {
  if (!taskListEl) return;

  const T = window.I18N;
  const lang = window.AppState?.lang || "hr";

  taskListEl.innerHTML = "";

  const activeTasks = tasks
    .filter(t => t.status === "active")
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time || "").localeCompare(b.time || "");
    });

  if (activeTasks.length === 0) {
    taskListEl.innerHTML = `<p class="empty-tasks">—</p>`;
    return;
  }

  activeTasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-card";
    item.dataset.taskId = task.id;

    const dateText = task.date
      ? new Date(task.date).toLocaleDateString()
      : "—";

    const A = T[lang].actions;

    item.innerHTML = `
      <div class="task-header">
        <div class="task-title">${task.title}</div>
        <div class="task-date">${dateText} ${task.time || ""}</div>
      </div>

      <div class="task-meta">${task.cat}</div>

      ${task.note ? `<div class="task-note">${task.note}</div>` : ""}

      <div class="task-actions labeled">
        <button class="task-btn done">
          <span class="icon">✔</span>
          <span class="label">${A.done}</span>
        </button>

        <button class="task-btn edit">
          <span class="icon">✏</span>
          <span class="label">${A.edit}</span>
        </button>

        <button class="task-btn cancel">
          <span class="icon">✖</span>
          <span class="label">${A.cancel}</span>
        </button>

        <button class="task-btn delete">
          <span class="icon">🗑</span>
          <span class="label">${A.delete}</span>
        </button>
      </div>
    `;

    taskListEl.appendChild(item);
  });

  taskListEl.querySelectorAll(".task-btn").forEach(btn => {
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