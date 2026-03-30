// modules/worklog/worklog-init.js

// 🧠 SELECTION STATE
if (!window.__WORKLOG_SELECTION_MODE__) {
  window.__WORKLOG_SELECTION_MODE__ = false;
}

if (!window.__SELECTED_WORKLOG__) {
  window.__SELECTED_WORKLOG__ = new Set();
}

// 🧠 EDIT STATE
if (!window.__EDITING_WORKLOG_ID__) {
  window.__EDITING_WORKLOG_ID__ = null;
}

export function initWorklogModule() {
  console.log('[Worklog] module init');

  // 🔄 BIND NA SCREEN SHOW
  document.addEventListener('screenShown', (e) => {
    if (e.detail !== 'screen-worklog') return;

    console.log('[Worklog] screen shown');

    // 🔄 HIDE CANCEL BUTTON ON ENTER
   const cancelBtnEl = document.getElementById('cancelEditWorklog');
   if (cancelBtnEl) {
   cancelBtnEl.style.display = 'none';
  }

    // 🔧 RESET SELECTION STATE ON ENTER
   window.__WORKLOG_SELECTION_MODE__ = false;
   window.__SELECTED_WORKLOG__.clear();

    // 🔄 render on open
    renderWorklogList();

   // 💾 SAVE
   const saveBtn = document.getElementById('saveWorklog');

   if (saveBtn && !saveBtn.dataset.bound) {
  saveBtn.dataset.bound = '1';

  saveBtn.addEventListener('click', () => {

    const date = document.getElementById('worklogDate').value;
    const start = document.getElementById('worklogStart').value;
    const end = document.getElementById('worklogEnd').value;
    const location = document.getElementById('worklogLocation').value.trim();
    const breakMinutes = Number(document.getElementById('worklogBreak')?.value || 0);

    // 🛡️ VALIDACIJA
    if (!date || !start || !end) {
      alert('Popuni datum i vrijeme');
      return;
    }

    if (start >= end) {
      alert('Vrijeme nije ispravno');
      return;
    }

    // ⏱ duration (u minutama)
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    const rawDuration = (eh * 60 + em) - (sh * 60 + sm);

    // 🛡️ VALIDACIJA BREAK
    if (breakMinutes < 0) {
    alert('Pauza ne može biti negativna');
    return;
  }

    if (breakMinutes > rawDuration) {
    alert('Pauza ne može biti veća od radnog vremena');
    return;
  }

   const duration = rawDuration - breakMinutes;

    const editingId = window.__EDITING_WORKLOG_ID__ || null;

const entry = {
  id: editingId || Date.now(),
  date,
  startTime: start,
  endTime: end,
  location,
  breakMinutes,
  duration,
  createdAt: new Date().toISOString()
};

// 💾 SAVE (localStorage MVP)
let existing = JSON.parse(localStorage.getItem('worklog') || '[]');

// ✏️ EDIT MODE → makni stari
if (editingId) {
  existing = existing.filter(item => Number(item.id) !== Number(editingId));
}

existing.push(entry);
localStorage.setItem('worklog', JSON.stringify(existing));

// 🔄 RESET EDIT STATE
window.__EDITING_WORKLOG_ID__ = null;

    console.log('[Worklog] saved', entry);

    alert('Spremljeno');

// 🔄 REFRESH LISTE
renderWorklogList();

// 🔄 HIDE EDIT LABEL
const editLabel = document.getElementById('worklogEditLabel');
if (editLabel) {
  editLabel.style.display = 'none';
}

// ❌ HIDE CANCEL BUTTON
const cancelBtn = document.getElementById('cancelEditWorklog');
if (cancelBtn) {
  cancelBtn.style.display = 'none';
}

// 🔄 RESET FORME
const dateInput = document.getElementById('worklogDate');
const startInput = document.getElementById('worklogStart');
const endInput = document.getElementById('worklogEnd');
const locationInput = document.getElementById('worklogLocation');
const breakInput = document.getElementById('worklogBreak');

if (startInput) startInput.value = '';
if (endInput) endInput.value = '';
if (locationInput) locationInput.value = '';
if (breakInput) breakInput.value = '';

// 🔧 vrati datum na danas
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
 });
}

// ❌ CANCEL EDIT BUTTON
const cancelBtn = document.getElementById('cancelEditWorklog');

if (cancelBtn && !cancelBtn.dataset.bound) {
  cancelBtn.dataset.bound = '1';

  cancelBtn.addEventListener('click', () => {

    // 🧠 RESET EDIT STATE
    window.__EDITING_WORKLOG_ID__ = null;

    // 🔄 CLEAR FORM
    const startInput = document.getElementById('worklogStart');
    const endInput = document.getElementById('worklogEnd');
    const locationInput = document.getElementById('worklogLocation');
    const breakInput = document.getElementById('worklogBreak');

    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
    if (locationInput) locationInput.value = '';
    if (breakInput) breakInput.value = '';

    // 🔧 RESET DATE
    const dateInput = document.getElementById('worklogDate');
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // 🔄 HIDE LABEL
    const label = document.getElementById('worklogEditLabel');
    if (label) {
      label.style.display = 'none';
    }

    // 🔄 HIDE BUTTON
    cancelBtn.style.display = 'none';

    console.log('[Worklog] edit cancelled');
  });
}

// 🔙 BACK HANDLER (reset edit)
document.addEventListener('click', (e) => {
  const isBack = e.target.closest('#headerBack');
  if (!isBack) return;

  if (window.__EDITING_WORKLOG_ID__) {

    // 🧠 RESET EDIT STATE
    window.__EDITING_WORKLOG_ID__ = null;

    // 🔄 CLEAR FORM
    const startInput = document.getElementById('worklogStart');
    const endInput = document.getElementById('worklogEnd');
    const locationInput = document.getElementById('worklogLocation');
    const breakInput = document.getElementById('worklogBreak');

    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
    if (locationInput) locationInput.value = '';
    if (breakInput) breakInput.value = '';

    // 🔧 RESET DATE
    const dateInput = document.getElementById('worklogDate');
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // 🔄 HIDE LABEL
    const label = document.getElementById('worklogEditLabel');
    if (label) {
      label.style.display = 'none';
    }

    console.log('[Worklog] edit reset on back');
  }
});

   // 🗑️ BULK DELETE BUTTON
const bulkBtn = document.getElementById('btnDeleteSelectedWorklog');

if (bulkBtn && !bulkBtn.dataset.bound) {
  bulkBtn.dataset.bound = '1';

  bulkBtn.addEventListener('click', () => {

    // ➡️ ENTER SELECTION MODE
    if (!window.__WORKLOG_SELECTION_MODE__) {

      window.__WORKLOG_SELECTION_MODE__ = true;
      window.__SELECTED_WORKLOG__.clear();

      bulkBtn.textContent = 'Potvrdi brisanje (0)';

      renderWorklogList();
      return;
    }

    // ➡️ DELETE
const ids = Array.from(window.__SELECTED_WORKLOG__);

if (!ids.length) {
  window.__WORKLOG_SELECTION_MODE__ = false;
  bulkBtn.textContent = '🗑️ Obriši odabrano';
  renderWorklogList();
  return;
}

const ok = confirm(`Obrisati ${ids.length} zapisa?`);
if (!ok) return;

// 💾 DELETE FROM localStorage
let data = JSON.parse(localStorage.getItem('worklog') || '[]');

data = data.filter(item => !ids.includes(Number(item.id)));

localStorage.setItem('worklog', JSON.stringify(data));

// 🔄 RESET STATE
window.__WORKLOG_SELECTION_MODE__ = false;
window.__SELECTED_WORKLOG__.clear();
bulkBtn.textContent = '🗑️ Obriši odabrano';

// 🔄 REFRESH
renderWorklogList();

  });
}

    // 🔧 DEFAULT DATE (danas)
    const dateInput = document.getElementById('worklogDate');
    if (dateInput && !dateInput.value) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  });
}

// 📋 RENDER LISTA
function renderWorklogList() {

  const container = document.getElementById('worklogList');
  if (!container) return;

  const data = JSON.parse(localStorage.getItem('worklog') || '[]');

  // najnoviji gore
  data.sort((a, b) => {

  // prvo po datumu (noviji gore)
  if (a.date !== b.date) {
    return b.date.localeCompare(a.date);
  }

  // ako isti datum → po početku (raniji gore)
  return a.startTime.localeCompare(b.startTime);
});

  if (data.length === 0) {
    container.innerHTML = `
      <div style="color:white; opacity:0.7;">
        Nema zapisa
      </div>
    `;
    return;
  }

  container.innerHTML = data.map(item => {

    const hours = Math.floor(item.duration / 60);
const minutes = item.duration % 60;

const breakText = (typeof item.breakMinutes === 'number' && item.breakMinutes > 0)
  ? ` (-${item.breakMinutes} min)`
  : '';

    return `
  <div class="diary-item worklog-item"
       data-id="${item.id}"
       style="
         margin-bottom:12px;
         cursor:pointer;
         padding:12px;
         border-radius:12px;
         border:1px solid rgba(255,255,255,0.15);
         ${window.__SELECTED_WORKLOG__.has(item.id) ? 'background:rgba(0,0,0,0.1);' : ''}
       ">

    <div style="display:flex; justify-content:space-between; align-items:center">

      <div>

        <div style="color:white;">
          📅 ${formatDate(item.date)}
        </div>

        <div style="color:white;">
         🕓 ${item.startTime} - ${item.endTime}${breakText}
        </div>

        ${item.location ? `
        <div style="color:white;">
          📍 ${item.location}
        </div>
        ` : ''}

        <div style="color:#00ff9c; margin-top:4px;">
          ⏱ ${hours}h ${minutes}min
        </div>

      </div>

      ${window.__WORKLOG_SELECTION_MODE__ ? `
        <div style="
          width:22px;
          height:22px;
          border-radius:6px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:14px;
          font-weight:bold;
          background:${window.__SELECTED_WORKLOG__.has(item.id) ? '#4CAF50' : 'transparent'};
          border:2px solid ${window.__SELECTED_WORKLOG__.has(item.id) ? '#4CAF50' : 'rgba(255,255,255,0.4)'};
          color:white;
        ">
          ${window.__SELECTED_WORKLOG__.has(item.id) ? '✓' : ''}
        </div>
      ` : ''}

    </div>
  </div>
`;
  }).join('');

  const items = container.querySelectorAll('.worklog-item');

items.forEach(el => {

  if (el.dataset.bound) return;
  el.dataset.bound = '1';

  el.addEventListener('click', () => {

    const id = Number(el.dataset.id);

    // 🗑️ SELECTION MODE
    if (window.__WORKLOG_SELECTION_MODE__) {

  if (window.__SELECTED_WORKLOG__.has(id)) {
    window.__SELECTED_WORKLOG__.delete(id);
  } else {
    window.__SELECTED_WORKLOG__.add(id);
  }

  const bulkBtn = document.getElementById('btnDeleteSelectedWorklog');
  if (bulkBtn) {
    bulkBtn.textContent = `Potvrdi brisanje (${window.__SELECTED_WORKLOG__.size})`;
  }

  renderWorklogList();
  return;
}

// ✏️ EDIT MODE
openWorklogEdit(id);

  });

});
}

// 📅 FORMAT DATUMA
function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}

function openWorklogEdit(id) {

  try {

    const data = JSON.parse(localStorage.getItem('worklog') || '[]');
    const entry = data.find(e => Number(e.id) === Number(id));

    if (!entry) return;

    console.log('[Worklog] edit:', entry);

    // 🧠 FILL FORM
    const dateInput = document.getElementById('worklogDate');
    const startInput = document.getElementById('worklogStart');
    const endInput = document.getElementById('worklogEnd');
    const locationInput = document.getElementById('worklogLocation');
    const breakInput = document.getElementById('worklogBreak');

    if (dateInput) dateInput.value = entry.date || '';
    if (startInput) startInput.value = entry.startTime || '';
    if (endInput) endInput.value = entry.endTime || '';
    if (locationInput) locationInput.value = entry.location || '';
    if (breakInput) {
  breakInput.value = typeof entry.breakMinutes === 'number'
    ? entry.breakMinutes
    : 0;
}

    // 🧠 STORE EDITING ID
    window.__EDITING_WORKLOG_ID__ = entry.id;

    // ❌ SHOW CANCEL BUTTON
    const cancelBtn = document.getElementById('cancelEditWorklog');
    if (cancelBtn) {
    cancelBtn.style.display = 'block';
  }

    // ✏️ SHOW EDIT LABEL
   const label = document.getElementById('worklogEditLabel');
   if (label) {
   label.style.display = 'block';
  }

    // 🔥 SCROLL TO ITEM
    requestAnimationFrame(() => {
      const el = document.querySelector(`.worklog-item[data-id="${id}"]`);
      if (!el) return;

      const list = document.getElementById('worklogList');
    if (list && el) {
    list.scrollTo({
    top: el.offsetTop - list.offsetTop - 20,
    behavior: 'smooth'
  });
}
    });

  } catch (e) {
    console.error('[Worklog] edit error', e);
  }
}