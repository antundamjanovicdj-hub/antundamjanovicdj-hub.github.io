// core/obligations.js
// LifeKompas — Obligations Module (scaffold)
// ZERO-RISK STEP 1: no side-effects, no runtime changes.
// In the next steps, we will move code from app-init.js into this module gradually.

// ---- TEMP SAFE WRAPPERS ----
// These wrappers allow us to import this module later without breaking existing behavior.
// For now, nothing imports this file, so it changes nothing.

export function buildObligationCard(ob, lang) {
  if (typeof window.buildObligationCard === 'function') {
    return window.buildObligationCard(ob, lang);
  }
  throw new Error('[obligations] buildObligationCard not wired yet');
}

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