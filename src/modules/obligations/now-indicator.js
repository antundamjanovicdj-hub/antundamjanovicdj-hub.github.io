// ===== NOW INDICATOR MODULE =====
export function updateNowIndicatorVisibility() {
  const indicator = document.getElementById('nowIndicator');
  if (!indicator) return;

  const activeScreen = document.querySelector('.screen.active')?.id;
  if (activeScreen !== 'screen-obligations-list') {
    indicator.classList.add('hidden');
    return;
  }

  const pointer = document.querySelector('.temporal-pointer');

  if (!pointer) {
    indicator.classList.add('hidden');
    return;
  }

  const rect = pointer.getBoundingClientRect();

  // real viewport safe zone (header + bottom padding)
  const TOP_OFFSET = 100;
  const BOTTOM_OFFSET = 100;

  const pointerVisible =
    rect.bottom > TOP_OFFSET &&
    rect.top < (window.innerHeight - BOTTOM_OFFSET);

  if (pointerVisible) {
    indicator.classList.add('hidden');
  } else {
    indicator.classList.remove('hidden');
  }
}

export function initNowIndicatorRuntime() {
  if (window.__NOW_INDICATOR_READY__) return;
  window.__NOW_INDICATOR_READY__ = true;

  const indicator = document.getElementById('nowIndicator');
  if (!indicator) return;

  // klik → scroll na pointer
  indicator.addEventListener('click', () => {
    const pointer = document.querySelector('.temporal-pointer');
    if (!pointer) return;

    pointer.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  });

  // scroll → reevaluate visibility
  function bindNowIndicatorScroll() {
    const scrollContainer = document.getElementById('screen-obligations-list');

    if (!scrollContainer) {
      requestAnimationFrame(bindNowIndicatorScroll);
      return;
    }

    scrollContainer.addEventListener('scroll', () => {
      window.updateNowIndicatorVisibility?.();
    }, { passive: true });
  }

  bindNowIndicatorScroll();

  // resize → reevaluate
  window.addEventListener('resize', () => {
    window.updateNowIndicatorVisibility?.();
  });

  // inicijalni poziv (nakon layout-a)
  requestAnimationFrame(() => {
    window.updateNowIndicatorVisibility?.();
  });
}

window.updateNowIndicatorVisibility = updateNowIndicatorVisibility;