// ===== BOOTSTRAP (must be first) =====
import '../bootstrap.js';

// 🫀 Temporal must be directly available (no race condition)
import Temporal from '/core/temporal/index.js';

import { getLang } from '/core/utils/utils.js';
import { getFreshTemporalState } from '../temporal/temporal-bridge.js';

// 🫀 TEMPORAL SUBSCRIBER (source of truth for list)
window.__temporalRerenderQueued = false;
window.__obligationsRenderLock = false;

Temporal.subscribe((state) => {

  console.log('🧭 TEMPORAL STATE', {
    now: state.now,
    pointer: state.pointer,
    past: Array.isArray(state.past) ? state.past.length : 0,
    future: Array.isArray(state.future) ? state.future.length : 0,
    nextChangeAt: state.nextChangeAt
  });

  const activeId = document.querySelector('.screen.active')?.id;
  const mode = window.AppState?.obligations?.viewMode || 'list';

  if (activeId !== 'screen-obligations-list') return;
  if (mode !== 'list') return;

  if (window.__obligationsRenderLock) return;
  if (window.__temporalRerenderQueued) return;

  window.__temporalRerenderQueued = true;

  requestAnimationFrame(() => {
    window.__temporalRerenderQueued = false;
    try {
      renderObligationsList();
    } catch (e) {
      console.log('[Temporal] list rerender skipped', e);
    }
  });
});

// ===== GLOBAL ERROR GUARD (STABILIZATION WALL) =====

window.addEventListener('error', (e) => {
  console.error('GLOBAL ERROR:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('UNHANDLED PROMISE:', e.reason);
  console.error('STACK:', e.reason?.stack);
  console.error('FULL EVENT:', e);
});

/* =====================================================
   CLICK GUARD — prevents multi-tap chaos
   ===================================================== */

let clickLocked = false;

document.addEventListener('click', (e) => {
  if (e.target.closest('#lkTesterBtn')) return;

  if (clickLocked) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return;
  }

  clickLocked = true;

  setTimeout(() => {
    clickLocked = false;
  }, 350); // sweet spot
});

/*
=====================================================
ENGINE HOST FILE

app-init.js je GLAVNI runtime host.

DO NOT:
- premještati engine logiku u druge init fajlove
- duplicirati navigation
- stvarati drugi entry point

NEXT PHASE:
👉 controlled engine consolidation
(ne prije stabilizacijskog sprinta)
=====================================================
*/
// core/app-init.js
// LifeKompas INIT EXTRACTION – STEP 1 (scaffold)
// Namjerno prazno: u sljedećem koraku selimo veliki dio koda iz index.html ovdje.

// 🔔 LifeKompas notification bootstrap
import('../services/notifications.js')
  .then(() => console.log('🔔 notifications module loaded'))
  .catch(e => console.log('🔔 notifications bootstrap skipped', e));

console.log('[LifeKompas] app-init.js loaded');
/* ===== LIFEKOMPAS TESTER MODE DISABLED DURING STABILIZATION =====
setTimeout(() => {

  // 1) PROMPT + SAVE (ne ovisi o Capacitoru)
  let testerName = localStorage.getItem('lkTesterName');

  if (!testerName) {
    testerName = prompt("LifeKompas tester ime (Antun, Ruža, Mama...)");
    if (!testerName) testerName = "unknown";
    localStorage.setItem('lkTesterName', testerName);
  }

  console.log("🧪 Tester name:", testerName);

  // 2) FIREBASE PROPERTY (retry dok plugin ne bude spreman)
  (async () => {
    for (let i = 0; i < 12; i++) {
      try {
        const FirebaseAnalytics =
          window.Capacitor?.Plugins?.FirebaseAnalytics;

        if (!FirebaseAnalytics) throw new Error("FirebaseAnalytics plugin not ready yet");

        await FirebaseAnalytics.setUserProperty({
          name: "tester",
          value: testerName
        });

        console.log("🧪 Tester registered (Firebase):", testerName);
        return;

      } catch (e) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    console.log("Tester mode: Firebase not ready after retries");
  })();

}, 1800);
*/


/* ===== FIREBASE ANALYTICS DISABLED DURING STABILIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const FirebaseAnalytics =
      window.Capacitor?.Plugins?.FirebaseAnalytics;

    if (FirebaseAnalytics) {
      await FirebaseAnalytics.setEnabled({ enabled: true });
      console.log('🔥 Firebase Analytics ENABLED');
    } else {
      console.log('Firebase Analytics plugin not available (skip)');
    }
  } catch (err) {
    console.log('Firebase Analytics init skipped', err);
  }
});
*/

/* =====================================================
   GLOBAL ERROR GUARD — LIFEOMPAS CORE SAFETY NET
   Must stay at INIT level.
   ===================================================== */

window.addEventListener('error', (event) => {

  console.error('[GLOBAL ERROR]', event.error);

  // fallback — nikad blank screen
  const active = document.querySelector('.screen.active');

  if (!active) {
    const menu = document.getElementById('screen-menu');
    if (menu) {
      menu.classList.add('active');
      menu.style.display = 'block';
    }
  }

});

window.addEventListener('unhandledrejection', (event) => {

  console.error('[UNHANDLED PROMISE]', event.reason);

});

// ===== APP VERSION =====
const APP_VERSION = "0.1.1-family-test";

// ===== UX 1.6 – SCREEN HISTORY (GLOBAL) =====
const screenHistory = [];

// ===== BATTERY OPTIMIZATION CHECK =====
import { checkBatteryOptimization } from '/core/services/battery.js';
import {
  obligationDB,
  addShoppingItem,
  getShoppingItems,
  updateShoppingItem,
  deleteShoppingItem
} from '/core/services/db.js';
// DEBUG: expose DB to console
window.obligationDB = obligationDB;
import { buildObligationCard, renderAllSections } from '/modules/obligations/obligations.js';
import { attachObligationHandlers } from "/modules/obligations/obligations.js";

// ZERO-RISK SHADOW IMPORT (obligations module)
window.checkBatteryOptimization = checkBatteryOptimization;
document.getElementById("appVersion").textContent = "v" + APP_VERSION;
// ===== GLOBAL CONFIG =====
const CONFIG = {
  notificationsEnabled: true,
  serviceWorkerEnabled: !window.Capacitor, // ✅ SW samo na webu/localhostu
  debug: false
};
// ===== INIT SERVICE WORKER (guarded) =====
if (CONFIG.serviceWorkerEnabled) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.log("SW registration error:", err));
  }
}
/* ===== HELPERS ===== */

// ✅ DETEKCIJA TOUCH UREĐAJA (MOBITEL / TABLET)
const IS_TOUCH_DEVICE =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0;

export function getISODateFromDateTime(dateTimeStr) {
  if (!dateTimeStr) return null;
  return String(dateTimeStr).split('T')[0] || null;
}

export function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// 🫀 iOS / mobile resume fix — refresh Temporal state when app returns
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible") {
    try {

      const { temporalState } = await getFreshTemporalState();

      window.__TEMPORAL_STATE__ =
        temporalState || window.__TEMPORAL_STATE__;

      if (document.getElementById('screen-obligations-list')?.classList.contains('active')) {

        window.__temporalRerenderQueued = false;

        requestAnimationFrame(() => {
          renderObligationsList?.();
        });

      }

    } catch (err) {
      console.warn("[Temporal] Resume refresh failed:", err);
    }
  }
});

// ===== TEMPORAL MIDNIGHT EVENT =====
window.addEventListener('temporalMidnight', () => {

  console.log('[Temporal] Midnight UI refresh');

  try {

    window.__SCROLL_TO_POINTER_ON_OPEN__ = true;
    window.__temporalRerenderQueued = false;

    if (document.getElementById('screen-obligations-list')?.classList.contains('active')) {

      requestAnimationFrame(() => {
        renderObligationsList?.();
      });

    }

  } catch (err) {
    console.warn('[Temporal] Midnight UI refresh failed:', err);
  }

});

// ===== CAPACITOR APP RESUME GUARD =====
try {

  const CapApp = window.Capacitor?.Plugins?.App;

  if (CapApp) {

    CapApp.addListener('appStateChange', async ({ isActive }) => {

      if (!isActive) return;

      console.log('[Lifecycle] App resumed');

      try {

        const all = await obligationDB.getAll();
        Temporal.setObligations(all);

        window.__TEMPORAL_STATE__ =
          Temporal.getState?.() || window.__TEMPORAL_STATE__;

        if (document.getElementById('screen-obligations-list')?.classList.contains('active')) {

          window.__temporalRerenderQueued = false;

          requestAnimationFrame(() => {
            renderObligationsList?.();
          });

        }

      } catch (err) {
        console.warn('[Lifecycle] Resume refresh failed:', err);
      }

    });

  }

} catch (e) {

  console.log('[Lifecycle] Capacitor App plugin not available');

}

/* =====================================================
   OBLIGATIONS ENGINE
   ===================================================== */
   /*
  ⚠️ EXTRACTION FREEZE (IMPORTANT)

  Obligations engine is currently STABLE and owned by app-init.js.

  Do NOT partially move logic to obligations.js.
  Do NOT refactor inside extraction.
  Do NOT split functions.

  Next allowed step:
  👉 FULL ENGINE MIGRATION (one controlled operation)

  Until then — engine is FROZEN.
*/

/* ===== LIST VIEW RENDER ===== */
async function renderObligationsList() {

  if (window.__obligationsRenderLock) return;
  window.__obligationsRenderLock = true;

  try {

    // 🔥 SINGLE SOURCE OF TRUTH

const { all, obligations, temporalState } = await getFreshTemporalState();

    const container = document.getElementById('obligationsContainer');
  console.log('🔍 [renderObligationsList] container:', {
    exists: !!container,
    display: container?.style?.display,
    classList: container?.classList?.value,
    offsetHeight: container?.offsetHeight,
    parentDisplay: container?.parentElement?.style?.display
  });
  const lang = getLang();
  const today = todayISO();

  console.log("📅 LifeKompas today =", today);

  const normalizeISO = (dt) =>
    getISODateFromDateTime(
      typeof dt === "string" && dt.length === 10
        ? dt + "T00:00"
        : dt
    );

  console.log(
    "DEBUG obligations:",
    all.map(o => ({
      title: o.title,
      dateTime: o.dateTime,
      iso: getISODateFromDateTime(o.dateTime),
      today: today
    }))
  );

  if (window.AppState.obligations.viewMode === 'days') {
  container.innerHTML = renderAllObligationsTimeline(obligations, lang);
} else {
  container.innerHTML = renderAllSections(obligations, temporalState, lang);
}
attachObligationHandlers(container);

// 🫀 NOW INDICATOR SYNC (AFTER DOM + LAYOUT)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    window.updateNowIndicatorVisibility?.();
  });
});

// 🫀 pointer stabilization tick (fix for iOS layout delay)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {

    const pointer = document.querySelector('.temporal-pointer');

    if (!pointer) {
  window.updateNowIndicatorVisibility?.();
  return;
}

    // force reflow so pointer position recalculates
    pointer.getBoundingClientRect();

    // update NOW indicator if exists
    window.updateNowIndicatorVisibility?.();

  });
});

// 🫀 iOS layout stabilization for temporal pointer
requestAnimationFrame(() => {
  requestAnimationFrame(() => {

    const pointer = document.querySelector('.temporal-pointer');

    if (pointer && window.__SCROLL_TO_POINTER_ON_OPEN__) {

      window.__SCROLL_TO_POINTER_ON_OPEN__ = false;

      pointer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }

  });
});

// 🫀 AUTO SCROLL TO TEMPORAL POINTER
if (window.__SCROLL_TO_POINTER_ON_OPEN__) {

  window.__SCROLL_TO_POINTER_ON_OPEN__ = false;

  requestAnimationFrame(() => {

    const pointer = document.querySelector('.temporal-pointer');

    if (pointer) {
      pointer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

  });

}

return;

  } finally {
    window.__obligationsRenderLock = false;
  }

/* ===== LEGACY SORT (DISABLED BY TEMPORAL) =====
  obligations.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    if (!a.dateTime) return 1;
    if (!b.dateTime) return -1;
    return new Date(a.dateTime) - new Date(b.dateTime);
  });
================================================ */
// 🫀 TEMPORAL INPUT
const temporalPast = temporalState?.past || [];
const temporalFuture = temporalState?.future || [];
const temporalPointer = temporalState?.pointer ?? null;

// compatibility variables (used later in renderer)
const todayItems = temporalFuture;
const overdueItems = temporalPast;
const upcomingItems = temporalFuture;

/* ===== LEGACY CALENDAR LOGIC (TEMPORARILY DISABLED) =====
const todayItems = obligations.filter(o =>
  normalizeISO(o.dateTime) === today
);

const overdueItems = obligations.filter(o =>
  normalizeISO(o.dateTime) < today
);

const upcomingItems = obligations.filter(o =>
  normalizeISO(o.dateTime) > today
);
========================================================== */
/* ===== DAILY NEXT FOCUS ===== */

const focusEl = document.getElementById("dailyFocus");
let next = null;

if (focusEl) {

  const now = new Date();

  // 1️⃣ sljedeća današnja u budućnosti
  const nextTodayFuture = todayItems.find(o =>
    new Date(o.dateTime) > now
  );

  // 2️⃣ ili prva nadolazeća
next = nextTodayFuture || upcomingItems[0];

// 🫀 TEMPORAL OVERRIDE (safe mode)
if (temporalFuture.length > 0) {
  next = temporalFuture[0];
}

  if (next) {

    const dt = new Date(next.dateTime);

    const time = dt.toLocaleTimeString(getLang(), {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newText = `Sljedeće: ${next.title} · ${time}`;

if (focusEl.textContent !== newText) {

  focusEl.classList.add("fade-out");

  setTimeout(() => {
    focusEl.textContent = newText;

    focusEl.classList.remove("fade-out");
    focusEl.classList.add("fade-in");

    setTimeout(() => {
      focusEl.classList.remove("fade-in");
    }, 350);

  }, 200);

}

    focusEl.onclick = () => {

      const el = document.querySelector(
        `.obligation-card[data-id="${next.id}"]`
      );

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        el.classList.add("focus-highlight");

        setTimeout(() => {
          el.classList.remove("focus-highlight");
        }, 1600);
      }
    };

  } else {
    focusEl.textContent = "Danas nema obveza.";
  }
}
/* ===== DAILY PROGRESS ===== */

const progressEl = document.getElementById("dailyProgress");

if (progressEl) {

  // 🫀 TEMPORAL TOTAL (safe mode)
const totalToday = temporalPast.length + temporalFuture.length;

  if (totalToday > 0) {

    progressEl.classList.remove("hidden");

    const allToday = (await obligationDB.getAll())
      .filter(o =>
        o.type !== "shopping" &&
        normalizeISO(o.dateTime) === today
      );

    const doneToday = temporalPast.filter(o => o.status === "done").length;

    const ratio = doneToday / totalToday;

    progressEl.innerHTML = `
      <div class="daily-progress-bar"
           style="width:${Math.max(ratio * 100, 6)}%">
      </div>
    `;

  } else {
    progressEl.classList.add("hidden");
  }
}

/* ===== DAY COMPLETION ===== */

const titleEl = document.querySelector(".daily-state-title");
const subEl = document.querySelector(".daily-state-subtitle");

if (titleEl && subEl) {

  // empty state handled by obligations module
if (temporalFuture.length === 0 && temporalPast.length === 0) {

  if (focusEl) focusEl.textContent = "";

}

}

if (temporalFuture.length === 0 && temporalPast.length === 0) {
  container.innerHTML = `
    <div class="empty-list">
      <div style="font-size:26px; margin-bottom:8px;">🌱</div>

      <div style="font-weight:800; font-size:16px;">
        ${I18N[lang].obligationsList.emptyTitle}
      </div>

      <div style="opacity:0.7; font-size:14px; margin-top:6px;">
        ${I18N[lang].obligationsList.emptySub}
      </div>

      <div style="margin-top:14px; font-size:14px; opacity:0.85;">
        ➕ Dodaj novu obvezu kad budeš spreman.
      </div>
    </div>
  `;
  return;
}

let html = '';

// 🫀 TEMPORAL CONTINUOUS FLOW

const todayDate = new Date().toLocaleDateString(
  (I18N[lang] && I18N[lang].lang) || 'hr-HR',
  { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }
);

html += `
  <div class="obligations-date">
    Danas · ${todayDate}
  </div>
`;

// 🫀 RENDER VIA OBLIGATIONS MODULE
// temporalState already defined above

const obligationsForRender = (await obligationDB.getAll())
  .filter(o => o.type !== 'shopping');

// 🫀 include obligations without time ("Kad stigneš")
const anytimeItems = obligationsForRender.filter(o => {
  if (!o.dateTime) return true;

  const str = String(o.dateTime).trim();

  // nema vremena u stringu
  return !str.includes("T");
});

// 🫀 temporal timeline items (ONLY timed obligations)
const temporalItems = [
  ...temporalPast,
  ...temporalFuture
];

// render koristi originalne obveze
html += renderAllSections(obligationsForRender, temporalState, lang);

// upcoming section removed — handled by temporal timeline

// 🫀 SMART SCROLL RESTORE
const prevScroll = container.scrollTop;

container.innerHTML = html;
attachObligationHandlers(container);

requestAnimationFrame(() => {

  const pointer = document.querySelector('.temporal-pointer');

  // 🫀 AUTO SCROLL ON FIRST OPEN
  if (window.__SCROLL_TO_POINTER_ON_OPEN__) {

    window.__SCROLL_TO_POINTER_ON_OPEN__ = false;

    if (pointer) {
      pointer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

  }

  // ako je nova obveza dodana → fokus na pointer
  if (window.__NEW_OBLIGATION_ADDED__) {

    window.__NEW_OBLIGATION_ADDED__ = false;

    if (pointer) {
      pointer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

  }

  // inače zadrži scroll
  container.scrollTop = prevScroll;

});

// 🫀 AUTO SCROLL HANDLED BY obligations module (on screen open)
// prevents scroll jump on every temporal rerender
}
function renderAllObligationsTimeline(obligations, lang) {

  const safe = Array.isArray(obligations) ? obligations : [];

  // samo obveze sa datumom
  const timed = safe.filter(o => o.dateTime);

  // sortiraj po datumu
  timed.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  let currentMonth = null;
  const html = [];

  timed.forEach(ob => {

    const dt = new Date(ob.dateTime);

    const monthKey = `${dt.getFullYear()}-${dt.getMonth()}`;

    // novi mjesec → ubaci separator
    if (monthKey !== currentMonth) {

      currentMonth = monthKey;

      const monthName = dt.toLocaleDateString(
        (I18N[lang] && I18N[lang].lang) || 'hr-HR',
        { month: 'long', year: 'numeric' }
      );

      html.push(`
        <div class="obligations-month-separator">
          — ${monthName} —
        </div>
      `);
    }

    html.push(buildObligationCard(ob, lang));

  });

  if (html.length === 0) {
    return `
      <div class="empty-list">
        Nema obveza
      </div>
    `;
  }

  return html.join('');
}

/* ===== DAILY VIEW LOGIC ===== */
// SINGLE SOURCE OF TRUTH
Object.defineProperty(window, 'viewMode', {
  get() {
    return window.AppState?.obligations?.viewMode || 'list';
  },
  set(v) {
    if (!window.AppState) window.AppState = {};
    if (!window.AppState.obligations)
      window.AppState.obligations = {};

    window.AppState.obligations.viewMode = v;
  }
});

viewMode = 'list';
let currentDailyDate = todayISO();

function showListMode() {

  // spriječi dupli poziv
  if (window.__LK_LIST_MODE__) return;
  window.__LK_LIST_MODE__ = true;

  console.log('📋 [showListMode] CALLED');
  window.AppState.obligations.viewMode = 'list';
  viewMode = 'list';

  const dailyView = document.getElementById('dailyView');
  const dailyDateBar = document.getElementById('dailyDateBar');
  const list = document.getElementById('obligationsContainer');
  const btn = document.getElementById('btnViewByDays');

  if (dailyView) dailyView.classList.add('hidden');
  // dailyDateBar removed (Sve obveze)
  if (list) list.classList.remove('hidden');

  if (btn) btn.textContent = '📆 Sve obveze';

  // reset guard
  setTimeout(() => {
    window.__LK_LIST_MODE__ = false;
  }, 50);
}

function showDailyMode() {
  window.AppState.obligations.viewMode = 'days';
  viewMode = 'days';

  const dailyView = document.getElementById('dailyView');
  const dailyDateBar = document.getElementById('dailyDateBar');
  const list = document.getElementById('obligationsContainer');
  const btn = document.getElementById('btnViewByDays');

  // koristimo isti list (timeline)
if (list) list.classList.remove('hidden');
if (dailyView) dailyView.classList.add('hidden');
  // dailyDateBar removed (Sve obveze)

  if (btn) btn.textContent = '📆 Današnje obveze';
}

function groupObligationsByStatus(items) {
  return {
    open: items.filter(i => !i.status || i.status === 'active'),
    done: items.filter(i => i.status === 'done')
  };
}

async function loadDailyForDate(isoDate) {

  currentDailyDate = isoDate;

  const picker = document.getElementById('dailyDatePicker');
  if (picker && picker.value !== isoDate) picker.value = isoDate;

  const lang = getLang();
  // ⚠️ PERFORMANCE NOTE:
// Currently doing FULL DB read.
// Acceptable while dataset is small.
// Future optimization: indexed queries or in-memory cache.
  const all = (await obligationDB.getAll())
  .filter(o => o.type !== 'shopping')
  .map(o => {
    // normalize date-only obligations globally
    if (o.dateTime && o.dateTime.length === 10) {
      return { ...o, dateTime: o.dateTime + "T00:00" };
    }
    return o;
  });

// 🫀 USE TEMPORAL FOR ACTIVE + DB FOR DONE
const temporalState = Temporal.getState?.();

let filtered = [];

if (temporalState) {

  const temporalItems = [
    ...(temporalState.past || []),
    ...(temporalState.future || [])
  ];

  const anytimeItems = all.filter(o => !o.dateTime && o.status !== 'done');

  const doneItems = all.filter(o => {
    if (o.status !== 'done') return false;
    if (!o.dateTime) return true;
    const iso = getISODateFromDateTime(o.dateTime);
    return iso === isoDate;
  });

  filtered = [
    ...temporalItems.filter(o => {
      if (!o.dateTime) return false;
      const iso = getISODateFromDateTime(o.dateTime);
      return iso === isoDate;
    }),
    ...anytimeItems,
    ...doneItems
  ];

} else {

  // fallback (safety)
  filtered = all.filter(o => {

    if (!o.dateTime) return true;

    const iso = getISODateFromDateTime(o.dateTime);
    return iso === isoDate;

  });

}
  const groups = groupObligationsByStatus(filtered);

  const openWrap = document.getElementById('dailyOpenWrap');
  const doneWrap = document.getElementById('dailyDoneWrap');
  const emptyHtml = `
  <div class="empty-list">
    <div style="font-weight:800;">
      ${I18N[lang].obligationsList.emptyTitle}
    </div>
    <div style="opacity:0.7;">
      ${I18N[lang].obligationsList.emptySub}
    </div>
  </div>
`;

  if (groups.open.length === 0) {
    openWrap.innerHTML = `<div class="empty-list">—</div>`;
  } else {
    openWrap.innerHTML = `
      <div style="font-weight:800; margin:8px 0;">Aktivne (${groups.open.length})</div>
      ${groups.open.map(ob => buildObligationCard(ob, lang)).join('')}
    `;
    attachObligationHandlers(openWrap);
  }

  if (groups.done.length === 0) {
    doneWrap.innerHTML = `<div class="empty-list">—</div>`;
  } else {
    doneWrap.innerHTML = `
      <div style="font-weight:800; margin:8px 0;">Završene (${groups.done.length})</div>
      ${groups.done.map(ob => buildObligationCard(ob, lang)).join('')}
    `;
    attachObligationHandlers(doneWrap);
  }

  if (groups.open.length === 0 && groups.done.length === 0) {
    openWrap.innerHTML = emptyHtml;
    doneWrap.innerHTML = '';
  }
}

function refreshCurrentObligationsView() {
  if (viewMode === 'days') {
    loadDailyForDate(currentDailyDate);
  } else {
    renderObligationsList();
  }
}

// ===== HEADER TITLE MAP (i18n based) =====

const btnShoppingArchive = document.getElementById('btnShoppingArchive');

if (btnShoppingArchive) {
  btnShoppingArchive.addEventListener('click', () => {

    showArchivedShopping = !showArchivedShopping;

    btnShoppingArchive.textContent =
      showArchivedShopping
        ? 'Sakrij arhivu'
        : 'Prikaži arhivu';

    renderShoppingList();
  });
}
function openEditObligation(id) {

  obligationDB.getAll().then(obligations => {

    const obligation = obligations.find(o => o.id === id);
    if (!obligation) return;

    screenHistory.push('screen-obligations-list');
    showScreen('screen-add-obligation');

    // Auto-close iOS time picker after selection
const timeInputBlur = document.getElementById('obligationTime');
if (timeInputBlur && !timeInputBlur.dataset.blurAttached) {
  timeInputBlur.dataset.blurAttached = "1";
  timeInputBlur.addEventListener('change', () => {
    timeInputBlur.blur();
  });
}

    const saveBtn = document.getElementById('saveObligation');
    if (saveBtn) {
    saveBtn.dataset.editId = id;
   }

    const title = document.getElementById('obligationTitle');
    if (title) title.value = obligation.title || '';

    const dateInput = document.getElementById('obligationDate');
const timeInput = document.getElementById('obligationTime');

if (obligation.dateTime) {
  const parts = obligation.dateTime.split('T');

  if (dateInput) dateInput.value = parts[0] || '';
  if (timeInput) timeInput.value = (parts[1] || '').slice(0,5);
}

    // ===== REMINDER: restore state in edit =====
const enableReminder = document.getElementById('enableReminder');
const reminderOptions = document.getElementById('reminderOptions');
const reminderTime = document.getElementById('reminderTime');

const hasReminder = !!obligation.reminder;

if (enableReminder) enableReminder.checked = hasReminder;

if (reminderOptions) {
  reminderOptions.classList.toggle('hidden', !hasReminder);
}

if (reminderTime && hasReminder) {
  reminderTime.value = obligation.reminder;
}

    window.__editingObligationId = id;

  });

}

// expose to handlers
window.openEditObligation = openEditObligation;
/*
  =====================================================
  ENGINE HOST BOUNDARY (ZERO-RISK PHASE)

  app-init.js currently owns the runtime engines.

  DO NOT move these to modules yet.
  DO NOT duplicate entry points.
  DO NOT call engines from multiple layers.

  Obligations migration will happen in a controlled phase.
  =====================================================
*/
// ✅ expose for non-module scripts (contacts.js etc.)
// ===== GLOBAL ENGINE EXPORT (LOCKED + SAFE) =====
(function lockEngineExports() {
  const defs = {

    legacy_showScreen: { value: window.legacy_showScreen, writable: false, configurable: true },
    renderObligationsList: { value: renderObligationsList, writable: false, configurable: true },
    refreshCurrentObligationsView: { value: refreshCurrentObligationsView, writable: false, configurable: true },
    showListMode: { value: showListMode, writable: false, configurable: true },
    showDailyMode: { value: showDailyMode, writable: false, configurable: true },
    loadDailyForDate: { value: loadDailyForDate, writable: false, configurable: true },

  };

  for (const key in defs) {
    // only define if not already defined (prevents redefine errors)
    if (!Object.getOwnPropertyDescriptor(window, key)) {
      Object.defineProperty(window, key, defs[key]);
    }
  }
})();

import {
  initNowIndicatorRuntime,
  updateNowIndicatorVisibility
} from '../../modules/obligations/now-indicator.js';

window.updateNowIndicatorVisibility = updateNowIndicatorVisibility;
initNowIndicatorRuntime();

// ===== OBLIGATIONS ENGINE BRIDGE (Calm Simplification) =====

// toggle status (engine owns DB)
// ===== NOTIFICATION CANCEL HELPER =====
async function cancelNotificationSafe(obligation) {

  if (!obligation) return;

  try {

    const m = await import('../services/notifications.js');

    if (m.cancelObligationNotification) {
      await m.cancelObligationNotification(obligation);
    }

  } catch (e) {

    console.log('🔔 cancel notification skipped', e);

  }

}
window.toggleObligationStatus = async function(id, newStatus) {
  const obligations = await obligationDB.getAll();
  const obligation = obligations.find(o => o.id === id);
  if (!obligation) return;

  obligation.status = newStatus;
  await obligationDB.add(obligation);

  // 🔔 cancel notification if obligation is completed
if (newStatus === "done") {
  await cancelNotificationSafe(obligation);
}

  // 🫀 Temporal sync
  await getFreshTemporalState();

window.__temporalRerenderQueued = false;
window.forceObligationsListRefresh?.('toggleStatus');
};

// delete obligation (engine owns DB)
window.deleteObligation = async function(id) {

  const allItems = await obligationDB.getAll();
  const obligation = allItems.find(o => o.id === id);

  // 🔔 cancel notification before delete
// prvo ugasi notifikaciju
await cancelNotificationSafe(obligation);

// zatim izbriši obvezu
await obligationDB.delete(id);

  // 🫀 Temporal sync
  await getFreshTemporalState();

window.__temporalRerenderQueued = false;
window.forceObligationsListRefresh?.('delete');
};

// ===== BULLETPROOF SCROLL TO TEMPORAL POINTER =====
window.scrollToTemporalPointerSafe = function () {

  let attempts = 0;
  const MAX_ATTEMPTS = 6;

  function tryScroll() {

    const pointer = document.querySelector('.temporal-pointer');

    if (pointer) {

      pointer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      return;

    }

    attempts++;

    if (attempts < MAX_ATTEMPTS) {
      requestAnimationFrame(tryScroll);
    }

  }

  tryScroll();

};
