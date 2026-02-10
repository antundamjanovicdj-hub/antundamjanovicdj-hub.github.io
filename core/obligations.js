// core/obligations.js
// LifeKompas — Obligations Module (scaffold)
// ZERO-RISK STEP 1: no side-effects, no runtime changes.
// In the next steps, we will move code from app-init.js into this module gradually.

// ---- TEMP SAFE WRAPPERS ----
// These wrappers allow us to import this module later without breaking existing behavior.

import { getISODateFromDateTime, todayISO } from './app-init.js';

export function attachObligationHandlers(container) {
  if (typeof window.attachObligationHandlers === 'function') {
    return window.attachObligationHandlers(container);
  }
  throw new Error('[obligations] attachObligationHandlers not wired yet');
}

export async function renderObligationsList() {
  if (typeof window.renderObligationsList === 'function') {
    return window.renderObligationsList();
  }
  throw new Error('[obligations] renderObligationsList not wired yet');
}

export function showListMode() {
  if (typeof window.showListMode === 'function') {
    return window.showListMode();
  }
  throw new Error('[obligations] showListMode not wired yet');
}

export function showDailyMode() {
  if (typeof window.showDailyMode === 'function') {
    return window.showDailyMode();
  }
  throw new Error('[obligations] showDailyMode not wired yet');
}

export async function loadDailyForDate(isoDate) {
  if (typeof window.loadDailyForDate === 'function') {
    return window.loadDailyForDate(isoDate);
  }
  throw new Error('[obligations] loadDailyForDate not wired yet');
}

export function refreshCurrentObligationsView() {
  if (typeof window.refreshCurrentObligationsView === 'function') {
    return window.refreshCurrentObligationsView();
  }
  throw new Error('[obligations] refreshCurrentObligationsView not wired yet');
}
export function buildObligationCard(ob, lang) {
  // ===== NORMALIZE OB OBJECT (prevent "undefined") =====
  const safe = {
    id: ob.id,
    title: ob.title || '',
    note: ob.note || '',
    dateTime: ob.dateTime || null,
    reminder: ob.reminder || null,
    repeat: ob.repeat || null,
    status: ob.status || 'active'
  };

  const t = (window.I18N && I18N[lang]) ? I18N[lang] : I18N.hr;
  const ol = (t && t.obligationsList) ? t.obligationsList : I18N.hr.obligationsList;

  const dt = safe.dateTime ? new Date(safe.dateTime) : null;
  const dateStr = dt ? dt.toLocaleDateString((t && t.lang) || 'hr-HR') : '—';
  const timeStr = dt ? dt.toLocaleTimeString((t && t.lang) || 'hr-HR', { hour: '2-digit', minute: '2-digit' }) : '—';
  const isOverdue =
  safe.dateTime &&
  getISODateFromDateTime(safe.dateTime) < todayISO();

  const overdueHint = isOverdue
  ? `<div style="font-size:12px; opacity:0.6; margin-top:2px;">Zakašnjelo</div>`
  : '';

  let reminderStr = '';
  if (safe.reminder) {
    const key = `reminder${safe.reminder}`;
    reminderStr = (ol && ol[key]) ? ol[key] : `${safe.reminder} min`;
  }

  let repeatIcon = '';
  let repeatTitle = '';

  if (safe.repeat) {
    repeatIcon = ' 🔁';
    if (safe.repeat === 'daily') repeatTitle = (t.obligation?.repeatDaily || 'Daily');
    else if (safe.repeat === 'weekly') repeatTitle = (t.obligation?.repeatWeekly || 'Weekly');
    else repeatTitle = '';
  }

  const statusDoneText = ol.statusDone || 'Done';
  const statusActiveText = ol.statusActive || 'Active';

  const statusText = safe.status === 'done'
    ? `✅ ${statusDoneText}`
    : `⏳ ${statusActiveText}`;

const bgColor = safe.status === 'done'
  ? '#e8f5e9'
  : isOverdue
    ? '#f7f7f7'
    : '#e3f2fd';

const borderColor = safe.status === 'done'
  ? '#4caf50'
  : isOverdue
    ? '#bbb'
    : '#2196f3';

  const toggleBtnText = safe.status === 'done'
    ? (ol.markActive || '⏳ Active')
    : (ol.markDone || '✅ Done');

  const editText = ol.edit || 'Edit';
  const deleteText = ol.delete || 'Delete';

  return `
    <div class="obligation-card" data-id="${safe.id}" style="background:${bgColor}; border-left:4px solid ${borderColor};">
      <div class="obligation-title" title="${repeatTitle}">${safe.title}${repeatIcon}</div>

      ${safe.note ? `<div class="obligation-note">${safe.note}</div>` : ''}

      <div class="obligation-meta">
        <div class="obligation-date">
  📅 ${dateStr}
  ${overdueHint}
</div>
<div class="obligation-time">⏰ ${timeStr}</div>
        ${reminderStr ? `<div class="obligation-reminder">🔔 ${reminderStr}</div>` : ''}
        <div class="obligation-status">${statusText}</div>
      </div>

      <button class="obligation-toggle-status" data-id="${safe.id}" data-status="${safe.status}">
        ${toggleBtnText}
      </button>

      <button class="obligation-edit" data-id="${safe.id}">✏️ ${editText}</button>

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