// core/ui.js
// 100% safe – nema top-level DOM pristupa

export function showScreen(id) {
  if (!id) return;

  const screens = document.querySelectorAll(".screen");
  if (!screens || !screens.length) return;

  screens.forEach(s => {
    if (s && s.classList) {
      s.classList.remove("active");
    }
  });

  const el = document.getElementById(id);
  if (el && el.classList) {
    el.classList.add("active");
  }
}
