// shopping-init.js
// LifeKompas — Shopping Init Layer (SAFE BOOT)

// 🔌 IMPORT ENGINE
import * as ShoppingEngine from '../../core/engine/shopping-engine.js';

// 🧠 INIT FUNCTION
export function initShoppingModule() {

  if (window.__LK_SHOPPING_INIT__) return;
  window.__LK_SHOPPING_INIT__ = true;

  console.log('[LifeKompas] Shopping init start');

  try {

    // 🚀 Engine init (ako postoji)
    if (typeof ShoppingEngine.init === 'function') {
      ShoppingEngine.init();
    }

    // 📦 expose global (TEMP - za sigurnost)
    window.Shopping = ShoppingEngine;

    // 🧷 expose render (bridge layer)
if (typeof ShoppingEngine.renderShoppingList === 'function') {
  window.renderShoppingList = (...args) =>
    ShoppingEngine.renderShoppingList(...args);
}

    // 🧷 legacy global bindings (SAFE)
if (typeof ShoppingEngine.renderShoppingList === 'function') {
  window.renderShoppingList = ShoppingEngine.renderShoppingList;
}

    console.log('[LifeKompas] Shopping init ready');

  } catch (err) {
    console.error('[LifeKompas] Shopping init failed:', err);
  }
}