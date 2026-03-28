// modules/diary/diary-init.js

// 🧠 SELECTION STATE
if (!window.__DIARY_SELECTION_MODE__) {
  window.__DIARY_SELECTION_MODE__ = false;
}

if (!window.__SELECTED_DIARY__) {
  window.__SELECTED_DIARY__ = new Set();
}

export function initDiaryModule() {
  console.log('[Diary] module init');

  // 🧠 LOCAL STATE
  let selectedMood = null;

  // 🔄 BIND NA SCREEN SHOW
  document.addEventListener('screenShown', (e) => {
    if (e.detail !== 'screen-diary') return;

// 🔄 RESET selection mode on enter
window.__DIARY_SELECTION_MODE__ = false;
window.__SELECTED_DIARY__.clear();

const bulkDeleteBtn = document.getElementById('btnDeleteSelectedDiary');
if (bulkDeleteBtn) {
  bulkDeleteBtn.textContent = '🗑️ Obriši odabrano';
}

// ⬇️ SAMO JEDAN RENDER
renderDiaryList();

    const moodContainer = document.getElementById('diaryMood');
    if (!moodContainer) return;

    const moods = moodContainer.querySelectorAll('span');

    // 🔄 RESET MOOD UI
selectedMood = null;

moods.forEach(m => {
  m.style.opacity = '1';
});

    // 💾 SAVE
const saveBtn = document.getElementById('saveDiary');

if (saveBtn && !saveBtn.dataset.bound) {

  saveBtn.dataset.bound = '1';

  saveBtn.addEventListener('click', async () => {

    if (!selectedMood) {
      alert('Odaberi kako si se osjećao');
      return;
    }

    const note = document.getElementById('diaryNote')?.value || '';

    const entry = {
      id: Date.now(),
      type: 'diary',
      date: getLocalISODate(),
      mood: selectedMood,
      note,
      createdAt: Date.now()
    };

    try {

      // 🧠 koristimo postojeći DB pattern
      await obligationDB.add(entry);

      console.log('[Diary] saved:', entry);
      renderDiaryList();

      // 🔄 reset UI
      document.getElementById('diaryNote').value = '';

      moods.forEach(m => m.style.opacity = '1');
      selectedMood = null;

      // 🔔 feedback
      if (typeof showSaveToast === 'function') {
        showSaveToast();
      }

    } catch (e) {
      console.error('[Diary] save error', e);
    }

  });

}

    moods.forEach(el => {

      // 🛡️ bind guard
      if (el.dataset.bound) return;
      el.dataset.bound = '1';

      el.addEventListener('click', () => {

        selectedMood = el.dataset.mood;

        // reset svi
        moods.forEach(m => m.style.opacity = '0.4');

        // aktivni
        el.style.opacity = '1';

        console.log('[Diary] mood selected:', selectedMood);
      });

    });
    // 🗑️ BULK DELETE BUTTON
const bulkBtn = document.getElementById('btnDeleteSelectedDiary');

if (bulkBtn && !bulkBtn.dataset.bound) {

  bulkBtn.dataset.bound = '1';

  bulkBtn.addEventListener('click', async () => {

    // ➡️ ENTER SELECTION MODE
    if (!window.__DIARY_SELECTION_MODE__) {

      window.__DIARY_SELECTION_MODE__ = true;
      window.__SELECTED_DIARY__.clear();

      bulkBtn.textContent = 'Potvrdi brisanje (0)';

      renderDiaryList();
      return;
    }

    // ➡️ DELETE
    const ids = Array.from(window.__SELECTED_DIARY__);

    if (!ids.length) {
      window.__DIARY_SELECTION_MODE__ = false;
      bulkBtn.textContent = '🗑️ Obriši odabrano';
      renderDiaryList();
      return;
    }

    const ok = confirm(`Obrisati ${ids.length} zapisa?`);
    if (!ok) return;

    try {

      const all = await obligationDB.getAll();
      const updated = all.filter(i => !ids.includes(i.id));

      for (const item of all) {
        await obligationDB.delete(item.id);
      }

      for (const item of updated) {
        await obligationDB.add(item);
      }

      window.__DIARY_SELECTION_MODE__ = false;
      window.__SELECTED_DIARY__.clear();

      bulkBtn.textContent = '🗑️ Obriši odabrano';

      renderDiaryList();

    } catch (e) {
      console.error('[Diary] bulk delete error', e);
    }

  });

}

  });

  // 🔙 BACK HANDLER (EXIT SELECTION MODE)
document.addEventListener('click', (e) => {

  const isBack = e.target.closest('#headerBack');
  if (!isBack) return;

  if (window.__DIARY_SELECTION_MODE__) {

    window.__DIARY_SELECTION_MODE__ = false;
    window.__SELECTED_DIARY__.clear();

    const bulkBtn = document.getElementById('btnDeleteSelectedDiary');
    if (bulkBtn) {
      bulkBtn.textContent = '🗑️ Obriši odabrano';
    }

    renderDiaryList();

    e.stopPropagation();
    e.stopImmediatePropagation();
  }

});

}

function getLocalISODate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2,'0');
  const dd = String(now.getDate()).padStart(2,'0');

  return `${yyyy}-${mm}-${dd}`;
}

async function renderDiaryList() {

  const container = document.getElementById('diaryList');
  if (!container) return;

  let all = [];

  try {
    all = await obligationDB.getAll();
  } catch (e) {
    console.error('[Diary] load error', e);
    return;
  }

  // filtriraj samo diary
  const entries = all
    .filter(i => i.type === 'diary')
    .sort((a, b) => b.createdAt - a.createdAt);

  if (!entries.length) {
    container.innerHTML = `<div style="opacity:0.6">Nema zapisa još</div>`;
    return;
  }

  container.innerHTML = entries.map(e => {

  const emoji =
    e.mood === 'good' ? '🙂' :
    e.mood === 'neutral' ? '😐' :
    '🙁';

  const isSelected = window.__SELECTED_DIARY__?.has(e.id);

  return `
    <div class="diary-item"
         data-id="${e.id}"
         style="
           padding:12px;
           border-bottom:1px solid rgba(0,0,0,0.1);
           ${isSelected ? 'background:rgba(0,0,0,0.05);' : ''}
         ">

      <div style="display:flex; justify-content:space-between; align-items:center">

        <div>
          <div style="font-size:20px">${emoji}</div>
          ${e.note ? `<div>${e.note}</div>` : ''}
          <div style="font-size:12px; opacity:0.6">${e.date}</div>
        </div>

        ${window.__DIARY_SELECTION_MODE__ ? `
          <div style="font-size:20px">
            ${isSelected ? '✔️' : '⬜'}
          </div>
        ` : ''}

      </div>
    </div>
  `;

}).join('');
  // 🧠 SELECTION CLICK
if (window.__DIARY_SELECTION_MODE__) {

  const items = container.querySelectorAll('.diary-item');

  items.forEach(el => {

  // 🛡️ bind guard
  if (el.dataset.bound) return;
  el.dataset.bound = '1';

  el.addEventListener('click', () => {

    const id = Number(el.dataset.id);

    if (window.__SELECTED_DIARY__.has(id)) {
      window.__SELECTED_DIARY__.delete(id);
    } else {
      window.__SELECTED_DIARY__.add(id);
    }

    const bulkBtn = document.getElementById('btnDeleteSelectedDiary');
    if (bulkBtn) {
      bulkBtn.textContent = `Potvrdi brisanje (${window.__SELECTED_DIARY__.size})`;
    }

    renderDiaryList();

  });

});

}
}