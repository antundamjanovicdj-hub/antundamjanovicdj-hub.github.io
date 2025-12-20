// modules/tasks/tasks.popup.js
export function openDayPopup({
  loadTasksFn,
  popupDateEl,
  renderPopupTasksFn,
  dayPopupEl
}) {
  loadTasksFn();

  const today = new Date().toISOString().split("T")[0];
  popupDateEl.value = popupDateEl.value || today;

  renderPopupTasksFn(popupDateEl.value);

  dayPopupEl.classList.add("active");
  dayPopupEl.setAttribute("aria-hidden", "false");
}

export function closeDayPopup({ dayPopupEl }) {
  dayPopupEl.classList.remove("active");
  dayPopupEl.setAttribute("aria-hidden", "true");
}

export function renderPopupTasks({ date, tasks, popupTasksEl, T, lang }) {
  popupTasksEl.innerHTML = "";

  const sections = [
    { key: "active", label: T[lang].status.active },
    { key: "done", label: T[lang].status.done },
    { key: "cancelled", label: T[lang].status.cancelled }
  ];

  let any = false;

  sections.forEach(sec => {
    const list = tasks
      .filter(t => t.date === date && t.status === sec.key)
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

    if (!list.length) return;
    any = true;

    const h = document.createElement("div");
    h.className = "popup-section";
    h.textContent = sec.label;
    popupTasksEl.appendChild(h);

    list.forEach(t => {
      const el = document.createElement("div");
      el.className = `item task-${t.status}`;

      el.innerHTML = `
        <button class="popup-delete" data-task-id="${t.id}">🗑</button>
        <strong>${t.title}</strong><br>
        ${t.time || ""}${t.time ? "<br>" : ""}
        <small>${T[lang].cats[t.cat] || ""}</small>
        ${t.note ? `<div class="note">${t.note}</div>` : ""}
      `;

      popupTasksEl.appendChild(el);
    });
  });

  if (!any) {
    const p = document.createElement("div");
    p.className = "popup-empty";
    p.textContent = T[lang].emptyDay;
    popupTasksEl.appendChild(p);
  }

  // Poveži brisanje putem event delegation
  popupTasksEl.querySelectorAll(".popup-delete").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.taskId);
      if (typeof window.popupDeleteTask === "function") {
        window.popupDeleteTask(id);
      }
    };
  });
}