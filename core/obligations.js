// core/obligations.js
// LifeKompas — Obligations Module (scaffold)
// ZERO-RISK STEP 1: no side-effects, no runtime changes.
// DEV SENTINEL — this module must NEVER execute runtime code on import
const __OBLIGATIONS_MODULE__ = true;
/*
  ⚠️ ENGINE OWNERSHIP (ZERO-RISK PHASE)

  Obligations runtime is STILL owned by app-init.js.

  This module currently provides:
  ✔ card builder
  ✔ safe wrappers
  ✔ helper exports

  DO NOT move engine logic here yet.
  DO NOT call DB here.
  DO NOT attach DOM listeners here.

  Full engine migration happens in a later phase.
*/
// In the next steps, we will move code from app-init.js into this module gradually.

// ---- TEMP SAFE WRAPPERS ----
// These wrappers allow us to import this module later without breaking existing behavior.

import { obligationDB } from "./db.js";
import { getISODateFromDateTime, todayISO } from "./date-utils.js";

export async function renderObligationsList_SAFE() {
  if (typeof window.renderObligationsList === "function") {
    return window.renderObligationsList();
  }

  console.warn("[obligations] renderObligationsList not wired yet");
  return;
}

export function showListMode() {
  if (typeof window.showListMode === "function") {
    return window.showListMode();
  }
  throw new Error("[obligations] showListMode not wired yet");
}

export function showDailyMode() {
  if (typeof window.showDailyMode === "function") {
    return window.showDailyMode();
  }
  throw new Error("[obligations] showDailyMode not wired yet");
}

export async function loadDailyForDate(isoDate) {
  if (typeof window.loadDailyForDate === "function") {
    return window.loadDailyForDate(isoDate);
  }
  throw new Error("[obligations] loadDailyForDate not wired yet");
}

export function buildObligationCard(ob, lang) {
  // ===== NORMALIZE OB OBJECT (prevent "undefined") =====
  const safe = ob;

  const t = I18N[lang] || I18N.hr;
  const ol =
    t && t.obligationsList ? t.obligationsList : I18N.hr.obligationsList;

  const dt = safe.dateTime ? new Date(safe.dateTime) : null;
const isoDate = safe.dateTime
  ? getISODateFromDateTime(safe.dateTime)
  : null;
  const dateStr = dt ? dt.toLocaleDateString(t.lang) : "—";
  const timeStr = dt
  ? dt.toLocaleTimeString(t.lang, {
      hour: "2-digit",
      minute: "2-digit",
    })
  : "—";
  const isOverdue = isoDate && isoDate < todayISO();

  const overdueText = ol.overdue || "Zakašnjelo";

const overdueHint = isOverdue
  ? `<div class="obligation-overdue">${overdueText}</div>`
  : "";

  let reminderStr = "";
  if (safe.reminder) {
    const key = `reminder${safe.reminder}`;
    reminderStr = ol && ol[key] ? ol[key] : `${safe.reminder} min`;
  }

  let repeatIcon = "";
  let repeatTitle = "";

  if (safe.repeat) {
    repeatIcon = " 🔁";
    if (safe.repeat === "daily")
      repeatTitle = t.obligation?.repeatDaily || "Daily";
    else if (safe.repeat === "weekly")
      repeatTitle = t.obligation?.repeatWeekly || "Weekly";
    else repeatTitle = "";
  }

  const statusDoneText = ol.statusDone || "Done";
  const statusActiveText = ol.statusActive || "Active";

  const statusText =
    safe.status === "done" ? `✅ ${statusDoneText}` : `⏳ ${statusActiveText}`;

  let stateClass = "ob-active";

if (safe.status === "done") stateClass = "ob-done";
else if (isOverdue) stateClass = "ob-overdue";

  const toggleBtnText =
    safe.status === "done"
      ? ol.markActive || "⏳ Active"
      : ol.markDone || "✅ Done";

  const editText = ol.edit || "Edit";
  const deleteText = ol.delete || "Delete";

  return `
    <div class="obligation-card ${stateClass}" data-id="${safe.id}">
      <div class="obligation-title" title="${repeatTitle}">
        ${safe.title}${repeatIcon}
      </div>

      ${safe.note ? `<div class="obligation-note">${safe.note}</div>` : ""}

      <div class="obligation-meta">
        <div class="obligation-date">
  📅 ${dateStr}
  ${overdueHint}
</div>
${dt ? `<div class="obligation-time">⏰ ${timeStr}</div>` : ""}
        ${
          reminderStr
            ? `<div class="obligation-reminder">🔔 ${reminderStr}</div>`
            : ""
        }
        <div class="obligation-status">${statusText}</div>
      </div>

      <button class="obligation-toggle-status" data-id="${
        safe.id
      }" data-status="${safe.status}">
        ${toggleBtnText}
      </button>

      <div class="obligation-actions">

  <button class="obligation-edit" data-id="${safe.id}">
    ✏️ ${editText}
  </button>

  <button
    class="obligation-delete"
    data-id="${safe.id}"
    title="${deleteText}"
    aria-label="${deleteText}"
  >
    🗑️
  </button>

</div>
    </div>
  `;
}
export function attachObligationHandlers(container) {

  if (!container) return;

  // TOGGLE STATUS (engine-owned)
  container.querySelectorAll(".obligation-toggle-status").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = parseInt(btn.dataset.id, 10);
      const currentStatus = btn.dataset.status;
      const newStatus = currentStatus === "done" ? "active" : "done";

      window.toggleObligationStatus?.(id, newStatus);
    });
  });

  // DELETE (engine-owned)
  container.querySelectorAll(".obligation-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = parseInt(btn.dataset.id, 10);

      window.deleteObligation?.(id);
    });
  });

  // EDIT
  container.querySelectorAll(".obligation-edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = parseInt(btn.dataset.id, 10);

      window.openEditObligation?.(id);
    });
  });

}