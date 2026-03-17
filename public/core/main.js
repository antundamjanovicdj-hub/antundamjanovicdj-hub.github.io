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
        margin-top:20px;
        cursor:pointer;
      ">
        Pokreni ponovo
      </button>
    </div>
  `;

  throw new Error("BOOT BLOCKED - Safe Mode Active");
}

// Increment boot fail counter
localStorage.setItem(BOOT_FAIL_KEY, String(bootFails + 1));

// ===== GLOBAL CRASH SHIELD =====
window.addEventListener('error', (event) => {
  console.error('GLOBAL ERROR:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('UNHANDLED PROMISE:', event.reason);
});

// ===== ENGINE LIFECYCLE =====

const waitForDomReady = () =>
  new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    } else {
      resolve();
    }
  });

// double-rAF = "next paint" (fixes blank-until-click)
const waitForNextPaint = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

async function boot() {
  console.log('[LifeKompas] Boot pipeline start');

  try {
    // ✅ ensure DOM exists before init touches screens
    await waitForDomReady();

    // CORE
    await import('/core/engine/app-init.js');

    // FEATURE MODULES
    await import('/core/contacts.js');

    // INLINE MIGRATION (mora prije init)
    await import('/core/boot-inline.js');

    // APP INIT (controlled start)
    const { initApp } = await import('/core/app-init-main.js');

    setTimeout(() => {
      initApp();
    }, 0);

    // ✅ force first real paint (prevents "blank until tap")
    await waitForNextPaint();

    // ===== MINI FREEZE: Preload shopping (cold first-hit fix) =====
    setTimeout(async () => {
      try {
        if (typeof getShoppingItems === 'function') {
          await getShoppingItems();
          console.log('[PRELOAD] Shopping ready');
        }
      } catch (e) {
        console.warn('[PRELOAD] Shopping preload failed', e);
      }
    }, 0);

    // DEVICE LAYER
    const { checkBatteryOptimization } = await import('/core/services/battery.js');

    // run after slight delay so UI is visible
    setTimeout(() => {
      checkBatteryOptimization();
    }, 1200);

    // 🔧 FIX: Reset boot fail counter on successful boot
    localStorage.removeItem(BOOT_FAIL_KEY);
    
    console.log('[LifeKompas] Boot pipeline complete ✅');

  } catch (error) {
    console.error('[LifeKompas] Boot failed:', error);
    
    // Don't reset boot fail counter on error
    // This allows safe mode to kick in after 3 failures
  }
}

window.addEventListener('DOMContentLoaded', boot);