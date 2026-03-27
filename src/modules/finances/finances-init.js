import {
  addFinanceItem,
  getFinanceItems,
  deleteFinanceItem
} from '../../core/services/db.js';

export function initFinancesModule() {
  console.log('[Finances] init');

  const btn = document.getElementById('btnFinances');

  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = '1';

    btn.addEventListener('click', async () => {
      showScreen('screen-finances-menu');
      await renderFinanceSummary();
    });
  }

  const saveIncomeBtn = document.getElementById('saveIncome');

  if (saveIncomeBtn && !saveIncomeBtn.dataset.bound) {
    saveIncomeBtn.dataset.bound = '1';

    saveIncomeBtn.addEventListener('click', async () => {
      const amount = parseFloat(document.getElementById('incomeAmount').value);
      const desc = document.getElementById('incomeDesc').value.trim();
      const date = document.getElementById('incomeDate').value;

      if (!amount || !date) return alert('Unesi iznos i datum');

      const editId = saveIncomeBtn.dataset.editId;
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
      saveIncomeBtn.removeAttribute('data-edit-id');

      renderIncomeList();
    });
  }

  const incomeScreenBtn = document.getElementById('btnIncomeScreen');

  if (incomeScreenBtn && !incomeScreenBtn.dataset.bound) {
    incomeScreenBtn.dataset.bound = '1';

    incomeScreenBtn.addEventListener('click', async () => {
      showScreen('screen-finance-income');
      window.showScreen('screen-finance-income');
      await renderIncomeList();
    });
  }
  const saveFixedBtn = document.getElementById('saveFixed');

if (saveFixedBtn && !saveFixedBtn.dataset.bound) {
  saveFixedBtn.dataset.bound = '1';

  saveFixedBtn.addEventListener('click', async () => {
    const desc = document.getElementById('fixedDesc').value.trim();
    const amount = parseFloat(document.getElementById('fixedAmount').value);

    if (!desc || !amount) return alert('Unesi naziv i iznos');

    const editId = saveFixedBtn.dataset.editId;
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
    saveFixedBtn.removeAttribute('data-edit-id');

    window.renderFixedList();
  });
}

const monthlyCostsScreenBtn = document.getElementById('btnMonthlyCostsScreen');
const saveCreditBtn = document.getElementById('saveCredit');

if (saveCreditBtn && !saveCreditBtn.dataset.bound) {
  saveCreditBtn.dataset.bound = '1';

  saveCreditBtn.addEventListener('click', async () => {
    const desc = document.getElementById('creditDesc').value.trim();
    const amount = parseFloat(document.getElementById('creditAmount').value);
    const start = document.getElementById('creditStart').value;
    const end = document.getElementById('creditEnd').value;
    const lastPaid = document.getElementById('creditLastPaid').value;

    if (!desc || !amount || !start || !end) return alert('Unesi sve podatke kredita');

    const editId = saveCreditBtn.dataset.editId;
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
    saveCreditBtn.removeAttribute('data-edit-id');

    window.renderCreditList();
  });
}

const creditsScreenBtn = document.getElementById('btnCreditsScreen');
const saveOtherBtn = document.getElementById('saveOther');

if (saveOtherBtn && !saveOtherBtn.dataset.bound) {
  saveOtherBtn.dataset.bound = '1';

  saveOtherBtn.addEventListener('click', async () => {
    const desc = document.getElementById('otherDesc').value.trim();
    const amount = document.getElementById('otherAmount').value;
    const date = new Date().toISOString().split('T')[0];

    if (!desc || !amount) return;

    const editId = saveOtherBtn.dataset.editId;
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
    saveOtherBtn.removeAttribute('data-edit-id');

    window.renderOtherList();
  });
}

const otherScreenBtn = document.getElementById('btnOtherCostsScreen');
const calcBtn = document.getElementById('btnCalculateMonth');

if (calcBtn && !calcBtn.dataset.bound) {
  calcBtn.dataset.bound = '1';

  calcBtn.addEventListener('click', () => {
  if (typeof window.calculateMonth === 'function') {
    window.calculateMonth();
  } else {
    console.error('calculateMonth not ready');
  }
});
}

const overviewBtn = document.getElementById('btnCostsOverview');

if (overviewBtn && !overviewBtn.dataset.bound) {
  overviewBtn.dataset.bound = '1';

  overviewBtn.addEventListener('click', () => {
    const lang = getLang();
    document.documentElement.setAttribute('lang', lang);
    showScreen('screen-finance-overview');
  });
}

if (otherScreenBtn && !otherScreenBtn.dataset.bound) {
  otherScreenBtn.dataset.bound = '1';

  otherScreenBtn.addEventListener('click', async () => {
    showScreen('screen-finance-other');
    window.showScreen('screen-finance-other');
    await window.renderOtherList();
  });
}

if (creditsScreenBtn && !creditsScreenBtn.dataset.bound) {
  creditsScreenBtn.dataset.bound = '1';

  creditsScreenBtn.addEventListener('click', async () => {
    showScreen('screen-finance-credits');
    window.showScreen('screen-finance-credits');
    await window.renderCreditList();
  });
}

if (monthlyCostsScreenBtn && !monthlyCostsScreenBtn.dataset.bound) {
  monthlyCostsScreenBtn.dataset.bound = '1';

  monthlyCostsScreenBtn.addEventListener('click', async () => {
    showScreen('screen-finance-fixed');
    window.showScreen('screen-finance-fixed');
    await window.renderFixedList();
  });
}
}

// ===== FINANCE SUMMARY (EXTRACTED) =====
async function renderFinanceSummary() {
  const items = await getFinanceItems();

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const incomes = items.filter(i =>
    i.type === 'income' &&
    i.date &&
    i.date.startsWith(`${year}-${month}`)
  );

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

  const fixed = items.filter(i => i.type === 'fixed');
  const totalFixed = fixed.reduce((sum, i) => sum + Number(i.amount), 0);

  const credits = items.filter(i => i.type === 'credit');
  const totalCredits = credits.reduce((sum, i) => sum + Number(i.amount), 0);

  const other = items.filter(i =>
    i.type === 'otherCost' &&
    i.date &&
    i.date.startsWith(`${year}-${month}`)
  );
  const totalOther = other.reduce((sum, i) => sum + Number(i.amount), 0);

  const incomeEl = document.getElementById('financeIncomeTotal');
  const expenseEl = document.getElementById('financeExpenseTotal');
  const balanceEl = document.getElementById('financeBalanceTotal');

  const totalExpenses = totalFixed + totalCredits + totalOther;
  const balance = totalIncome - totalExpenses;

  if (incomeEl) incomeEl.textContent = `Prihodi ${totalIncome.toFixed(2)} €`;
  if (expenseEl) expenseEl.textContent = `Odbici ${totalExpenses.toFixed(2)} €`;
  if (balanceEl) balanceEl.textContent = `Stanje ${balance.toFixed(2)} €`;
}
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
  <div class="finance-item" data-id="${i.id}">
    <div class="finance-row">
      <div><strong>${Number(i.amount).toFixed(2)} €</strong> – ${i.desc}</div>

      <div class="finance-actions">
        <button class="finance-edit" data-id="${i.id}">✏️</button>
        <button class="finance-delete" data-id="${i.id}">🗑️</button>
      </div>
    </div>
  </div>
`).join('');

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
window.renderFixedList = async function () {
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
          <div class="finance-item" data-id="${i.id}">
            <div class="finance-row">
              <div><strong>${Number(i.amount).toFixed(2)} €</strong> – ${i.desc}</div>

              <div class="finance-actions">
                <button class="finance-edit-fixed" data-id="${i.id}">✏️</button>
                <button class="finance-delete-fixed" data-id="${i.id}">🗑️</button>
             </div>
           </div>
         </div>
         `).join('');

  list.querySelectorAll('.finance-delete-fixed').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      await deleteFinanceItem(id);
      window.renderFixedList();
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
};
window.renderCreditList = async function () {
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
  <div class="finance-item" data-id="${c.id}">
    <div class="finance-row">
      <div>
        <strong>${Number(c.amount).toFixed(2)} €</strong> – ${c.desc}
        <div style="font-size:12px; opacity:0.7;">
          ${new Date(c.start + 'T00:00:00').toLocaleDateString('hr-HR')} → ${new Date(c.end + 'T00:00:00').toLocaleDateString('hr-HR')}
        </div>
      </div>

      <div class="finance-actions">
        <button class="finance-edit-credit" data-id="${c.id}">✏️</button>
        <button class="finance-delete-credit" data-id="${c.id}">🗑️</button>
      </div>
    </div>
  </div>
`).join('');

  list.querySelectorAll('.finance-delete-credit').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      await deleteFinanceItem(id);
      window.renderCreditList();
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
};

window.renderOtherList = async function () {

  const list = document.getElementById('otherList');
  if (!list) return;

  const items = (await getFinanceItems())
  .filter(i => i.type === 'otherCost')
  .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (items.length === 0) {
    list.innerHTML = `<div class="empty-list"><div style="font-size:26px; margin-bottom:6px;">🛒</div><div style="font-weight:700;">Nema ostalih troškova</div><div style="opacity:0.7; font-size:14px; margin-top:4px;">Ovdje dolaze jednokratni troškovi.</div></div>`;
    return;
  }

  list.innerHTML = items.map(i => `
  <div class="finance-item" data-id="${i.id}">
    <div class="finance-row">
      <div>
        <strong>${Number(i.amount).toFixed(2)} €</strong> – ${i.desc}
        <div style="font-size:12px; opacity:0.7;">
          ${i.date ? new Date(i.date + 'T00:00:00').toLocaleDateString('hr-HR') : ''}
        </div>
      </div>

      <div class="finance-actions">
        <button class="finance-edit-other" data-id="${i.id}">✏️</button>
        <button class="finance-delete-other" data-id="${i.id}">🗑️</button>
      </div>
    </div>
  </div>
`).join('');

  list.querySelectorAll('.finance-delete-other').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      await deleteFinanceItem(id);
      window.renderOtherList();
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
};
window.calculateMonth = async function () {
  const monthInput = document.getElementById('financeMonth').value;

  if (!monthInput) return alert('Odaberi mjesec');

  const [year, month] = monthInput.split('-');

  const items = await getFinanceItems();

  const incomes = items.filter(i =>
    i.type === 'income' &&
    i.date &&
    i.date.startsWith(`${year}-${month}`)
  );

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

  const fixed = items.filter(i => i.type === 'fixed');
  const totalFixed = fixed.reduce((sum, i) => sum + Number(i.amount), 0);

  const credits = items.filter(i => i.type === 'credit');

  let activeCredits = [];
  let totalCredits = 0;

  credits.forEach(c => {
    if (!c.start || !c.end) return;

    const startMonth = c.start.slice(0, 7);
    const endMonth = c.end.slice(0, 7);

    if (monthInput >= startMonth && monthInput <= endMonth) {
      totalCredits += Number(c.amount);
      activeCredits.push(c);
    }
  });

  const otherCosts = items
    .filter(i =>
      i.type === 'otherCost' &&
      i.date &&
      i.date.startsWith(`${year}-${month}`)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalOther = otherCosts.reduce((sum, i) => sum + Number(i.amount), 0);

  const result = totalIncome - totalFixed - totalCredits - totalOther;

  const out = document.getElementById('monthResult');

  let html = `
    <div class="finance-item"><strong>Prihodi:</strong> ${totalIncome.toFixed(2)} €</div>
    <div class="finance-item"><strong>Fiksni:</strong> ${totalFixed.toFixed(2)} €</div>
    <div class="finance-item"><strong>Krediti:</strong> ${totalCredits.toFixed(2)} €</div>
    <div class="finance-item"><strong>Ostalo:</strong> ${totalOther.toFixed(2)} €</div>
    <div class="finance-item" style="font-weight:800;">Rezultat: ${result.toFixed(2)} €</div><hr>
  `;

  if (incomes.length > 0) {
    html += `<div class="finance-item" style="text-align:center; font-weight:800;">Popis prihoda</div>`;
    incomes.forEach(i => {
      html += `<div class="finance-item">💵 ${i.desc} — ${Number(i.amount).toFixed(2)} €</div>`;
    });
  }

  if (fixed.length > 0) {
    html += `<div class="finance-item" style="text-align:center; font-weight:800;">Fiksni troškovi</div>`;
    fixed.forEach(f => {
      html += `<div class="finance-item">📅 ${f.desc} — ${Number(f.amount).toFixed(2)} €</div>`;
    });
  }

  if (activeCredits.length > 0) {
    html += `<div class="finance-item" style="text-align:center; font-weight:800;">Aktivni krediti</div>`;
    activeCredits.forEach(c => {
      html += `<div class="finance-item">🏦 ${c.desc} — ${Number(c.amount).toFixed(2)} €</div>`;
    });
  }

  if (otherCosts.length > 0) {
    html += `<div class="finance-item" style="text-align:center; font-weight:800;">Ostali troškovi</div>`;
    otherCosts.forEach(o => {
      html += `<div class="finance-item">🛒 ${o.desc} — ${Number(o.amount).toFixed(2)} €</div>`;
    });
  }

  out.innerHTML = html;
};