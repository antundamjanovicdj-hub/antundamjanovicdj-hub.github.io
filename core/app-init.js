import Temporal from '../src/core/temporal/index.js';

// 🫀 Temporal Brain auto-boot
void Temporal;

// 🫀 TEMPORAL SUBSCRIBER (source of truth for list)
let __temporalRerenderQueued = false;

Temporal.subscribe((state) => {

  // ✅ always keep freshest state
  window.__TEMPORAL_STATE__ = state;

  console.log('🧭 TEMPORAL STATE', {
    now: state.now,
    pointer: state.pointer,
    past: state.past.length,
    future: state.future.length,
    nextChangeAt: state.nextChangeAt
  });

  // ✅ if we are currently on obligations list + list mode → rerender once
  const activeId = document.querySelector('.screen.active')?.id;
  const mode = window.AppState?.obligations?.viewMode || 'list';

  if (activeId !== 'screen-obligations-list') return;
  if (mode !== 'list') return;

  if (__temporalRerenderQueued) return;
  __temporalRerenderQueued = true;

  requestAnimationFrame(() => {
    __temporalRerenderQueued = false;
    try {
      renderObligationsList?.();
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
import('./notifications.js')
  .then(() => console.log('🔔 notifications module loaded'))
  .catch(e => console.log('🔔 notifications bootstrap skipped', e));

console.log('[LifeKompas] app-init.js loaded');
// ===== LIFEKOMPAS TESTER MODE (PROMPT FIRST, THEN RETRY FIREBASE) =====
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


// ===== FIREBASE ANALYTICS BOOTSTRAP (SAFE INIT) =====
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
const APP_VERSION = "0.1.0";

// ===== UX 1.6 – SCREEN HISTORY (GLOBAL) =====
const screenHistory = [];

// ===== BATTERY OPTIMIZATION CHECK =====
import { checkBatteryOptimization } from './battery.js';
import {
  obligationDB,
  addShoppingItem,
  getShoppingItems,
  updateShoppingItem,
  deleteShoppingItem
} from './db.js';
import { buildObligationCard } from './obligations.js';
import { attachObligationHandlers } from "./obligations.js";

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
export function getLang() {
  let lang = localStorage.getItem('userLang') || 'hr';
  if (!I18N[lang]) {
    lang = lang.split('-')[0];
  }
  return lang;
}

// ✅ DETEKCIJA TOUCH UREĐAJA (MOBITEL / TABLET)
const IS_TOUCH_DEVICE =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0;

export function getISODateFromDateTime(dateTimeStr) {
  if (!dateTimeStr) return null;
  return String(dateTimeStr).split('T')[0] || null;
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}
let navigationLock = false;
/*
  ⚠️ NAVIGATION ENGINE (FROZEN)

  This is the active screen engine.
  Do NOT refactor yet.

  Preconditions before refactor:
  ✔ obligations fully extracted
  ✔ shopping stabilized
  ✔ contacts stable
  ✔ header behavior finalized

  Refactor will be ONE controlled operation.
*/
function legacy_showScreen(screenId) {

  if (navigationLock) return;
  navigationLock = true;
  const screens = document.querySelectorAll('.screen');
  const next = document.getElementById(screenId);

  screens.forEach(screen => {
    screen.classList.remove('active');
    screen.style.display = 'none';
  });

  if (next) {
  next.classList.add('active');
  next.style.display = 'block';

  requestAnimationFrame(() => {

    navigationLock = false;

   // ===== OBLIGATIONS LIST ENTER =====
if (screenId === 'screen-obligations-list') {

  // ✅ refresh only when needed
  if (window.__OBLIGATIONS_DIRTY__) {

    window.__OBLIGATIONS_DIRTY__ = false;

    (async () => {

      const all = await obligationDB.getAll();
      Temporal.setObligations(all);

      window.__TEMPORAL_STATE__ =
        Temporal.getState?.() || window.__TEMPORAL_STATE__;

      renderObligationsList?.();
      window.refreshCurrentObligationsView?.();

    })();
  }

  // ✅ SINGLE SOURCE OF TRUTH — always list after save
  window.AppState.obligations.viewMode = 'list';
  showListMode?.();
}

    // ✅ LifeKompas auto keyboard (iOS + Android safe)
    if (screenId === 'screen-add-obligation') {
      const input = document.getElementById('obligationTitle');
      if (input) {
        setTimeout(() => {
          input.focus();
        }, 80);
      }
    }

  });
}

  // ===== FORCE MENU ITEMS VISIBLE (fix blank menu) =====
if (screenId === 'screen-menu') {
  const items = document.querySelectorAll('#screen-menu .menu-item');
  items.forEach(el => {
    el.classList.remove('animate');
    // force reflow
    void el.offsetWidth;
    el.classList.add('animate');
    // safety: if CSS hides them
    el.style.opacity = '';
    el.style.transform = '';
  });
}


  // ===== HEADER TITLE =====
  const headerTitle = document.getElementById('headerTitle');
if (headerTitle) {
  const lang = getLang();
  const titleFn = SCREEN_TITLES[screenId];

  headerTitle.textContent =
    typeof titleFn === 'function'
      ? (titleFn(lang) || 'LifeKompas')
      : 'LifeKompas';
}

  // ===== HEADER RIGHT ACTION (UX 1.6.1) =====
  const headerAction = document.getElementById('headerAction');
  if (headerAction) {

  const screensWithPlus = [
    'screen-obligations-list',
    'screen-contacts'
  ];

  if (screensWithPlus.includes(screenId)) {
    headerAction.classList.remove('hidden');
  } else {
    headerAction.classList.add('hidden');
  }
}

  // ===== CONTACTS INIT (only when screen active) =====
  if (screenId === 'screen-contacts') {
    if (typeof loadContacts === 'function') {
      loadContacts();
    }

    const lang = getLang();
    const c = I18N[lang].contacts || I18N.en.contacts;

    const contactsTitle = document.getElementById('contactsTitle');
    if (contactsTitle && c) {
      contactsTitle.innerHTML =
        `<img src="images/contacts-icon.png" class="contacts-title-icon"> ${c.title}`;
    }

    const btnImport = document.getElementById('btnImportContacts');
    if (btnImport && c) btnImport.textContent = c.import;

    const btnAddContact = document.getElementById('btnAddContact');
    if (btnAddContact && c) btnAddContact.textContent = c.add;

    const searchContacts = document.getElementById('searchContacts');
if (searchContacts && c) searchContacts.placeholder = c.search;
}


// ===== CONTACT FORM I18N =====
if (screenId === 'screen-contact-form') {

  const lang = getLang();
  const c = I18N[lang].contacts || I18N.en.contacts;

  const first = document.getElementById('contactFirstName');
  if (first) first.placeholder = c.form.firstName;

  const last = document.getElementById('contactLastName');
  if (last) last.placeholder = c.form.lastName;

  const birth = document.getElementById('contactBirthDate');
  if (birth) birth.placeholder = c.form.birthDate;

  const address = document.getElementById('contactAddress');
  if (address) address.placeholder = c.form.address;

  const email = document.getElementById('contactEmail');
  if (email) email.placeholder = c.form.email;

  const phone = document.getElementById('contactPhone');
  if (phone) phone.placeholder = c.form.phone;

  const label = document.getElementById('contactBirthdayTimeLabel');
  if (label) label.textContent = c.form.birthdayTime;

  const photo = document.getElementById('btnPickContactPhoto');
  if (photo) photo.textContent = c.form.pickPhoto;

  const save = document.getElementById('saveContact');
  if (save) save.textContent = c.form.save;
}
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

   /* =====================================================
   SHOPPING ENGINE
   ===================================================== */
   let shoppingItems = [];
let showArchivedShopping = false;

function ensureShoppingArchiveButton() {

  const btn = document.getElementById('toggleArchive');

  // ako gumb ne postoji — ne radimo ništa
  if (!btn) return;

  // sprječava dupli listener
  if (btn.dataset.bound === '1') {
    btn.textContent = showArchivedShopping
      ? 'Sakrij arhivu'
      : 'Prikaži arhivu';
    return;
  }

  btn.dataset.bound = '1';

  btn.textContent = showArchivedShopping
    ? 'Sakrij arhivu'
    : 'Prikaži arhivu';

  btn.addEventListener('click', () => {

    showArchivedShopping = !showArchivedShopping;

    btn.textContent = showArchivedShopping
      ? 'Sakrij arhivu'
      : 'Prikaži arhivu';

    renderShoppingList();
  });
}

   /* ===== SHOPPING (IndexedDB + Archive) ===== */
async function renderShoppingList() {

  shoppingItems = await getShoppingItems();

  const list = document.getElementById('shoppingList');
  const empty = document.getElementById('shoppingEmpty');

  if (!list || !empty) return;

  ensureShoppingArchiveButton();

  list.innerHTML = '';

  const visibleItems = showArchivedShopping
    ? shoppingItems.filter(item => item.checked)
    : shoppingItems.filter(item => !item.checked);

  if (visibleItems.length === 0) {
    empty.innerHTML = `
      <div style="font-size:26px; margin-bottom:8px;">🛒</div>

      <div style="font-weight:800; font-size:16px;">
        Nema stavki
      </div>

      <div style="opacity:0.7; font-size:14px; margin-top:6px;">
        Popis je trenutačno prazan.
      </div>

      <div style="margin-top:14px; font-size:14px; opacity:0.85;">
        • Enter – brzo dodavanje stavke
      </div>
    `;

    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  visibleItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'shopping-item';

    li.innerHTML = `
      <div class="shopping-item-delete">🗑️</div>
      <div class="shopping-item-content">${item.title}</div>
    `;
    const swipeContent = li.querySelector('.shopping-item-content');

    if (item.checked) li.classList.add('checked');

    li.addEventListener('click', async () => {
      item.checked = !item.checked;
      await updateShoppingItem(item); // 🔥 važnije od add
      renderShoppingList();
    });

// ===== MOBILE ONLY: swipe to delete (FINAL) =====
if (IS_TOUCH_DEVICE) {
  let startX = 0;
let currentX = 0;
let startTime = 0;
let swiping = false;
  const DELETE_THRESHOLD = 120; // px

  li.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  currentX = startX;
  startTime = Date.now();
  swiping = true;
  li.classList.add('swiping');
}, { passive: true });

// 🔎 MICRO HINT – show on first swipe only
const hint = document.getElementById('shoppingSwipeHint');
const hintSeen = localStorage.getItem('shoppingSwipeHintSeen');

if (IS_TOUCH_DEVICE && hint && !hintSeen) {
  hint.classList.remove('hidden');

  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => {
      hint.classList.add('hidden');
      hint.style.opacity = '';
    }, 300);
  }, 2500);

  localStorage.setItem('shoppingSwipeHintSeen', '1');
}

  li.addEventListener('touchmove', e => {
  li.classList.add('swiping');
    if (!swiping) return;

    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
const elapsed = Date.now() - startTime;
const velocity = Math.abs(diff) / elapsed;

// 🔥 flick delete
if (diff < -DELETE_THRESHOLD || velocity > 0.6) {

  const MAX_SWIPE = 84;

  // 🔥 ELASTIC
  let limited = diff;

  if (diff < -MAX_SWIPE) {
    const extra = diff + MAX_SWIPE;
    limited = -MAX_SWIPE + (extra * 0.35); 
  }

  swipeContent.style.transform = `translateX(${limited}px)`;
}
  }, { passive: true });

  li.addEventListener('touchend', () => {
    if (!swiping) return;
    swiping = false;
  li.classList.remove('swiping');

    const diff = currentX - startX;

    if (diff < -DELETE_THRESHOLD) {
      // ✅ DELETE
      shoppingItems = shoppingItems.filter(i => i.id !== item.id);
      renderShoppingList();
      deleteShoppingItem(item.id);
    } else {
      // ⬅️ SNAP BACK
      swipeContent.style.transition = 'transform 0.15s ease-out';
      swipeContent.style.transform = 'translateX(0)';

      setTimeout(() => {
  swipeContent.style.transition = '';
    }, 150);
    }
  });
}

// swipe disabled for stability

    // DESKTOP: right-click delete
    li.addEventListener('contextmenu', e => {
      e.preventDefault();
      shoppingItems = shoppingItems.filter(i => i.id !== item.id);
      renderShoppingList();
      deleteShoppingItem(item.id);
    });

    list.appendChild(li);
});
}

/* ===== LIST VIEW RENDER ===== */
async function renderObligationsList() {

  // 🔥 SINGLE SOURCE OF TRUTH
  const all = await obligationDB.getAll();

  Temporal.setObligations(all);

  window.__TEMPORAL_STATE__ =
    Temporal.getState?.() || window.__TEMPORAL_STATE__;

  const temporal = window.__TEMPORAL_STATE__;

  const container = document.getElementById('obligationsContainer');
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

  const obligations = all.filter(o =>
    o.type !== 'shopping' &&
    o.status !== 'done' &&
    o.dateTime
  );

/* ===== LEGACY SORT (DISABLED BY TEMPORAL) =====
  obligations.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    if (!a.dateTime) return 1;
    if (!b.dateTime) return -1;
    return new Date(a.dateTime) - new Date(b.dateTime);
  });
================================================ */
// 🫀 TEMPORAL INPUT (shadow read)

let temporalPast = [];
let temporalFuture = [];
let temporalPointer = null;

if (temporal) {
  temporalPast = temporal.past;
  temporalFuture = temporal.future;
  temporalPointer = temporal.pointer;
}

// 🫀 TEMPORAL COMPATIBILITY LAYER
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

  if (todayItems.length === 0 && overdueItems.length === 0) {

    titleEl.textContent = "Miran dan";
    subEl.textContent = "Sve za danas je završeno.";

    if (focusEl) focusEl.textContent = "";
  }

}

if (todayItems.length === 0 && overdueItems.length === 0 && upcomingItems.length === 0) {
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
const allItems = [
  ...temporalPast,
  ...temporalFuture
];

const todayDate = new Date().toLocaleDateString(
  (I18N[lang] && I18N[lang].lang) || 'hr-HR',
  { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }
);

html += `
  <div class="obligations-date">
    Danas · ${todayDate}
  </div>
`;

// 🫀 TEMPORAL CONTINUOUS LIST
html += `
  ${allItems.map(ob => buildObligationCard(ob, lang)).join('')}
`;

if (upcomingItems.length > 0) {
  html += `
    <div class="obligations-section-title">
      📅 Nadolazeće (${upcomingItems.length})
    </div>
    ${upcomingItems.map(ob => buildObligationCard(ob, lang)).join('')}
  `;
}

container.innerHTML = html;
attachObligationHandlers(container);

// 🫀 TEMPORAL POINTER

let markerTarget = null;

if (temporalFuture.length > 0) {
  markerTarget = temporalFuture[0].id;
}

updateCurrentMomentMarker(markerTarget);
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
  window.AppState.obligations.viewMode = 'list';
  viewMode = 'list';

  const dailyView = document.getElementById('dailyView');
  const dailyDateBar = document.getElementById('dailyDateBar');
  const list = document.getElementById('obligationsContainer');
  const btn = document.getElementById('btnViewByDays');

  if (dailyView) dailyView.classList.add('hidden');
  if (dailyDateBar) dailyDateBar.classList.add('hidden');
  if (list) list.classList.remove('hidden');

  const lang = getLang();
  if (btn) btn.textContent = I18N[lang].obligationsView.byDay;
}

function showDailyMode() {
  window.AppState.obligations.viewMode = 'days';
  viewMode = 'days';

  const dailyView = document.getElementById('dailyView');
  const dailyDateBar = document.getElementById('dailyDateBar');
  const list = document.getElementById('obligationsContainer');
  const btn = document.getElementById('btnViewByDays');

  if (list) list.classList.add('hidden');
  if (dailyView) dailyView.classList.remove('hidden');
  if (dailyDateBar) dailyDateBar.classList.remove('hidden');

  const lang = getLang();
  if (btn) btn.textContent = I18N[lang].obligationsView.asList;
}

function groupObligationsByStatus(items) {
  return {
    open: items.filter(i => i.status !== 'done'),
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

const filtered = all.filter(o => {
  if (!o.dateTime) return false;

  // supports date-only AND datetime values
  const iso = getISODateFromDateTime(o.dateTime);
  return iso === isoDate;
});
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

/* ===== CURRENT MOMENT MARKER ===== */
function updateCurrentMomentMarker(nextId) {

  const list = document.getElementById("screen-obligations-list");
  if (!list) return;

  let marker = document.querySelector(".obligation-now-marker");

  if (!marker) {
    marker = document.createElement("div");
    marker.className = "obligation-now-marker";
    list.appendChild(marker);
  }

  const nextCard = document.querySelector(
    `.obligation-card[data-id="${nextId}"]`
  );

  if (!nextCard) {
    marker.style.opacity = "0";
    return;
  }

  const listRect = list.getBoundingClientRect();
  const cardRect = nextCard.getBoundingClientRect();

  const offset =
    cardRect.top - listRect.top + cardRect.height / 2;

  marker.style.opacity = "1";
  marker.style.top = offset + "px";
}


// ===== HEADER TITLE MAP (i18n based) =====
const SCREEN_TITLES = {
  'screen-obligations-list': lang => I18N[lang].obligationsList?.title,
  'screen-shopping':         lang => I18N[lang].shopping?.title,
  'screen-contacts':         lang => I18N[lang].contacts?.title,
  'screen-finances-menu':    lang => I18N[lang].menu?.finances,

  'screen-finance-income':   lang => I18N[lang].finances?.income?.title,
  'screen-finance-fixed':    lang => I18N[lang].finances?.fixed?.title,
  'screen-finance-credits':  lang => I18N[lang].finances?.credits?.title,
  'screen-finance-other':    lang => I18N[lang].finances?.other?.title,
  'screen-finance-overview': lang => I18N[lang].finances?.overview?.title,

  'screen-add-obligation':   lang => I18N[lang].popup?.newObligationTitle,
  'screen-contact-form':     lang => I18N[lang].contacts?.form?.title,
  'screen-contact-details':  lang => I18N[lang].contacts?.details?.title,

  'screen-menu':             () => 'LifeKompas',
  'screen-lang':             () => 'LifeKompas'
};

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

    const saveBtn = document.getElementById('saveObligation');
    if (saveBtn) {
    saveBtn.dataset.editId = id;
   }

    const title = document.getElementById('obligationTitle');
    if (title) title.value = obligation.title || '';

    const note = document.getElementById('obligationNote');
    if (note) note.value = obligation.note || '';

    const date = document.getElementById('obligationDateTime');
    if (date) date.value = obligation.dateTime || '';

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

    legacy_showScreen: { value: legacy_showScreen, writable: false, configurable: true },
    renderObligationsList: { value: renderObligationsList, writable: false, configurable: true },
    refreshCurrentObligationsView: { value: refreshCurrentObligationsView, writable: false, configurable: true },
    showListMode: { value: showListMode, writable: false, configurable: true },
    renderShoppingList: { value: renderShoppingList, writable: false, configurable: true },
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

// ===== OBLIGATIONS ENGINE BRIDGE (Calm Simplification) =====

// toggle status (engine owns DB)
window.toggleObligationStatus = async function(id, newStatus) {
  const obligations = await obligationDB.getAll();
  const obligation = obligations.find(o => o.id === id);
  if (!obligation) return;

  obligation.status = newStatus;
  await obligationDB.add(obligation);
  // 🫀 Temporal sync
const all = await obligationDB.getAll();
Temporal.setObligations(all);

  window.refreshCurrentObligationsView?.();
};

// delete obligation (engine owns DB)
window.deleteObligation = async function(id) {
  await obligationDB.delete(id);
  // 🫀 Temporal sync
const all = await obligationDB.getAll();
Temporal.setObligations(all);
  window.refreshCurrentObligationsView?.();
};
