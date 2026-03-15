import { getLang, SCREEN_TITLES } from '../utils/utils.js';
import { obligationDB } from '../services/db.js';
import Temporal from '../../src/core/temporal/index.js';

let navigationLock = false;
let navigationLockTimeout = null;

function legacy_showScreen(screenId) {
  if (navigationLock) {
    console.debug('[NAV] Ignored tap (navigation lock):', screenId);
    return;
  }
  
  navigationLock = true;
  
  if (navigationLockTimeout) {
    clearTimeout(navigationLockTimeout);
  }

  const screens = document.querySelectorAll('.screen');
  const next = document.getElementById(screenId);

  screens.forEach(screen => {
    screen.classList.remove('active');
    screen.style.display = 'none';
  });

  if (next) {
    next.classList.add('active');
    next.style.display = 'block';

    requestAnimationFrame(() => {
      try {
        if (screenId === 'screen-obligations-list') {
          if (window.__OBLIGATIONS_DIRTY__) {
            window.__OBLIGATIONS_DIRTY__ = false;

            (async () => {
              try {
                const all = await obligationDB.getAll();
                Temporal.setObligations(all);

                const temporalState = Temporal.getState?.();
                window.__TEMPORAL_STATE__ = temporalState || window.__TEMPORAL_STATE__ || {
                  past: [],
                  future: [],
                  pointer: null,
                  now: new Date().toISOString()
                };

                renderObligationsList?.();
                window.refreshCurrentObligationsView?.();
              } catch (err) {
                console.error('[NAV] Obligations load error:', err);
              }
            })();
          }

          window.AppState.obligations.viewMode = 'list';
          showListMode?.();

          // 🫀 scroll to pointer when screen opens
          window.__SCROLL_TO_POINTER_ON_OPEN__ = true;
        }

        if (screenId === 'screen-add-obligation') {
          const input = document.getElementById('obligationTitle');
          if (input) {
            setTimeout(() => {
              input.focus();
            }, 80);
          }
        }

        document.dispatchEvent(new CustomEvent('screenShown', { 
          detail: screenId 
        }));

      } finally {
        navigationLockTimeout = setTimeout(() => {
          navigationLock = false;
          navigationLockTimeout = null;
        }, 50);
      }
    });
  } else {
    navigationLock = false;
  }

  if (screenId === 'screen-menu') {
    const items = document.querySelectorAll('#screen-menu .menu-item');
    items.forEach(el => {
      el.classList.remove('animate');
      void el.offsetWidth;
      el.classList.add('animate');
      el.style.opacity = '';
      el.style.transform = '';
    });
  }

  const headerTitle = document.getElementById('headerTitle');
  if (headerTitle) {
    const lang = getLang();
    const titleFn = SCREEN_TITLES[screenId];

    headerTitle.textContent =
      typeof titleFn === 'function'
        ? (titleFn(lang) || 'LifeKompas')
        : 'LifeKompas';
  }

  const headerAction = document.getElementById('headerAction');
  if (headerAction) {
    const screensWithPlus = [
      'screen-obligations-list',
      'screen-contacts'
    ];

    if (screensWithPlus.includes(screenId)) {
      headerAction.classList.remove('hidden');
    } else {
      headerAction.classList.add('hidden');
    }
  }

  if (screenId === 'screen-contacts') {
    if (typeof loadContacts === 'function') {
      loadContacts();
    }

    const lang = getLang();
    const c = I18N[lang]?.contacts || I18N.en?.contacts;

    const contactsTitle = document.getElementById('contactsTitle');
    if (contactsTitle && c) {
      contactsTitle.innerHTML =
        `<img src="images/contacts-icon.png" class="contacts-title-icon"> ${c.title}`;
    }

    const btnImport = document.getElementById('btnImportContacts');
    if (btnImport && c) btnImport.textContent = c.import;

    const btnAddContact = document.getElementById('btnAddContact');
    if (btnAddContact && c) btnAddContact.textContent = c.add;

    const searchContacts = document.getElementById('searchContacts');
    if (searchContacts && c) searchContacts.placeholder = c.search;
  }

  if (screenId === 'screen-contact-form') {
    const lang = getLang();
    const c = I18N[lang]?.contacts || I18N.en?.contacts;

    const first = document.getElementById('contactFirstName');
    if (first) first.placeholder = c.form?.firstName || '';

    const last = document.getElementById('contactLastName');
    if (last) last.placeholder = c.form?.lastName || '';

    const birth = document.getElementById('contactBirthDate');
    if (birth) birth.placeholder = c.form?.birthDate || '';

    const address = document.getElementById('contactAddress');
    if (address) address.placeholder = c.form?.address || '';

    const email = document.getElementById('contactEmail');
    if (email) email.placeholder = c.form?.email || '';

    const phone = document.getElementById('contactPhone');
    if (phone) phone.placeholder = c.form?.phone || '';

    const label = document.getElementById('contactBirthdayTimeLabel');
    if (label) label.textContent = c.form?.birthdayTime || '';

    const photo = document.getElementById('btnPickContactPhoto');
    if (photo) photo.textContent = c.form?.pickPhoto || '';

    const save = document.getElementById('saveContact');
    if (save) save.textContent = c.form?.save || '';
  }
}

window.showScreen = legacy_showScreen;
window.legacy_showScreen = legacy_showScreen;