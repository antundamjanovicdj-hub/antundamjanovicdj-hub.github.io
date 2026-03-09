// core/obligations.js
// LifeKompas — Obligations Module with ALL Features
// TEMPORAL ENGINE + SEKCIJE + EMPTY STATE + NOW INDICATOR + DONE ACTION

const __OBLIGATIONS_MODULE__ = true;

import { obligationDB } from "./db.js";
import Temporal from "../src/core/temporal/index.js";
import { getISODateFromDateTime, todayISO } from "./date-utils.js";

// ===== SAFE RENDER WRAPPER (CRASH-SAFE) =====
export async function renderObligationsList_SAFE() {
  try {
    const obligations = await obligationDB.getAll();
    Temporal.setObligations(obligations);

    if (typeof window.renderObligationsList === "function") {
      return window.renderObligationsList(obligations);
    }

    console.warn("[obligations] renderObligationsList not wired yet");
  } catch (error) {
    console.error('[obligations] Render failed:', error);
    renderFallbackState();
  }
}

// ===== FALLBACK STATE (CRASH-SAFE) =====
function renderFallbackState() {
  const container = document.getElementById('obligationsContainer');
  if (!container) return;

  const lang = window.getLang?.() || 'hr';
  container.innerHTML = buildEmptyState(lang);
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

// ===== HELPER: Safe date parsing =====
function safeParseDate(dateTimeStr) {
  if (!dateTimeStr) return null;
  const dt = new Date(dateTimeStr);
  if (isNaN(dt.getTime())) {
    console.warn('[obligations] Invalid date:', dateTimeStr);
    return null;
  }
  return dt;
}

// ===== HELPER: Escape HTML (XSS prevention) =====
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== CHECK IF DATE IS YESTERDAY =====
function isYesterday(dateTime) {
  if (!dateTime) return false;
  const dt = getISODateFromDateTime(dateTime);
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yy = yesterday.getFullYear();
  const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
  const dd = String(yesterday.getDate()).padStart(2, '0');
  return dt === `${yy}-${mm}-${dd}`;
}

// ===== SECTIONS BUILDER =====
export function buildSections(obligations, temporalState) {
  const lang = window.getLang?.() || 'hr';
  const t = window.I18N?.[lang]?.obligationsView || window.I18N?.hr?.obligationsView;
  const today = todayISO();

  // SECTION: Active (timed obligations, status = active, today)
  const activeObligations = obligations.filter(o => 
    o.status !== 'done' && 
    o.dateTime && 
    getISODateFromDateTime(o.dateTime) === today
  ).sort((a, b) => {

  const timeDiff = new Date(a.dateTime) - new Date(b.dateTime);

  if (timeDiff !== 0) return timeDiff;

  // stabilni fallback za identično vrijeme
  return (a.id || 0) - (b.id || 0);

});

  // SECTION: Kad stigneš (no time, status = active)
  const whenYouCanObligations = obligations.filter(o => 
  o.status !== 'done' &&
  (!o.dateTime || String(o.dateTime).trim() === '')
);

  // SECTION: Završeno danas (done today)
  const doneTodayObligations = obligations.filter(o => {
    if (o.status !== 'done') return false;
    const doneDate = o.doneAt ? getISODateFromDateTime(o.doneAt) : null;
    return doneDate === today;
  });

  return {
    active: activeObligations,
    whenYouCan: whenYouCanObligations,
    doneToday: doneTodayObligations,
    labels: t?.sections || {
      active: 'Aktivne obveze',
      whenYouCan: 'Kad stigneš',
      doneToday: 'Završeno danas'
    }
  };
}

// ===== EMPTY STATE =====
export function buildEmptyState(lang = 'hr') {
  const t = window.I18N?.[lang]?.obligationsView || window.I18N?.hr?.obligationsView;

  return `
  <div class="obligations-empty-state" data-testid="empty-state">

    <div class="empty-calm-icon">🌿</div>

    <div class="empty-calm-title">
      ${t?.emptyTitle || 'Miran dan'}
    </div>

    <div class="empty-calm-sub">
      ${t?.emptySub || 'Sve je pod kontrolom.'}
    </div>

    <div class="empty-calm-hint">
      ${t?.emptyHint || 'Dodaj obvezu kad god se pojavi.'}
    </div>

    <button class="empty-add-btn" id="emptyAddBtn" data-testid="empty-add-btn">
      ${t?.addFirst || '+ Dodaj obvezu'}
    </button>

  </div>
`;
}

// ===== NOW INDICATOR =====
export function buildNowIndicator(visible = false, lang = 'hr') {
  const t = window.I18N?.[lang]?.obligationsView || window.I18N?.hr?.obligationsView;
  
  return `
    <div class="now-indicator ${visible ? '' : 'hidden'}" id="nowIndicator" data-testid="now-indicator">
      ${t?.nowIndicator || '● Sada'}
    </div>
  `;
}

// ===== PROGRESS LINE (24h) =====
export function buildProgressLine(percent = 0) {
  return `
    <div class="progress-line-24h" data-testid="progress-line">
      <div class="progress-line-fill" style="width: ${percent}%"></div>
      <div class="progress-line-marker" style="left: ${percent}%"></div>
    </div>
  `;
}

// ===== TEMPORAL POINTER ELEMENT =====
export function buildTemporalPointer() {
  return `
    <div class="temporal-pointer" id="temporalPointer" data-testid="temporal-pointer">
      <div class="pointer-dot"></div>
      <div class="pointer-line"></div>
    </div>
  `;
}

// ===== OBLIGATION CARD BUILDER =====
export function buildObligationCard(ob, lang) {
  const safe = ob || {};
  const t = window.I18N?.[lang] || window.I18N?.hr;
  const ol = t?.obligationsList || window.I18N?.hr?.obligationsList || {};

  const dt = safeParseDate(safe.dateTime);
  const isoDate = safe.dateTime ? getISODateFromDateTime(safe.dateTime) : null;
  
  const dateStr = dt ? dt.toLocaleDateString(t?.lang || 'hr-HR') : "—";
  const timeStr = dt ? dt.toLocaleTimeString(t?.lang || 'hr-HR', { hour: "2-digit", minute: "2-digit" }) : "—";
  
  const isOverdue = isoDate && isoDate < todayISO();
  const overdueText = ol.overdue || "Zakašnjelo";
  const overdueHint = isOverdue ? `<div class="obligation-overdue">${escapeHtml(overdueText)}</div>` : "";

  let reminderStr = "";
  if (safe.reminder) {
    const key = `reminder${safe.reminder}`;
    reminderStr = ol[key] || `${safe.reminder} min`;
  }

  let repeatIcon = "";
  let repeatTitle = "";
  if (safe.repeat) {
    repeatIcon = " 🔁";
    if (safe.repeat === "daily") repeatTitle = t?.obligation?.repeatDaily || "Svaki dan";
    else if (safe.repeat === "weekly") repeatTitle = t?.obligation?.repeatWeekly || "Svaki tjedan";
    else if (safe.repeat === "monthly") repeatTitle = t?.obligation?.repeatMonthly || "Svaki mjesec";
  }

  const statusDoneText = ol.statusDone || "Završeno";
  const statusActiveText = ol.statusActive || "Aktivno";
  const statusText = safe.status === "done" ? `✅ ${statusDoneText}` : `⏳ ${statusActiveText}`;

  let stateClass = "ob-active";
  if (safe.status === "done") stateClass = "ob-done";
  else if (isOverdue) stateClass = "ob-overdue";

  const editText = ol.edit || "Uredi";
  const safeTitle = escapeHtml(safe.title || '');
  const safeNote = escapeHtml(safe.note || '');

  return `
    <div class="obligation-card ${stateClass}" data-id="${safe.id}" data-testid="obligation-card-${safe.id}">
      
      <div class="obligation-quick-done" data-id="${safe.id}" data-testid="quick-done-${safe.id}">
        ✓
      </div>

      <div class="obligation-title" title="${escapeHtml(repeatTitle)}">${safeTitle}${repeatIcon}</div>

      ${safeNote ? `<div class="obligation-note">${safeNote}</div>` : ''}

      <div class="obligation-meta">
        ${dt ? `<div class="obligation-date">📅 ${dateStr}${overdueHint}</div>` : ''}
        ${dt ? `<div class="obligation-time">⏰ ${timeStr}</div>` : ''}
        ${reminderStr ? `<div class="obligation-reminder">🔔 ${escapeHtml(reminderStr)}</div>` : ''}
        <div class="obligation-status">${statusText}</div>
      </div>

      <div class="obligation-actions">
        <button class="obligation-edit" data-id="${safe.id}" data-testid="edit-${safe.id}">
          ✏️ ${escapeHtml(editText)}
        </button>
        <button class="obligation-delete" data-id="${safe.id}" data-testid="delete-${safe.id}">
          🗑️
        </button>
      </div>
    </div>
  `;
}

// ===== RENDER ALL SECTIONS =====
export function renderAllSections(obligations, temporalState, lang = 'hr') {
  const sections = buildSections(obligations, temporalState);
  const t = window.I18N?.[lang]?.obligationsView || window.I18N?.hr?.obligationsView;

  const htmlParts = [];

// 🫀 NOW INDICATOR (initially hidden)
htmlParts.push(buildNowIndicator(false, lang));

  // Progress line (24h)
  // 🫀 DAILY PROGRESS LINE (24h timeline)
if (temporalState && typeof temporalState.progressPercent === "number") {
  htmlParts.push(`
    <div class="daily-progress-wrap">
      ${buildProgressLine(temporalState.progressPercent)}
    </div>
  `);
}

  const hasTimedObligations = sections.active.length > 0;
const hasAnyActive = hasTimedObligations || sections.whenYouCan.length > 0;

  if (!hasAnyActive && sections.doneToday.length === 0) {
    return buildEmptyState(lang);
  }

  // SECTION: Active obligations with temporal pointer
  // SECTION: Active obligations (timed → temporal timeline)
if (hasTimedObligations) {
    htmlParts.push(`<div class="obligations-section-title">${sections.labels.active || 'Aktivne obveze'}</div>`);
    htmlParts.push(`<div class="obligations-list with-timeline" data-testid="active-obligations">`);
    
   const pointer = Number.isInteger(temporalState?.pointer)
  ? temporalState.pointer
  : -1;

let pointerPosition = temporalState?.pointerPosition;

// 🛡️ TEMPORAL EDGE CASE FIX
// ako nema future obveza pointer mora biti "after"
if (
  temporalState &&
  Array.isArray(temporalState.future) &&
  temporalState.future.length === 0 &&
  sections.active.length > 0
) {
  pointerPosition = "after";
}

const activeSnapshot = [...sections.active];

activeSnapshot.forEach((ob, index) => {

  // pointer BEFORE first obligation
  if (index === 0 && pointerPosition === 'before') {
  htmlParts.push(buildTemporalPointer());
}

  // pointer BETWEEN obligations
  if (index === 0 && pointerPosition === 'before') {
  htmlParts.push(buildTemporalPointer());
}

  // pointer ON obligation
  if (index === 0 && pointerPosition === 'before') {
  htmlParts.push(buildTemporalPointer());
}

  htmlParts.push(buildObligationCard(ob, lang));

  // pointer AFTER last obligation
  if (
  pointerPosition === 'after' &&
  index === sections.active.length - 1
) {
  htmlParts.push(buildTemporalPointer());
}

}); 

    htmlParts.push(`</div>`);
  }

  // SECTION: Kad stigneš (NO temporal pointer)
  if (sections.whenYouCan.length > 0) {
    htmlParts.push(`<div class="obligations-section-title">${sections.labels.whenYouCan || 'Kad stigneš'}</div>`);
    htmlParts.push(`<div class="obligations-list no-timeline" data-testid="when-you-can">`);
    
    sections.whenYouCan.forEach(ob => {
      htmlParts.push(buildObligationCard(ob, lang));
    });

    htmlParts.push(`</div>`);
  }

  // SECTION: Završeno danas (collapsed by default)
  if (sections.doneToday.length > 0) {
    htmlParts.push(`
      <div class="obligations-section-title done-section collapsed" id="doneTodayHeader" data-testid="done-today-header">
        ${sections.labels.doneToday || 'Završeno danas'} (${sections.doneToday.length})
      </div>
      <div class="obligations-list done-list hidden" id="doneTodayList" data-testid="done-today-list">
    `);
    
    sections.doneToday.forEach(ob => {
      htmlParts.push(buildObligationCard(ob, lang));
    });

    htmlParts.push(`</div>`);
  }

  return htmlParts.join('');
}

// ===== EVENT DELEGATION =====
const delegationSetup = new WeakSet();

export function attachObligationHandlers(container) {
  if (!container) return;
  if (delegationSetup.has(container)) return;
  delegationSetup.add(container);

  container.addEventListener("click", (e) => {
    const target = e.target;

    // Quick Done button (0.5s animation)
    const quickDoneBtn = target.closest(".obligation-quick-done");
    if (quickDoneBtn) {
      e.stopPropagation();
      const id = parseInt(quickDoneBtn.dataset.id, 10);
      handleDoneAction(id);
      return;
    }

    // Delete button
    const deleteBtn = target.closest(".obligation-delete");
    if (deleteBtn) {
      e.stopPropagation();
      deleteBtn.classList.add("tap");
      const id = parseInt(deleteBtn.dataset.id, 10);
      setTimeout(() => deleteBtn.classList.remove("tap"), 150);
      window.deleteObligation?.(id);
      return;
    }

    // Edit button
    const editBtn = target.closest(".obligation-edit");
    if (editBtn) {
      e.stopPropagation();
      const id = parseInt(editBtn.dataset.id, 10);
      window.openEditObligation?.(id);
      return;
    }

    // Card tap → Edit
    const card = target.closest(".obligation-card");
    if (card && !target.closest("button") && !target.closest(".obligation-quick-done")) {
      const id = parseInt(card.dataset.id, 10);
      window.openEditObligation?.(id);
      return;
    }

    // Done section toggle
    const doneSectionHeader = target.closest("#doneTodayHeader");
    if (doneSectionHeader) {
      toggleDoneSection();
      return;
    }

    // Empty state add button
    const emptyAddBtn = target.closest("#emptyAddBtn");
    if (emptyAddBtn) {
      window.showScreen?.('screen-add-obligation');
      return;
    }

    // Now indicator click
    const nowIndicator = target.closest("#nowIndicator");
    if (nowIndicator) {
      scrollToPointer();
      return;
    }
  });
}

// ===== DONE ACTION (0.5s animation) =====
async function handleDoneAction(id) {

  const card = document.querySelector(`.obligation-card[data-id="${id}"]`);
  if (!card) return;

  if (card.dataset.processing === "1") return;
  card.dataset.processing = "1";

  card.classList.add('completing');

  await new Promise(resolve => setTimeout(resolve, 500));

  window.toggleObligationStatus?.(id, "done");

  delete card.dataset.processing;

}

// ===== TOGGLE DONE SECTION =====
function toggleDoneSection() {
  const header = document.getElementById('doneTodayHeader');
  const list = document.getElementById('doneTodayList');

  if (header && list) {
    header.classList.toggle('collapsed');
    list.classList.toggle('hidden');
  }
}

// ===== SCROLL TO POINTER =====
export function scrollToPointer() {
  const pointer = document.getElementById('temporalPointer');
  if (pointer) {
    pointer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ===== AUTO SCROLL ON SCREEN OPEN =====
export function autoScrollOnOpen(temporalState) {
  const container = document.getElementById('obligationsContainer');
  if (!container) return;

  requestAnimationFrame(() => {
    const pointer = document.getElementById('temporalPointer');
    
    if (pointer) {
      pointer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (temporalState?.pointerPosition === 'before') {
      container.scrollTop = 0;
    } else if (temporalState?.pointerPosition === 'after') {
      container.scrollTop = container.scrollHeight;
    }
  });
}

// ===== NOW INDICATOR VISIBILITY =====
export function updateNowIndicatorVisibility() {
  const pointer = document.getElementById('temporalPointer');
  const nowIndicator = document.getElementById('nowIndicator');
  const container = document.getElementById('obligationsContainer');

  if (!pointer || !nowIndicator || !container) return;

  const pointerRect = pointer.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const isOutOfView = 
    pointerRect.bottom < containerRect.top || 
    pointerRect.top > containerRect.bottom;

  nowIndicator.classList.toggle('hidden', !isOutOfView);
}

// ===== HIGHLIGHT NEW OBLIGATION =====
export function highlightNewObligation(id) {
  if (!id) return;

  requestAnimationFrame(() => {
    const el = document.querySelector(`.obligation-card[data-id="${id}"]`);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      el.classList.add("obligation-new");
      setTimeout(() => {
        el.classList.remove("obligation-new");
      }, 2000);
    }, 350);
  });
}

// ===== YESTERDAY UNFINISHED DIALOG =====
export async function checkYesterdayUnfinished() {
  // prevent multiple dialogs
if (window.__LK_YESTERDAY_DIALOG_OPEN__) return;
window.__LK_YESTERDAY_DIALOG_OPEN__ = true;
  const obligations = await obligationDB.getAll();
  const lang = window.getLang?.() || 'hr';
  const t = window.I18N?.[lang]?.yesterday || window.I18N?.hr?.yesterday;

  const yesterdayUnfinished = obligations.filter(o => {
    if (o.status === 'done') return false;
    if (!o.dateTime) return false;
    return isYesterday(o.dateTime);
  });

  if (yesterdayUnfinished.length === 0) {
  window.__LK_YESTERDAY_DIALOG_OPEN__ = false;
  return;
}

  const dialog = document.createElement('div');
  dialog.className = 'yesterday-dialog';
  dialog.innerHTML = `
    <div class="yesterday-dialog-content">
      <div class="yesterday-title">${t?.title || 'Jučerašnje obveze'}</div>
      <div class="yesterday-message">${t?.message || 'Neke jučerašnje obveze nisu završene.'}</div>
      <div class="yesterday-actions">
        <button class="yesterday-btn move" id="moveToToday">${t?.moveToToday || 'Premjesti u danas'}</button>
        <button class="yesterday-btn keep" id="keepYesterday">${t?.keepYesterday || 'Ostavi u jučer'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById('moveToToday').addEventListener('click', async () => {
    const today = todayISO();
    for (const ob of yesterdayUnfinished) {
      const oldTime = ob.dateTime.split('T')[1] || '09:00';
      ob.dateTime = `${today}T${oldTime}`;
      await obligationDB.add(ob);
    }
    dialog.remove();
window.__LK_YESTERDAY_DIALOG_OPEN__ = false;
    Temporal.setObligations(await obligationDB.getAll());
    window.refreshCurrentObligationsView?.();
  });

  document.getElementById('keepYesterday').addEventListener('click', () => {
    dialog.remove();
window.__LK_YESTERDAY_DIALOG_OPEN__ = false;
  });
}

// ===== RECURRING OBLIGATIONS =====
export async function processRecurringObligation(obligation) {
  if (!obligation.repeat || obligation.status !== 'done') return null;
  
  const currentDate = new Date(obligation.dateTime);
  const nextDate = new Date(currentDate);
  
  switch (obligation.repeat) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return null;
  }
  
  const newObligation = {
    id: Date.now(),
    type: 'obligation',
    title: obligation.title,
    note: obligation.note,
    dateTime: nextDate.toISOString().slice(0, 16),
    reminder: obligation.reminder,
    repeat: obligation.repeat,
    status: 'active',
    createdAt: new Date().toISOString(),
    parentId: obligation.id
  };
  
  await obligationDB.add(newObligation);
  console.log(`[Recurring] Created next: "${obligation.title}" at ${newObligation.dateTime}`);
  
  return newObligation;
}

// ===== MOBILE LIFECYCLE =====
export function setupMobileLifecycle() {
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      console.log('[Lifecycle] App resumed');
      const obligations = await obligationDB.getAll();
      Temporal.setObligations(obligations);
      Temporal.triggerUIRender?.();
      checkYesterdayUnfinished();
    }
  });

  if (window.Capacitor?.Plugins?.App) {
    window.Capacitor.Plugins.App.addListener('appStateChange', async (state) => {
      if (state.isActive) {
        console.log('[Lifecycle] Capacitor resume');
        const obligations = await obligationDB.getAll();
        Temporal.setObligations(obligations);
        Temporal.triggerUIRender?.();
      }
    });
  }
}

// ===== MIDNIGHT HANDLER =====
window.addEventListener('temporalMidnight', async () => {
  console.log('[Midnight] Day transition');
  const obligations = await obligationDB.getAll();
  Temporal.setObligations(obligations);
  window.refreshCurrentObligationsView?.();
  setTimeout(() => autoScrollOnOpen(Temporal.getState()), 100);
  checkYesterdayUnfinished();
});

// ===== TEMPORAL SUBSCRIBER =====
// Temporal subscriber moved to app-init.js
// obligations module remains renderer-only

// ===== INIT MOBILE LIFECYCLE =====
setupMobileLifecycle();
