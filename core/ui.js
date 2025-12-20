// core/ui.js
export function showScreen(id) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(s => {
    s.classList.remove("active");
    s.style.pointerEvents = "none";
    s.style.opacity = "0";
  });

  const el = document.getElementById(id);
  if (el) {
    el.classList.add("active");
    el.style.pointerEvents = "auto";
    el.style.opacity = "1";
  }
}
