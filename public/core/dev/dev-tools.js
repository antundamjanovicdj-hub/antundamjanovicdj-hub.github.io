import Temporal from '../temporal/index.js';
import { obligationDB } from '../services/db.js';

let lkDevVisible = false;

// toggle dev panel
(function initDevToggle() {

  const header = document.querySelector('.app-header');
  if (!header) return;

  let taps = 0;

  header.addEventListener('click', () => {

    taps++;

    if (taps >= 3) {
      lkDevVisible = !lkDevVisible;

      const panel = document.getElementById('lkDevPanel');
      if (panel) panel.style.display = lkDevVisible ? 'block' : 'none';

      if (lkDevVisible) renderDevPanel();

      taps = 0;
    }

    setTimeout(() => taps = 0, 900);

  });

})();

function renderDevPanel() {

  const panel = document.getElementById('lkDevContent');
  if (!panel) return;

  const state = Temporal.getState?.();

  if (!state) {
    panel.innerHTML = 'Temporal state unavailable';
    return;
  }

  panel.innerHTML = `
now: ${state.now}

pointer: ${state.pointer ?? '-'}
pointerPosition: ${state.pointerPosition ?? '-'}

past: ${state.past?.length ?? 0}
future: ${state.future?.length ?? 0}

timedObligations: ${state.timedObligations?.length ?? 0}

nextChangeAt:
${state.nextChangeAt ?? '-'}

progress:
${state.progressPercent ?? '-'}%
`;

}

function devLog(message) {

  const log = document.getElementById('lkDevLog');
  if (!log) return;

  const time = new Date().toLocaleTimeString();

  const line = document.createElement('div');
  line.textContent = time + ' ' + message;

  log.prepend(line);

  while (log.children.length > 12) {
    log.removeChild(log.lastChild);
  }

}

Temporal.subscribe((state) => {

  if (lkDevVisible) {

    renderDevPanel();

    devLog(
      "pointer=" + state.pointer +
      " past=" + state.past.length +
      " future=" + state.future.length
    );

  }

});

function shiftTime(hours) {

  const state = Temporal.getState?.();
  if (!state) return;

  const now = new Date(state.now);
  now.setHours(now.getHours() + hours);

  Temporal.overrideNow?.(now);

  renderDevPanel();

}

function jumpMidnight() {

  const state = Temporal.getState?.();
  if (!state) return;

  const now = new Date(state.now);
  now.setHours(24,0,0,0);

  Temporal.overrideNow?.(now);

  renderDevPanel();

}

document.addEventListener('click', async (e) => {

  if (e.target.id === 'lkDevPlus1h') shiftTime(1);
  if (e.target.id === 'lkDevPlus3h') shiftTime(3);
  if (e.target.id === 'lkDevMidnight') jumpMidnight();

  if (e.target.id === 'lkDevResetDB') {

    if (!confirm("Reset LifeKompas database?")) return;

    try {

      const all = await obligationDB.getAll();

      for (const ob of all) {
        await obligationDB.delete(ob.id);
      }

      Temporal.setObligations([]);

      window.__temporalRerenderQueued = false;

      window.forceObligationsListRefresh?.('dev-reset');

      devLog("DB RESET");

      alert("Database cleared");

    } catch (err) {

      console.error("DEV DB reset failed", err);

    }

  }

});