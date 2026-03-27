// core/contacts.js

// ===== CONTACTS MODULE =====

import {
  getContacts,
  addContact,
  deleteContact
} from './services/db.js';

let ContactsPlugin = null;

function getContactsPluginSafe() {

  if (ContactsPlugin) return ContactsPlugin;

  if (!window.Capacitor) return null;

  try {
    // 🔥 try registerPlugin first (@capgo)
    if (window.Capacitor.registerPlugin) {
      ContactsPlugin = window.Capacitor.registerPlugin('CapacitorContacts');
    }
  } catch (e) {
    console.warn('CapacitorContacts registerPlugin failed, trying fallback', e);
  }

  // 🔥 fallback
  if (!ContactsPlugin) {
    ContactsPlugin =
      window.Capacitor?.Plugins?.CapacitorContacts ||
      window.Capacitor?.Plugins?.Contacts ||
      null;
  }

  return ContactsPlugin;
}

// ===== TRUST NOTIFICATION BRIDGE =====
async function requestNotificationPermissionSafe() {
  return await window.requestNotificationPermission?.();
}

async function scheduleBirthdayNotificationSafe(contact) {
  return await window.scheduleBirthdayNotification?.(contact);
}

async function cancelBirthdayNotificationSafe(id) {
  return await window.cancelBirthdayNotification?.(id);
}

let contacts = [];
let filteredContacts = [];
let selectionMode = false;
let selectedContacts = new Set();

// 🔥 GLOBAL NAVIGATION GUARD (contacts details → contacts)
(function () {

  const originalShowScreen = window.showScreen;

  if (!originalShowScreen) return;

  window.showScreen = function (screenId) {

    // ako pokušava otići na menu iz contact-details → vrati na contacts
    if (
      window.__LK_FROM_CONTACT_DETAILS__ &&
      screenId !== 'screen-contact-details' &&
      screenId !== 'screen-contacts'
    ) {
      window.__LK_FROM_CONTACT_DETAILS__ = false;
      return originalShowScreen('screen-contacts');
    }

    // normal flow
    if (screenId !== 'screen-contact-details') {
      window.__LK_FROM_CONTACT_DETAILS__ = false;
    }

    return originalShowScreen(screenId);
  };

})();

function resetSelectionState() {
  selectionMode = false;
  selectedContacts.clear();

  const btn = document.getElementById('btnDeleteSelectedContacts');
  if (btn) {
    btn.textContent = 'Obriši odabrane';
  }
}
function getContactMessages() {
  const lang = (localStorage.getItem('userLang') || 'hr');
  return (I18N[lang].contacts && I18N[lang].contacts.messages)
    ? I18N[lang].contacts.messages
    : I18N.hr.contacts.messages;
}

// ===== BIRTHDATE FORMATTER =====
function formatBirthDateByLang(input) {
  if (!input) return '';

  const lang = (localStorage.getItem('userLang') || 'hr').toLowerCase();

  // 🔥 split po točkama ili minusima
  const parts = input.split(/[\.\-\/]/).filter(Boolean);

  if (parts.length < 3) return input;

  let d = parts[0];
  let m = parts[1];
  let y = parts[2];

  // 🔥 normalize (dodaj 0 ako treba)
  d = d.padStart(2, '0');
  m = m.padStart(2, '0');

  // ako godina nije 4 znamenke → ignore
  if (y.length !== 4) return input;

  // jezici koji koriste ISO
  const isoLangs = ['en', 'zh', 'ja', 'ko'];

  if (isoLangs.includes(lang)) {
    return `${y}-${m}-${d}`;   // YYYY-MM-DD
  } else {
    return `${d}-${m}-${y}`;   // DD-MM-YYYY
  }
}

// ===== FILL CONTACT FORM I18N =====
function fillContactFormI18N() {

  console.log("fillContactFormI18N RUNNING");

  const lang = localStorage.getItem('userLang') || 'hr';

  const t =
    (I18N[lang].contacts && I18N[lang].contacts.form)
      ? I18N[lang].contacts.form
      : I18N.hr.contacts.form;

  // placeholders
  document.getElementById('contactFirstName')?.setAttribute('placeholder', t.firstName || '');
  document.getElementById('contactLastName')?.setAttribute('placeholder', t.lastName || '');
  document.getElementById('contactBirthDate')?.setAttribute('placeholder', t.birthDate || '');
  document.getElementById('contactBirthdayTime')?.setAttribute('placeholder', t.birthdayTime || '');
  document.getElementById('contactAddress')?.setAttribute('placeholder', t.address || '');
  document.getElementById('contactEmail')?.setAttribute('placeholder', t.email || '');
  document.getElementById('contactPhone')?.setAttribute('placeholder', t.phone || '');

  // buttons
  const saveBtn = document.getElementById('saveContact');
  if (saveBtn && t.save) {
    saveBtn.textContent = t.save;
  }

  const pickPhoto = document.getElementById('btnPickContactPhoto');
  if (pickPhoto && t.pickPhoto) {
  pickPhoto.textContent = t.pickPhoto;
}
}

// Init
function initContacts() {
   console.log("INIT CONTACTS RUN");
  loadContacts();
  setupContactsEvents();

  // BACK - from contact details
const backDetails = document.getElementById('backContactDetails');
bindOnce(backDetails, 'back-details', 'click', () => {
  showScreen('screen-contacts');
});

// BACK - from contact form
const backForm = document.getElementById('backContactForm');
bindOnce(backForm, 'back-form-init', 'click', () => {
  showScreen('screen-contacts');
});

  // 🔒 LOCK IMPORT BUTTON
  const importBtn = document.getElementById('btnImportContacts');

if (importBtn) {
    const isNative = window.Capacitor?.isNativePlatform?.();

    // ❌ Web → disable (iOS i Android ostaju omogućeni)
    if (!isNative) {
      importBtn.disabled = true;
      importBtn.style.opacity = '0.5';
      importBtn.textContent = "📥 Uvoz dostupan samo na mobitelu";
      return;
    }
    
    // ✅ iOS i Android: omogući gumb
    importBtn.disabled = false;
    importBtn.style.opacity = '1';
    importBtn.textContent = "📥 Uvezi iz imenika";
}

}


// ===== DIRECT ANDROID CONTACT IMPORT =====
window.importDeviceContacts = async function () {

  // prvo provjeri podršku
  const plugin = getContactsPluginSafe();

if (!plugin) {
    alert(getContactMessages().notSupported || "Uvoz kontakata nije podržan na ovom uređaju.");
    return;
  }

  // tek onda objasni dozvolu
  const proceed = confirm(
    "LifeKompas treba pristup tvojim kontaktima kako bi mogao uvesti osobe koje želiš imati na jednom sigurnom mjestu.\n\nDozvolu možeš promijeniti u bilo kojem trenutku u Settings."
  );

  if (!proceed) return;

  try {

  let loadingShown = false;

const loadingTimer = setTimeout(() => {
  showScreen('screen-loading');
  loadingShown = true;
}, 300);

  const perm = await plugin.requestPermissions();
console.log('🔐 Permission result:', JSON.stringify(perm));

// 🔥 @capgo plugin returns: {readContacts: "granted", writeContacts: "granted"}
const isGranted = 
  perm?.readContacts === 'granted' || 
  perm?.contacts === 'granted' || 
  perm?.status === 'granted' ||
  perm === 'granted' ||
  perm === true;

if (!isGranted) {
  console.warn('⚠️ Permission not granted:', perm);
  alert(getContactMessages().noPermission || "Dozvola za kontakte nije dana.");
  return;
}

    // ===== LOAD CONTACTS =====
let result;

try {
  // 🔥 iOS safe fields only
  result = await plugin.getContacts({
    fields: [
      'identifier',
      'givenName',
      'familyName',
      'phoneNumbers',
      'emailAddresses'
    ]
  });

  console.log('📇 Contacts fetched:', result?.contacts?.length || 0, 'contacts');

  // 🔍 DEBUG: Pokaži strukturu prvog kontakta
  if (result?.contacts?.[0]) {
    console.log('📇 First contact FULL structure:', JSON.stringify(result.contacts[0], null, 2));
  }

} catch (e) {
  console.error('getContacts() error:', e);
  
  // Fallback: probaj bez ikakvih parametara
  try {
    console.log('🔄 Retrying getContacts() without fields...');
    result = await plugin.getContacts();
  } catch (e2) {
    throw e2;
  }
}

    if (!result || !result.contacts) {
      alert(getContactMessages().noContacts);
      return;
    }

  // povuci postojeće kontakte jednom (performance + trust)
const existingContacts = await getContacts();

// 🔥 cache postojećih telefona
const seenPhones = new Set(
  existingContacts
    .map(c => (c.phone || '').replace(/[^\d]/g, ''))
    .filter(Boolean)
);

console.log('🔍 START: Processing', result.contacts?.length || 0, 'contacts');

for (let i = 0; i < result.contacts.length; i++) {
  const c = result.contacts[i];
  
  console.log(`🔍 Contact #${i}:`, JSON.stringify(c));

  // 🔥 Telefon
  const rawPhone = c.phoneNumbers?.[0]?.value || '';
  const phone = rawPhone?.replace(/[^\d+]/g, '') || '';
  
  // 🔥 Email
  const email = c.emailAddresses?.[0]?.value || '';
  
  // 🔥 Adresa
  const address = c.postalAddresses?.[0]?.street || '';

  console.log(`🔍 Contact #${i} parsed:`, { rawPhone, phone, email, address });

  // 🔥 Preskoči ako nema NIŠTA
  if (!phone && !email) {
    console.log(`⚠️ Contact #${i} skipped: no phone or email`);
    continue;
  }

  // 🔥 Duplicate check
  // 🔥 normalize phone helper
function normalizePhone(p) {
  return (p || '').replace(/[^\d]/g, '');
}

const normalizedPhone = normalizePhone(phone);

// 🔥 koristi Set (instant + točan)
if (normalizedPhone && seenPhones.has(normalizedPhone)) {
  console.log(`⚠️ Contact #${i} skipped: duplicate (phone=${phone})`);
  continue;
}

  // 🔥 PRVO pokušaj uzeti pravo ime iz kontakta
// 🔥 pokušaj izvući ime iz displayName
let firstName = '';
let lastName = '';

if (c.displayName) {
  const parts = c.displayName.trim().split(' ');
  firstName = parts[0] || '';
  lastName = parts.slice(1).join(' ') || '';
}

// 🔥 prvo uzmi ime iz kontakta (iOS plugin)
if (c.givenName && c.givenName.trim()) {
  firstName = c.givenName.trim();
}

if (c.familyName && c.familyName.trim()) {
  lastName = c.familyName.trim();
}

// fallback ako nema imena (STRICT: no phone/email as name)
if (!firstName || /^\+?\d+$/.test(firstName)) {
  firstName = 'Kontakt';
}

  // 🔥 Kreiraj kontakt
  const newContact = {
  id: Date.now() + Math.floor(Math.random() * 1000),
  firstName: firstName,
  lastName: lastName,
    birthDate: '',
    birthdayNotify: false,
    address,
    email,
    phone,
    photo: ''
  };

  console.log('💾 Saving contact:', { firstName, phone, email });

  await addContact(newContact);

  // 🔥 zapamti novododani telefon
if (normalizedPhone) {
  seenPhones.add(normalizedPhone);
}
  
  console.log(`✅ Contact #${i} saved successfully`);
}

console.log('🔍 END: Processing complete');
clearTimeout(loadingTimer);

await loadContacts();

if (loadingShown) {
  showScreen('screen-contacts');
}

} catch (err) {
  console.error("CONTACT IMPORT ERROR REAL:", err);
  alert(getContactMessages().error + ": " + (err?.message || err));
}
};

// ===== LOAD CONTACTS FROM DB =====
async function loadContacts() {
  contacts = await getContacts();

  // ===== SORT ALPHABETICALLY =====
  contacts.sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const search = document.getElementById('searchContacts');
const q = search?.value?.toLowerCase() || '';

filteredContacts = contacts.filter(c =>
  (`${c.firstName} ${c.lastName}`).toLowerCase().includes(q)
);

renderContactsList();
}

// ===== EXPOSE CONTACT FUNCTIONS GLOBALLY =====
window.loadContacts = loadContacts;
window.initContacts = initContacts;
window.openContactDetails = openContactDetails;

// Render list with search
function renderContactsList() {
  const list = document.getElementById('contactsList');
  if (!list) return;

  list.innerHTML = '';

  // ===== PRAZNO STANJE =====
  if (!filteredContacts || filteredContacts.length === 0) {
    const lang = localStorage.getItem('userLang') || 'hr';

    list.innerHTML = `
      <div class="empty-list glass">
        <div style="font-size:26px; margin-bottom:8px;">👥</div>

        <div style="font-weight:800; font-size:16px;">
          ${I18N[lang]?.contacts?.emptyTitle || 'Nema kontakata'}
        </div>

        <div style="opacity:0.7; font-size:14px; margin-top:6px;">
          ${I18N[lang]?.contacts?.emptySub || 'Dodaj prvi kontakt kako bi započeo.'}
        </div>

        <div style="margin-top:14px; font-size:14px; opacity:0.85;">
          ➕ Dodaj kontakt pomoću gumba gore.
        </div>
      </div>
    `;
    return;
  }

  // ===== LISTA KONTAKATA =====
  filteredContacts.forEach(c => {
    const card = document.createElement('div');
const isSelected = selectedContacts.has(String(c.id));

card.className = `contact-card glass${isSelected ? ' selected' : ''}`;
card.dataset.id = String(c.id);

card.innerHTML = `
  <div class="contact-card-inner">
    <div class="contact-photo">
      ${c.photo ? `<img src="${c.photo}">` : '👤'}
    </div>
    <div class="contact-name">
      ${c.firstName} ${c.lastName}
    </div>
    ${isSelected ? `<div class="contact-selected-mark">✔️</div>` : ''}
  </div>
`;

    card.addEventListener('click', () => {

  if (selectionMode) {

  const id = String(c.id);

  if (selectedContacts.has(id)) {
    selectedContacts.delete(id);
  } else {
    selectedContacts.add(id);
  }

  const btn = document.getElementById('btnDeleteSelectedContacts');
  if (btn) {
    btn.textContent = `Potvrdi brisanje (${selectedContacts.size})`;
  }

  renderContactsList();
  return;
}

  openContactDetails(c.id);
});

// ❌ long press uklonjen (prelazimo na click-only selection model)
    list.appendChild(card);
  });
}

// Search
function setupContactsEvents() {
  const search = document.getElementById('searchContacts');
  if (search) {
    search.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      filteredContacts = contacts.filter(c =>
        (`${c.firstName} ${c.lastName}`).toLowerCase().includes(q)
      );
      renderContactsList();
    });
  }

  // 🔥 DELETE SELECTED CONTACTS
  const deleteSelectedBtn = document.getElementById('btnDeleteSelectedContacts');

  if (deleteSelectedBtn && !deleteSelectedBtn.dataset.bound) {

    deleteSelectedBtn.dataset.bound = '1';

    deleteSelectedBtn.addEventListener('click', async () => {

  // 🔥 ulazak u selection mode
  if (!selectionMode) {
  resetSelectionState(); // clean start
  selectionMode = true;

  deleteSelectedBtn.textContent = 'Potvrdi brisanje (0)';
  return;
}

  // 🔥 izlaz ako nema odabranih
  if (selectionMode && selectedContacts.size === 0) {
    selectionMode = false;
    deleteSelectedBtn.textContent = 'Obriši odabrane';
    return;
  }

  // 🔥 CONFIRM DELETE
  const confirmed = confirm('Obrisati odabrane kontakte?');
  if (!confirmed) return;

  const ids = Array.from(selectedContacts);

  for (const id of ids) {
    await deleteContact(Number(id));
  }

  // 🔥 RESET STATE (centralized)
resetSelectionState();

  await loadContacts();
});

  }
}

// Open details placeholder (next step)
async function openContactDetails(id) {
  // uvijek čitaj svježe iz IndexedDB
  const all = await getContacts();
  const c = all.find(x => x.id === id);
  if (!c) return;

  const wrap = document.getElementById('contactDetailsContent');

  wrap.innerHTML = `
  <div data-current-contact-id="${c.id}"></div>

  <div style="text-align:center;">
  ${c.photo ? `<img src="${c.photo}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;">` : '👤'}
</div>

<div class="contact-details-line"><strong>${c.firstName} ${c.lastName}</strong></div>

<div class="contact-details-line">
🎂 ${c.birthDate || '-'} ⏰ ${c.birthdayTime || '09:00'}
</div>

<label class="contact-details-line">
  <input type="checkbox" id="birthdayNotifyToggle" ${c.birthdayNotify ? 'checked' : ''}>
  🔔 <span id="cdBirthdayNotifyText"></span>
</label>

<div class="contact-details-line">📍 <span id="contactAddressLink">${c.address || '-'}</span></div>
<div class="contact-details-line">📧 <span id="contactEmailLink">${c.email || '-'}</span></div>
<div class="contact-details-line">📞 <span id="contactPhoneLink">${c.phone || '-'}</span></div>
`;

// ===== FILL I18N TEXT INSIDE DETAILS (dynamic content fix) =====
const lang = (localStorage.getItem('userLang') || 'hr');
const cd =
  (I18N[lang].contacts && I18N[lang].contacts.details)
    ? I18N[lang].contacts.details
    : (I18N.en.contacts && I18N.en.contacts.details)
        ? I18N.en.contacts.details
        : { birthdayNotify: "" };

const cdTextEl = document.getElementById('cdBirthdayNotifyText');
if (cdTextEl) cdTextEl.textContent = cd.birthdayNotify;

// ===== BUTTON TEXT (I18N FIX) =====
requestAnimationFrame(() => {

  const btnEdit = document.getElementById('btnEditContact');
  const btnDelete = document.getElementById('btnDeleteContact');

  if (btnEdit) {
    btnEdit.textContent = cd.edit || 'Uredi';
  }

  if (btnDelete) {
    btnDelete.textContent = cd.delete || 'Izbriši';
  }

});

  // address → Google Maps
  document.getElementById('contactAddressLink').addEventListener('click', () => {
    if (!c.address) return;
    window.open('https://www.google.com/maps/search/' + encodeURIComponent(c.address));
  });

  // email → mail app
  document.getElementById('contactEmailLink').addEventListener('click', () => {
    if (!c.email) return;
    window.location.href = 'mailto:' + c.email;
  });

  // phone → dialer
  document.getElementById('contactPhoneLink').addEventListener('click', () => {
    if (!c.phone) return;
    window.location.href = 'tel:' + c.phone;
  });

// ===== BIRTHDAY NOTIFY TOGGLE =====
document.getElementById('birthdayNotifyToggle').addEventListener('change', async (e) => {

  const nb = getNotificationsBridge();

  if (e.target.checked) {

    const confirmed = confirm(
      getContactMessages().notificationPermissionExplanation ||
      "LifeKompas can remind you about birthdays. Notifications stay private and are only used for reminders you create."
    );

    if (!confirmed) {
      e.target.checked = false;
      return;
    }

    if (typeof nb.requestPermission === 'function') {
      const granted = await nb.requestPermission();
      if (!granted) {
        e.target.checked = false;
        return;
      }
    }

    c.birthdayNotify = true;
    await addContact(c);

    if (typeof nb.scheduleBirthday === 'function') {
      await nb.scheduleBirthday(c);
    }

  } else {

    c.birthdayNotify = false;
    await addContact(c);

    if (typeof nb.cancelBirthday === 'function') {
      await nb.cancelBirthday(c.id);
    }

  }

});

// 🔥 set return screen (navigation hint)
window.__LK_RETURN_SCREEN__ = 'screen-contacts';

// 🔥 push history state (so back stays inside contacts)
history.pushState({ screen: 'contact-details' }, '');

window.__LK_FROM_CONTACT_DETAILS__ = true;

// 🔥 FORCE NAVIGATION STACK
if (window.__LK_NAV_STACK__) {
  window.__LK_NAV_STACK__.length = 0;
  window.__LK_NAV_STACK__.push('screen-contacts');
}

// fallback (ako koristi drugi naziv)
if (window.__NAV_STACK__) {
  window.__NAV_STACK__.length = 0;
  window.__NAV_STACK__.push('screen-contacts');
}

// 🔥 FIX: add proper back navigation
if (window.screenHistory) {
  window.screenHistory.push('screen-contacts');
}

showScreen('screen-contact-details');
  requestAnimationFrame(() => {
    attachContactDetailsHandlers();
  });
} // <-- KRAJ openContactDetails()

// ===== TRUST-GRADE: BIND ONCE HELPERS =====
function bindOnce(el, key, eventName, handler) {
  if (!el) return;
  const attr = `data-lk-bound-${key}`;
  if (el.getAttribute(attr) === '1') return;
  el.setAttribute(attr, '1');
  el.addEventListener(eventName, handler);
}

function getNotificationsBridge() {
  return {
    requestPermission: requestNotificationPermissionSafe,
    scheduleBirthday: scheduleBirthdayNotificationSafe,
    cancelBirthday: cancelBirthdayNotificationSafe
  };
}

// 🔥 HANDLE BACK (history)
window.addEventListener('popstate', (e) => {

  const currentScreen = document.body?.dataset?.screen;

  if (currentScreen === 'screen-contact-details') {
    e.preventDefault();
    showScreen('screen-contacts');
  }

});

function resetContactFormFields() {
  document.getElementById('contactFirstName').value = '';
  document.getElementById('contactLastName').value = '';
  document.getElementById('contactBirthDate').value = '';
  document.getElementById('contactBirthdayTime').value = '09:00';
  document.getElementById('contactAddress').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactPhone').value = '';
  document.getElementById('contactPhotoData').value = '';
  document.getElementById('saveContact')?.removeAttribute('data-edit-id');
}

function attachContactsListHandlers() {
  const btnAddContact = document.getElementById('btnAddContact');

  bindOnce(btnAddContact, 'add-contact', 'click', () => {
    resetContactFormFields();
    showScreen('screen-contact-form');

    // Force default birthday time after screen becomes active (iOS WebKit reset fix)
    requestAnimationFrame(() => {
      const birthdayTimeInput = document.getElementById('contactBirthdayTime');
      if (birthdayTimeInput) {
        birthdayTimeInput.type = 'text';
        birthdayTimeInput.value = '09:00';
        birthdayTimeInput.type = 'time';
      }
      fillContactFormI18N();
    });
  });
}

function attachContactFormHandlers() {
  const backContactForm = document.getElementById('backContactForm');
  const btnPickContactPhoto = document.getElementById('btnPickContactPhoto');
  const saveContactBtn = document.getElementById('saveContact');

  bindOnce(backContactForm, 'back-form', 'click', () => {
    showScreen('screen-contacts');
  });

  bindOnce(btnPickContactPhoto, 'pick-photo', 'click', async () => {

  // 🛡️ LOCK SCREEN (prevent navigation reset)
  window.__LK_PHOTO_PICK_ACTIVE__ = true;

  try {

    // Android / Capacitor
    if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Camera) {

      const confirmed = confirm(
        getContactMessages().photoPermissionExplanation ||
        "LifeKompas needs access to your photos so you can add a profile image. The photo stays only on your device."
      );

      if (!confirmed) return;

      try {
        const image = await Capacitor.Plugins.Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: "dataUrl",
          source: "PROMPT"
        });

        document.getElementById('contactPhotoData').value = image.dataUrl;

      } catch (err) {
        console.warn("Camera permission denied or cancelled", err);
      }

      return;
    }

    // Web fallback
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById('contactPhotoData').value = e.target.result;
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();

  } finally {
    // 🛡️ UNLOCK after small delay (important!)
    setTimeout(() => {
      window.__LK_PHOTO_PICK_ACTIVE__ = false;
    }, 300);
  }

});

  bindOnce(saveContactBtn, 'save-contact', 'click', async () => {

    const firstName = document.getElementById('contactFirstName').value.trim();
    const lastName = document.getElementById('contactLastName').value.trim();

    if (!firstName || !lastName) {
      alert(getContactMessages().enterName);
      return;
    }

    const photoBase64 = document.getElementById('contactPhotoData').value || '';
    const editId = document.getElementById('saveContact').dataset.editId;

    const birthDateValue = formatBirthDateByLang(
      document.getElementById('contactBirthDate').value.trim()
    );

    const contact = {
      id: editId ? Number(editId) : Date.now(),
      firstName,
      lastName,
      birthDate: birthDateValue,
      birthdayTime: document.getElementById('contactBirthdayTime').value || "09:00",
      birthdayNotify: document.getElementById('contactBirthdayNotify')?.checked || false,
      address: document.getElementById('contactAddress').value.trim(),
      email: document.getElementById('contactEmail').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      photo: photoBase64
    };

    // Trust-grade: lock save to prevent multi-tap duplicates
    const btn = document.getElementById('saveContact');
    const oldText = btn?.textContent || '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = (getContactMessages().saving || 'Spremam...');
    }

    try {
      await addContact(contact);

      const nb = getNotificationsBridge();

      if (contact.birthdayNotify) {

        const confirmed = confirm(
          getContactMessages().notificationPermissionExplanation ||
          "LifeKompas can remind you about birthdays. Notifications stay private and are only used for reminders you create."
        );

        if (!confirmed) {
          contact.birthdayNotify = false;
          if (typeof nb.cancelBirthday === 'function') {
            await nb.cancelBirthday(contact.id);
          }
        } else {
          if (typeof nb.requestPermission === 'function') {
            const granted = await nb.requestPermission();
            if (granted) {
              if (typeof nb.cancelBirthday === 'function') {
                await nb.cancelBirthday(contact.id);
              }
              if (typeof nb.scheduleBirthday === 'function') {
                await nb.scheduleBirthday(contact);
              }
            }
          }
        }

      } else {
        if (typeof nb.cancelBirthday === 'function') {
          await nb.cancelBirthday(contact.id);
        }
      }

      resetContactFormFields();
      await loadContacts();
      showScreen('screen-contacts');

    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
    }
  });
}

function attachContactDetailsHandlers() {
  const btnDeleteContact = document.getElementById('btnDeleteContact');
  const btnEditContact = document.getElementById('btnEditContact');

  bindOnce(btnDeleteContact, 'delete-contact', 'click', async () => {
    const wrap = document.getElementById('contactDetailsContent');
    if (!wrap) return;

    const currentId =
      wrap.querySelector('[data-current-contact-id]')?.dataset.currentContactId;
    if (!currentId) return;

    if (!confirm(getContactMessages().deleteConfirm)) return;

    // Trust-grade: lock delete + don't crash if notif bridge missing
    const btn = document.getElementById('btnDeleteContact');
    const oldText = btn?.textContent || '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = (getContactMessages().deleting || 'Brišem...');
    }

    try {
      const nb = getNotificationsBridge();
      if (typeof nb.cancelBirthday === 'function') {
        await nb.cancelBirthday(Number(currentId));
      }

      await deleteContact(Number(currentId));
      await loadContacts();
      showScreen('screen-contacts');

    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
    }
  });

  bindOnce(btnEditContact, 'edit-contact', 'click', async () => {
    const wrap = document.getElementById('contactDetailsContent');
    if (!wrap) return;

    const currentId =
      wrap.querySelector('[data-current-contact-id]')?.dataset.currentContactId;
    if (!currentId) return;

    const all = await getContacts();
    const c = all.find(x => x.id == currentId);
    if (!c) return;

    document.getElementById('contactFirstName').value = c.firstName;
    document.getElementById('contactLastName').value = c.lastName;
    document.getElementById('contactBirthDate').value = c.birthDate;
    document.getElementById('contactBirthdayTime').value = c.birthdayTime || "09:00";

    const birthdayCheckbox = document.getElementById('contactBirthdayNotify');
    if (birthdayCheckbox) birthdayCheckbox.checked = !!c.birthdayNotify;

    document.getElementById('contactAddress').value = c.address;
    document.getElementById('contactEmail').value = c.email;
    document.getElementById('contactPhone').value = c.phone;
    document.getElementById('contactPhotoData').value = c.photo || '';

    document.getElementById('saveContact').dataset.editId = c.id;

    showScreen('screen-contact-form');
  });
}

// APPLY I18N + TRUST-GRADE BINDINGS WHEN SCREENS ARE SHOWN
document.addEventListener('screenShown', (e) => {

  if (e.detail === 'screen-contact-form') {
    fillContactFormI18N();
    attachContactFormHandlers();

    const saveBtn = document.getElementById('saveContact');
    const isEdit = saveBtn?.dataset.editId;

    if (!isEdit) {
      const birthdayTimeInput = document.getElementById('contactBirthdayTime');
      if (birthdayTimeInput) {
        birthdayTimeInput.value = '09:00';
      }
    }
  }

  if (e.detail === 'screen-contacts') {

    // 🔥 RESET SELECTION MODE (centralized)
resetSelectionState();

  const deleteBtn = document.getElementById('btnDeleteSelectedContacts');
if (deleteBtn) deleteBtn.style.display = 'block';

  const searchInput = document.getElementById('searchContacts');
  if (searchInput) {
    searchInput.value = '';
  }

  attachContactsListHandlers();
  loadContacts();

  // 🔥 FIX: bind import button svaki put kad se screen otvori
  const importBtn = document.getElementById('btnImportContacts');

  if (importBtn && !importBtn.dataset.bound) {

  importBtn.dataset.bound = '1';

  importBtn.addEventListener('click', async (e) => {

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (importBtn.disabled) return;

    importBtn.disabled = true;
    importBtn.textContent = "Uvozim...";

    try {
      await window.importDeviceContacts();
    } finally {
      importBtn.disabled = false;
      importBtn.textContent = "📥 Uvezi iz imenika";
    }

  }, true); 
  }
  }
  
  // 🔥 capture phase

  if (e.detail === 'screen-contact-details') {
  attachContactDetailsHandlers();

  // 🔥 FORCE BACK TO CONTACTS (override engine)
  requestAnimationFrame(() => {
    const backBtn = document.querySelector('#btnBack, .btn-back, [data-back]');
    if (!backBtn) return;

    if (backBtn.dataset.lkContactsOverride === '1') return;
    backBtn.dataset.lkContactsOverride = '1';

    backBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();

      showScreen('screen-contacts');
    }, true);
  });
}

});