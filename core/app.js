// core/app.js — STEP 1

alert("APP START");

import { AppState } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  alert("DOM READY");

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("CLICK " + btn.dataset.lang);
    });
  });
});
