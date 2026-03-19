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