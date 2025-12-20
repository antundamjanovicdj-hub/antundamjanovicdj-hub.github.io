// core/app.js — BULLETPROOF BASE

document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");

  function show(id) {
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

  // ⬅️ HARD RESET: uvijek kreni s jezikom
  show("screen-lang");

  // LANGUAGE BUTTONS
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      console.log("LANG CLICK:", btn.dataset.lang);
      show("screen-menu");
    });
  });

  // BACK
  const backMenu = document.getElementById("backMenu");
  if (backMenu) {
    backMenu.onclick = () => show("screen-lang");
  }
});
