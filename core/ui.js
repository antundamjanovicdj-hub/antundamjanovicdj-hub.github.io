// core/ui.js
function formatDate(dateString) {
  if (!dateString) return "";
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(el => {
    el.classList.remove("active");
  });
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add("active");
  }
}

// ✅ IZLOŽI GLOBALNO — NEMA export!
window.showScreen = showScreen;
window.formatDate = formatDate;