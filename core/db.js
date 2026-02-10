// core/db.js
class ObligationDB {
  constructor() {
    this.dbName = 'lifeKompasDB';
    this.version = 3; // ↑ povećana verzija zbog contacts store-a
    this.storeName = 'obligations';
    this.financeStoreName = 'finances';
    this.contactsStoreName = 'contacts'; // ← novi store za kontakte
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
  this.db = request.result;

  // 🔧 Ako je bila promjena verzije, zatvori staru konekciju i koristi novu
  this.db.onversionchange = () => {
    this.db.close();
  };

  resolve();
};

       request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Obligations store (postojeći)
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('dateTime', 'dateTime', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // Finances store (novi)
        if (!db.objectStoreNames.contains(this.financeStoreName)) {
          const fstore = db.createObjectStore(this.financeStoreName, { keyPath: 'id' });
          fstore.createIndex('type', 'type', { unique: false });       // income / expense / credit / fixed
          fstore.createIndex('date', 'date', { unique: false });       // ISO date
          fstore.createIndex('category', 'category', { unique: false });
        }

 // Contacts store (novi)
        if (!db.objectStoreNames.contains(this.contactsStoreName)) {
          const cstore = db.createObjectStore(this.contactsStoreName, { keyPath: 'id' });
          cstore.createIndex('lastName', 'lastName', { unique: false });
          cstore.createIndex('birthDate', 'birthDate', { unique: false });
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

export const obligationDB = new ObligationDB();
// ===== SHOPPING (IndexedDB) =====

export function addShoppingItem(item) {
  item.type = 'shopping';
  return obligationDB.add(item);
}

export function getShoppingItems() {
  return obligationDB.getAll().then(items =>
    items.filter(item => item.type === 'shopping')
  );
}

export function updateShoppingItem(item) {
  return obligationDB.add(item);
}
export function deleteShoppingItem(id) {
  return obligationDB.delete(id);
}
// ===== FINANCES (IndexedDB) =====

export function addFinanceItem(item) {
  return new Promise(async (resolve, reject) => {
    await obligationDB.init();
    const tx = obligationDB.db.transaction(obligationDB.financeStoreName, 'readwrite');
    const store = tx.objectStore(obligationDB.financeStoreName);
    const request = store.put(item);

    request.onsuccess = () => resolve(item.id);
    request.onerror = () => reject(request.error);
  });
}

export function getFinanceItems() {
  return new Promise(async (resolve, reject) => {
    await obligationDB.init();
    const tx = obligationDB.db.transaction(obligationDB.financeStoreName, 'readonly');
    const store = tx.objectStore(obligationDB.financeStoreName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function deleteFinanceItem(id) {
  return new Promise(async (resolve, reject) => {
    await obligationDB.init();
    const tx = obligationDB.db.transaction(obligationDB.financeStoreName, 'readwrite');
    const store = tx.objectStore(obligationDB.financeStoreName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ===== CONTACTS (IndexedDB) =====

export function addContact(item) {
  return new Promise(async (resolve, reject) => {
    await obligationDB.init();
    const tx = obligationDB.db.transaction(obligationDB.contactsStoreName, 'readwrite');
    const store = tx.objectStore(obligationDB.contactsStoreName);
    const request = store.put(item);

    request.onsuccess = () => resolve(item.id);
    request.onerror = () => reject(request.error);
  });
}

export function getContacts() {
  return new Promise(async (resolve, reject) => {
    await obligationDB.init();
    const tx = obligationDB.db.transaction(obligationDB.contactsStoreName, 'readonly');
    const store = tx.objectStore(obligationDB.contactsStoreName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function deleteContact(id) {
  return new Promise(async (resolve, reject) => {
    await obligationDB.init();
    const tx = obligationDB.db.transaction(obligationDB.contactsStoreName, 'readwrite');
    const store = tx.objectStore(obligationDB.contactsStoreName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}