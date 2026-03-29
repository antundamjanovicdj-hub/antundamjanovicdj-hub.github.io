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

    // 🔧 FORCE HEADER TITLE
    const headerTitle = document.getElementById('headerTitle');
    if (headerTitle) {
      headerTitle.textContent = 'Dnevnik';
    }

    // 🔧 RESET GLOBAL/UI STATE ON ENTER
    window.__DIARY_SELECTION_MODE__ = false;
    window.__SELECTED_DIARY__.clear();
    window.__EDITING_DIARY_ID__ = null;
    selectedMood = null;

    const noteInput = document.getElementById('diaryNote');
    if (noteInput) {
      noteInput.value = '';
    }

    const editLabel = document.getElementById('diaryEditLabel');
    if (editLabel) {
      editLabel.style.display = 'none';
    }

    const bulkDeleteBtn = document.getElementById('btnDeleteSelectedDiary');
    if (bulkDeleteBtn) {
      bulkDeleteBtn.textContent = '🗑️ Obriši odabrano';
    }

    const moodContainer = document.getElementById('diaryMood');
    if (!moodContainer) return;

    const moods = moodContainer.querySelectorAll('span');

    moods.forEach(m => {
      m.style.opacity = '1';
    });

    // ⬇️ SAMO JEDAN RENDER
    renderDiaryList();

    // 💾 SAVE
    const saveBtn = document.getElementById('saveDiary');

    if (saveBtn && !saveBtn.dataset.bound) {
      saveBtn.dataset.bound = '1';

      saveBtn.addEventListener('click', async () => {
        const note = document.getElementById('diaryNote')?.value || '';

        if (!note && !selectedMood) {
          alert('Unesi tekst ili odaberi raspoloženje');
          return;
        }

        const editingId = window.__EDITING_DIARY_ID__ || null;

        const entry = {
          id: editingId || Date.now(),
          type: 'diary',
          date: getLocalISODate(),
          mood: selectedMood || null,
          note,
          createdAt: editingId ? undefined : Date.now()
        };

        try {
          if (editingId) {
            await obligationDB.delete(editingId);
          }

          await obligationDB.add(entry);

          console.log('[Diary] saved:', entry);
          renderDiaryList();

          // 🔄 RESET UI
          if (noteInput) {
            noteInput.value = '';
          }

          moods.forEach(m => {
            m.style.opacity = '1';
          });

          selectedMood = null;
          window.__EDITING_DIARY_ID__ = null;

          const label = document.getElementById('diaryEditLabel');
          if (label) {
            label.style.display = 'none';
          }

          // 🔔 FEEDBACK
          if (typeof showSaveToast === 'function') {
            showSaveToast();
          }

        } catch (e) {
          console.error('[Diary] save error', e);
        }
      });
    }

    // 😊 MOOD SELECT
    moods.forEach(el => {
      if (el.dataset.bound) return;
      el.dataset.bound = '1';

      el.addEventListener('click', () => {
        selectedMood = el.dataset.mood;

        moods.forEach(m => {
          m.style.opacity = '0.4';
        });

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
          window.__EDITING_DIARY_ID__ = null;

          if (noteInput) {
            noteInput.value = '';
          }

          moods.forEach(m => {
            m.style.opacity = '1';
          });

          selectedMood = null;

          const label = document.getElementById('diaryEditLabel');
          if (label) {
            label.style.display = 'none';
          }

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
          for (const id of ids) {
            await obligationDB.delete(id);
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

  // 🔙 BACK HANDLER
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
      return;
    }

    if (window.__EDITING_DIARY_ID__) {
      window.__EDITING_DIARY_ID__ = null;

      const noteInput = document.getElementById('diaryNote');
      if (noteInput) {
        noteInput.value = '';
      }

      const moods = document.querySelectorAll('#diaryMood span');
      moods.forEach(m => {
        m.style.opacity = '1';
      });

      selectedMood = null;

      const label = document.getElementById('diaryEditLabel');
      if (label) {
        label.style.display = 'none';
      }
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

  let emoji = '';

  if (e.mood === 'good') emoji = '🙂';
  if (e.mood === 'neutral') emoji = '😐';
  if (e.mood === 'bad') emoji = '🙁';

  if (!e.mood) emoji = '';

  const isSelected = window.__SELECTED_DIARY__?.has(e.id);

  return `
    <div class="diary-item"
         data-id="${e.id}"
         style="
           padding:12px;
           border:1px solid rgba(255,255,255,0.15);
           border-radius:12px;
           margin-bottom:10px;
           ${isSelected ? 'background:rgba(0,0,0,0.05);' : ''}
         ">

      <div style="display:flex; justify-content:space-between; align-items:center">

        <div>
      <div style="display:flex; gap:8px; align-items:center; font-size:14px; opacity:0.8;">
        ${emoji ? `<span style="font-size:20px">${emoji}</span>` : ''}
        <span style="color:white; opacity:0.8;">${formatDate(e.date)}</span>
      </div>

  ${e.note ? `<div style="margin-top:6px; color:white;">${e.note}</div>` : ''}
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

// 🧠 CLICK HANDLER (selection + edit)
const items = container.querySelectorAll('.diary-item');

items.forEach(el => {

  // 🛡️ bind guard
  if (el.dataset.bound) return;
  el.dataset.bound = '1';

  el.addEventListener('click', () => {

    const id = Number(el.dataset.id);

    // 🗑️ SELECTION MODE
    if (window.__DIARY_SELECTION_MODE__) {

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
      return;
    }

    // ✏️ EDIT MODE
    openDiaryEdit(id);

  });

});

}

function formatDate(dateStr) {
  if (!dateStr) return '';

  const [year, month, day] = dateStr.split('-');

  return `${day}.${month}.${year.slice(2)}`;
}

async function openDiaryEdit(id) {

  try {
    const all = await obligationDB.getAll();
    const entry = all.find(e => e.id === id);

    if (!entry) return;

    console.log('[Diary] edit:', entry);

    // 🧠 fill form
    const noteInput = document.getElementById('diaryNote');
    if (noteInput) {
      noteInput.value = entry.note || '';
    }

    // 🧠 mood
    const moods = document.querySelectorAll('#diaryMood span');

    moods.forEach(m => {
      m.style.opacity = '0.4';

      if (m.dataset.mood === entry.mood) {
        m.style.opacity = '1';
      }
    });

    // 🧠 store editing ID
    window.__EDITING_DIARY_ID__ = id;
    const label = document.getElementById('diaryEditLabel');
    if (label) label.style.display = 'block';

  } catch (e) {
    console.error('[Diary] edit load error', e);
  }
}