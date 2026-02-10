// core/app-init.js
// LifeKompas INIT EXTRACTION – STEP 1 (scaffold)
// Namjerno prazno: u sljedećem koraku selimo veliki dio koda iz index.html ovdje.

console.log('[LifeKompas] app-init.js loaded');
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
window.checkBatteryOptimization = checkBatteryOptimization;
document.getElementById("appVersion").textContent = "v" + APP_VERSION;
// ===== GLOBAL CONFIG =====
const CONFIG = {
  notificationsEnabled: true,
  serviceWorkerEnabled: true,
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

/* ===== RENDER CARD (reused) ===== */
function buildObligationCard(ob, lang) {
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

function attachObligationHandlers(container) {
  // PROMJENA STATUSA
  container.querySelectorAll('.obligation-toggle-status').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      const currentStatus = btn.dataset.status;
      const newStatus = currentStatus === 'done' ? 'active' : 'done';

      const obligations = await obligationDB.getAll();
      const obligation = obligations.find(o => o.id === id);
      if (!obligation) return;

      obligation.status = newStatus;
await obligationDB.add(obligation);

if (newStatus === 'done') {
  import('./notifications.js').then(async ({
    cancelObligationNotification,
    scheduleObligationNotification
  }) => {
    cancelObligationNotification(id);

    if (
  obligation.repeat &&
  obligation.dateTime &&
  !obligation.repeatPaused
) {
if (obligation.skipNextRepeat) {
  obligation.skipNextRepeat = false;
  await obligationDB.add(obligation);
  return;
}
      const baseDate = new Date(obligation.dateTime);
      const nextDate = new Date(baseDate);
if (obligation.repeat === 'custom' && obligation.customRepeat) {
  const { unit, every } = obligation.customRepeat;
  const baseDate = new Date(obligation.dateTime);
  const nextDate = new Date(baseDate);

  if (unit === 'day') nextDate.setDate(baseDate.getDate() + every);
  if (unit === 'week') nextDate.setDate(baseDate.getDate() + every * 7);
  if (unit === 'month') nextDate.setMonth(baseDate.getMonth() + every);

  const nextObligation = {
    ...obligation,
    id: Date.now(),
    status: 'active',
    dateTime: nextDate.toISOString().slice(0, 16),
    createdAt: new Date().toISOString()
  };

  await obligationDB.add(nextObligation);
  await scheduleObligationNotification(nextObligation);
  return;
}

      if (obligation.repeat === 'daily') {
  nextDate.setDate(baseDate.getDate() + 1);
}

if (obligation.repeat === 'weekly') {
  nextDate.setDate(baseDate.getDate() + 7);
}

if (obligation.repeat === 'monthly') {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1; // next month
  const day = baseDate.getDate();

  // zadnji dan ciljanog mjeseca
  const lastDayOfTargetMonth = new Date(year, month + 1, 0).getDate();

  nextDate.setFullYear(year);
  nextDate.setMonth(month);
  nextDate.setDate(Math.min(day, lastDayOfTargetMonth));
}

      const nextObligation = {
        ...obligation,
        id: Date.now(),
        status: 'active',
        dateTime: nextDate.toISOString().slice(0, 16),
        createdAt: new Date().toISOString()
      };

      await obligationDB.add(nextObligation);
      await scheduleObligationNotification(nextObligation);
    }
  });
}

refreshCurrentObligationsView();
    });
  });

  // UREĐIVANJE
  container.querySelectorAll('.obligation-edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      const obligations = await obligationDB.getAll();
      const ob = obligations.find(o => o.id === id);
      if (ob) openEditForm(ob);
    });
  });

  // BRISANJE
  container.querySelectorAll('.obligation-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      const langNow = getLang();

      if (!confirm(I18N[langNow].obligationsList.deleteConfirm || 'Obrisati obvezu?')) {
        return;
      }

      await obligationDB.delete(id);

      import('./notifications.js').then(({ cancelObligationNotification }) => {
        cancelObligationNotification(id);
      });

      refreshCurrentObligationsView();
    });
  });
}

/* ===== LIST VIEW RENDER ===== */
async function renderObligationsList() {
  if (viewMode === 'days') return;

  const container = document.getElementById('obligationsContainer');
  const lang = getLang();

  const today = todayISO();

const obligations = (await obligationDB.getAll())
  .filter(o =>
    o.type !== 'shopping' &&
    o.status !== 'done' &&
    o.dateTime &&
    getISODateFromDateTime(o.dateTime) <= today
  );

  obligations.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    if (!a.dateTime) return 1;
    if (!b.dateTime) return -1;
    return new Date(b.dateTime) - new Date(a.dateTime);
  });

const todayItems = obligations.filter(o =>
  getISODateFromDateTime(o.dateTime) === today
);

const overdueItems = obligations.filter(o =>
  getISODateFromDateTime(o.dateTime) < today
);

if (todayItems.length === 0 && overdueItems.length === 0) {
  container.innerHTML = `
    <div class="empty-list">
      <div style="font-size:26px; margin-bottom:8px;">🌱</div>

      <div style="font-weight:800; font-size:16px;">
        ${I18N[lang].obligationsList.noObligations}
      </div>

      <div style="opacity:0.7; font-size:14px; margin-top:6px;">
        Nema obveza za danas. Sve je mirno i pod kontrolom.
      </div>

      <div style="margin-top:14px; font-size:14px; opacity:0.85;">
        ➕ Dodaj novu obvezu kad budeš spreman.
      </div>
    </div>
  `;
  return;
}

let html = '';

const todayDate = new Date().toLocaleDateString(
  (I18N[lang] && I18N[lang].lang) || 'hr-HR',
  { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }
);

html += `
  <div class="obligations-date">
    Danas · ${todayDate}
  </div>
`;

if (todayItems.length > 0) {
  html += `
    <div class="obligations-section-title">Danas</div>
    ${todayItems.map(ob => buildObligationCard(ob, lang)).join('')}
  `;
}

if (overdueItems.length > 0) {
  html += `
    <div class="obligations-section-title overdue">
  Zakašnjelo
</div>
    ${overdueItems.map(ob => buildObligationCard(ob, lang)).join('')}
  `;
}

container.innerHTML = html;
attachObligationHandlers(container);
}

/* ===== DAILY VIEW LOGIC ===== */
let viewMode = 'list'; // 'list' | 'days'
let currentDailyDate = todayISO();

function showListMode() {
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
  const all = (await obligationDB.getAll())
  .filter(o => o.type !== 'shopping');

const filtered = all.filter(o =>
  getISODateFromDateTime(o.dateTime) === isoDate
);
  const groups = groupObligationsByStatus(filtered);

  const openWrap = document.getElementById('dailyOpenWrap');
  const doneWrap = document.getElementById('dailyDoneWrap');
  const emptyHtml = `<div class="empty-list">${I18N[lang].obligationsList.noObligations}</div>`;

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

// ✅ expose for non-module scripts (contacts.js etc.)
// ===== GLOBAL ENGINE EXPORT =====
window.legacy_showScreen = legacy_showScreen;
window.renderObligationsList = renderObligationsList;
window.refreshCurrentObligationsView = refreshCurrentObligationsView;
window.showListMode = showListMode;
window.renderShoppingList = renderShoppingList;
window.showDailyMode = showDailyMode;
window.loadDailyForDate = loadDailyForDate;

// ZERO-RISK: obligations internal helpers bridge
window.buildObligationCard = buildObligationCard;
window.attachObligationHandlers = attachObligationHandlers;