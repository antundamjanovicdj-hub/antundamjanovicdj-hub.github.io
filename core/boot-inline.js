// core/boot-inline.js
// Extracted from index.html inline <script type="module"> (Phase 2)

import { getLang, todayISO, getISODateFromDateTime } from './app-init.js';

// expose helpers (temporary, until global kill phase)
window.todayISO = todayISO;
window.getISODateFromDateTime = getISODateFromDateTime;
window.getLang = getLang;

// NOTE:
// - Pre-boot crash guard is now handled in core/main.js
// - Global crash shield is now handled in core/main.js
// So we do NOT duplicate those parts here.

/* ===== SET LANGUAGE + SHOW MENU ===== */
function setLanguage(lang) {
  localStorage.setItem('userLang', lang);
  document.documentElement.setAttribute('lang', lang);

  if (typeof I18N === 'undefined' || !I18N[lang]) {
    showScreen('screen-menu');
    return;
  }

  // ===== LANGUAGE FALLBACK TO ENGLISH =====
  if (!I18N[lang].obligationsView) I18N[lang].obligationsView = I18N.en.obligationsView;
  if (!I18N[lang].obligationsList) I18N[lang].obligationsList = I18N.en.obligationsList;
  if (!I18N[lang].obligation) I18N[lang].obligation = I18N.en.obligation;
  if (!I18N[lang].popup) I18N[lang].popup = I18N.en.popup;
  if (!I18N[lang].shopping) I18N[lang].shopping = I18N.en.shopping;
  if (!I18N[lang].finances) I18N[lang].finances = I18N.en.finances;

  document.getElementById('btnObligations').textContent = I18N[lang].menu.obligations;
  document.getElementById('btnShopping').textContent = I18N[lang].menu.shopping;
  document.getElementById('btnContacts').textContent = I18N[lang].menu.contacts;
  document.getElementById('btnFinances').textContent = I18N[lang].menu.finances;
  document.getElementById('btnHealth').textContent = I18N[lang].menu.health;
  document.getElementById('btnDiary').textContent = I18N[lang].menu.diary;

  // ===== CONTACTS SCREEN TEXT =====
  const c = I18N[lang].contacts || I18N.en.contacts;

  const contactsTitle = document.getElementById('contactsTitle');
  if (contactsTitle && c) {
    contactsTitle.innerHTML = `<img src="images/contacts-icon.png" class="contacts-title-icon"> ${c.title}`;
  }

  const btnImport = document.getElementById('btnImportContacts');
  if (btnImport && c) {
    btnImport.textContent = c.import;
  }

  const btnAddContact = document.getElementById('btnAddContact');
  if (btnAddContact && c) {
    btnAddContact.textContent = c.add;
  }

  const searchContacts = document.getElementById('searchContacts');
  if (searchContacts && c) {
    searchContacts.placeholder = c.search;
  }

  // ===== CONTACT FORM TEXT =====
  const cf =
    (I18N[lang].contacts && I18N[lang].contacts.form)
      ? I18N[lang].contacts.form
      : (I18N.en.contacts && I18N.en.contacts.form)
          ? I18N.en.contacts.form
          : {
              title: "",
              firstName: "",
              lastName: "",
              birthDate: "",
              birthdayTime: "",
              address: "",
              email: "",
              phone: "",
              pickPhoto: "",
              save: ""
            };

  // ===== CONTACT DETAILS TEXT =====
  const cd =
    (I18N[lang].contacts && I18N[lang].contacts.details)
      ? I18N[lang].contacts.details
      : (I18N.en.contacts && I18N.en.contacts.details)
          ? I18N.en.contacts.details
          : {
              title: "",
              edit: "",
              delete: "",
              birthdayNotify: ""
            };

  const cdBirthdayNotifyText = document.getElementById('cdBirthdayNotifyText');
  if (cdBirthdayNotifyText) cdBirthdayNotifyText.textContent = cd.birthdayNotify;

  const contactDetailsTitle = document.getElementById('contactDetailsTitle');
  if (contactDetailsTitle) contactDetailsTitle.textContent = cd.title;

  const btnEditContact = document.getElementById('btnEditContact');
  if (btnEditContact) btnEditContact.textContent = "✏️ " + cd.edit;

  const btnDeleteContact = document.getElementById('btnDeleteContact');
  if (btnDeleteContact) btnDeleteContact.textContent = "🗑️ " + cd.delete;

  const contactFormTitle = document.getElementById('contactFormTitle');
  if (contactFormTitle) {
    contactFormTitle.innerHTML = `<img src="images/contacts-icon.png" class="contacts-title-icon"> ${cf.title}`;
  }

  const cfFirst = document.getElementById('contactFirstName');
  const cfLast = document.getElementById('contactLastName');
  const cfBirth = document.getElementById('contactBirthDate');
  const cfAddress = document.getElementById('contactAddress');
  const cfEmail = document.getElementById('contactEmail');
  const cfPhone = document.getElementById('contactPhone');

  if (cfFirst) cfFirst.placeholder = cf.firstName;
  if (cfLast) cfLast.placeholder = cf.lastName;
  if (cfBirth) cfBirth.placeholder = cf.birthDate;
  if (cfAddress) cfAddress.placeholder = cf.address;
  if (cfEmail) cfEmail.placeholder = cf.email;
  if (cfPhone) cfPhone.placeholder = cf.phone;

  const cfTimeLabel = document.getElementById('contactBirthdayTimeLabel');
  if (cfTimeLabel) cfTimeLabel.textContent = cf.birthdayTime;

  const cfPickPhoto = document.getElementById('btnPickContactPhoto');
  if (cfPickPhoto) cfPickPhoto.textContent = "🖼️ " + cf.pickPhoto;

  const cfSave = document.getElementById('saveContact');
  if (cfSave) cfSave.textContent = "💾 " + cf.save;

  // ===== FINANCES MENU + SCREENS (guarded) =====
  if (I18N[lang].finances) {
    const finTitle = document.querySelector('#screen-finances-menu h2');
    if (finTitle) finTitle.textContent = I18N[lang].menu.finances;

    document.getElementById('btnIncomeScreen').textContent = I18N[lang].finances.menu.income;
    document.getElementById('btnMonthlyCostsScreen').textContent = I18N[lang].finances.menu.fixed;
    document.getElementById('btnCreditsScreen').textContent = I18N[lang].finances.menu.credits;
    document.getElementById('btnOtherCostsScreen').textContent = I18N[lang].finances.menu.other;
    document.getElementById('btnCostsOverview').textContent = I18N[lang].finances.menu.overview;

    document.querySelector('#screen-finance-income h2').textContent = I18N[lang].finances.income.title;
    document.querySelector('#screen-finance-fixed h2').textContent = I18N[lang].finances.fixed.title;
    document.querySelector('#screen-finance-credits h2').textContent = I18N[lang].finances.credits.title;
    document.querySelector('#screen-finance-other h2').textContent = I18N[lang].finances.other.title;
    document.querySelector('#screen-finance-overview h2').textContent = I18N[lang].finances.overview.title;

    const incAmount = document.getElementById('incomeAmount');
    const incDesc = document.getElementById('incomeDesc');
    if (incAmount) incAmount.placeholder = I18N[lang].finances.income.amountPh;
    if (incDesc) incDesc.placeholder = I18N[lang].finances.income.descPh;

    const incomeDateLabel = document.getElementById('incomeDateLabel');
    if (incomeDateLabel) incomeDateLabel.textContent = I18N[lang].finances.income.dateLabel;

    const fixedDesc = document.getElementById('fixedDesc');
    const fixedAmount = document.getElementById('fixedAmount');
    if (fixedDesc) fixedDesc.placeholder = I18N[lang].finances.fixed.descPh;
    if (fixedAmount) fixedAmount.placeholder = I18N[lang].finances.fixed.amountPh;

    const creditDesc = document.getElementById('creditDesc');
    const creditAmount = document.getElementById('creditAmount');
    if (creditDesc) creditDesc.placeholder = I18N[lang].finances.credits.descPh;
    if (creditAmount) creditAmount.placeholder = I18N[lang].finances.credits.amountPh;

    const creditStartLabel = document.getElementById('creditStartLabel');
    const creditEndLabel = document.getElementById('creditEndLabel');
    const creditLastPaidLabel = document.getElementById('creditLastPaidLabel');

    if (creditStartLabel) creditStartLabel.textContent = I18N[lang].finances.credits.startLabel;
    if (creditEndLabel) creditEndLabel.textContent = I18N[lang].finances.credits.endLabel;
    if (creditLastPaidLabel) creditLastPaidLabel.textContent = I18N[lang].finances.credits.lastPaidLabel;

    const otherDesc = document.getElementById('otherDesc');
    const otherAmount = document.getElementById('otherAmount');
    if (otherDesc) otherDesc.placeholder = I18N[lang].finances.other.descPh;
    if (otherAmount) otherAmount.placeholder = I18N[lang].finances.other.amountPh;

    document.getElementById('saveIncome').textContent = "➕ " + I18N[lang].finances.income.add;
    document.getElementById('saveFixed').textContent = "➕ " + I18N[lang].finances.fixed.add;
    document.getElementById('saveCredit').textContent = "➕ " + I18N[lang].finances.credits.add;
    document.getElementById('saveOther').textContent = "➕ " + I18N[lang].finances.other.add;
    document.getElementById('btnCalculateMonth').textContent = I18N[lang].finances.overview.calculate;

    const monthLabel = document.getElementById('financeMonthLabel');
    if (monthLabel) monthLabel.textContent = I18N[lang].obligationsView.selectDate || I18N.en.obligationsView.selectDate;
  }

  // ===== REFRESH CONTACTS TRANSLATION IF SCREEN ALREADY OPEN =====
  const currentContactsScreen = document.getElementById('screen-contacts');
  if (currentContactsScreen && currentContactsScreen.classList.contains('active')) {
    const c = I18N[lang].contacts || I18N.en.contacts;

    const contactsTitle = document.getElementById('contactsTitle');
    if (contactsTitle && c) {
      contactsTitle.innerHTML = `<img src="images/contacts-icon.png" class="contacts-title-icon"> ${c.title}`;
    }

    const btnImport = document.getElementById('btnImportContacts');
    if (btnImport && c) btnImport.textContent = c.import;

    const btnAddContact = document.getElementById('btnAddContact');
    if (btnAddContact && c) btnAddContact.textContent = c.add;

    const searchContacts = document.getElementById('searchContacts');
    if (searchContacts && c) searchContacts.placeholder = c.search;
  }

  showScreen('screen-menu');

  // UX 1.6 – reset history nakon izbora jezika
  screenHistory.length = 0;

  setTimeout(() => {
    document.querySelectorAll('.menu-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('animate'), 150 * i);
    });
  }, 50);
}

// expose for legacy callers
window.setLanguage = setLanguage;

/* ===== LANGUAGE BUTTON ENGINE ===== */
function bindLanguageButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (!lang) return;
      setLanguage(lang);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindLanguageButtons();
});