// core/main.js
// LifeKompas SINGLE ENTRY ENGINE

console.log('[LifeKompas] MAIN ENGINE START');

// ===== CRASH GUARD + SAFE BOOT =====
const BOOT_FAIL_KEY = 'lifekompas_boot_fail';
const bootFails = Number(localStorage.getItem(BOOT_FAIL_KEY) || 0);

if (bootFails >= 3) {

  document.body.style.background = '#0d5e32';

  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;
      font-family:sans-serif;
      text-align:center;
      padding:24px;
      color:white;
    ">
      <h2>LifeKompas Safe Mode</h2>
      <p>Aplikacija se rušila pri pokretanju.</p>

      <button onclick="
        localStorage.removeItem('${BOOT_FAIL_KEY}');
        location.reload();
      " style="
        padding:14px 22px;
        border:none;
        border-radius:14px;
        font-size:16px;
      ">
        Pokreni ponovo
      </button>
    </div>
  `;

  throw new Error("BOOT BLOCKED");
}

localStorage.setItem(BOOT_FAIL_KEY, bootFails + 1);

// ===== GLOBAL CRASH SHIELD =====
window.addEventListener('error', (event) => {
  console.error('GLOBAL ERROR:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('UNHANDLED PROMISE:', event.reason);
});

// ===== IMPORT ENGINE MODULES =====
import './app-init.js';
import './contacts.js';
import './app-init-main.js';

// ===== INLINE EXTRACTION (Phase 2) =====
import './boot-inline.js';

// ===== BOOT COMPLETE =====
console.log('[LifeKompas] ENGINE LOADED');