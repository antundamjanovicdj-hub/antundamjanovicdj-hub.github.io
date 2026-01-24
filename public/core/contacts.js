// core/contacts.js

// ===== CONTACTS MODULE =====

let contacts = [];
let filteredContacts = [];

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

// Load from IndexedDB
async function loadContacts() {
  contacts = await getContacts();
  filteredContacts = contacts;
  renderContactsList();
}

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
  <div style="text-align:center;">
  ${c.photo ? `<img src="${c.photo}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;">` : '👤'}
</div>

<div><strong>${c.firstName} ${c.lastName}</strong></div>
  <div>🎂 ${c.birthDate || '-'}</div>

  <label style="display:block; margin:8px 0;">
    <input type="checkbox" id="birthdayNotifyToggle" ${c.birthdayNotify ? 'checked' : ''}>
    🔔 Rođendanska notifikacija
  </label>

  <div>📍 <span id="contactAddressLink">${c.address || '-'}</span></div>
  <div>📧 <span id="contactEmailLink">${c.email || '-'}</span></div>
  <div>📞 <span id="contactPhoneLink">${c.phone || '-'}</span></div>
`;

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
    await addContact(c); // put() update u IndexedDB
  });

  showScreen('screen-contact-details');
}

// ===== OPEN FORM =====
document.getElementById('btnAddContact').addEventListener('click', () => {
  showScreen('screen-contact-form');
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
    alert('Unesi ime i prezime');
    return;
  }

  // ===== PHOTO TO BASE64 =====
const photoInput = document.getElementById('contactPhotoInput');
let photoBase64 = '';

if (photoInput.files && photoInput.files[0]) {
  const file = photoInput.files[0];
  photoBase64 = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

const contact = {
  id: Date.now(),
  firstName,
  lastName,
  birthDate: formatBirthDateByLang(
    document.getElementById('contactBirthDate').value.trim()
  ),
  birthdayNotify: false,
  address: document.getElementById('contactAddress').value.trim(),
  email: document.getElementById('contactEmail').value.trim(),
  phone: document.getElementById('contactPhone').value.trim(),
  photo: photoBase64
};

  await addContact(contact);

  // reset forme
  document.getElementById('contactFirstName').value = '';
  document.getElementById('contactLastName').value = '';
  document.getElementById('contactBirthDate').value = '';
  document.getElementById('contactAddress').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactPhone').value = '';
  document.getElementById('contactPhotoInput').value = '';

  await loadContacts();
  showScreen('screen-contacts');
});