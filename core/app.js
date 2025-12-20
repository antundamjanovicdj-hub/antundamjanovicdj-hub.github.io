/ core/app.js — STEP 3

alert("APP START");

import { AppState } from "./state.js";
import { getPlatformFlags } from "./platform.js";
import { showScreen } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  alert("DOM READY");

  const platform = getPlatformFlags();
  alert("PLATFORM OK");

  showScreen("screen-lang");
  alert("UI OK");

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("CLICK " + btn.dataset.lang);
    });
  });
});
