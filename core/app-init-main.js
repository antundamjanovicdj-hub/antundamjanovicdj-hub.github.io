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
} from './db.js';
import Temporal from '../src/core/temporal/index.js';
import * as notifications from './notifications.js';
import { getContacts } from './db.js';

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
        if (window.legacy_showScreen) {
           window.legacy_showScreen(screenId);
        }
        console.log('[NAV]', screenId);
        // TRUE screen engine
        document.querySelectorAll('.screen')
          .forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none'; // 🔥 KRITIČNO
          });
        const target = document.getElementById(screenId);
        if (target) {
  target.classList.add('active');
  target.style.display = 'block';

  // iOS keyboard fix
  const autofocusId = target?.dataset.autofocus;

if (autofocusId) {
  requestAnimationFrame(() => {
    document.getElementById(autofocusId)?.focus();
  });
}
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
            'screen-finance-overview': 'Pregled'
          };
          headerTitle.textContent = titles[screenId] || 'LifeKompas';
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
          case 'screen-finance-income':
            headerAction.classList.remove('hidden');
            headerAction.onclick = () => {
              const btn = document.getElementById('saveIncome');
              if (btn) btn.click();
            };
            break;
          case 'screen-finance-fixed':
            headerAction.classList.remove('hidden');
            headerAction.onclick = () => {
              const btn = document.getElementById('saveFixed');
              if (btn) btn.click();
            };
            break;
          case 'screen-finance-credits':
            headerAction.classList.remove('hidden');
            headerAction.onclick = () => {
              const btn = document.getElementById('saveCredit');
              if (btn) btn.click();
            };
            break;
          case 'screen-finance-other':
            headerAction.classList.remove('hidden');
            headerAction.onclick = () => {
              const btn = document.getElementById('saveOther');
              if (btn) btn.click();
            };
            break;
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

// 🔗 LIFEOMPAS ENGINE BRIDGE
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
window.forceObligationsListRefresh = async function(reason = '') {
  try {

    const all = await obligationDB.getAll();
    Temporal.setObligations(all);

    window.__TEMPORAL_STATE__ =
      Temporal.getState?.() || window.__TEMPORAL_STATE__;

    console.log('🧾 [forceListRefresh]', reason, {
      dbCount: all.length,
      lastId: all[all.length - 1]?.id
    });

    window.AppState.obligations.viewMode = 'list';

    showListMode?.();

// ⏱ wait one engine frame AFTER Temporal recalculation
setTimeout(() => {
  renderObligationsList?.();
}, 0);

  } catch (e) {
    console.log('🧾 [forceListRefresh] failed', e);
  }
};

      // klik na BACK
      if (headerBack) {
        headerBack.addEventListener('click', () => {
          const current = document.querySelector('.screen.active')?.id;
          const prev = screenHistory.pop();
          if (current === 'screen-menu') {
            showScreen('screen-lang');
            return;
          }
          if (prev) {
            showScreen(prev);
          } else {
            showScreen('screen-menu');
          }
        });
      }

      // ===== ENGINE GLOBAL CLICK DELEGATION =====
      document.addEventListener('click', async (e) => {
        const toggleBtn = e.target.closest('#btnViewByDays');
        if (!toggleBtn) return;
        const mode = window.AppState.obligations.viewMode;
        if (mode === 'list') {
          window.AppState.obligations.viewMode = 'days';
          showDailyMode();
          await loadDailyForDate(
            window.AppState.obligations.currentDailyDate || todayISO()
          );
        } else {
          window.AppState.obligations.viewMode = 'list';
          showListMode();
          await renderObligationsList();
        }
      });

      // ===== CONTACTS INIT =====
      if (typeof loadContacts === 'function') loadContacts();
      if (typeof initContacts === 'function') initContacts();

      // ===== FORCE START SCREEN =====
      showScreen('screen-lang');
      setTimeout(bindLangButtons, 0);

      // ===== SAVE INCOME =====
      document.getElementById('saveIncome').addEventListener('click', async () => {
        const amount = parseFloat(document.getElementById('incomeAmount').value);
        const desc = document.getElementById('incomeDesc').value.trim();
        const date = document.getElementById('incomeDate').value;
        if (!amount || !date) return alert('Unesi iznos i datum');
        const editId = document.getElementById('saveIncome').dataset.editId;
        const isEdit = !!editId;
        const item = {
          id: isEdit ? Number(editId) : Date.now(),
          type: 'income',
          amount,
          desc: desc || 'Prihod',
          date
        };
        await addFinanceItem(item);
        document.getElementById('incomeAmount').value = '';
        document.getElementById('incomeDesc').value = '';
        document.getElementById('incomeDate').value = '';
        document.getElementById('saveIncome').removeAttribute('data-edit-id');
        renderIncomeList();
      });

      // ===== RENDER INCOME LIST =====
      async function renderIncomeList() {
        const list = document.getElementById('incomeList');
        if (!list) return;
        const items = await getFinanceItems();
        const incomes = items.filter(i => i.type === 'income');
        incomes.sort((a, b) => b.id - a.id);
        if (incomes.length === 0) {
          list.innerHTML = `<div class="empty-list"><div style="font-size:26px; margin-bottom:6px;">💵</div><div style="font-weight:700;">Nema unesenih prihoda</div><div style="opacity:0.7; font-size:14px; margin-top:4px;">Dodaj prvi prihod pomoću ➕ u headeru.</div></div>`;
          return;
        }
        list.innerHTML = incomes.map(i => `
          <div class="finance-item" data-id="${i.id}" style="position:relative;">
            <div><strong>${i.amount} €</strong> – ${i.desc}</div>
            <div>${new Date(i.date).toLocaleDateString('hr-HR')}</div>
            <button class="finance-edit" data-id="${i.id}">✏️</button>
            <button class="finance-delete" data-id="${i.id}" style="position:absolute; bottom:6px; right:6px; border:none; background:none; font-size:18px;">🗑️</button>
          </div>`).join('');
        list.querySelectorAll('.finance-delete').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            await deleteFinanceItem(id);
            renderIncomeList();
          });
        });
        list.querySelectorAll('.finance-edit').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            const items = await getFinanceItems();
            const item = items.find(x => x.id === id);
            if (!item) return;
            document.getElementById('incomeAmount').value = item.amount;
            document.getElementById('incomeDesc').value = item.desc;
            document.getElementById('incomeDate').value = item.date;
            document.getElementById('saveIncome').dataset.editId = id;
          });
        });
      }

      // ===== SAVE FIXED =====
      document.getElementById('saveFixed').addEventListener('click', async () => {
        const desc = document.getElementById('fixedDesc').value.trim();
        const amount = parseFloat(document.getElementById('fixedAmount').value);
        if (!desc || !amount) return alert('Unesi naziv i iznos');
        const editId = document.getElementById('saveFixed').dataset.editId;
        const isEdit = !!editId;
        const item = {
          id: isEdit ? Number(editId) : Date.now(),
          type: 'fixed',
          desc,
          amount
        };
        await addFinanceItem(item);
        document.getElementById('fixedDesc').value = '';
        document.getElementById('fixedAmount').value = '';
        document.getElementById('saveFixed').removeAttribute('data-edit-id');
        renderFixedList();
      });

      // ===== SAVE CREDIT =====
      document.getElementById('saveCredit').addEventListener('click', async () => {
        const desc = document.getElementById('creditDesc').value.trim();
        const amount = parseFloat(document.getElementById('creditAmount').value);
        const start = document.getElementById('creditStart').value;
        const end = document.getElementById('creditEnd').value;
        const lastPaid = document.getElementById('creditLastPaid').value;
        if (!desc || !amount || !start || !end) return alert('Unesi sve podatke kredita');
        const editId = document.getElementById('saveCredit').dataset.editId;
        const isEdit = !!editId;
        const item = {
          id: isEdit ? Number(editId) : Date.now(),
          type: 'credit',
          desc,
          amount,
          start,
          end,
          lastPaid: lastPaid || null
        };
        await addFinanceItem(item);
        document.getElementById('creditDesc').value = '';
        document.getElementById('creditAmount').value = '';
        document.getElementById('creditStart').value = '';
        document.getElementById('creditEnd').value = '';
        document.getElementById('creditLastPaid').value = '';
        document.getElementById('saveCredit').removeAttribute('data-edit-id');
        renderCreditList();
      });

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

      // FINANCES BUTTON
      document.getElementById('btnFinances').addEventListener('click', () => showScreen('screen-finances-menu'));

      // ===== CONTACTS BUTTON =====
      document.getElementById('btnContacts').addEventListener('click', () => {
        screenHistory.push('screen-menu');
        showScreen('screen-contacts');
        if (window.showScreen) window.showScreen('screen-contacts');
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

      // BACK - FINANCES MENU
      const backFin = document.getElementById('backFinancesMenu');
      if (backFin) backFin.addEventListener('click', () => showScreen('screen-menu'));

      // ===== FINANCES: FIXED EXPENSES =====
      async function renderFixedList() {
        const list = document.getElementById('fixedList');
        if (!list) return;
        const items = await getFinanceItems();
        const fixed = items.filter(i => i.type === 'fixed');
        fixed.sort((a, b) => b.id - a.id);
        if (fixed.length === 0) {
          list.innerHTML = `<div class="empty-list"><div style="font-size:26px; margin-bottom:6px;">📅</div><div style="font-weight:700;">Nema mjesečnih troškova</div><div style="opacity:0.7; font-size:14px; margin-top:4px;">Dodaj trošak poput stanarine ili pretplate.</div></div>`;
          return;
        }
        list.innerHTML = fixed.map(i => `
          <div class="finance-item" data-id="${i.id}" style="position:relative;">
            <div><strong>${i.amount} €</strong> – ${i.desc}</div>
            <button class="finance-edit-fixed" data-id="${i.id}">✏️</button>
            <button class="finance-delete-fixed" data-id="${i.id}" style="position:absolute; bottom:6px; right:6px; border:none; background:none; font-size:18px;">🗑️</button>
          </div>`).join('');
        list.querySelectorAll('.finance-delete-fixed').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            await deleteFinanceItem(id);
            renderFixedList();
          });
        });
        list.querySelectorAll('.finance-edit-fixed').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            const items = await getFinanceItems();
            const item = items.find(x => x.id === id);
            if (!item) return;
            document.getElementById('fixedDesc').value = item.desc;
            document.getElementById('fixedAmount').value = item.amount;
            document.getElementById('saveFixed').dataset.editId = id;
          });
        });
      }

      // ===== FINANCES: CREDITS =====
      async function renderCreditList() {
        const list = document.getElementById('creditList');
        if (!list) return;
        const items = await getFinanceItems();
        const credits = items.filter(i => i.type === 'credit');
        credits.sort((a, b) => b.id - a.id);
        if (credits.length === 0) {
          list.innerHTML = `<div class="empty-list"><div style="font-size:26px; margin-bottom:6px;">🏦</div><div style="font-weight:700;">Nema aktivnih kredita</div><div style="opacity:0.7; font-size:14px; margin-top:4px;">Ovdje će se prikazati rate kredita.</div></div>`;
          return;
        }
        list.innerHTML = credits.map(c => `
          <div class="finance-item" data-id="${c.id}" style="position:relative;">
            <div><strong>${c.amount} €</strong> – ${c.desc}</div>
            <div>Početak: ${new Date(c.start).toLocaleDateString('hr-HR')}</div>
            <div>Završetak: ${new Date(c.end).toLocaleDateString('hr-HR')}</div>
            <div>Zadnja uplata: ${c.lastPaid ? new Date(c.lastPaid).toLocaleDateString('hr-HR') : '-'}</div>
            <button class="finance-edit-credit" data-id="${c.id}">✏️</button>
            <button class="finance-delete-credit" data-id="${c.id}" style="position:absolute; bottom:6px; right:6px; border:none; background:none; font-size:18px;">🗑️</button>
          </div>`).join('');
        list.querySelectorAll('.finance-delete-credit').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            await deleteFinanceItem(id);
            renderCreditList();
          });
        });
        list.querySelectorAll('.finance-edit-credit').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            const items = await getFinanceItems();
            const item = items.find(x => x.id === id);
            if (!item) return;
            document.getElementById('creditDesc').value = item.desc;
            document.getElementById('creditAmount').value = item.amount;
            document.getElementById('creditStart').value = item.start;
            document.getElementById('creditEnd').value = item.end;
            document.getElementById('creditLastPaid').value = item.lastPaid || '';
            document.getElementById('saveCredit').dataset.editId = id;
          });
        });
      }

      // ===== FINANCES: MONTHLY CALCULATION =====
      async function calculateMonth() {
        const monthInput = document.getElementById('financeMonth').value;
        if (!monthInput) return alert('Odaberi mjesec');
        const [year, month] = monthInput.split('-');
        const items = await getFinanceItems();
        const incomes = items.filter(i => i.type === 'income' && i.date && i.date.startsWith(`${year}-${month}`));
        const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
        const fixed = items.filter(i => i.type === 'fixed');
        const totalFixed = fixed.reduce((sum, i) => sum + Number(i.amount), 0);
        const credits = items.filter(i => i.type === 'credit');
        let activeCredits = [], totalCredits = 0;
        credits.forEach(c => {
          if (!c.start || !c.end) return;
          const startMonth = c.start.slice(0, 7), endMonth = c.end.slice(0, 7);
          if (monthInput >= startMonth && monthInput <= endMonth) { totalCredits += Number(c.amount); activeCredits.push(c); }
        });
        const otherCosts = items.filter(i => i.type === 'otherCost' && i.date && i.date.startsWith(`${year}-${month}`));
        const totalOther = otherCosts.reduce((sum, i) => sum + Number(i.amount), 0);
        const result = totalIncome - totalFixed - totalCredits - totalOther;
        const out = document.getElementById('monthResult');
        const lang = document.documentElement.getAttribute('lang') || getLang();
        let html = `
          <div class="finance-item"><strong>${I18N[lang].finances.overview.sumIncome}:</strong> ${totalIncome.toFixed(2)} €</div>
          <div class="finance-item"><strong>${I18N[lang].finances.overview.sumFixed}:</strong> ${totalFixed.toFixed(2)} €</div>
          <div class="finance-item"><strong>${I18N[lang].finances.overview.sumCredits}:</strong> ${totalCredits.toFixed(2)} €</div>
          <div class="finance-item"><strong>${I18N[lang].finances.overview.sumOther}:</strong> ${totalOther.toFixed(2)} €</div>
          <div class="finance-item" style="font-weight:800;">${I18N[lang].finances.overview.sumResult}: ${result.toFixed(2)} €</div><hr>`;
        if (incomes.length > 0) {
          html += `<div class="finance-item" style="text-align:center; font-weight:800;">${I18N[lang].finances.overview.listIncome}</div>`;
          incomes.forEach(i => { html += `<div class="finance-item">💵 ${i.desc} — ${Number(i.amount).toFixed(2)} €</div>`; });
        }
        if (fixed.length > 0) {
          html += `<div class="finance-item" style="text-align:center; font-weight:800;">${I18N[lang].finances.overview.listFixed}</div>`;
          fixed.forEach(f => { html += `<div class="finance-item">📅 ${f.desc} — ${Number(f.amount).toFixed(2)} €</div>`; });
        }
        if (activeCredits.length > 0) {
          html += `<div class="finance-item" style="text-align:center; font-weight:800;">${I18N[lang].finances.overview.listCredits}</div>`;
          activeCredits.forEach(c => { html += `<div class="finance-item">🏦 ${c.desc} — ${Number(c.amount).toFixed(2)} €</div>`; });
        }
        if (otherCosts.length > 0) {
          html += `<div class="finance-item" style="text-align:center; font-weight:800;">${I18N[lang].finances.overview.listOther}</div>`;
          otherCosts.forEach(o => { html += `<div class="finance-item">🛒 ${o.desc} — ${Number(o.amount).toFixed(2)} €</div>`; });
        }
        if (totalIncome === 0 && totalFixed === 0 && totalCredits === 0 && totalOther === 0) {
          out.innerHTML = `<div class="empty-list"><div style="font-size:26px; margin-bottom:6px;">📊</div><div style="font-weight:700;">Nema podataka za odabrani mjesec</div><div style="opacity:0.7; font-size:14px; margin-top:4px;">Unesi prihode ili troškove da vidiš pregled.</div></div>`;
          return;
        }
        out.innerHTML = html;
      }
      document.getElementById('btnCalculateMonth').addEventListener('click', calculateMonth);

      // ===== OTHER COSTS =====
      async function renderOtherList() {
        const list = document.getElementById('otherList');
        if (!list) return;
        const items = (await getFinanceItems()).filter(i => i.type === 'otherCost');
        if (items.length === 0) {
          list.innerHTML = `<div class="empty-list"><div style="font-size:26px; margin-bottom:6px;">🛒</div><div style="font-weight:700;">Nema ostalih troškova</div><div style="opacity:0.7; font-size:14px; margin-top:4px;">Ovdje dolaze jednokratni troškovi.</div></div>`;
          return;
        }
        list.innerHTML = items.map(i => `
          <div class="finance-item" data-id="${i.id}" style="position:relative;">
            <div><strong>${i.desc}</strong></div>
            <div>€ ${Number(i.amount).toFixed(2)}</div>
            <div>${i.date ? new Date(i.date).toLocaleDateString('hr-HR') : ''}</div>
            <button class="finance-edit-other" data-id="${i.id}">✏️</button>
            <button class="finance-delete-other" data-id="${i.id}" style="position:absolute; bottom:6px; right:6px; border:none; background:none; font-size:18px;">🗑️</button>
          </div>`).join('');
        list.querySelectorAll('.finance-delete-other').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            await deleteFinanceItem(id);
            renderOtherList();
          });
        });
        list.querySelectorAll('.finance-edit-other').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            const items = await getFinanceItems();
            const item = items.find(x => x.id === id);
            if (!item) return;
            document.getElementById('otherDesc').value = item.desc;
            document.getElementById('otherAmount').value = item.amount;
            document.getElementById('saveOther').dataset.editId = id;
          });
        });
      }

      document.getElementById('saveOther').addEventListener('click', async () => {
        const desc = document.getElementById('otherDesc').value.trim();
        const amount = document.getElementById('otherAmount').value;
        const date = new Date().toISOString().split('T')[0];
        if (!desc || !amount) return;
        const editId = document.getElementById('saveOther').dataset.editId;
        const isEdit = !!editId;
        const item = { id: isEdit ? Number(editId) : Date.now(), type: 'otherCost', desc, amount, date, createdAt: Date.now() };
        await addFinanceItem(item);
        document.getElementById('otherDesc').value = '';
        document.getElementById('otherAmount').value = '';
        document.getElementById('saveOther').removeAttribute('data-edit-id');
        renderOtherList();
      });

      const calcBtn = document.getElementById('calcMonth');
      if (calcBtn) calcBtn.addEventListener('click', calculateMonth);

      document.getElementById('btnShopping').addEventListener('click', async () => {
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
            alert("Račun spremljen: " + amount.toFixed(2) + " €");
          });
        }
      });

      // ===== FINANCES MENU BUTTON LINKS =====
      document.getElementById('btnIncomeScreen').addEventListener('click', async () => {
        showScreen('screen-finance-income');
        window.showScreen('screen-finance-income');
        await renderIncomeList();
      });
      document.getElementById('btnMonthlyCostsScreen').addEventListener('click', async () => {
        showScreen('screen-finance-fixed');
        window.showScreen('screen-finance-fixed');
        await renderFixedList();
      });
      document.getElementById('btnCreditsScreen').addEventListener('click', async () => {
        showScreen('screen-finance-credits');
        window.showScreen('screen-finance-credits');
        await renderCreditList();
      });
      document.getElementById('btnOtherCostsScreen').addEventListener('click', async () => {
        showScreen('screen-finance-other');
        window.showScreen('screen-finance-other');
        await renderOtherList();
      });
      document.getElementById('btnCostsOverview').addEventListener('click', () => {
        const lang = getLang();
        document.documentElement.setAttribute('lang', lang);
        showScreen('screen-finance-overview');
      });

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
        screenHistory.push('screen-menu');
        showScreen('screen-obligations-list');
        showListMode();
        renderObligationsList();
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
          const options = reminderSelect.querySelectorAll('option');
          if (options[0]) options[0].textContent = "U trenutku";
          if (options[1]) options[1].textContent = "15 min";
          if (options[2]) options[2].textContent = "30 min";
          if (options[3]) options[3].textContent = "1 h";
          if (options[4]) options[4].textContent = "2 h";
          if (options[5]) options[5].textContent = "1 dan";
        }
        const repeatType = document.getElementById('repeatType');
        if (repeatType) {
          const options = repeatType.querySelectorAll('option');
          if (options[0]) options[0].textContent = t.repeatNone;
          if (options[1]) options[1].textContent = t.repeatDaily;
          if (options[2]) options[2].textContent = t.repeatWeekly;
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
       document.getElementById('obligationTitle')?.focus(); 
  window.lkFocusIntent = 'obligationTitle'; // iOS keyboard intent

  screenHistory.push('screen-obligations-list');
  showScreen('screen-add-obligation');
  applyAddObligationI18N();
});
      document.getElementById('saveObligation').removeAttribute('data-edit-id');

      // BACK IZ FORME
      const backToAddObligation = document.getElementById('backToAddObligation');
      if (backToAddObligation) backToAddObligation.addEventListener('click', () => showScreen('screen-menu'));

      // PODSJETNIK
      document.getElementById('enableReminder').addEventListener('change', (e) => {
        document.getElementById('reminderOptions').classList.toggle('hidden', !e.target.checked);
      });

      // SPREMI ILI AŽURIRAJ
      document.getElementById('saveObligation').addEventListener('click', async () => {

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

const timeVal =
  document.getElementById('obligationTime')?.value || '';

let dateTime = null;

if (dateVal && timeVal) {
  dateTime = `${dateVal}T${timeVal}`;
} else if (dateVal) {
  dateTime = `${dateVal}T00:00`;
} else if (isEdit && existing?.dateTime) {
  // ✅ KEEP OLD DATE WHEN USER DID NOT CHANGE IT
  dateTime = existing.dateTime;
}
// ===== FORM SNAPSHOT (Calm Simplification) =====
const formData = {
  title: document.getElementById('obligationTitle').value.trim(),
  note: document.getElementById('obligationNote').value,
  urgent: document.getElementById('urgentObligation')?.checked || false,
  reminderEnabled: document.getElementById('enableReminder').checked,
  reminderValue: document.getElementById('reminderTime').value,
  repeat: document.getElementById('repeatType')?.value || null
};

const obligation = {
  id: isEdit ? editId : Date.now(),
  type: 'obligation',
  title: formData.title,
note: formData.note,
urgent: formData.urgent,
dateTime,
  reminder: formData.reminderEnabled
  ? formData.reminderValue
  : null,
  repeat: formData.repeat,
  customRepeat: isEdit ? (existing?.customRepeat || null) : null,
  repeatPaused: isEdit ? (existing?.repeatPaused || false) : false,
  skipNextRepeat: isEdit ? (existing?.skipNextRepeat || false) : false,
  status: isEdit ? (existing?.status || 'active') : 'active',
  createdAt: isEdit ? (existing?.createdAt || new Date().toISOString()) : new Date().toISOString(),
  lang
};

    // ✅ 1) Spremi odmah
await obligationDB.add(obligation);

// ✅ always go back to list screen
window.AppState.obligations.viewMode = 'list';
showScreen('screen-obligations-list');

// ✅ deterministic render AFTER screen mount (2x RAF)
requestAnimationFrame(() => {
  requestAnimationFrame(async () => {
    await window.forceObligationsListRefresh?.('afterSave');
  });
});

    // ✅ 3) Očisti formu
    document.getElementById('obligationTitle').value = '';
document.getElementById('obligationNote').value = '';

const dateInput = document.getElementById('obligationDate');
if (dateInput) dateInput.value = '';

const timeInput = document.getElementById('obligationTime');
if (timeInput) timeInput.value = '';

document.getElementById('enableReminder').checked = false;
document.getElementById('reminderOptions').classList.add('hidden');

    const repeatSelect = document.getElementById('repeatType');
    if (repeatSelect) repeatSelect.value = '';

    saveBtn.removeAttribute('data-edit-id');

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

    const m = await import('./notifications.js');

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
      saveBtn.removeAttribute('data-edit-id');
    }

    // očisti formu
    document.getElementById('obligationTitle').value = '';
document.getElementById('obligationNote').value = '';

const dateInput = document.getElementById('obligationDate');
if (dateInput) dateInput.value = '';

const timeInput = document.getElementById('obligationTime');
if (timeInput) timeInput.value = '';

document.getElementById('enableReminder').checked = false;
document.getElementById('reminderOptions').classList.add('hidden');

    const repeatSelect = document.getElementById('repeatType');
    if (repeatSelect) repeatSelect.value = '';

    // UX: uvijek natrag na listu
    showScreen('screen-obligations-list');
    refreshCurrentObligationsView?.();
  });
}

      // PREGLED OBVEZA
      document.getElementById('btnViewObligations').addEventListener('click', () => {
        screenHistory.push('screen-menu');
        const popup = document.getElementById('obligationsPopup');
        popup.classList.remove('animate');
        setTimeout(() => popup.style.display = 'none', 300);
        showScreen('screen-obligations-list');
        const headerBack = document.getElementById('headerBack');
        if (headerBack) headerBack.classList.remove('hidden');
        showListMode();
        renderObligationsList();
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

  const notif = await import('./notifications.js');

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
            renderObligationsList();
            obligationDB.getAll().then(items => {
              const ob = items.find(o => Number(o.id) === id);
              if (!ob) return;
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  const card = document.querySelector(`.obligation-card[data-id="${ob.id}"]`);
                  if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.classList.add('highlight');
                    setTimeout(() => card.classList.remove('highlight'), 2000);
                  }
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
            renderObligationsList();
          }, 0);
        }
      } // ✅ DODANO: zatvara Capacitor if block

    } // ← zatvara EVENT GUARD else block

  } catch (err) { // ← zatvara try block
    console.error('INIT CRASH:', err);
    document.body.innerHTML = `<div style="height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;background:#0d5e32;color:white;font-family:sans-serif;text-align:center;padding:20px;"><h2>LifeKompas</h2><p>Dogodila se greška pri pokretanju aplikacije.</p><button onclick="location.reload()" style="padding:12px 20px;border:none;border-radius:12px;font-size:16px;">Ponovno pokreni</button></div>`;
  } // ← zatvara catch block
} // ← ✅ zatvara initApp function