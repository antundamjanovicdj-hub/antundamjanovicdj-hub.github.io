// core/contacts.js

// ===== CONTACTS MODULE =====

let contacts = [];
let filteredContacts = [];
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

  // očisti sve osim brojeva
  const digits = input.replace(/\D/g, '');

  // mora imati 8 znamenki
  if (digits.length !== 8) return input;

  const d = digits.substring(0,2);
  const m = digits.substring(2,4);
  const y = digits.substring(4,8);

  // jezici koji koriste ISO
  const isoLangs = ['en', 'zh', 'ja', 'ko'];

  if (isoLangs.includes(lang)) {
    return `${y}-${m}-${d}`;   // YYYY-MM-DD
  } else {
    return `${d}-${m}-${y}`;   // DD-MM-YYYY
  }
}

// Init
function initContacts() {
  loadContacts();
  setupContactsEvents();

  // BACK - from contact details
  const backDetails = document.getElementById('backContactDetails');
  if (backDetails) {
    backDetails.addEventListener('click', () => {
      showScreen('screen-contacts');
    });
  }

  // BACK - from contact form
  const backForm = document.getElementById('backContactForm');
  if (backForm) {
    backForm.addEventListener('click', () => {
      showScreen('screen-contacts');
    });
  }
}

// ===== DIRECT ANDROID CONTACT IMPORT =====
window.importDeviceContacts = async function () {

  if (!window.Capacitor || !Capacitor.Plugins || !Capacitor.Plugins.Contacts) {
    alert("Import kontakata radi samo u Android aplikaciji");
    return;
  }

  try {

    // ===== REQUEST PERMISSION FIRST =====
const perm = await Capacitor.Plugins.Contacts.requestPermissions();

// ✅ SAFE CHECK (sprječava optBoolean null crash)
if (!perm || !perm.contacts || perm.contacts !== 'granted') {
  alert(getContactMessages().noPermission);
  return;
}

    // ===== LOAD CONTACTS =====
const result = await Capacitor.Plugins.Contacts.getContacts({
  projection: {
    name: true,
    phones: true,
    emails: true,
    addresses: true
  }
});

    if (!result || !result.contacts) {
      alert(getContactMessages().noContacts);
      return;
    }

    for (const c of result.contacts) {

      const firstName = c.name?.given || '';
      const lastName = c.name?.family || '';

      const phone = c.phones?.length ? c.phones[0].number : '';
      const email = c.emails?.length ? c.emails[0].address : '';
      const address = c.addresses?.length ? c.addresses[0].street : '';

      if (!firstName && !lastName) continue;

      const newContact = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        firstName,
        lastName,
        birthDate: '',
        birthdayNotify: false,
        address,
        email,
        phone,
        photo: ''
      };

      await addContact(newContact);
    }

    await loadContacts();
    alert(getContactMessages().importDone);

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

  filteredContacts = contacts;
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

  filteredContacts.forEach(c => {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.dataset.id = c.id;

    card.innerHTML = `
      <div class="contact-card-inner">
        <div class="contact-photo">
          ${c.photo ? `<img src="${c.photo}">` : '👤'}
        </div>
        <div class="contact-name">
          ${c.firstName} ${c.lastName}
        </div>
      </div>
    `;

    card.addEventListener('click', () => openContactDetails(c.id));
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
  c.birthdayNotify = e.target.checked;
  await addContact(c);

  const m = await import('./notifications.js');

  if (c.birthdayNotify) {
    const granted = await m.requestNotificationPermission();
    if (granted) {
      await m.scheduleBirthdayNotification(c);
    }
  } else {
    await m.cancelBirthdayNotification(c.id);
  }
});

  showScreen('screen-contact-details');
}
// ===== DELETE CONTACT =====
document.getElementById('btnDeleteContact').addEventListener('click', async () => {
  const wrap = document.getElementById('contactDetailsContent');
  if (!wrap) return;

  // uzmi ID trenutno otvorenog kontakta
  const currentId = wrap.querySelector('[data-current-contact-id]')?.dataset.currentContactId;
  if (!currentId) return;

  if (!confirm(getContactMessages().deleteConfirm)) return;

  await deleteContact(Number(currentId));
  await loadContacts();
  showScreen('screen-contacts');
});
// ===== EDIT CONTACT =====
document.getElementById('btnEditContact').addEventListener('click', async () => {
  const wrap = document.getElementById('contactDetailsContent');
  const currentId = wrap.querySelector('[data-current-contact-id]')?.dataset.currentContactId;
  if (!currentId) return;

  const all = await getContacts();
  const c = all.find(x => x.id == currentId);
  if (!c) return;

  // napuni formu
  document.getElementById('contactFirstName').value = c.firstName;
  document.getElementById('contactLastName').value = c.lastName;
  document.getElementById('contactBirthDate').value = c.birthDate;
  document.getElementById('contactAddress').value = c.address;
  document.getElementById('contactEmail').value = c.email;
  document.getElementById('contactPhone').value = c.phone;
  document.getElementById('contactPhotoData').value = c.photo || '';

  // zapamti da je edit
  document.getElementById('saveContact').dataset.editId = c.id;

  showScreen('screen-contact-form');
});

// ===== OPEN FORM =====
document.getElementById('btnAddContact').addEventListener('click', () => {
  showScreen('screen-contact-form');
});

/// ===== PICK PHOTO =====
document.getElementById('btnPickContactPhoto').addEventListener('click', async () => {

  // Android / Capacitor
  if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Camera) {

    const image = await Capacitor.Plugins.Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: "dataUrl",
      source: "photos"
    });

    document.getElementById('contactPhotoData').value = image.dataUrl;
    return;
  }

  // Web fallback
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('contactPhotoData').value = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
});

// ===== BACK FROM FORM =====
document.getElementById('backContactForm').addEventListener('click', () => {
  showScreen('screen-contacts');
});

// ===== SAVE CONTACT =====
document.getElementById('saveContact').addEventListener('click', async () => {

  const firstName = document.getElementById('contactFirstName').value.trim();
  const lastName = document.getElementById('contactLastName').value.trim();

  if (!firstName || !lastName) {
    alert(getContactMessages().enterName);
    return;
  }

  // ===== PHOTO DATA (from gallery or web) =====
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
  birthdayNotify: birthDateValue ? true : false,
  address: document.getElementById('contactAddress').value.trim(),
  email: document.getElementById('contactEmail').value.trim(),
  phone: document.getElementById('contactPhone').value.trim(),
  photo: photoBase64
};

  await addContact(contact);

// ===== AUTO SCHEDULE BIRTHDAY NOTIFICATION ON SAVE =====
const m = await import('./notifications.js');

if (contact.birthdayNotify) {
  const granted = await m.requestNotificationPermission();
  if (granted) {
    await m.cancelBirthdayNotification(contact.id);
    await m.scheduleBirthdayNotification(contact);
  }
} else {
  await m.cancelBirthdayNotification(contact.id);
}

  // reset forme
  document.getElementById('contactFirstName').value = '';
  document.getElementById('contactLastName').value = '';
  document.getElementById('contactBirthDate').value = '';
  document.getElementById('contactBirthdayTime').value = '';
  document.getElementById('contactAddress').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactPhone').value = '';
  document.getElementById('contactPhotoData').value = '';
  document.getElementById('saveContact').removeAttribute('data-edit-id');

  await loadContacts();
  showScreen('screen-contacts');
});