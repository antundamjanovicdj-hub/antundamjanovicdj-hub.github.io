// core/app.js — BOOTSTRAP (NO IMPORTS)

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;

      // spremi jezik
      localStorage.setItem("lang", lang);

      // lazy-load ostatak appa
      import("./main.js");
    });
  });
});
