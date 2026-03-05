// core/db.js
class ObligationDB {
  constructor() {
    this.dbName = 'lifeKompasDB';
    this.version = 3;
    // 🔒 DB VERSION LOCK
    // Production users exist.
    // DO NOT bump without a migration strategy.
    // Breaking this rule = potential user data loss.
    this.storeName = 'obligations';
    this.financeStoreName = 'finances';
    this.contactsStoreName = 'contacts';
    this.db = null;
    this._initPromise = null; // 🔧 FIX: Prevent multiple init calls
  }

  async init() {
    // 🔧 FIX: Return existing promise if init is in progress
    if (this._initPromise) {
      return this._initPromise;
    }

    // 🔧 FIX: If already initialized, return immediately
    if (this.db) {
      return Promise.resolve();
    }

    this._initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        this._initPromise = null;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;

        // 🔧 Handle version change (another tab upgraded DB)
        this.db.onversionchange = () => {
          this.db.close();
          this.db = null;
          this._initPromise = null;
        };

        // 🔧 Handle unexpected close
        this.db.onclose = () => {
          this.db = null;
          this._initPromise = null;
        };

        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Obligations store
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('dateTime', 'dateTime', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('type', 'type', { unique: false }); // 🔧 FIX: Add type index for shopping filter
        }

        // Finances store
        if (!db.objectStoreNames.contains(this.financeStoreName)) {
          const fstore = db.createObjectStore(this.financeStoreName, { keyPath: 'id' });
          fstore.createIndex('type', 'type', { unique: false });
          fstore.createIndex('date', 'date', { unique: false });
          fstore.createIndex('category', 'category', { unique: false });
        }

        // Contacts store
        if (!db.objectStoreNames.contains(this.contactsStoreName)) {
          const cstore = db.createObjectStore(this.contactsStoreName, { keyPath: 'id' });
          cstore.createIndex('lastName', 'lastName', { unique: false });
          cstore.createIndex('birthDate', 'birthDate', { unique: false });
        }
      };
    });

    return this._initPromise;
  }

  // 🔧 FIX: Safe init wrapper that handles reconnection
  async ensureInit() {
    if (this.db) return;
    await this.init();
  }

  async add(obligation) {
    await this.ensureInit(); // 🔧 FIX: Use ensureInit instead of init
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const request = store.put(obligation);

        request.onsuccess = () => resolve(obligation.id);
        request.onerror = () => reject(request.error);
        
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        // 🔧 FIX: Handle transaction errors gracefully
        this.db = null;
        this._initPromise = null;
        reject(err);
      }
    });
  }

  async getAll() {
    await this.ensureInit(); // 🔧 FIX: Use ensureInit
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
        
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        this.db = null;
        this._initPromise = null;
        reject(err);
      }
    });
  }

  async delete(id) {
    await this.ensureInit(); // 🔧 FIX: Use ensureInit
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        this.db = null;
        this._initPromise = null;
        reject(err);
      }
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

export async function addFinanceItem(item) {
  await obligationDB.ensureInit(); // 🔧 FIX: Use ensureInit
  return new Promise((resolve, reject) => {
    try {
      const tx = obligationDB.db.transaction(obligationDB.financeStoreName, 'readwrite');
      const store = tx.objectStore(obligationDB.financeStoreName);
      const request = store.put(item);

      request.onsuccess = () => resolve(item.id);
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function getFinanceItems() {
  await obligationDB.ensureInit(); // 🔧 FIX: Use ensureInit
  return new Promise((resolve, reject) => {
    try {
      const tx = obligationDB.db.transaction(obligationDB.financeStoreName, 'readonly');
      const store = tx.objectStore(obligationDB.financeStoreName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function deleteFinanceItem(id) {
  await obligationDB.ensureInit(); // 🔧 FIX: Use ensureInit
  return new Promise((resolve, reject) => {
    try {
      const tx = obligationDB.db.transaction(obligationDB.financeStoreName, 'readwrite');
      const store = tx.objectStore(obligationDB.financeStoreName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
}

// ===== CONTACTS (IndexedDB) =====

export async function addContact(item) {
  await obligationDB.ensureInit(); // 🔧 FIX: Use ensureInit
  return new Promise((resolve, reject) => {
    try {
      const tx = obligationDB.db.transaction(obligationDB.contactsStoreName, 'readwrite');
      const store = tx.objectStore(obligationDB.contactsStoreName);
      const request = store.put(item);

      request.onsuccess = () => resolve(item.id);
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function getContacts() {
  await obligationDB.ensureInit(); // 🔧 FIX: Use ensureInit
  return new Promise((resolve, reject) => {
    try {
      const tx = obligationDB.db.transaction(obligationDB.contactsStoreName, 'readonly');
      const store = tx.objectStore(obligationDB.contactsStoreName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function deleteContact(id) {
  await obligationDB.ensureInit(); // 🔧 FIX: Use ensureInit
  return new Promise((resolve, reject) => {
    try {
      const tx = obligationDB.db.transaction(obligationDB.contactsStoreName, 'readwrite');
      const store = tx.objectStore(obligationDB.contactsStoreName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
}