/*
=====================================================
⚠️ LIFEOMPAS CORE FREEZE LINE
Everything inside this file is considered STABLE CORE.
DO NOT:
- refactor casually
- move logic between init files
- duplicate navigation
- split engine pieces
ALLOWED:
✅ bug fixes
✅ controlled extractions
✅ performance improvements
NEXT MAJOR STEP:
👉 full engine modularization (ONE operation — not incremental)
Until then — treat this file as SYSTEM CODE.
=====================================================
*/
/*
=====================================================
⚠️ NAVIGATION OWNERSHIP
showScreen() is owned by the ENGINE HOST.
Feature files SHOULD NOT navigate directly unless:
✅ triggered by user interaction
✅ flow is obvious and isolated
Avoid deep navigation chains from feature modules.
Future plan:
👉 central navigation controller
=====================================================
*/
import {
  obligationDB,
  addFinanceItem,
  getFinanceItems,
  deleteFinanceItem,
  getShoppingItems,
  addShoppingItem
} from './services/db.js';

import { initShoppingModule } from '../modules/shopping/shopping-init.js';
import { initFinancesModule } from '../modules/finances/finances-init.js';
import { initDiaryModule } from '../modules/diary/diary-init.js';

import * as notifications from './services/notifications.js';

import { getContacts } from './services/db.js';

export function initApp() {
  // ===== INIT GUARD =====
  if (window.__LIFEKOMPAS_INIT__) {
    console.warn('[LifeKompas] initApp already executed');
    return;
  }
  window.__LIFEKOMPAS_INIT__ = true;

  try {
    // ===== EVENT BIND GUARD =====
    if (window.__LIFEKOMPAS_EVENTS_BOUND__) {
      console.warn('[LifeKompas] Events already bound');
    } else {
      window.__LIFEKOMPAS_EVENTS_BOUND__ = true;

      // 🛒 init shopping (EARLY BOOT)
initShoppingModule();

// 📓 init diary (EARLY BOOT - safe)
initDiaryModule();

// 💰 init finances (SAFE DELAY)
setTimeout(() => {
  try {
    initFinancesModule();
  } catch (e) {
    console.warn('[LifeKompas] finances init failed (non-blocking)', e);
  }
}, 0);

      // ===== CRITICAL GLOBAL STATE =====
      window.screenHistory = [];
      window.shoppingItems = [];
      window.showArchivedShopping = false;

      // ===== GLOBAL APP STATE (SINGLE SOURCE OF TRUTH) =====
      window.AppState = {
        navigation: {
          history: []
        },
        shopping: {
          items: [],
          showArchived: false
        },
        obligations: {
          viewMode: 'list',
          currentDailyDate: null
        }
      };

      // ===== LEGACY SAFE ALIASES (do not remove yet) =====
      window.screenHistory = window.AppState.navigation.history;
      window.shoppingItems = window.AppState.shopping.items;
      window.showArchivedShopping = window.AppState.shopping.showArchived;

      // ===== NAVIGATION STATE =====
      window.screenHistory = [];

      // ===== AUTO RESET BOOT FAIL COUNTER =====
      localStorage.removeItem('lifekompas_boot_fail');

      // ===== UX 1.6.1 – CENTRAL BACK HANDLER =====
      const headerBack = document.getElementById('headerBack');

      // jednostavna povijest ekrana
      window.showScreen = function (screenId) {

  // 🛡️ PREVENT NAVIGATION DURING PHOTO PICK
  if (window.__LK_PHOTO_PICK_ACTIVE__) {
    console.log('[NAV BLOCKED - PHOTO PICK]', screenId);
    return;
  }

  console.log('[NAV]', screenId);
console.log('[NAV]', screenId);

// 🔥 AUTO HISTORY (FINAL FIX)
const current = document.querySelector('.screen.active')?.id;

// 🛡️ FIX: ne push-aj ako se vraćamo (BACK)
if (current && current !== screenId && !window.__IS_GOING_BACK__) {
  screenHistory.push(current);
}

        // 🛑 CLOSE FINANCE POPUP ON NAVIGATION
const financePopup = document.getElementById('financeCostsPopup');
if (financePopup) {
  financePopup.classList.remove('animate');
  financePopup.style.display = 'none';
}

        // ===== HEADER TITLE =====
        const headerTitle = document.getElementById('headerTitle');
        if (headerTitle) {
          const titles = {
            'screen-menu': 'LifeKompas',
            'screen-lang': 'LifeKompas',
            'screen-obligations-list': 'Obveze',
            'screen-add-obligation': 'Nova obveza',
            'screen-shopping': 'Kupovina',
            'screen-contacts': 'Kontakti',
            'screen-contact-form': 'Novi kontakt',
            'screen-contact-details': 'Detalji kontakta',
            'screen-finances-menu': 'Financije',
            'screen-finance-income': 'Prihodi',
            'screen-finance-fixed': 'Fiksni troškovi',
            'screen-finance-credits': 'Krediti',
            'screen-finance-other': 'Ostalo',
            'screen-finance-overview': 'Pregled',
            'screen-diary': 'Dnevnik'
          };
          headerTitle.textContent = titles[screenId] || 'LifeKompas';

          // 🔧 FIX: diary title
          if (screenId === 'screen-diary') {
          headerTitle.textContent = 'Dnevnik';
         }
        }

        // ===== MENU ANIMATION FIX =====
        if (screenId === 'screen-menu') {
          const items = document.querySelectorAll('.menu-item');
          requestAnimationFrame(() => {
            items.forEach((el) => {
              el.classList.remove('animate'); // reset
            });
            requestAnimationFrame(() => {
              items.forEach((el, i) => {
                setTimeout(() => {
                  el.classList.add('animate');
                }, i * 60);
              });
            });
          });
        }

        const isRoot =
          screenId === 'screen-lang' ||
          screenId === 'screen-menu';

        // BACK
        if (headerBack) {
          headerBack.classList.toggle('hidden', isRoot);
        }

        // ➕ HEADER ACTION (UX 1.6.2)
        const headerAction = document.getElementById('headerAction');
        if (headerAction) {
          headerAction.classList.add('hidden');
          headerAction.onclick = null;
        }

        switch (screenId) {
          // ===== FINANCES ➕ = SAVE (UX 1.6.x) =====
          case 'screen-finance-income': {
          requestAnimationFrame(() => {
          const headerAction = document.getElementById('headerAction');
          if (headerAction) {
          headerAction.classList.remove('hidden');
          headerAction.onclick = () => {
          const btn = document.getElementById('saveIncome');
          if (btn) btn.click();
        };
        }
       });
        break;
       }
          case 'screen-finance-fixed': {
          requestAnimationFrame(() => {
          const headerAction = document.getElementById('headerAction');
          if (headerAction) {
          headerAction.classList.remove('hidden');
          headerAction.onclick = () => {
          const btn = document.getElementById('saveFixed');
          if (btn) btn.click();
          };
         }
         });
        break;
        }
          case 'screen-finance-credits': {
          requestAnimationFrame(() => {
          const headerAction = document.getElementById('headerAction');
          if (headerAction) {
          headerAction.classList.remove('hidden');
          headerAction.onclick = () => {
          const btn = document.getElementById('saveCredit');
          if (btn) btn.click();
         };
         }
         });
          break;
        }
          case 'screen-finance-other': {
          requestAnimationFrame(() => {
          const headerAction = document.getElementById('headerAction');
          if (headerAction) {
          headerAction.classList.remove('hidden');
          headerAction.onclick = () => {
          const btn = document.getElementById('saveOther');
          if (btn) btn.click();
         };
        }
       });
        break;
      }
          case 'screen-finance-overview':
          case 'screen-finances-menu':
            // ➕ se NE prikazuje
            break;
          case 'screen-obligations-list':
            headerAction.classList.remove('hidden');
            headerAction.onclick = () => {
              screenHistory.push('screen-obligations-list');
              showScreen('screen-add-obligation');
              document.getElementById('saveObligation').removeAttribute('data-edit-id');
              window.__editingObligationId = null;
            };
            break;
          case 'screen-add-obligation':
            applyAddObligationI18N();
            document.getElementById('saveObligation').removeAttribute('data-edit-id');
            window.__editingObligationId = null;
            break;
          case 'screen-shopping':
            // ➕ se NE prikazuje (unos ide preko Enter)
            break;
          case 'screen-contacts': {
            headerAction.classList.remove('hidden');
            headerAction.onclick = () => {
              screenHistory.push('screen-contacts');
              showScreen('screen-contact-form');
            };
            const legacyAddBtn = document.getElementById('btnAddContact');
            if (legacyAddBtn) {
              legacyAddBtn.style.display = 'none';
            }
            break;
          }
          default:
            break;
        }

        // 🔥 SCREEN LIFECYCLE EVENT
        document.dispatchEvent(
  new CustomEvent('screenShown', { detail: screenId })
);

// 🔗 LIFEOMPAS ENGINE BRIDGE (FIXED - samo jednom poziv)
if (typeof window.legacy_showScreen === 'function') {
  window.legacy_showScreen(screenId);
}

// iOS auto keyboard focus (LifeKompas UX)
if (window.lkFocusIntent) {
  requestAnimationFrame(() => {
    const el = document.getElementById(window.lkFocusIntent);
    if (el) el.focus();
    window.lkFocusIntent = null;
  });
}
      };

      // ===== OBLIGATIONS: DETERMINISTIC LIST REFRESH (ENGINE SAFE) =====
async function forceObligationsListRefresh(reason = '') {
  window.forceObligationsListRefresh = forceObligationsListRefresh;
  try {
    // 🛡️ WAIT FOR DB STABILIZATION (iOS fix)
await new Promise(r => setTimeout(r, 50));

let all = [];

try {
  all = await obligationDB.getAll();
} catch (dbErr) {
  console.error('🧾 [forceListRefresh] getAll ERROR', dbErr);
  return;
}

// refresh UI only (Temporal engine already owns state)
// ⚠️ DO NOT MUTATE GLOBAL TEMPORAL STATE (immutable)
const temporalState =
  Temporal.getState?.() || window.__TEMPORAL_STATE__;
    
    // 🧪 DEBUG LOGS
    console.log('🧾 [forceListRefresh] START', {
      reason,
      dbCount: all.length,
      viewMode: window.AppState?.obligations?.viewMode,
      queueFlag: window.__temporalRerenderQueued
    });
    
    if (window.AppState?.obligations) {
  window.AppState.obligations.viewMode = 'list';
} else {
  console.warn('⚠️ AppState.obligations missing');
}

try {
  showListMode?.();
} catch (err) {
  console.error('🧾 showListMode ERROR', err);
}
    
    // 🫀 RESET TEMPORAL QUEUE
    window.__temporalRerenderQueued = false;
    
    console.log('🧾 [forceListRefresh] AFTER RESET', {
      queueFlag: window.__temporalRerenderQueued,
      viewMode: window.AppState?.obligations?.viewMode
    });
    
    // 🧾 SAFE RAF (stabilno + timing sigurnost)
requestAnimationFrame(() => {
  setTimeout(() => {
    try {
      console.log('🧾 [forceListRefresh] CALLING renderObligationsList');

      if (typeof renderObligationsList === 'function') {
        window.__LK_FORCE_RENDER__ = true;
        renderObligationsList(all);
      } else if (typeof window.renderObligationsList === 'function') {
        window.__LK_FORCE_RENDER__ = true;
        window.renderObligationsList(all);
      } else {
        throw new Error('renderObligationsList not found');
      }

    } catch (err) {
      console.error('🧾 [forceListRefresh] RENDER ERROR', err);
    }
  }, 30);
});
  } catch (e) {
  console.error('🧾 [forceListRefresh] ERROR', e);
  console.error('🧾 TYPE:', typeof e);
  console.error('🧾 KEYS:', Object.keys(e || {}));
  console.error('🧾 STRING:', JSON.stringify(e));
}
};

      // klik na BACK
      if (headerBack) {
  headerBack.addEventListener('click', () => {
    window.__IS_GOING_BACK__ = true;

    const current = document.querySelector('.screen.active')?.id;
    const prev = screenHistory.pop();

    if (current === 'screen-menu') {
      showScreen('screen-lang');
      window.__IS_GOING_BACK__ = false;
      return;
    }

    if (prev) {
      showScreen(prev);
    } else {
      showScreen('screen-menu');
    }

    window.__IS_GOING_BACK__ = false;
  });
}

      // ===== ENGINE GLOBAL CLICK DELEGATION =====
document.addEventListener('click', async (e) => {
  const toggleBtn = e.target.closest('#btnViewByDays');
  if (!toggleBtn) return;

  const mode = window.AppState.obligations.viewMode;
  const all = await obligationDB.getAll();

  if (mode === 'list') {
    window.AppState.obligations.viewMode = 'days';
    showDailyMode();
    await renderObligationsList(all);
  } else {
    window.AppState.obligations.viewMode = 'list';
    showListMode();
    await renderObligationsList(all);
  }
});

      // ===== CONTACTS INIT =====
      if (typeof loadContacts === 'function') loadContacts();
      if (typeof initContacts === 'function') initContacts();

      // ===== FORCE START SCREEN =====
      showScreen('screen-lang');
      setTimeout(bindLangButtons, 0);

      // ===== BATTERY OPTIMIZATION =====
      checkBatteryOptimization();

      // ===== QUIET HOURS =====
      const quietStartInput = document.getElementById('quietStart');
      const quietEndInput = document.getElementById('quietEnd');
      if (quietStartInput && quietEndInput) {
        quietStartInput.value = localStorage.getItem('quietStart') || '22:00';
        quietEndInput.value = localStorage.getItem('quietEnd') || '07:00';
        quietStartInput.addEventListener('change', () => localStorage.setItem('quietStart', quietStartInput.value));
        quietEndInput.addEventListener('change', () => localStorage.setItem('quietEnd', quietEndInput.value));
      }

      // ===== SERVICE WORKER SNOOZE =====
      navigator.serviceWorker?.addEventListener('message', async e => {
  if (e.data?.type === 'SNOOZE') {

    const items = await obligationDB.getAll();
    const ob = items.find(o => o.id === e.data.obligationId);

    if (ob) {
      await notifications.snoozeObligation(
        ob,
        e.data.minutes
      );
    }
  }
});

      /* ===== SET LANGUAGE + SHOW MENU (RESTORED) ===== */
      function setLanguage(lang) {
        localStorage.setItem('userLang', lang);
        document.documentElement.setAttribute('lang', lang);
        if (typeof window.I18N === 'undefined' || !window.I18N[lang]) {
          if (typeof window.showScreen === 'function') window.showScreen('screen-menu');
          return;
        }
        if (!I18N[lang].obligationsView) I18N[lang].obligationsView = I18N.en.obligationsView;
        if (!I18N[lang].obligationsList) I18N[lang].obligationsList = I18N.en.obligationsList;
        if (!I18N[lang].obligation) I18N[lang].obligation = I18N.en.obligation;
        if (!I18N[lang].popup) I18N[lang].popup = I18N.en.popup;
        if (!I18N[lang].shopping) I18N[lang].shopping = I18N.en.shopping;
        if (!I18N[lang].finances) I18N[lang].finances = I18N.en.finances;
        if (!I18N[lang].contacts) I18N[lang].contacts = I18N.en.contacts;
        const m = I18N[lang].menu || I18N.en.menu;
        const setTxt = (id, txt) => { const el = document.getElementById(id); if (el && txt) el.textContent = txt; };
        setTxt('btnObligations', m.obligations);
        setTxt('btnShopping', m.shopping);
        setTxt('btnContacts', m.contacts);
        setTxt('btnFinances', m.finances);
        setTxt('btnHealth', m.health);
        setTxt('btnDiary', m.diary);
        if (typeof window.showScreen === 'function') window.showScreen('screen-menu');
      }
      window.setLanguage = setLanguage;

      function bindLangButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
          btn.onclick = () => {
            const lang = btn.dataset.lang;
            if (!window.I18N || !I18N[lang]) { console.log("I18N not ready yet"); return; }
            setLanguage(lang);
          };
        });
      }

      // BACK - MENU
      const backMenu = document.getElementById('backMenu');
      if (backMenu) backMenu.addEventListener('click', () => {
        showScreen('screen-lang');
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('animate'));
      });

      // BACK - SHOPPING
      const backShopping = document.getElementById('backShopping');
      if (backShopping) backShopping.addEventListener('click', () => showScreen('screen-menu'));

      const backFinanceIncome = document.getElementById('backFinanceIncome');
      if (backFinanceIncome) backFinanceIncome.addEventListener('click', () => showScreen('screen-finances-menu'));
      const backFinanceFixed = document.getElementById('backFinanceFixed');
      if (backFinanceFixed) backFinanceFixed.addEventListener('click', () => showScreen('screen-finances-menu'));
      const backFinanceCredits = document.getElementById('backFinanceCredits');
      if (backFinanceCredits) backFinanceCredits.addEventListener('click', () => showScreen('screen-finances-menu'));
      const backFinanceOther = document.getElementById('backFinanceOther');
      if (backFinanceOther) backFinanceOther.addEventListener('click', () => showScreen('screen-finances-menu'));
      const backFinanceOverview = document.getElementById('backFinanceOverview');
      if (backFinanceOverview) backFinanceOverview.addEventListener('click', () => showScreen('screen-finances-menu'));

      // ===== CONTACTS BUTTON =====
      document.getElementById('btnContacts').addEventListener('click', () => {
        showScreen('screen-contacts');
        loadContacts();
        const lang = getLang();
        const c = I18N[lang].contacts || I18N.en.contacts;
        const contactsTitle = document.getElementById('contactsTitle');
        if (contactsTitle && c) contactsTitle.innerHTML = `<img src="images/contacts-icon.png" class="contacts-title-icon"> ${c.title}`;
        const btnImport = document.getElementById('btnImportContacts');
        if (btnImport && c) btnImport.textContent = c.import;
        const btnAddContact = document.getElementById('btnAddContact');
        if (btnAddContact && c) btnAddContact.textContent = c.add;
        const searchContacts = document.getElementById('searchContacts');
        if (searchContacts && c) searchContacts.placeholder = c.search;
      });

      // 📓 DIARY
      document.getElementById('btnDiary').addEventListener('click', () => {
        showScreen('screen-diary');
      });

      // BACK - FINANCES MENU
      const backFin = document.getElementById('backFinancesMenu');
      if (backFin) backFin.addEventListener('click', () => showScreen('screen-menu'));

      // ===== OTHER COSTS =====
      document.getElementById('btnShopping').addEventListener('click', async () => {
        initShoppingModule();
        const lang = getLang();
        showScreen('screen-shopping');
        document.getElementById('shoppingTitle').textContent = I18N[lang].shopping.title;
        document.getElementById('shoppingInput').placeholder = I18N[lang].shopping.placeholder;
        safeText('shoppingEmptyTitle', I18N[lang].shopping.emptyTitle);
        safeText('shoppingEmptySub', I18N[lang].shopping.emptySub);
        const scanBtnText = document.getElementById('btnScanReceipt');
        if (scanBtnText && I18N[lang].shopping.scanReceipt) scanBtnText.textContent = "➕ " + I18N[lang].shopping.scanReceipt;
        const toggleBtn = document.getElementById('toggleArchive');
        toggleBtn.textContent = showArchivedShopping ? I18N[lang].shopping.hideArchive : I18N[lang].shopping.showArchive;
        shoppingItems = await getShoppingItems();
        shoppingItems.sort((a, b) => a.createdAt - b.createdAt);
        requestAnimationFrame(() => {
          renderShoppingList();
          requestAnimationFrame(() => document.getElementById('shoppingInput')?.focus());
        });
        const scanBtn = document.getElementById('btnScanReceipt');
        if (scanBtn && !scanBtn.dataset.bound) {
          scanBtn.dataset.bound = "1";
          scanBtn.addEventListener('click', async () => {
            const userAmount = prompt("Upiši iznos računa (€):");
            if (userAmount === null) return;
            const amount = Number(userAmount.replace(',', '.'));
            if (!amount || isNaN(amount)) { alert("Neispravan iznos"); return; }
            const item = { id: Date.now(), type: 'otherCost', desc: "Račun", amount, date: new Date().toISOString().split('T')[0], createdAt: Date.now() };
            await addFinanceItem(item);
            alert("Račun spremljen u ostali troškovi: " + amount.toFixed(2) + " €");
          });
        }
      });

      // ===== NEW FINANCES UX (SIMPLIFIED) =====

// ➕ Dodaj prihod → direktno otvori prihode (kao default entry)
document.getElementById('btnAddTransaction')?.addEventListener('click', () => {
  document.getElementById('btnIncomeScreen')?.click();
});

// 📂 Troškovi → vodi na mjesečne troškove (entry point)
document.getElementById('btnAllCosts')?.addEventListener('click', () => {
  const popup = document.getElementById('financeCostsPopup');
  if (!popup) return;

  popup.style.display = 'block';

  requestAnimationFrame(() => {
    popup.classList.add('animate');
  });
});

// ===== FINANCE COSTS POPUP ACTIONS =====

document.getElementById('btnGoFixed')?.addEventListener('click', () => {
  closeFinancePopup();
  document.getElementById('btnMonthlyCostsScreen')?.click();
});

document.getElementById('btnGoOther')?.addEventListener('click', () => {
  closeFinancePopup();
  document.getElementById('btnOtherCostsScreen')?.click();
});

document.getElementById('btnGoCredits')?.addEventListener('click', () => {
  closeFinancePopup();
  document.getElementById('btnCreditsScreen')?.click();
});

function closeFinancePopup() {
  const popup = document.getElementById('financeCostsPopup');
  if (!popup) return;

  popup.classList.remove('animate');

  setTimeout(() => {
    popup.style.display = 'none';
  }, 200);
}

      // SHOPPING INPUT - Enter to add item
      const shoppingInput = document.getElementById('shoppingInput');
      if (shoppingInput) {
        shoppingInput.addEventListener('keydown', async e => {
          if (e.key !== 'Enter') return;
          const title = shoppingInput.value.trim();
          if (!title) return;
          const item = { id: crypto.randomUUID(), title, checked: false, createdAt: Date.now() };
          await addShoppingItem(item);
          shoppingItems = await getShoppingItems();
          shoppingItems.sort((a, b) => a.createdAt - b.createdAt);
          renderShoppingList();
          shoppingInput.value = '';
          shoppingInput.focus();
        });
      }

      // ARCHIVE TOGGLE
      const toggleArchiveBtn = document.getElementById('toggleArchive');
      if (toggleArchiveBtn) {
        toggleArchiveBtn.addEventListener('click', () => {
          showArchivedShopping = !showArchivedShopping;
          const lang = getLang();
          toggleArchiveBtn.textContent = showArchivedShopping ? I18N[lang].shopping.hideArchive : I18N[lang].shopping.showArchive;
          renderShoppingList();
        });
      }

      // OBVEZE → DIREKTNO PREGLED
      document.getElementById('btnObligations').addEventListener('click', () => {
  showScreen('screen-obligations-list');
  showListMode();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      renderObligationsList_SAFE();
    });
  });
});

      // ===== SAFE TEXT HELPER =====
      function safeText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

      // ===== APPLY ADD OBLIGATION I18N =====
      function applyAddObligationI18N() {
        const lang = getLang();
        const t = I18N[lang]?.obligation || I18N.en.obligation;
        const reminderLabel = document.getElementById('reminderLabel');
        if (reminderLabel) reminderLabel.textContent = t.reminder;
        const urgentLabel = document.getElementById('urgentLabel');
        if (urgentLabel) urgentLabel.textContent = t.urgent;
        const repeatLabel = document.getElementById('repeatLabel');
        if (repeatLabel) repeatLabel.textContent = t.repeat;
        const quietHoursLabel = document.getElementById('quietHoursLabel');
        if (quietHoursLabel) quietHoursLabel.textContent = t.quietHours;
        const reminderSelect = document.getElementById('reminderTime');
        if (reminderSelect) {
  reminderSelect.querySelectorAll('option').forEach(opt => {
    switch (opt.value) {
      case "0":
        opt.textContent = "U trenutku";
        break;
      case "15":
        opt.textContent = "15 min";
        break;
      case "30":
        opt.textContent = "30 min";
        break;
      case "60":
        opt.textContent = "1 h";
        break;
      case "120":
        opt.textContent = "2 h";
        break;
      case "1440":
        opt.textContent = "1 dan";
        break;
    }
  });
}
        const repeatType = document.getElementById('repeatType');
        if (repeatType) {
          const options = repeatType.querySelectorAll('option');
          if (options[0]) options[0].textContent = t.repeatNone;
          if (options[1]) options[1].textContent = t.repeatDaily;
          if (options[2]) options[2].textContent = t.repeatWeekly;
          if (options[3]) options[3].textContent = t.repeatMonthly;
        }
      }

      // ===== OPEN EDIT FORM (ENGINE SAFE) =====
      window.openEditForm = function (ob) {
        screenHistory.push('screen-obligations-list');
        showScreen('screen-add-obligation');
        document.getElementById('obligationTitle').value = ob.title || '';
        document.getElementById('obligationNote').value = ob.note || '';
        const dateInput = document.getElementById('obligationDate');
        const timeInput = document.getElementById('obligationTime');
        const enableTime = document.getElementById('enableTime');
        const timeWrapper = document.getElementById('timeWrapper');

if (enableTime && timeWrapper) {
  const hasTime =
  !!ob.dateTime &&
  typeof ob.dateTime === "string" &&
  ob.dateTime.match(/T\d{2}:\d{2}/);

  enableTime.checked = hasTime;
  timeWrapper.classList.toggle('hidden', !hasTime);
}

if (ob.dateTime) {
  const [datePart, timePart] = ob.dateTime.split('T');

  if (dateInput) dateInput.value = datePart || '';

  if (timeInput) {
    timeInput.value = timePart
      ? timePart.slice(0, 5)
      : '';
  }
} else {
  if (dateInput) dateInput.value = '';
  if (timeInput) timeInput.value = '';
}
        const urgent = document.getElementById('urgentObligation');
        if (urgent) urgent.checked = !!ob.urgent;
        const enableReminder = document.getElementById('enableReminder');
        const reminderOptions = document.getElementById('reminderOptions');
        if (enableReminder) {
          enableReminder.checked = !!ob.reminder;
        }
        if (reminderOptions) {
          reminderOptions.classList.toggle('hidden', !ob.reminder);
        }
        const reminderTime = document.getElementById('reminderTime');
        if (reminderTime && ob.reminder) reminderTime.value = ob.reminder;
        const repeatType = document.getElementById('repeatType');
        if (repeatType && ob.repeat) repeatType.value = ob.repeat;
        document.getElementById('saveObligation').dataset.editId = ob.id;

      }

      document.getElementById('btnAddObligation').addEventListener('click', (e) => {

  window.lkFocusIntent = 'obligationTitle'; // iOS keyboard intent

  showScreen('screen-add-obligation');

  resetObligationForm();

  applyAddObligationI18N();

  // Auto focus title after screen animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const titleInput = document.getElementById('obligationTitle');
      titleInput?.focus();
    });
  });


});
      document.getElementById('saveObligation').removeAttribute('data-edit-id');

      // BACK IZ FORME
      const backToAddObligation = document.getElementById('backToAddObligation');
      if (backToAddObligation) backToAddObligation.addEventListener('click', () => showScreen('screen-menu'));

      // PODSJETNIK
document.getElementById('enableReminder').addEventListener('change', (e) => {

  const enabled = e.target.checked;

  const reminderOptions = document.getElementById('reminderOptions');
  reminderOptions.classList.toggle('hidden', !enabled);

  if (enabled) {

    const reminderSelect = document.getElementById('reminderTime');

    // Predloži 15 min ako ništa nije odabrano
    if (!reminderSelect.value) {
      reminderSelect.value = "15";
    }

    // Podsjetnik automatski gasi repeat
    const repeatSelect = document.getElementById('repeatType');
    if (repeatSelect) repeatSelect.value = '';

  }

});

// ===== TIME TOGGLE (iOS FIX) =====
const enableTime = document.getElementById('enableTime');
const timeWrapper = document.getElementById('timeWrapper');
const timeInput = document.getElementById('obligationTime');

// 🧠 iOS TIME CONFIRM ONLY (uzima vrijednost tek na ✓)
if (timeInput && !timeInput.dataset.confirmOnly) {
  timeInput.dataset.confirmOnly = "1";

  let pendingTime = '';

  // dok scrolla → samo pamti
  timeInput.addEventListener('input', () => {
    pendingTime = timeInput.value;
  });

  // kad zatvori picker (✓) → commit
  timeInput.addEventListener('blur', () => {
    if (pendingTime) {
      timeInput.value = pendingTime;
    }
  });
}


if (enableTime && timeWrapper && timeInput) {

  enableTime.addEventListener('change', () => {
    const enabled = enableTime.checked;

    timeWrapper.classList.toggle('hidden', !enabled);

    if (!enabled) {
      timeInput.value = '';
    } else {
      requestAnimationFrame(() => {
        timeInput.focus();
      });
    }
  });

}

      // date is optional — no auto fill
const dateInput = document.getElementById('obligationDate');

      // SPREMI ILI AŽURIRAJ
      document.getElementById('saveObligation').addEventListener('click', async () => {

        showSaveToast();

  const saveBtn = document.getElementById('saveObligation');

  // ✅ HARD LOCK: spriječi multi-click duplikate
  if (saveBtn.dataset.saving === '1') return;
  saveBtn.dataset.saving = '1';
  saveBtn.disabled = true;

  try {

    const title = document.getElementById('obligationTitle').value.trim();
    if (!title) {
      alert(I18N[getLang()].popup.newObligationTitle);
      return;
    }

    const editIdStr = saveBtn.dataset.editId;
    const isEdit = !!editIdStr;
    const editId = isEdit ? parseInt(editIdStr, 10) : null;

    const lang = getLang();

    let existing = null;
    if (isEdit) {
      const all = await obligationDB.getAll();
      existing = all.find(o => o.id === editId) || null;
    }

// If user selected a date in a UI that yields date-only elsewhere,
// accept "YYYY-MM-DD" too. Also normalize date-only to midnight.
const dateVal =
  document.getElementById('obligationDate')?.value || '';

// 🧠 HARD READ (iOS fix)
const timeInputEl = document.getElementById('obligationTime');

let timeVal = '';

if (timeInputEl) {

  // 🛡️ iOS debounce guard (uzima samo stabilnu vrijednost)
  const raw = timeInputEl.value;

  if (raw && raw.length === 5) {
    timeVal = raw;
  } else {
    timeVal = '';
  }

}

const enableTime =
  document.getElementById('enableTime')?.checked;

let dateTime = null;

// timed obligation → ide u timeline
if (dateVal && timeVal) {
  dateTime = `${dateVal}T${timeVal}`;
} else {
  // bez potpunog datuma+vremena → "Kad stigneš"
  dateTime = null;
}
// ===== FORM SNAPSHOT (Calm Simplification) =====
const formData = {
  title: document.getElementById('obligationTitle').value.trim(),
  reminderEnabled: document.getElementById('enableReminder').checked,
  reminderValue: document.getElementById('reminderTime').value,
  repeat: document.getElementById('repeatType')?.value || null
};

const obligation = {
  id: isEdit ? editId : Date.now(),
  type: 'obligation',
  title: formData.title,
  dateTime,
  reminder: formData.reminderEnabled
  ? formData.reminderValue
  : null,
  repeat: formData.repeat,
  customRepeat: isEdit ? (existing?.customRepeat || null) : null,
  repeatPaused: isEdit ? (existing?.repeatPaused || false) : false,
  skipNextRepeat: isEdit ? (existing?.skipNextRepeat || false) : false,
  status: isEdit ? (existing?.status || 'active') : 'active',
  createdAt: isEdit
  ? (existing?.createdAt || `${getLocalISODate()}T${getLocalTimeHHMM()}`)
  : `${getLocalISODate()}T${getLocalTimeHHMM()}`,
  lang
};

    // ✅ 1) Spremi odmah (single source of truth)
await obligationDB.add(obligation);

// 🫀 flag for smart scroll
window.__NEW_OBLIGATION_ADDED__ = true;


// 🛡️ SAFE FALLBACK RENDER (no side effects)
try {
  const all = await obligationDB.getAll();
  window.__LK_FORCE_RENDER__ = true;
  window.renderObligationsList?.(all);
} catch (e) {
  console.warn('[save] fallback render failed', e);
}
// reset form fields after save (safe)
const titleInput = document.getElementById('obligationTitle');
const noteInput = document.getElementById('obligationNote');
const dateInput = document.getElementById('obligationDate');
const timeInput = document.getElementById('obligationTime');

if (titleInput) titleInput.value = '';
if (noteInput) noteInput.value = '';
if (dateInput) dateInput.value = '';
if (timeInput) timeInput.value = '';

// ✅ FIXED: očisti history da se izbjegne dupli back
const lastInHistory = screenHistory[screenHistory.length - 1];
if (lastInHistory === 'screen-obligations-list') {
  screenHistory.pop();
}

// ✅ always go back to list screen
window.AppState.obligations.viewMode = 'list';
showScreen('screen-obligations-list');

// ✅ deterministic render AFTER screen mount + visibility check
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    // 🧪 Provjeri da li smo na list screenu PRIJE rendera
const isActive = document.getElementById('screen-obligations-list')?.classList?.contains('active');

if (isActive) {
  window.__temporalRerenderQueued = false;

  if (typeof window.forceObligationsListRefresh === 'function') {
  window.forceObligationsListRefresh('afterSave')
    .catch(err => {
      console.error('🧾 forceListRefresh CALL ERROR (afterSave)', err);
    });
}

  // 🌿 UX: highlight nova obveza
  import('../modules/obligations/obligations.js').then(m => {
    setTimeout(() => {
  m.highlightNewObligation?.(obligation.id);
}, 180);
  });

} else {
  console.warn('⚠️ screen-obligations-list not active, skipping render');
}
  });
});

    resetObligationForm();

// ✅ 4) Notifikacije: pokušaj + jasni logovi (ne blokira UX)
(async () => {
  try {

    console.log("🔔 [notif] start", {
      isEdit,
      reminder: obligation?.reminder,
      dateTime: obligation?.dateTime,
      id: obligation?.id
    });

    console.log("🔔 [notif] importing notifications.js ...");

    const m = await import('./services/notifications.js');

    console.log("🔔 [notif] imported OK", Object.keys(m));

    if (!obligation?.reminder) {
      console.log("🔔 [notif] no reminder -> skip");
      return;
    }

    console.log("🔔 [notif] requesting permission ...");
    const granted = await m.requestNotificationPermission();

    console.log("🔔 [notif] permission result:", granted);

    if (!granted) return;

    console.log("🔔 [notif] calling schedule/reschedule ...");

    if (isEdit) {
      await m.rescheduleObligationNotification(obligation);
      console.log("🔔 [notif] rescheduled:", obligation.id);
    } else {
      await m.scheduleObligationNotification(obligation);
      console.log("🔔 [notif] scheduled:", obligation.id);
    }

  } catch (e) {
    console.error("🔔 [notif] ERROR object:", e);
    console.error("🔔 [notif] ERROR message:", e?.message);
    console.error("🔔 [notif] ERROR stack:", e?.stack);
    console.error("🔔 [notif] ERROR keys:", e ? Object.keys(e) : null);
    console.error("🔔 [notif] ERROR string:", String(e));
  }
})();

  } finally {
    // ✅ Unlock uvijek, čak i ako nešto pukne
    saveBtn.dataset.saving = '0';
    saveBtn.disabled = false;
  }

});

// ===== LOCAL DATE (NO TIMEZONE SHIFT) =====
function getLocalISODate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2,'0');
  const dd = String(now.getDate()).padStart(2,'0');

  return `${yyyy}-${mm}-${dd}`;
}

// ===== LOCAL TIME =====
function getLocalTimeHHMM() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');

  return `${hh}:${mm}`;
}

// ===== RESET OBLIGATION FORM =====
function resetObligationForm() {

  const title = document.getElementById('obligationTitle');
  if (title) title.value = '';

  const date = document.getElementById('obligationDate');
if (date) {
  date.value = getLocalISODate();
}

  const time = document.getElementById('obligationTime');
  if (time) time.value = '';

  const reminder = document.getElementById('enableReminder');
  if (reminder) reminder.checked = false;

  const reminderOptions = document.getElementById('reminderOptions');
  if (reminderOptions) reminderOptions.classList.add('hidden');

  const repeat = document.getElementById('repeatType');
  if (repeat) repeat.value = '';

  const saveBtn = document.getElementById('saveObligation');
  if (saveBtn) delete saveBtn.dataset.editId;

}

// ===== CANCEL OBLIGATION (SAFE) =====
const cancelBtn = document.getElementById('cancelObligation');
if (cancelBtn) {
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const saveBtn = document.getElementById('saveObligation');
    if (saveBtn) {
      saveBtn.dataset.saving = '0';
      saveBtn.disabled = false;
      delete saveBtn.dataset.editId;
    }

    resetObligationForm();

    // Back to list
    showScreen('screen-obligations-list');
    refreshCurrentObligationsView?.();
  });
}

      // PREGLED OBVEZA
      document.getElementById('btnViewObligations').addEventListener('click', () => {
        const popup = document.getElementById('obligationsPopup');
        popup.classList.remove('animate');
        setTimeout(() => popup.style.display = 'none', 300);
        showScreen('screen-obligations-list');
        const headerBack = document.getElementById('headerBack');
        if (headerBack) headerBack.classList.remove('hidden');
        showListMode();
        renderObligationsList_SAFE();
      });

      // BACK IZ LISTE
      const backToObligationsList = document.getElementById('backToObligationsList');
      if (backToObligationsList) backToObligationsList.addEventListener('click', () => showScreen('screen-menu'));

      // DATE PICKER
const dailyDatePicker = document.getElementById('dailyDatePicker');
if (dailyDatePicker) {

  // ✅ ne forsiraj Daily view svaki ulazak
  if (!window.AppState.obligations.currentDailyDate) {
    dailyDatePicker.value = todayISO();
    window.AppState.obligations.currentDailyDate = dailyDatePicker.value;
  } else {
    dailyDatePicker.value = window.AppState.obligations.currentDailyDate;
  }

  dailyDatePicker.addEventListener('change', () => {
    window.AppState.obligations.currentDailyDate = dailyDatePicker.value;
    loadDailyForDate(window.AppState.obligations.currentDailyDate);
  });
}

      // PROVJERA
      obligationDB.getAll().then(async obligations => {
  console.log('Učitane obveze iz IndexedDB:', obligations);

  const notif = await import('./services/notifications.js');

  if (notif?.rescheduleAllObligations) {
    await notif.rescheduleAllObligations(obligations);
  }
});

      // ===== HANDLE NOTIFICATION TAP (deep link) =====
      if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.LocalNotifications) {
        const { LocalNotifications } = Capacitor.Plugins;
        LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
          const data = event?.notification?.extra || {};
          if (data.obligationId) {
            const id = Number(data.obligationId);
            showScreen('screen-obligations-list');
            showListMode();

           requestAnimationFrame(() => {
           requestAnimationFrame(() => {
            renderObligationsList_SAFE();
           });
          });
            obligationDB.getAll().then(items => {
              const ob = items.find(o => Number(o.id) === id);
              if (!ob) return;
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  import('../modules/obligations/obligations.js').then(m => {
                    m.highlightNewObligation?.(ob.id);
                 });
                });
              });
            });
            return;
          }
          if (data.contactId) {
            const id = Number(data.contactId);
            getContacts().then(all => {
              const c = all.find(x => x.id == id);
              if (!c) return;
              openContactDetails(id);
            });
            return;
          }
        });
        // ===== FINAL FORCE START SCREEN (DEV ONLY) =====
        const DEV_FORCE_SCREEN = false;
        if (DEV_FORCE_SCREEN) {
          setTimeout(() => {
          showScreen('screen-obligations-list');
          showListMode();

         requestAnimationFrame(() => {
          requestAnimationFrame(() => {
           renderObligationsList_SAFE();
          });
        });

      }, 0);
        }
      } // ✅ DODANO: zatvara Capacitor if block

    } // ← zatvara EVENT GUARD else block

  } catch (err) { // ← zatvara try block
    console.error('INIT CRASH:', err);
    document.body.innerHTML = `<div style="height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;background:#0d5e32;color:white;font-family:sans-serif;text-align:center;padding:20px;"><h2>LifeKompas</h2><p>Dogodila se greška pri pokretanju aplikacije.</p><button onclick="location.reload()" style="padding:12px 20px;border:none;border-radius:12px;font-size:16px;">Ponovno pokreni</button></div>`;
  } // ← zatvara catch block
} // ← ✅ zatvara initApp function

function showSaveToast() {

  const toast = document.createElement('div');
  toast.textContent = 'Spremljeno';

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'black',
    color: 'white',
    padding: '12px 18px',
    borderRadius: '20px',
    zIndex: 99999
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 1500);
}