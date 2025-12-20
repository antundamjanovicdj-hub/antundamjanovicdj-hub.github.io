// core/app.js — STEP 2

alert("APP START");

import { AppState } from "./state.js";
import { getPlatformFlags } from "./platform.js";

document.addEventListener("DOMContentLoaded", () => {
  alert("DOM READY");

  const platform = getPlatformFlags();
  alert("PLATFORM OK");

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("CLICK " + btn.dataset.lang);
    });
  });
});
