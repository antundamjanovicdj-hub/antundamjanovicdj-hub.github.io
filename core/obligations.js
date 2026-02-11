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
  const safe = {
    id: ob.id,
    title: ob.title || "",
    note: ob.note || "",
    dateTime: ob.dateTime || null,
    reminder: ob.reminder || null,
    repeat: ob.repeat || null,
    status: ob.status || "active",
  };

  const t = window.I18N && I18N[lang] ? I18N[lang] : I18N.hr;
  const ol =
    t && t.obligationsList ? t.obligationsList : I18N.hr.obligationsList;

  const dt = safe.dateTime ? new Date(safe.dateTime) : null;
  const dateStr = dt ? dt.toLocaleDateString((t && t.lang) || "hr-HR") : "—";
  const timeStr = dt
    ? dt.toLocaleTimeString((t && t.lang) || "hr-HR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
  const isOverdue =
    safe.dateTime && getISODateFromDateTime(safe.dateTime) < todayISO();

  const overdueHint = isOverdue
    ? `<div style="font-size:12px; opacity:0.6; margin-top:2px;">Zakašnjelo</div>`
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

  const bgColor =
    safe.status === "done" ? "#e8f5e9" : isOverdue ? "#f7f7f7" : "#e3f2fd";

  const borderColor =
    safe.status === "done" ? "#4caf50" : isOverdue ? "#bbb" : "#2196f3";

  const toggleBtnText =
    safe.status === "done"
      ? ol.markActive || "⏳ Active"
      : ol.markDone || "✅ Done";

  const editText = ol.edit || "Edit";
  const deleteText = ol.delete || "Delete";

  return `
    <div class="obligation-card" data-id="${
      safe.id
    }" style="background:${bgColor}; border-left:4px solid ${borderColor};">
      <div class="obligation-title" title="${repeatTitle}">${
    safe.title
  }${repeatIcon}</div>

      ${safe.note ? `<div class="obligation-note">${safe.note}</div>` : ""}

      <div class="obligation-meta">
        <div class="obligation-date">
  📅 ${dateStr}
  ${overdueHint}
</div>
<div class="obligation-time">⏰ ${timeStr}</div>
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

      <button class="obligation-edit" data-id="${
        safe.id
      }">✏️ ${editText}</button>

      <button
        class="obligation-delete"
        data-id="${safe.id}"
        title="${deleteText}"
        aria-label="${deleteText}"
      >
        🗑️
      </button>
    </div>
  `;
}
export function attachObligationHandlers(container) {

  if (!container) return;

  // TOGGLE STATUS
  container.querySelectorAll(".obligation-toggle-status").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();

      const id = parseInt(btn.dataset.id, 10);
      const currentStatus = btn.dataset.status;
      const newStatus = currentStatus === "done" ? "active" : "done";

      const obligations = await obligationDB.getAll();
      const obligation = obligations.find(o => o.id === id);
      if (!obligation) return;

      obligation.status = newStatus;
      await obligationDB.add(obligation);

      window.refreshCurrentObligationsView?.();
    });
  });

  // DELETE
  container.querySelectorAll(".obligation-delete").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();

      const id = parseInt(btn.dataset.id, 10);
      await obligationDB.delete(id);

      window.refreshCurrentObligationsView?.();
    });
  });
// ✅ EDIT — ZALIJEPI TOČNO OVDJE
  container.querySelectorAll(".obligation-edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = parseInt(btn.dataset.id, 10);

      if (typeof window.openEditObligation === "function") {
        window.openEditObligation(id);
      }
    });
  });

}