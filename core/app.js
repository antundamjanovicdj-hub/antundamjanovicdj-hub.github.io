// core/app.js — HARD TEST

alert("APP.JS START");

document.addEventListener("DOMContentLoaded", () => {
  alert("DOM READY");

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("CLICK: " + btn.dataset.lang);
    });
  });
});
