// core/obligations.js
// LifeKompas — Obligations Module with ALL Features
// TEMPORAL ENGINE + SEKCIJE + EMPTY STATE + NOW INDICATOR + DONE ACTION

const __OBLIGATIONS_MODULE__ = true;

import { obligationDB } from "./db.js";
import Temporal from "../src/core/temporal/index.js";
import { getISODateFromDateTime, todayISO } from "./date-utils.js";
// cache za already scheduled reminders
const scheduledReminderCache = new Set();

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

window.renderObligationsList_SAFE = renderObligationsList_SAFE;

// ===== FALLBACK STATE (CRASH-SAFE) =====
function renderFallbackState() {
  const container = document.getElementById('obligationsContainer');
  if (!container) return;

  const lang = window.getLang?.() || 'hr';
  container.innerHTML = buildEmptyState(lang);
}

// ===== MAIN LIST RENDER =====
export function renderObligationsList(obligations = []) {
  const container = document.getElementById('obligationsContainer');
  if (!container) return;

  const lang = window.getLang?.() || 'hr';
  const temporalState = Temporal.getState?.() || {};

  container.innerHTML = renderAllSections(obligations, temporalState, lang);

  if (!window.__LK_POINTER_SCROLLED__) {

  setTimeout(() => {
  scrollToPointer();
  window.__LK_POINTER_SCROLLED__ = true;
}, 80);

}

  attachObligationHandlers(container);
  updateNowIndicatorVisibility();

  requestAnimationFrame(() => {
    updateNowIndicatorVisibility();
  });

  return container.innerHTML;
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
  String(o.dateTime).match(/T\d{2}:\d{2}/) &&
  getISODateFromDateTime(o.dateTime) === today
  ).sort((a, b) => {

  const timeDiff = new Date(a.dateTime) - new Date(b.dateTime);

  if (timeDiff !== 0) return timeDiff;

  // stabilni fallback za identično vrijeme
  return (a.id || 0) - (b.id || 0);

});

  // SECTION: Kad stigneš (no time, status = active)
  const whenYouCanObligations = obligations.filter(o => {

  if (o.status === "done") return false;

  const dt = o.dateTime;

  if (!dt) return true;

  const str = String(dt).trim();

  // nema vremena → Kad stigneš
  if (!str.includes("T")) return true;

  return false;

});

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
      <div class="pointer-now">SADA</div>
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

function buildFreeTimeMessage(temporalState, sections) {
  if (!temporalState?.nextChangeAt) return null;

// nema više obveza danas → ne prikazuj free time
if (!temporalState?.future?.length) return null;

  const now = temporalState.now || Date.now();
  const diff = temporalState.nextChangeAt - now;

  const minutes = Math.floor(diff / 60000);

  if (minutes < 10) return null;

  let text = "⏳ ";

  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (m === 0) {
      text = `🌿 Imaš ${h}h slobodno`;
    } else {
      text = `🌿 Imaš ${h}h ${m}min slobodno`;
    }
  } else {
    text = `🌿 Imaš ${minutes} min slobodno`;
  }

  // Kad stigneš prijedlog (max 2)
  let suggestions = "";

  if (sections?.whenYouCan?.length) {
    const items = sections.whenYouCan.slice(0, 2);

    suggestions = `
  <div class="free-time-suggestions">
    Možda sada:
    ${items.map(i => `<div class="free-time-item" data-id="${i.id}">• ${escapeHtml(i.title)}</div>`).join("")}
  </div>
`;
  }

  return `
    <div class="free-time-block" data-testid="free-time-block">
      <div class="free-time-text">${text}</div>
      ${suggestions}
    </div>
  `;
}


// ===== RENDER ALL SECTIONS =====
export function renderAllSections(obligations, temporalState, lang = 'hr') {
  const sections = buildSections(obligations, temporalState);

const {
  active = [],
  whenYouCan = [],
  doneToday = [],
  labels = {}
} = sections;
  console.log("SECTIONS RESULT", {
  active: sections.active.length,
  whenYouCan: sections.whenYouCan.length,
  doneToday: sections.doneToday.length
});
  const t = window.I18N?.[lang]?.obligationsView || window.I18N?.hr?.obligationsView;

  console.log("DEBUG SECTIONS", {
    obligations,
    active: sections?.active,
    whenYouCan: sections?.whenYouCan,
    doneToday: sections?.doneToday,
    temporalTimed: temporalState?.timedObligations,
    pointer: temporalState?.pointer,
    pointerPosition: temporalState?.pointerPosition
  });

  const htmlParts = [];

  // ===== UPDATE DAILY STATE =====
const dailyTitle = document.querySelector(".daily-state-title");
const dailySubtitle = document.querySelector(".daily-state-subtitle");

if (dailyTitle && dailySubtitle) {

  const count = sections.active?.length || 0;

  if (count >= 5) {
    dailyTitle.textContent = "⚡ Gust raspored";
    dailySubtitle.textContent = "Danas imaš puno obveza.";
  } else {
    dailyTitle.textContent = "🌿 Miran dan";
    dailySubtitle.textContent = "Sve je pod kontrolom.";
  }

}

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

const whenYouCanList = sections.whenYouCan;

const hasWhenYouCan = whenYouCanList.length > 0;
const hasDone = doneToday.length > 0;

if (!hasTimedObligations && !hasWhenYouCan && !hasDone) {
  return buildEmptyState(lang);
}

  // SECTION: Active obligations with temporal pointer
  // SECTION: Active obligations (timed → temporal timeline)
if (hasTimedObligations) {
    htmlParts.push(`<div class="obligations-section-title">${sections.labels.active || 'Aktivne obveze'}</div>`);
    htmlParts.push(`<div class="obligations-list with-timeline" data-testid="active-obligations">`);
    
   const activeSnapshot = Array.isArray(sections.active)
  ? [...sections.active]
  : [];

// 🫀 ensure pointer uses temporal timeline order
if (Array.isArray(temporalState?.timedObligations)) {
  const temporalIds = temporalState.timedObligations.map(o => o.id);
  activeSnapshot.sort((a, b) => {
  const ai = temporalIds.indexOf(a.id);
const bi = temporalIds.indexOf(b.id);

if (ai === -1 || bi === -1) {
  return (a.id || 0) - (b.id || 0);
}

  if (ai !== bi) return ai - bi;

  // fallback stabilnost ako su indeksi isti
  return (a.id || 0) - (b.id || 0);
});
}

// 🫀 POINTER FROM TEMPORAL ENGINE
let pointer = hasTimedObligations && Number.isInteger(temporalState?.pointer)
  ? temporalState.pointer
  : null;

let pointerPosition = hasTimedObligations
  ? (temporalState?.pointerPosition ?? null)
  : null;

// 🛡️ FALLBACK ako temporal još nije spreman
if (pointerPosition === null && activeSnapshot.length > 0) {

  const nowTs = Date.now();

  const timed = activeSnapshot
    .map((ob, i) => {
      const dt = safeParseDate(ob.dateTime);
      return { index: i, ts: dt ? dt.getTime() : null };
    })
    .filter(o => Number.isFinite(o.ts));

  const firstFuture = timed.find(o => o.ts >= nowTs);

  if (!firstFuture) {
    pointerPosition = 'after';
    pointer = activeSnapshot.length - 1;
  }
  else if (firstFuture.index === 0) {
    pointerPosition = 'before';
    pointer = 0;
  }
  else {
    pointerPosition = 'between';
    pointer = firstFuture.index;
  }

}

// 🛡️ CLAMP sigurnost
if (Number.isInteger(pointer)) {
  if (pointer < 0) pointer = 0;
  if (pointer >= activeSnapshot.length) pointer = activeSnapshot.length - 1;
}

activeSnapshot.forEach((ob, index) => {

  try {

    // BEFORE first obligation
    if (pointerPosition === 'before' && index === 0) {
  htmlParts.push(buildTemporalPointer());

  const freeBlock = buildFreeTimeMessage(temporalState, sections);
  if (freeBlock) htmlParts.push(freeBlock);
}

    // render obligation
    htmlParts.push(buildObligationCard(ob, lang));

    // BETWEEN obligations
    if (pointerPosition === 'between' && index === pointer) {
  htmlParts.push(buildTemporalPointer());

  const freeBlock = buildFreeTimeMessage(temporalState, sections);
  if (freeBlock) htmlParts.push(freeBlock);
}

    // ON obligation
    if (pointerPosition === 'on' && index === pointer) {
  htmlParts.push(buildTemporalPointer());

  const freeBlock = buildFreeTimeMessage(temporalState, sections);
  if (freeBlock) htmlParts.push(freeBlock);
}

    // AFTER last obligation
    if (pointerPosition === 'after' && index === activeSnapshot.length - 1) {
  htmlParts.push(buildTemporalPointer());

  const freeBlock = buildFreeTimeMessage(temporalState, sections);
  if (freeBlock) htmlParts.push(freeBlock);
}

  } catch (err) {

    console.error("OBLIGATION RENDER ERROR", err, ob);

  }

});

    htmlParts.push(`</div>`);
  }

  // SECTION: Kad stigneš (NO temporal pointer)
  if (hasWhenYouCan) {
  htmlParts.push(`<div class="obligations-section-title">${sections.labels.whenYouCan || 'Kad stigneš'}</div>`);
  htmlParts.push(`<div class="obligations-list no-timeline" data-testid="when-you-can">`);

  whenYouCanList.forEach(ob => {
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

    // Free time suggestion click → scroll to obligation
const suggestion = target.closest(".free-time-item");
if (suggestion) {
  const id = suggestion.dataset.id;
  const el = document.querySelector(`.obligation-card[data-id="${id}"]`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  const obligations = await obligationDB.getAll();
const ob = obligations.find(o => o.id === id);

if (ob) {
  const next = await processRecurringObligation(ob);
  if (next) {
    Temporal.setObligations(await obligationDB.getAll());
  }
}

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

export function scrollToPointer() {
  const temporalState =
    Temporal.getState?.() ||
    window.__TEMPORAL_STATE__ ||
    {};

  const pointer = document.getElementById('temporalPointer');

  const candidates = [];
  const directContainer = document.getElementById('obligationsContainer');
  if (directContainer) candidates.push(directContainer);

  let el = (pointer || directContainer)?.parentElement;
  while (el && el !== document.body) {
    candidates.push(el);
    el = el.parentElement;
  }

  const docScrollEl = document.scrollingElement || document.documentElement;
  if (docScrollEl) candidates.push(docScrollEl);

  const uniqueCandidates = [...new Set(candidates)];

  const container = uniqueCandidates.find((node) => {
    if (!node || node === window) return false;
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    return /(auto|scroll)/.test(overflowY) && node.scrollHeight > node.clientHeight;
  });

  const scrollTarget = container || window;

  // fallback: no DOM pointer, but temporal state says before/after
  if (!pointer) {
    if (temporalState?.pointerPosition === 'before') {
      if (scrollTarget === window) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (temporalState?.pointerPosition === 'after') {
      if (scrollTarget === window) {
        const doc = document.scrollingElement || document.documentElement;
        window.scrollTo({
          top: doc.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        scrollTarget.scrollTo({
          top: scrollTarget.scrollHeight,
          behavior: 'smooth'
        });
      }
      return;
    }

    console.log('[scrollToPointer] no pointer and no before/after fallback');
    return;
  }

  const pointerRect = pointer.getBoundingClientRect();

  if (container) {
    const containerRect = container.getBoundingClientRect();

    const targetTop =
      pointerRect.top -
      containerRect.top +
      container.scrollTop -
      (container.clientHeight / 2) +
      (pointerRect.height / 2);

    container.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });

    return;
  }

  const winTargetTop =
    pointerRect.top +
    window.pageYOffset -
    (window.innerHeight / 2) +
    (pointerRect.height / 2);

  window.scrollTo({
    top: Math.max(0, winTargetTop),
    behavior: 'smooth'
  });
}

// ===== AUTO SCROLL ON SCREEN OPEN =====
export function autoScrollOnOpen(temporalState, attempt = 0) {
  const directContainer =
  document.getElementById('obligationsContainer') ||
  document.querySelector('.obligations-list');
  if (!container) return;

  const pointer = document.getElementById('temporalPointer');

  const scrollParent = (() => {
    let el = pointer || container;

    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      const canScroll =
        /(auto|scroll)/.test(style.overflowY) &&
        el.scrollHeight > el.clientHeight;

      if (canScroll) return el;
      el = el.parentElement;
    }

    return container;
  })();

  const layoutReady =
    container.offsetHeight > 0 &&
    scrollParent.clientHeight > 0 &&
    scrollParent.scrollHeight >= scrollParent.clientHeight;

  const pointerReady =
    !!pointer &&
    pointer.getBoundingClientRect().height >= 0;

  if ((!layoutReady || !pointerReady) && attempt < 12) {
    setTimeout(() => autoScrollOnOpen(temporalState, attempt + 1), 80);
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const livePointer = document.getElementById('temporalPointer');

      if (livePointer) {
        const pointerRect = livePointer.getBoundingClientRect();
        const parentRect = scrollParent.getBoundingClientRect();

        const currentScrollTop =
          scrollParent === window
            ? window.pageYOffset || document.documentElement.scrollTop || 0
            : scrollParent.scrollTop;

        const pointerTop =
          pointerRect.top - parentRect.top + currentScrollTop;

        const targetScroll = Math.max(
          0,
          pointerTop - (scrollParent.clientHeight / 2)
        );

        if (scrollParent === window) {
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        } else {
          scrollParent.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }

        console.log('[autoScrollOnOpen]', {
          attempt,
          scrollParentId: scrollParent.id || '(no-id)',
          containerHeight: container.clientHeight,
          parentHeight: scrollParent.clientHeight,
          parentScrollHeight: scrollParent.scrollHeight,
          pointerTop,
          targetScroll
        });

      } else if (temporalState?.pointerPosition === 'before') {
        scrollParent.scrollTop = 0;

      } else if (temporalState?.pointerPosition === 'after') {
        scrollParent.scrollTop = scrollParent.scrollHeight;
      }
    });
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
  window.scheduleReminder?.(newObligation);
  
  return newObligation;
}

// ===== MOBILE LIFECYCLE =====
export function setupMobileLifecycle() {
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      console.log('[Lifecycle] App resumed');
      recoverReminders();
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
  scheduledReminderCache.clear();
  const obligations = await obligationDB.getAll();
  // generate next recurring obligations automatically
for (const ob of obligations) {

  if (!ob.repeat) continue;
  if (ob.status === "done") continue;
  if (!ob.dateTime) continue;

  const iso = getISODateFromDateTime(ob.dateTime);

  if (iso === todayISO()) {

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextISO = tomorrow.toISOString().slice(0, 10);

  const exists = obligations.some(o =>
    o.parentId === ob.id &&
    getISODateFromDateTime(o.dateTime) === nextISO
  );

  if (!exists) {
    await processRecurringObligation(ob);
  }

}

}
  Temporal.setObligations(obligations);
  window.refreshCurrentObligationsView?.();
  setTimeout(() => autoScrollOnOpen(Temporal.getState()), 100);
  checkYesterdayUnfinished();
});

// ===== TEMPORAL SUBSCRIBER =====
// Temporal subscriber moved to app-init.js
// obligations module remains renderer-only

// ===== REMINDER RECOVERY ENGINE =====
export async function recoverReminders() {

  if (!window.scheduleReminder) return;

  const obligations = await obligationDB.getAll();
  const now = Date.now();

  for (const ob of obligations) {

    if (!ob.reminder) continue;
    if (!ob.dateTime) continue;
    if (ob.status === "done") continue;

    const eventTime = new Date(ob.dateTime).getTime();
    const reminderTime = eventTime - (ob.reminder * 60000);

    if (reminderTime <= now) continue;

    const key = `${ob.id}-${ob.dateTime}`;

if (scheduledReminderCache.has(key)) continue;

scheduledReminderCache.add(key);
window.scheduleReminder(ob);

  }

  console.log("[ReminderEngine] recovery scan complete");

}

// ===== INIT MOBILE LIFECYCLE =====
setupMobileLifecycle();
recoverReminders();
