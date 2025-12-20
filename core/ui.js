// core/ui.js
// Minimalna i sigurna UI kontrola screenova

export function showScreen(id) {
  if (!id) return;

  const screens = document.querySelectorAll(".screen");
  if (!screens || !screens.length) return;

  screens.forEach(screen => {
    if (screen.classList) {
      screen.classList.remove("active");
    }
  });

  const target = document.getElementById(id);
  if (target && target.classList) {
    target.classList.add("active");
  }
}
