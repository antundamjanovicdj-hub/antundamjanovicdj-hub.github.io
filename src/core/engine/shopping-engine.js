import {
  addShoppingItem,
  getShoppingItems,
  updateShoppingItem,
  deleteShoppingItem
} from '../services/db.js';
import { getLang } from '../utils/utils.js';
// 🖐️ device detection (SAFE LOCAL)
const IS_TOUCH_DEVICE =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0;
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
export async function renderShoppingList() {

  shoppingItems = await getShoppingItems();

  const list = document.getElementById('shoppingList');
  const empty = document.getElementById('shoppingEmpty');

  // 🧹 bulk delete (create button if not exists)
let bulkDeleteBtn = document.getElementById('btnDeleteSelected');

if (!bulkDeleteBtn) {
  bulkDeleteBtn = document.createElement('button');
  bulkDeleteBtn.id = 'btnDeleteSelected';
  bulkDeleteBtn.textContent = 'Obriši označeno';
  bulkDeleteBtn.style.margin = '16px 8px 8px 8px';
  bulkDeleteBtn.style.padding = '10px 14px';
  bulkDeleteBtn.style.borderRadius = '20px';
  bulkDeleteBtn.style.border = 'none';
  bulkDeleteBtn.style.background = 'rgba(255,255,255,0.15)';
  bulkDeleteBtn.style.backdropFilter = 'blur(10px)';
  bulkDeleteBtn.style.color = '#fff';
  bulkDeleteBtn.style.fontWeight = '600';

  list.parentNode.insertBefore(bulkDeleteBtn, list);

  bulkDeleteBtn.addEventListener('click', async () => {

    const selected = shoppingItems.filter(i => i.selected);

    for (const item of selected) {
      await deleteShoppingItem(item.id);
    }

    renderShoppingList();
  });
}

// 🧨 delete all button (create once)
let deleteAllBtn = document.getElementById('btnDeleteAll');

if (!deleteAllBtn) {

  deleteAllBtn = document.createElement('button');
  deleteAllBtn.id = 'btnDeleteAll';
  deleteAllBtn.textContent = 'Obriši sve';

  deleteAllBtn.style.margin = '16px 8px 8px 8px';
  deleteAllBtn.style.padding = '10px 14px';
  deleteAllBtn.style.borderRadius = '20px';
  deleteAllBtn.style.border = 'none';
  deleteAllBtn.style.background = 'rgba(255,255,255,0.15)';
  deleteAllBtn.style.backdropFilter = 'blur(10px)';
  deleteAllBtn.style.color = '#fff';
  deleteAllBtn.style.fontWeight = '600';

  // ubaci iznad liste (iznad ovog drugog gumba)
  deleteAllBtn.style.marginLeft = '8px';
list.parentNode.insertBefore(deleteAllBtn, list);

  deleteAllBtn.addEventListener('click', async () => {

    if (shoppingItems.length === 0) return;

    // optional confirm (možeš kasnije maknuti ako želiš)
    const confirmDelete = confirm('Obrisati sve stavke?');
    if (!confirmDelete) return;

    for (const item of shoppingItems) {
      await deleteShoppingItem(item.id);
    }

    renderShoppingList();
  });
}

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
  <div class="shopping-item-content">
    <input type="checkbox" class="shopping-select" />
    <span>${item.title}</span>
  </div>
`;
    const swipeContent = li.querySelector('.shopping-item-content');

    const checkbox = li.querySelector('.shopping-select');

if (checkbox) {

  // 🛑 PREKINI event da ne ide na li
  checkbox.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  checkbox.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  });

  // ✅ toggle selected (UI only)
  checkbox.addEventListener('change', () => {
    item.selected = checkbox.checked;
  });

}

const content = li.querySelector('.shopping-item-content');

if (content) {
  content.addEventListener('click', async () => {
    item.checked = !item.checked;
    await updateShoppingItem(item);
    renderShoppingList();
  });
}

    if (item.checked) li.classList.add('checked');

// ===== MOBILE ONLY: swipe to delete (FINAL) =====
if (IS_TOUCH_DEVICE) {
  let startX = 0;
let currentX = 0;
let startTime = 0;
let swiping = false;
  const DELETE_THRESHOLD = 120; // px

  li.addEventListener('touchstart', e => {

  // 🛑 ignore checkbox
  if (e.target.closest('.shopping-select')) return;

  startX = e.touches[0].clientX;
  currentX = startX;
  startTime = Date.now();

  swiping = false; // 🔥 reset na početku

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

  // 🛑 ignore swipe on checkbox
  if (e.target.closest('.shopping-select')) return;

  currentX = e.touches[0].clientX;
const diff = currentX - startX;

// 🔥 aktiviraj swipe čim ima mali pomak
if (Math.abs(diff) > 10) {
  swiping = true;
}

if (!swiping) return;

li.classList.add('swiping');
  const elapsed = Date.now() - startTime;
  const velocity = Math.abs(diff) / elapsed;

  // 🔥 flick delete
  if (diff < -DELETE_THRESHOLD || velocity > 0.6) {

    const MAX_SWIPE = 84;

    let limited = diff;

    if (diff < -MAX_SWIPE) {
      const extra = diff + MAX_SWIPE;
      limited = -MAX_SWIPE + (extra * 0.35); 
    }

    swipeContent.style.transform = `translateX(${limited}px)`;
  }

}, { passive: true });

  li.addEventListener('touchend', (e) => {

  // 🛑 ignore swipe on checkbox
  if (e.target.closest('.shopping-select')) return;

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

list.appendChild(li);
});
}