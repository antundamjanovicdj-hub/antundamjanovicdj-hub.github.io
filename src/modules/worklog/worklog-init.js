// modules/worklog/worklog-init.js

export function initWorklogModule() {
  console.log('[Worklog] module init');

  // 🔄 BIND NA SCREEN SHOW
  document.addEventListener('screenShown', (e) => {
    if (e.detail !== 'screen-worklog') return;

    console.log('[Worklog] screen shown');

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

    // 🛡️ VALIDACIJA
    if (!date || !start || !end || !location) {
      alert('Popuni sva polja');
      return;
    }

    if (start >= end) {
      alert('Vrijeme nije ispravno');
      return;
    }

    // ⏱ duration (u minutama)
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    const duration = (eh * 60 + em) - (sh * 60 + sm);

    const entry = {
      id: Date.now(),
      date,
      startTime: start,
      endTime: end,
      location,
      duration,
      createdAt: new Date().toISOString()
    };

    // 💾 SAVE (localStorage MVP)
    const existing = JSON.parse(localStorage.getItem('worklog') || '[]');
    existing.push(entry);
    localStorage.setItem('worklog', JSON.stringify(existing));

    console.log('[Worklog] saved', entry);

    alert('Spremljeno');

    // 🔄 REFRESH LISTE
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

    return `
      <div class="diary-item worklog-item" data-id="${item.id}" style="margin-bottom:12px; cursor:pointer;">

        <div style="color:white;">
          📅 ${formatDate(item.date)}
        </div>

        <div style="color:white;">
          🕓 ${item.startTime} - ${item.endTime}
        </div>

        <div style="color:white;">
          📍 ${item.location}
        </div>

        <div style="color:#00ff9c; margin-top:4px;">
          ⏱ ${hours}h ${minutes}min
        </div>

      </div>
    `;

  }).join('');

  // 🗑 SIMPLE DELETE
  container.querySelectorAll('.worklog-item').forEach(el => {
  el.addEventListener('click', () => {

    const id = el.dataset.id;

    const ok = confirm('Obrisati zapis?');
    if (!ok) return;

    let data = JSON.parse(localStorage.getItem('worklog') || '[]');

    data = data.filter(item => String(item.id) !== String(id));

    localStorage.setItem('worklog', JSON.stringify(data));

    renderWorklogList();
  });
});
}

// 📅 FORMAT DATUMA
function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}