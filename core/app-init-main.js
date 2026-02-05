import {
  obligationDB,
  addFinanceItem,
  getFinanceItems,
  deleteFinanceItem,
  getShoppingItems,
  addShoppingItem
} from './db.js';

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
window.viewMode = 'list';
window.currentDailyDate = null;

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
window.viewMode = window.AppState.obligations.viewMode;
window.currentDailyDate = window.AppState.obligations.currentDailyDate;

// ===== NAVIGATION STATE =====
window.screenHistory = [];

// ===== AUTO RESET BOOT FAIL COUNTER =====
localStorage.removeItem('lifekompas_boot_fail');

// ===== UX 1.6.1 – CENTRAL BACK HANDLER =====
const headerBack = document.getElementById('headerBack');

// jednostavna povijest ekrana

window.showScreen = function (screenId) {

  // TRUE screen engine
  document.querySelectorAll('.screen')
    .forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');

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
  // ➕ se NE prikazuje
  break;

case 'screen-finances-menu':
  // ➕ se NE prikazuje
  break;
    case 'screen-obligations-list':
  headerAction.classList.remove('hidden');
  headerAction.onclick = () => {

    // ➕ Nova obveza
    screenHistory.push('screen-obligations-list');
    showScreen('screen-add-obligation');

    requestAnimationFrame(() => {
      applyAddObligationI18N();
    });

    document
      .getElementById('saveObligation')
      .removeAttribute('data-edit-id');
  };
  break;

    case 'screen-add-obligation':
  // i18n se primjenjuje centralno
  applyAddObligationI18N();

  // sigurnost: novi unos
  document
    .getElementById('saveObligation')
    .removeAttribute('data-edit-id');
  break;

    case 'screen-shopping':
  // ➕ se NE prikazuje (unos ide preko Enter)
  break;

    case 'screen-contacts': {
  // ➕ samo u headeru
  headerAction.classList.remove('hidden');
  headerAction.onclick = () => {
    screenHistory.push('screen-contacts');
    showScreen('screen-contact-form');
  };

  // ❌ sakrij stari gumb "Dodaj kontakt" (content)
  const legacyAddBtn = document.getElementById('btnAddContact');
  if (legacyAddBtn) {
    legacyAddBtn.style.display = 'none';
  }

  break;
}

    default:
      // ➕ skriven
      break;
  }
};

// klik na BACK
if (headerBack) {
  headerBack.addEventListener('click', () => {
    const current = document.querySelector('.screen.active')?.id;
    const prev = screenHistory.pop();

    // ⬅️ MENU → LANGUAGE
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

 // ===== CONTACTS INIT =====
  if (typeof loadContacts === 'function') {
  loadContacts();
}

if (typeof initContacts === 'function') {
  initContacts();
}

// ===== FORCE START SCREEN =====
  showScreen('screen-lang');

// bind language AFTER screens exist
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

  // reset forme
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
  list.innerHTML = `
    <div class="empty-list">
      <div style="font-size:26px; margin-bottom:6px;">💵</div>
      <div style="font-weight:700;">Nema unesenih prihoda</div>
      <div style="opacity:0.7; font-size:14px; margin-top:4px;">
        Dodaj prvi prihod pomoću ➕ u headeru.
      </div>
    </div>
  `;
  return;
}

    list.innerHTML = incomes.map(i => `
  <div class="finance-item" data-id="${i.id}" style="position:relative;">

    <div><strong>${i.amount} €</strong> – ${i.desc}</div>
    <div>${new Date(i.date).toLocaleDateString('hr-HR')}</div>

    <button class="finance-edit" data-id="${i.id}">✏️</button>

    <button class="finance-delete" data-id="${i.id}"
      style="position:absolute; bottom:6px; right:6px; border:none; background:none; font-size:18px;">
      🗑️
    </button>

  </div>
`).join('');

    // --- DELETE ---
    list.querySelectorAll('.finance-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.id);
        await deleteFinanceItem(id);
        renderIncomeList();
      });
    });

    // --- EDIT ---
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

  if (!desc || !amount || !start || !end) {
    return alert('Unesi sve podatke kredita');
  }

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

    quietStartInput.addEventListener('change', () => {
      localStorage.setItem('quietStart', quietStartInput.value);
    });

    quietEndInput.addEventListener('change', () => {
      localStorage.setItem('quietEnd', quietEndInput.value);
    });
  }

  // ===== SERVICE WORKER SNOOZE =====
  navigator.serviceWorker?.addEventListener('message', e => {
    if (e.data?.type === 'SNOOZE') {
      import('./notifications.js').then(({ snoozeObligation }) => {
        obligationDB.getAll().then(items => {
          const ob = items.find(o => o.id === e.data.obligationId);
          if (ob) snoozeObligation(ob, e.data.minutes);
        });
      });
    }
  });

/* ===== SET LANGUAGE + SHOW MENU (RESTORED) ===== */
function setLanguage(lang) {
  localStorage.setItem('userLang', lang);
  document.documentElement.setAttribute('lang', lang);

  // ako i18n još nije spreman → barem otvori menu
  if (typeof window.I18N === 'undefined' || !window.I18N[lang]) {
    if (typeof window.showScreen === 'function') {
      window.showScreen('screen-menu');
    }
    return;
  }

  // fallback EN (sigurno)
  if (!I18N[lang].obligationsView) I18N[lang].obligationsView = I18N.en.obligationsView;
  if (!I18N[lang].obligationsList) I18N[lang].obligationsList = I18N.en.obligationsList;
  if (!I18N[lang].obligation) I18N[lang].obligation = I18N.en.obligation;
  if (!I18N[lang].popup) I18N[lang].popup = I18N.en.popup;
  if (!I18N[lang].shopping) I18N[lang].shopping = I18N.en.shopping;
  if (!I18N[lang].finances) I18N[lang].finances = I18N.en.finances;
  if (!I18N[lang].contacts) I18N[lang].contacts = I18N.en.contacts;

  // MENU
  const m = I18N[lang].menu || I18N.en.menu;
  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el && txt) el.textContent = txt;
  };

  setTxt('btnObligations', m.obligations);
  setTxt('btnShopping', m.shopping);
  setTxt('btnContacts', m.contacts);
  setTxt('btnFinances', m.finances);
  setTxt('btnHealth', m.health);
  setTxt('btnDiary', m.diary);

  // otvori menu
  if (typeof window.showScreen === 'function') {
    window.showScreen('screen-menu');
  }
}

// expose (da radi i iz onclick-a i iz drugih modula)
window.setLanguage = setLanguage;

// JEZICI  (safe bind after I18N loaded)
function bindLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.onclick = () => {
      const lang = btn.dataset.lang;
      if (!window.I18N || !I18N[lang]) {
        console.log("I18N not ready yet");
        return;
      }
      setLanguage(lang);
    };
  });
}

// bind immediately

  // BACK - MENU
const backMenu = document.getElementById('backMenu');
if (backMenu) {
  backMenu.addEventListener('click', () => {
    showScreen('screen-lang');
    document.querySelectorAll('.menu-item')
      .forEach(item => item.classList.remove('animate'));
  });
}

  // BACK - SHOPPING
const backShopping = document.getElementById('backShopping');
if (backShopping) {
  backShopping.addEventListener('click', () => {
    showScreen('screen-menu');
  });
}

const backFinanceIncome = document.getElementById('backFinanceIncome');
if (backFinanceIncome) {
  backFinanceIncome.addEventListener('click', () => {
    showScreen('screen-finances-menu');
  });
}

const backFinanceFixed = document.getElementById('backFinanceFixed');
if (backFinanceFixed) {
  backFinanceFixed.addEventListener('click', () => {
    showScreen('screen-finances-menu');
  });
}

const backFinanceCredits = document.getElementById('backFinanceCredits');
if (backFinanceCredits) {
  backFinanceCredits.addEventListener('click', () => {
    showScreen('screen-finances-menu');
  });
}

const backFinanceOther = document.getElementById('backFinanceOther');
if (backFinanceOther) {
  backFinanceOther.addEventListener('click', () => {
    showScreen('screen-finances-menu');
  });
}

const backFinanceOverview = document.getElementById('backFinanceOverview');
if (backFinanceOverview) {
  backFinanceOverview.addEventListener('click', () => {
    showScreen('screen-finances-menu');
  });
}

  // SHOPPING BUTTON (open + load + focus)
// FINANCES BUTTON
document.getElementById('btnFinances').addEventListener('click', () => {
  showScreen('screen-finances-menu');
});

// ===== CONTACTS BUTTON =====
document.getElementById('btnContacts').addEventListener('click', () => {
  // UX 1.6 – povratak ide na MENU
  screenHistory.push('screen-menu');

  showScreen('screen-contacts');

// UX 1.6.2 – force header refresh for ➕
  if (window.showScreen) {
    window.showScreen('screen-contacts');
  }

  loadContacts();

  // ===== APPLY CONTACTS TRANSLATION ON OPEN =====
  const lang = getLang();
  const c = I18N[lang].contacts || I18N.en.contacts;

  const contactsTitle = document.getElementById('contactsTitle');
  if (contactsTitle && c) {
    contactsTitle.innerHTML = `<img src="images/contacts-icon.png" class="contacts-title-icon"> ${c.title}`;
  }

  const btnImport = document.getElementById('btnImportContacts');
  if (btnImport && c) btnImport.textContent = c.import;

  const btnAddContact = document.getElementById('btnAddContact');
  if (btnAddContact && c) btnAddContact.textContent = c.add;

  const searchContacts = document.getElementById('searchContacts');
  if (searchContacts && c) searchContacts.placeholder = c.search;
});

  // BACK - FINANCES MENU
const backFin = document.getElementById('backFinancesMenu');
if (backFin) {
  backFin.addEventListener('click', () => showScreen('screen-menu'));
}


// ===== FINANCES: FIXED EXPENSES =====

async function renderFixedList() {
  const list = document.getElementById('fixedList');
  if (!list) return;

  const items = await getFinanceItems();
  const fixed = items.filter(i => i.type === 'fixed');

  fixed.sort((a, b) => b.id - a.id);

  if (fixed.length === 0) {
  list.innerHTML = `
    <div class="empty-list">
      <div style="font-size:26px; margin-bottom:6px;">📅</div>
      <div style="font-weight:700;">Nema mjesečnih troškova</div>
      <div style="opacity:0.7; font-size:14px; margin-top:4px;">
        Dodaj trošak poput stanarine ili pretplate.
      </div>
    </div>
  `;
  return;
}

  list.innerHTML = fixed.map(i => `
  <div class="finance-item" data-id="${i.id}" style="position:relative;">

    <div><strong>${i.amount} €</strong> – ${i.desc}</div>

    <button class="finance-edit-fixed" data-id="${i.id}">✏️</button>

    <button class="finance-delete-fixed" data-id="${i.id}"
      style="position:absolute; bottom:6px; right:6px; border:none; background:none; font-size:18px;">
      🗑️
    </button>

  </div>
`).join('');

  // --- DELETE ---
  list.querySelectorAll('.finance-delete-fixed').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      await deleteFinanceItem(id);
      renderFixedList();
    });
  });

  // --- EDIT ---
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
  list.innerHTML = `
    <div class="empty-list">
      <div style="font-size:26px; margin-bottom:6px;">🏦</div>
      <div style="font-weight:700;">Nema aktivnih kredita</div>
      <div style="opacity:0.7; font-size:14px; margin-top:4px;">
        Ovdje će se prikazati rate kredita.
      </div>
    </div>
  `;
  return;
}

  list.innerHTML = credits.map(c => `
  <div class="finance-item" data-id="${c.id}" style="position:relative;">

    <div><strong>${c.amount} €</strong> – ${c.desc}</div>
    <div>Početak: ${new Date(c.start).toLocaleDateString('hr-HR')}</div>
    <div>Završetak: ${new Date(c.end).toLocaleDateString('hr-HR')}</div>
    <div>Zadnja uplata: ${c.lastPaid ? new Date(c.lastPaid).toLocaleDateString('hr-HR') : '-'}</div>

    <button class="finance-edit-credit" data-id="${c.id}">✏️</button>

    <button class="finance-delete-credit" data-id="${c.id}"
      style="position:absolute; bottom:6px; right:6px; border:none; background:none; font-size:18px;">
      🗑️
    </button>

  </div>
`).join('');

  // --- DELETE ---
  list.querySelectorAll('.finance-delete-credit').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      await deleteFinanceItem(id);
      renderCreditList();
    });
  });

  // --- EDIT ---
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

  // --- INCOME ---
  const incomes = items.filter(i =>
    i.type === 'income' &&
    i.date &&
    i.date.startsWith(`${year}-${month}`)
  );
  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

  // --- FIXED ---
  const fixed = items.filter(i => i.type === 'fixed');
  const totalFixed = fixed.reduce((sum, i) => sum + Number(i.amount), 0);

  // --- CREDITS ---
  const credits = items.filter(i => i.type === 'credit');
  let activeCredits = [];
  let totalCredits = 0;

  credits.forEach(c => {
    if (!c.start || !c.end) return;

    const startMonth = c.start.slice(0,7);
    const endMonth = c.end.slice(0,7);

    if (monthInput >= startMonth && monthInput <= endMonth) {
      totalCredits += Number(c.amount);
      activeCredits.push(c);
    }
  });

  // --- OTHER COSTS ---
  const otherCosts = items.filter(i =>
    i.type === 'otherCost' &&
    i.date &&
    i.date.startsWith(`${year}-${month}`)
  );
  const totalOther = otherCosts.reduce((sum, i) => sum + Number(i.amount), 0);

  // --- FINAL ---
  const result = totalIncome - totalFixed - totalCredits - totalOther;

  const out = document.getElementById('monthResult');
const lang = document.documentElement.getAttribute('lang') || getLang();

let html = `
  <div class="finance-item"><strong>${I18N[lang].finances.overview.sumIncome}:</strong> ${totalIncome.toFixed(2)} €</div>
  <div class="finance-item"><strong>${I18N[lang].finances.overview.sumFixed}:</strong> ${totalFixed.toFixed(2)} €</div>
  <div class="finance-item"><strong>${I18N[lang].finances.overview.sumCredits}:</strong> ${totalCredits.toFixed(2)} €</div>
  <div class="finance-item"><strong>${I18N[lang].finances.overview.sumOther}:</strong> ${totalOther.toFixed(2)} €</div>
  <div class="finance-item" style="font-weight:800;">
    ${I18N[lang].finances.overview.sumResult}: ${result.toFixed(2)} €
  </div>
  <hr>
`;

  // ===== INCOME LIST =====
  if (incomes.length > 0) {
    html += `<div class="finance-item" style="text-align:center; font-weight:800;">${I18N[lang].finances.overview.listIncome}</div>`;
    incomes.forEach(i => {
      html += `<div class="finance-item">💵 ${i.desc} — ${Number(i.amount).toFixed(2)} €</div>`;
    });
  }

  // ===== FIXED LIST =====
  if (fixed.length > 0) {
    html += `<div class="finance-item" style="text-align:center; font-weight:800;">${I18N[lang].finances.overview.listFixed}</div>`;
    fixed.forEach(f => {
      html += `<div class="finance-item">📅 ${f.desc} — ${Number(f.amount).toFixed(2)} €</div>`;
    });
  }

  // ===== CREDIT LIST =====
  if (activeCredits.length > 0) {
    html += `<div class="finance-item" style="text-align:center; font-weight:800;">${I18N[lang].finances.overview.listCredits}</div>`;
    activeCredits.forEach(c => {
      html += `<div class="finance-item">🏦 ${c.desc} — ${Number(c.amount).toFixed(2)} €</div>`;
    });
  }

  // ===== OTHER COSTS LIST =====
  if (otherCosts.length > 0) {
    html += `<div class="finance-item" style="text-align:center; font-weight:800;">${I18N[lang].finances.overview.listOther}</div>`;
    otherCosts.forEach(o => {
      html += `<div class="finance-item">🛒 ${o.desc} — ${Number(o.amount).toFixed(2)} €</div>`;
    });
  }

if (totalIncome === 0 && totalFixed === 0 && totalCredits === 0 && totalOther === 0) {
  out.innerHTML = `
    <div class="empty-list">
      <div style="font-size:26px; margin-bottom:6px;">📊</div>
      <div style="font-weight:700;">Nema podataka za odabrani mjesec</div>
      <div style="opacity:0.7; font-size:14px; margin-top:4px;">
        Unesi prihode ili troškove da vidiš pregled.
      </div>
    </div>
  `;
  return;
}

  out.innerHTML = html;
}

// ===== CONNECT MONTH CALCULATE BUTTON =====
document.getElementById('btnCalculateMonth')
  .addEventListener('click', calculateMonth);

  
// ===== OTHER COSTS =====

async function renderOtherList() {
  const list = document.getElementById('otherList');
  if (!list) return;

  const items = (await getFinanceItems()).filter(i => i.type === 'otherCost');

  if (items.length === 0) {
  list.innerHTML = `
    <div class="empty-list">
      <div style="font-size:26px; margin-bottom:6px;">🛒</div>
      <div style="font-weight:700;">Nema ostalih troškova</div>
      <div style="opacity:0.7; font-size:14px; margin-top:4px;">
        Ovdje dolaze jednokratni troškovi.
      </div>
    </div>
  `;
  return;
}

  list.innerHTML = items.map(i => `
  <div class="finance-item" data-id="${i.id}" style="position:relative;">

    <div><strong>${i.desc}</strong></div>
    <div>€ ${Number(i.amount).toFixed(2)}</div>
    <div>${i.date ? new Date(i.date).toLocaleDateString('hr-HR') : ''}</div>

    <button class="finance-edit-other" data-id="${i.id}">✏️</button>

    <button class="finance-delete-other" data-id="${i.id}"
      style="position:absolute; bottom:6px; right:6px; border:none; background:none; font-size:18px;">
      🗑️
    </button>

  </div>
`).join('');

  // --- DELETE ---
  list.querySelectorAll('.finance-delete-other').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      await deleteFinanceItem(id);
      renderOtherList();
    });
  });

  // --- EDIT ---
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

  const item = {
    id: isEdit ? Number(editId) : Date.now(),
    type: 'otherCost',
    desc,
    amount,
    date,
    createdAt: Date.now()
  };

  await addFinanceItem(item);

  document.getElementById('otherDesc').value = '';
  document.getElementById('otherAmount').value = '';
  document.getElementById('saveOther').removeAttribute('data-edit-id');

  renderOtherList();
});

// CALCULATE MONTH BUTTON
const calcBtn = document.getElementById('calcMonth');
if (calcBtn) {
  calcBtn.addEventListener('click', calculateMonth);
}

  document.getElementById('btnShopping').addEventListener('click', async () => {
    const lang = getLang();

    showScreen('screen-shopping');

    document.getElementById('shoppingTitle').textContent = I18N[lang].shopping.title;
    document.getElementById('shoppingInput').placeholder = I18N[lang].shopping.placeholder;
    document.getElementById('shoppingEmptyTitle').textContent = I18N[lang].shopping.emptyTitle;
    document.getElementById('shoppingEmptySub').textContent = I18N[lang].shopping.emptySub;

// --- SCAN RECEIPT BUTTON ---
const scanBtnText = document.getElementById('btnScanReceipt');
if (scanBtnText && I18N[lang].shopping.scanReceipt) {
  scanBtnText.textContent = "➕ " + I18N[lang].shopping.scanReceipt;
}

    const toggleBtn = document.getElementById('toggleArchive');
    toggleBtn.textContent = showArchivedShopping
      ? I18N[lang].shopping.hideArchive
      : I18N[lang].shopping.showArchive;

    shoppingItems = await getShoppingItems();

// ✅ zadrži redoslijed unosa
shoppingItems.sort((a, b) => a.createdAt - b.createdAt);

renderShoppingList();

    setTimeout(() => document.getElementById('shoppingInput').focus(), 0);
  });

// ===== ENTER RECEIPT AMOUNT BUTTON =====
const scanBtn = document.getElementById('btnScanReceipt');

if (scanBtn && !scanBtn.dataset.bound) {
  scanBtn.dataset.bound = "1";

  scanBtn.addEventListener('click', async () => {

    const userAmount = prompt("Upiši iznos računa (€):");
    if (userAmount === null) return;

    const amount = Number(userAmount.replace(',', '.'));
    if (!amount || isNaN(amount)) {
      alert("Neispravan iznos");
      return;
    }

    // ===== SPREMI U OSTALI TROŠKOVI =====
    const item = {
      id: Date.now(),
      type: 'otherCost',
      desc: "Račun",
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    };

    await addFinanceItem(item);

    alert("Račun spremljen: " + amount.toFixed(2) + " €");
  });
}
// ===== FINANCES MENU BUTTON LINKS =====

document.getElementById('btnIncomeScreen').addEventListener('click', async () => {
  showScreen('screen-finance-income');

  // UX 1.6.x – force header refresh (➕)
  window.showScreen('screen-finance-income');

  await renderIncomeList();
});

document.getElementById('btnMonthlyCostsScreen').addEventListener('click', async () => {
  showScreen('screen-finance-fixed');

  // UX 1.6.x – force header refresh (➕)
  window.showScreen('screen-finance-fixed');

  await renderFixedList();
});

document.getElementById('btnCreditsScreen').addEventListener('click', async () => {
  showScreen('screen-finance-credits');

  // UX 1.6.x – force header refresh (➕)
  window.showScreen('screen-finance-credits');

  await renderCreditList();
});

document.getElementById('btnOtherCostsScreen').addEventListener('click', async () => {
  showScreen('screen-finance-other');

  // UX 1.6.x – force header refresh (➕)
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
    shoppingInput.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;

      const title = shoppingInput.value.trim();
      if (!title) return;

      const item = {
        id: crypto.randomUUID(),
        title,
        checked: false,
        createdAt: Date.now()
      };

      shoppingItems.push(item);
      renderShoppingList();
      addShoppingItem(item);

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
      toggleArchiveBtn.textContent = showArchivedShopping
        ? I18N[lang].shopping.hideArchive
        : I18N[lang].shopping.showArchive;

      renderShoppingList();
    });
  }

  // OBVEZE → DIREKTNO PREGLED (bez popupa)
document.getElementById('btnObligations').addEventListener('click', () => {
  // UX 1.7 – Obveze su glavni ekran
  screenHistory.push('screen-menu');

  showScreen('screen-obligations-list');

  // ⚠️ FORCE HEADER REFRESH (➕ handler)
  window.showScreen('screen-obligations-list');

  showListMode();
  renderObligationsList();
});

  // ZATVORI POPUP – NOP (popup više nije u upotrebi)

  // FORMA ZA DODAVANJE
  document.getElementById('btnAddObligation').addEventListener('click', () => {
  // UX 1.6 – jedinstveni ulaz
  screenHistory.push('screen-obligations-list');
  showScreen('screen-add-obligation');

  requestAnimationFrame(() => {
    applyAddObligationI18N();
  });
});

  document
    .getElementById('saveObligation')
    .removeAttribute('data-edit-id');

  // BACK IZ FORME
  const backToAddObligation = document.getElementById('backToAddObligation');
if (backToAddObligation) {
  backToAddObligation.addEventListener('click', () => {
    showScreen('screen-menu');
  });
}

  // PODSJETNIK
  document.getElementById('enableReminder').addEventListener('change', (e) => {
    document.getElementById('reminderOptions').classList.toggle('hidden', !e.target.checked);
  });

  // SPREMI ILI AŽURIRAJ
  document.getElementById('saveObligation').addEventListener('click', async () => {
  const title = document.getElementById('obligationTitle').value.trim();
  if (!title) {
  alert(I18N[getLang()].popup.newObligationTitle);
  return;
}

  const editIdStr = document.getElementById('saveObligation').dataset.editId;
  const isEdit = !!editIdStr;
  const editId = isEdit ? parseInt(editIdStr, 10) : null;
  const lang = getLang();

  let existing = null;
  if (isEdit) {
    const all = await obligationDB.getAll();
    existing = all.find(o => o.id === editId) || null;
  }

  const obligation = {
    id: isEdit ? editId : Date.now(),
    type: 'obligation',
    title: title,
    note: document.getElementById('obligationNote').value,
    dateTime: document.getElementById('obligationDateTime').value,
    urgent: document.getElementById('urgentObligation')?.checked || false,
    reminder: document.getElementById('enableReminder').checked
      ? document.getElementById('reminderTime').value
      : null,
    repeat: document.getElementById('repeatType')?.value || null,
    customRepeat: isEdit ? (existing?.customRepeat || null) : null,
    repeatPaused: isEdit ? (existing?.repeatPaused || false) : false,
    skipNextRepeat: isEdit ? (existing?.skipNextRepeat || false) : false,
    status: isEdit ? (existing?.status || 'active') : 'active',
    createdAt: isEdit ? (existing?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    lang: lang
  };

  // SPREMI U DB
  await obligationDB.add(obligation);

  // ===== AUTOMATSKA DOZVOLA + ZAKAZIVANJE =====
  const m = await import('./notifications.js');

  if (obligation.reminder) {
    const granted = await m.requestNotificationPermission();
    if (!granted) {
      alert(I18N[getLang()].popup.newObligationSaved);
      showScreen('screen-menu');
      return;
    }
  }

  if (isEdit) {
    await m.rescheduleObligationNotification(obligation);
  } else {
    await m.scheduleObligationNotification(obligation);
  }

  alert(
  isEdit
    ? I18N[getLang()].popup.newObligationSaved
    : I18N[getLang()].popup.newObligationSaved
);

  // RESET FORME
  document.getElementById('obligationTitle').value = '';
  document.getElementById('obligationNote').value = '';
  document.getElementById('obligationDateTime').value = '';
  document.getElementById('enableReminder').checked = false;
  document.getElementById('reminderOptions').classList.add('hidden');
  const repeatSelect = document.getElementById('repeatType');
  if (repeatSelect) repeatSelect.value = '';
  document.getElementById('saveObligation').removeAttribute('data-edit-id');

  if (isEdit) {
    showScreen('screen-obligations-list');
    refreshCurrentObligationsView();
  } else {
    showScreen('screen-menu');
  }
});

  // ODUSTANI
  document.getElementById('cancelObligation').addEventListener('click', () => {
    const isEdit = !!document.getElementById('saveObligation').dataset.editId;
    document.getElementById('saveObligation').removeAttribute('data-edit-id');

    if (isEdit) {
      showScreen('screen-obligations-list');
      refreshCurrentObligationsView();
    } else {
      showScreen('screen-menu');
    }
  });

  // PREGLED OBVEZA
  document.getElementById('btnViewObligations').addEventListener('click', () => {
  // UX 1.6 – povratak ide na MENU
  screenHistory.push('screen-menu');

  const popup = document.getElementById('obligationsPopup');
  popup.classList.remove('animate');
  setTimeout(() => popup.style.display = 'none', 300);

  showScreen('screen-obligations-list');

  // ✅ FORCE BACK VISIBLE (critical fix)
  const headerBack = document.getElementById('headerBack');
  if (headerBack) {
    headerBack.classList.remove('hidden');
  }

  showListMode();
  renderObligationsList();
});

  // BACK IZ LISTE
  const backToObligationsList = document.getElementById('backToObligationsList');
if (backToObligationsList) {
  backToObligationsList.addEventListener('click', () => {
    showScreen('screen-menu');
  });
}

  // DATE PICKER
  const dailyDatePicker = document.getElementById('dailyDatePicker');
  if (dailyDatePicker) {
    dailyDatePicker.value = todayISO();
    currentDailyDate = dailyDatePicker.value;

    dailyDatePicker.addEventListener('change', () => {
      if (viewMode !== 'days') return;
      loadDailyForDate(dailyDatePicker.value);
    });
  }

  // TOGGLE LIST/DAY VIEW
  const btnViewByDays = document.getElementById('btnViewByDays');
  if (btnViewByDays) {
    btnViewByDays.addEventListener('click', async () => {
      if (viewMode === 'list') {
        showDailyMode();
        await loadDailyForDate(currentDailyDate || todayISO());
      } else {
        showListMode();
        await renderObligationsList();
      }
    });
  }

  // PROVJERA
obligationDB.getAll().then(async obligations => {
  console.log('Učitane obveze iz IndexedDB:', obligations);

  // ===== RESCHEDULE ALL FUTURE NOTIFICATIONS =====
  const m = await import('./notifications.js');
  await m.rescheduleAllObligations(obligations);
});

// ===== HANDLE NOTIFICATION TAP (deep link) =====
if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.LocalNotifications) {
  const { LocalNotifications } = Capacitor.Plugins;

  LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
    const data = event?.notification?.extra || {};

    // ===== OBLIGATION TAP =====
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
            const card = document.querySelector(
              `.obligation-card[data-id="${ob.id}"]`
            );

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

    // ===== CONTACT BIRTHDAY TAP =====
    if (data.contactId) {
      const id = Number(data.contactId);

      // učitaj kontakte i otvori detalje
      getContacts().then(all => {
        const c = all.find(x => x.id == id);
        if (!c) return;

        // koristi postojeću funkciju iz contacts.js
        openContactDetails(id);
      });

      return;
    }
  });
}

  // ===== FINAL FORCE START SCREEN (DEV ONLY) =====
const DEV_FORCE_SCREEN = false;

if (DEV_FORCE_SCREEN) {
  setTimeout(() => {
    showScreen('screen-obligations-list');
    showListMode();
    renderObligationsList();
  }, 0);
}
} // ← EVENT GUARD END

} catch (err) {

  console.error('INIT CRASH:', err);

  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;
      background:#0d5e32;
      color:white;
      font-family:sans-serif;
      text-align:center;
      padding:20px;
    ">
      <h2>LifeKompas</h2>
      <p>Dogodila se greška pri pokretanju aplikacije.</p>
      <button onclick="location.reload()" style="
        padding:12px 20px;
        border:none;
        border-radius:12px;
        font-size:16px;
      ">
        Ponovno pokreni
      </button>
    </div>
  `;
}

}