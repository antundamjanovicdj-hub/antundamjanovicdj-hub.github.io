// ===== GLOBAL HELPERS =====

export function getLang() {
  let lang = localStorage.getItem('userLang') || 'hr';

  if (!window.I18N?.[lang]) {
    lang = lang.split('-')[0];
  }

  return lang;
}

export function getISODateFromDateTime(dateTimeStr) {
  if (!dateTimeStr) return null;
  return String(dateTimeStr).split('T')[0] || null;
}

export function todayISO() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// ===== SCREEN TITLE MAP =====

export const SCREEN_TITLES = {
  'screen-obligations-list': lang => I18N[lang].obligationsList?.title,
  'screen-shopping':         lang => I18N[lang].shopping?.title,
  'screen-contacts':         lang => I18N[lang].contacts?.title,
  'screen-finances-menu':    lang => I18N[lang].menu?.finances,

  'screen-finance-income':   lang => I18N[lang].finances?.income?.title,
  'screen-finance-fixed':    lang => I18N[lang].finances?.fixed?.title,
  'screen-finance-credits':  lang => I18N[lang].finances?.credits?.title,
  'screen-finance-other':    lang => I18N[lang].finances?.other?.title,
  'screen-finance-overview': lang => I18N[lang].finances?.overview?.title,

  'screen-add-obligation':   lang => I18N[lang].popup?.newObligationTitle,
  'screen-contact-form':     lang => I18N[lang].contacts?.form?.title,
  'screen-contact-details':  lang => I18N[lang].contacts?.details?.title,

  'screen-menu':             () => 'LifeKompas',
  'screen-lang':             () => 'LifeKompas'
};