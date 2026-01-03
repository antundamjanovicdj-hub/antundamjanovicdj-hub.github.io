// core/db.js
class ObligationDB {
  constructor() {
    this.dbName = 'lifeKompasDB';
    this.version = 1; // ostaje 1 jer IndexedDB automatski prima nova polja
    this.storeName = 'obligations';
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('dateTime', 'dateTime', { unique: false });
          store.createIndex('status', 'status', { unique: false }); // ← dodatno, nije obavezno
        }
      };
    });
  }

  async add(obligation) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.put(obligation); // koristi put() umjesto add() → ažurira ako postoji

      request.onsuccess = () => resolve(obligation.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll() {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

const obligationDB = new ObligationDB();
// ===== SHOPPING (IndexedDB) =====

function addShoppingItem(item) {
  item.type = 'shopping';
  return obligationDB.add(item);
}

function getShoppingItems() {
  return obligationDB.getAll().then(items =>
    items.filter(item => item.type === 'shopping')
  );
}

function updateShoppingItem(item) {
  return obligationDB.put(item);
}
function deleteShoppingItem(id) {
  return obligationDB.delete(id);
}