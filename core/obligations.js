// core/obligations.js
// LifeKompas — Obligations Module
const __OBLIGATIONS_MODULE__ = true;

import { obligationDB } from "./db.js";
import Temporal from "../src/core/temporal/index.js";
import { getISODateFromDateTime, todayISO } from "./date-utils.js";

export async function renderObligationsList_SAFE() {
  const obligations = await obligationDB.getAll();
  Temporal.setObligations(obligations);

  if (typeof window.renderObligationsList === "function") {
    return window.renderObligationsList(obligations);
  }

  console.warn("[obligations] renderObligationsList not wired yet");
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

// 🔧 FIX: Helper function to safely parse date
function safeParseDate(dateTimeStr) {
  if (!dateTimeStr) return null;
  
  const dt = new Date(dateTimeStr);
  
  // 🔧 FIX: Check for Invalid Date
  if (isNaN(dt.getTime())) {
    console.warn('[obligations] Invalid date:', dateTimeStr);
    return null;
  }
  
  return dt;
}

// 🔧 FIX: Helper to escape HTML (XSS prevention)
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function buildObligationCard(ob, lang) {
  // ===== NORMALIZE OB OBJECT (prevent "undefined") =====
  const safe = ob || {};

  const t = I18N[lang] || I18N.hr;
  const ol = t && t.obligationsList ? t.obligationsList : I18N.hr.obligationsList;

  // 🔧 FIX: Use safe date parsing
  const dt = safeParseDate(safe.dateTime);
  const isoDate = safe.dateTime ? getISODateFromDateTime(safe.dateTime) : null;
  
  const dateStr = dt ? dt.toLocaleDateString(t.lang || 'hr-HR') : "—";
  const timeStr = dt
    ? dt.toLocaleTimeString(t.lang || 'hr-HR', {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
  
  const isOverdue = isoDate && isoDate < todayISO();

  const overdueText = ol.overdue || "Zakašnjelo";
  const overdueHint = isOverdue
    ? `<div class="obligation-overdue">${escapeHtml(overdueText)}</div>`
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

  // 🔧 FIX: Escape user content to prevent XSS
  const safeTitle = escapeHtml(safe.title || '');
  const safeNote = escapeHtml(safe.note || '');

  return `
    <div class="obligation-card ${stateClass}" data-id="${safe.id}">

      <div class="obligation-quick-done" data-id="${safe.id}">
        ✓
      </div>
      
      <div class="obligation-title" title="${escapeHtml(repeatTitle)}">
        ${safeTitle}${repeatIcon}
      </div>

      ${safeNote ? `<div class="obligation-note">${safeNote}</div>` : ""}

      <div class="obligation-meta">
        <div class="obligation-date">
          📅 ${dateStr}
          ${overdueHint}
        </div>
        ${dt ? `<div class="obligation-time">⏰ ${timeStr}</div>` : ""}
        ${
          reminderStr
            ? `<div class="obligation-reminder">🔔 ${escapeHtml(reminderStr)}</div>`
            : ""
        }
        <div class="obligation-status">${statusText}</div>
      </div>

      <button class="obligation-toggle-status" data-id="${safe.id}" data-status="${safe.status || 'active'}">
        ${toggleBtnText}
      </button>

      <div class="obligation-actions">
        <button class="obligation-edit" data-id="${safe.id}">
          ✏️ ${escapeHtml(editText)}
        </button>

        <button
          class="obligation-delete"
          data-id="${safe.id}"
          title="${escapeHtml(deleteText)}"
          aria-label="${escapeHtml(deleteText)}"
        >
          🗑️
        </button>
      </div>
    </div>
  `;
}

// 🔧 FIX: Use event delegation to prevent memory leaks
// Track if delegation is already set up
const delegationSetup = new WeakSet();

export function attachObligationHandlers(container) {
  if (!container) return;

  // 🔧 FIX: Only attach delegation once per container
  if (delegationSetup.has(container)) {
    return;
  }
  delegationSetup.add(container);

  // 🔧 FIX: Single event listener using event delegation
  container.addEventListener("click", (e) => {
    const target = e.target;

    // TOGGLE STATUS
    const toggleBtn = target.closest(".obligation-toggle-status");
    if (toggleBtn) {
      e.stopPropagation();
      const id = parseInt(toggleBtn.dataset.id, 10);
      const currentStatus = toggleBtn.dataset.status;
      const newStatus = currentStatus === "done" ? "active" : "done";
      window.toggleObligationStatus?.(id, newStatus);
      return;
    }

    // DELETE
const deleteBtn = target.closest(".obligation-delete");
if (deleteBtn) {
  e.stopPropagation();

  deleteBtn.classList.add("tap");

  const id = parseInt(deleteBtn.dataset.id, 10);

  setTimeout(() => {
    deleteBtn.classList.remove("tap");
  }, 150);

  window.deleteObligation?.(id);
  return;
}

    // QUICK DONE
    const quickDoneBtn = target.closest(".obligation-quick-done");
    if (quickDoneBtn) {
      e.stopPropagation();
      const id = parseInt(quickDoneBtn.dataset.id, 10);
      window.toggleObligationStatus?.(id, "done");
      return;
    }

    // EDIT button
    const editBtn = target.closest(".obligation-edit");
    if (editBtn) {
      e.stopPropagation();
      const id = parseInt(editBtn.dataset.id, 10);
      window.openEditObligation?.(id);
      return;
    }

    // CARD TAP → EDIT (only if clicking on card itself, not controls)
const card = target.closest(".obligation-card");

if (
  card &&
  !target.closest("button") &&
  !target.closest(".obligation-quick-done") &&
  !target.closest(".obligation-toggle-status") &&
  !target.closest(".obligation-delete")
) {
  const id = parseInt(card.dataset.id, 10);
  window.openEditObligation?.(id);
  return;
}
  });
}

// 🫀 TEMPORAL UI SUBSCRIBER (shadow mode)
Temporal.subscribe((state) => {
  window.__TEMPORAL_STATE__ = state;
  window.refreshCurrentObligationsView?.();
});

// ===== UX: highlight new obligation =====
export function highlightNewObligation(id) {
  if (!id) return;

  // wait until DOM render completes
  requestAnimationFrame(() => {

    const el = document.querySelector(`.obligation-card[data-id="${id}"]`);
    if (!el) return;

    // smooth scroll to element
    el.scrollIntoView({
  behavior: "smooth",
  block: "center"
});

// highlight tek kad scroll završi
setTimeout(() => {

  el.classList.add("obligation-new");

  setTimeout(() => {
    el.classList.remove("obligation-new");
  }, 2000);

}, 350);

  });
}