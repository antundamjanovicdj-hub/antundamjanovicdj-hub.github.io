// core/i18n.js
const I18N = {
  hr: {
    menu: {
      obligations: "🧭 Obveze",
      shopping: "🛒 Kupovina",
      contacts: "👥 Kontakti",
      finances: "💰 Financije",
      health: "❤️ Zdravlje",
      diary: "📓 Dnevnik",
      addObligation: "➕ Dodaj obvezu",
      viewObligations: "📅 Pregled obveza"
    },
shopping: {
  title: "🛒 Kupovina",
  placeholder: "Dodaj stavku i stisni Enter",
  emptyTitle: "Nema stavki",
  emptySub: "Dodaj prvu stavku gore.",
  scanReceipt: "Unesi iznos računa",
  showArchive: "Prikaži arhivu",
  hideArchive: "Sakrij arhivu"
},
finances: {
      menu: {
        income: "💵 Unos prihoda",
        fixed: "📅 Mjesečni troškovi",
        credits: "🏦 Krediti",
        other: "🛒 Ostali troškovi",
        overview: "📊 Pregled troškova"
      },
      income: {
  title: "💵 Unos prihoda",
  dateLabel: "Datum",
  add: "Dodaj prihod",
  amountPh: "Iznos (€)",
  descPh: "Opis (npr. Plaća)"
},
      fixed: {
  title: "📅 Mjesečni troškovi",
  add: "Dodaj trošak",
  descPh: "Naziv fiksnog troška (npr. Stanarina)",
  amountPh: "Iznos (€)"
},
      credits: {
  title: "🏦 Krediti",
  add: "Dodaj kredit",
  descPh: "Naziv kredita (npr. Auto kredit)",
  amountPh: "Iznos rate (€)",
  startLabel: "Početak kredita",
  endLabel: "Završetak kredita",
  lastPaidLabel: "Zadnja uplata"
},
      other: {
  title: "🧾 Ostali troškovi",
  add: "Dodaj trošak",
  descPh: "Opis troška (npr. Gorivo)",
  amountPh: "Iznos (€)"
},
      overview: {
        title: "📊 Pregled troškova",
        calculate: "Izračunaj",
        listIncome: "Popis prihoda",
        listFixed: "Fiksni troškovi",
        listCredits: "Aktivni krediti",
        listOther: "Ostali troškovi",
        sumIncome: "Prihodi",
        sumFixed: "Mjesečni troškovi",
        sumCredits: "Krediti",
        sumOther: "Ostali troškovi",
        sumResult: "Stanje"
      }
    },
    obligation: {
  title: "Naslov obveze",
  note: "Napomena",
  dateTime: "Datum i vrijeme",
  reminder: "Podsjetnik",
  urgent: "Hitno (ignorira tihe sate)",
  quietHours: "Tihe sate",
  repeat: "Ponavljanje",
  repeatNone: "Bez ponavljanja",
  repeatDaily: "Svaki dan",
  repeatWeekly: "Svaki tjedan",
  save: "💾 Spremi",
  update: "Ažuriraj",
  cancel: "Odustani"
},
popup: {
  newObligationTitle: "➕ Nova obveza",
  newObligationSaved: "Obveza je spremljena"
},
    obligationsList: {
      title: "Moje obveze",
      total: "Ukupno",
      noObligations: "Nema obveza",
      delete: "Izbriši",
      deleteConfirm: "Obrisati obvezu?",
      edit: "Uredi",
      markDone: "✅ Obavljeno",
      markActive: "⏳ Ponovo aktivno",
      statusActive: "Aktivno",
      statusDone: "Obavljeno",
      reminder30: "30 minuta prije",
      reminder60: "1 sat prije",
      reminder120: "2 sata prije",
      reminder1440: "1 dan prije"
    },
    obligationsView: {
      byDay: "📆 Pregled po danima",
      asList: "📋 Pregled kao lista",
      selectDate: "Odaberi datum"
}
  },
  en: {
    menu: {
      obligations: "🧭 Obligations",
      shopping: "🛒 Shopping",
      contacts: "👥 Contacts",
      finances: "💰 Finances",
      health: "❤️ Health",
      diary: "📓 Diary",
      addObligation: "➕ Add obligation",
      viewObligations: "📅 View obligations"
    },
shopping: {
  title: "🛒 Shopping",
  placeholder: "Add item and press Enter",
  emptyTitle: "No items",
  emptySub: "Add your first item above.",
  scanReceipt: "Enter receipt amount",
  showArchive: "Show archive",
  hideArchive: "Hide archive"
},
finances: {
      menu: {
        income: "💵 Income",
        fixed: "📅 Monthly costs",
        credits: "🏦 Credits",
        other: "🛒 Other costs",
        overview: "📊 Costs overview"
      },
      income: {
  title: "💵 Income",
  dateLabel: "Date",
  add: "Add income",
  amountPh: "Amount (€)",
  descPh: "Description (e.g. Salary)"
},
      fixed: {
  title: "📅 Monthly costs",
  add: "Add cost",
  descPh: "Cost name (e.g. Rent)",
  amountPh: "Amount (€)"
},
      credits: {
  title: "🏦 Credits",
  add: "Add credit",
  descPh: "Credit name (e.g. Car loan)",
  amountPh: "Installment amount (€)",
startLabel: "Credit start",
endLabel: "Credit end",
lastPaidLabel: "Last payment"
},
      other: {
  title: "🧾 Other costs",
  add: "Add cost",
  descPh: "Cost description (e.g. Fuel)",
  amountPh: "Amount (€)"
},
      overview: {
        title: "📊 Costs overview",
        calculate: "Calculate",
        listIncome: "Income list",
        listFixed: "Fixed costs",
        listCredits: "Active credits",
        listOther: "Other costs",
        sumIncome: "Income",
        sumFixed: "Monthly costs",
        sumCredits: "Credits",
        sumOther: "Other costs",
        sumResult: "Balance"
      }
    },
    obligation: {
  title: "Title",
  note: "Note",
  dateTime: "Date & time",
  reminder: "Reminder",
  urgent: "Urgent (ignores quiet hours)",
  quietHours: "Quiet hours",
  repeat: "Repeat",
  repeatNone: "No repeat",
  repeatDaily: "Daily",
  repeatWeekly: "Weekly",
  save: "💾 Save",
  update: "Update",
  cancel: "Cancel"
},
popup: {
  newObligationTitle: "➕ New obligation",
  newObligationSaved: "Obligation saved"
},
    obligationsList: {
      title: "My obligations",
      total: "Total",
      noObligations: "No obligations",
      delete: "Delete",
      deleteConfirm: "Delete this obligation?",
      edit: "Edit",
      markDone: "✅ Mark done",
      markActive: "⏳ Mark active",
      statusActive: "Active",
      statusDone: "Done",
      reminder30: "30 min before",
      reminder60: "1 hour before",
      reminder120: "2 hours before",
      reminder1440: "1 day before"
    },
    obligationsView: {
      byDay: "📆 View by day",
      asList: "📋 View as list",
      selectDate: "Select date"
}
  },
  de: {
    menu: {
      obligations: "🧭 Verpflichtungen",
      shopping: "🛒 Einkaufen",
      contacts: "👥 Kontakte",
      finances: "💰 Finanzen",
      health: "❤️ Gesundheit",
      diary: "📓 Tagebuch",
      addObligation: "➕ Verpflichtung hinzufügen",
      viewObligations: "📅 Verpflichtungen anzeigen"
    },
shopping: {
  title: "🛒 Einkaufen",
  placeholder: "Artikel eingeben und Enter drücken",
  emptyTitle: "Keine Einträge",
  emptySub: "Füge oben einen Eintrag hinzu.",
  scanReceipt: "Rechnungsbetrag eingeben",
  showArchive: "Archiv anzeigen",
  hideArchive: "Archiv ausblenden"
},
finances: {
      menu: {
        income: "💵 Einkommen",
        fixed: "📅 Monatliche Kosten",
        credits: "🏦 Kredite",
        other: "🛒 Sonstige Kosten",
        overview: "📊 Kostenübersicht"
      },
      income: {
  title: "💵 Einkommen",
  dateLabel: "Datum",
  add: "Einkommen hinzufügen",
  amountPh: "Betrag (€)",
  descPh: "Beschreibung (z.B. Gehalt)"
},
      fixed: {
  title: "📅 Monatliche Kosten",
  add: "Kosten hinzufügen",
  descPh: "Name der Kosten (z.B. Miete)",
  amountPh: "Betrag (€)"
},
      credits: {
  title: "🏦 Kredite",
  add: "Kredit hinzufügen",
  descPh: "Kreditname (z.B. Autokredit)",
  amountPh: "Ratenbetrag (€)",
startLabel: "Kreditbeginn",
endLabel: "Kreditende",
lastPaidLabel: "Letzte Zahlung"
},
      other: {
  title: "🧾 Sonstige Kosten",
  add: "Kosten hinzufügen",
  descPh: "Kostenbeschreibung (z.B. Kraftstoff)",
  amountPh: "Betrag (€)"
},
      overview: {
        title: "📊 Kostenübersicht",
        calculate: "Berechnen",
        listIncome: "Einkommensliste",
        listFixed: "Fixkosten",
        listCredits: "Aktive Kredite",
        listOther: "Sonstige Kosten",
        sumIncome: "Einnahmen",
        sumFixed: "Monatliche Kosten",
        sumCredits: "Kredite",
        sumOther: "Sonstige Kosten",
        sumResult: "Saldo"
      }
    },
    obligation: {
  title: "Titel",
  note: "Notiz",
  dateTime: "Datum & Uhrzeit",
  reminder: "Erinnerung",
  urgent: "Dringend (ignoriert Ruhezeiten)",
  quietHours: "Ruhezeiten",
  repeat: "Wiederholung",
  repeatNone: "Keine Wiederholung",
  repeatDaily: "Täglich",
  repeatWeekly: "Wöchentlich",
  save: "💾 Speichern",
  update: "Aktualisieren",
  cancel: "Abbrechen"
},
popup: {
  newObligationTitle: "➕ Neue Verpflichtung",
  newObligationSaved: "Verpflichtung gespeichert"
},
    obligationsList: {
      title: "Meine Verpflichtungen",
      total: "Gesamt",
      noObligations: "Keine Verpflichtungen",
      delete: "Löschen",
      deleteConfirm: "Diese Verpflichtung löschen?",
      edit: "Bearbeiten",
      markDone: "✅ Erledigt",
      markActive: "⏳ Wieder aktiv",
      statusActive: "Aktiv",
      statusDone: "Erledigt",
      reminder30: "30 Min. vorher",
      reminder60: "1 Std. vorher",
      reminder120: "2 Std. vorher",
      reminder1440: "1 Tag vorher"
    },
    obligationsView: {
      byDay: "📆 Nach Tagen",
      asList: "📋 Als Liste anzeigen",
      selectDate: "Datum auswählen"
}
  },
  ru: {
    menu: {
      obligations: "🧭 Обязанности",
      shopping: "🛒 Покупки",
      contacts: "👥 Контакты",
      finances: "💰 Финансы",
      health: "❤️ Здоровье",
      diary: "📓 Дневник",
      addObligation: "➕ Добавить обязанность",
      viewObligations: "📅 Просмотр обязанностей"
    },
shopping: {
  title: "🛒 Покупки",
  placeholder: "Добавьте товар и нажмите Enter",
  emptyTitle: "Нет товаров",
  emptySub: "Добавьте первый товар выше.",
  scanReceipt: "Ввести сумму чека",
  showArchive: "Показать архив",
  hideArchive: "Скрыть архив"
},
finances: {
      menu: {
        income: "💵 Доходы",
        fixed: "📅 Ежемесячные расходы",
        credits: "🏦 Кредиты",
        other: "🛒 Прочие расходы",
        overview: "📊 Обзор расходов"
      },
      income: {
  title: "💵 Доходы",
  dateLabel: "Дата",
  add: "Добавить доход",
  amountPh: "Сумма (€)",
  descPh: "Описание (например, зарплата)"
},
      fixed: {
  title: "📅 Ежемесячные расходы",
  add: "Добавить расход",
  descPh: "Название расхода (например, аренда)",
  amountPh: "Сумма (€)"
},
      credits: {
  title: "🏦 Кредиты",
  add: "Добавить кредит",
  descPh: "Название кредита (например, автокредит)",
  amountPh: "Сумма платежа (€)",
startLabel: "Начало кредита",
endLabel: "Окончание кредита",
lastPaidLabel: "Последний платеж"
},
      other: {
  title: "🧾 Прочие расходы",
  add: "Добавить расход",
  descPh: "Описание расхода (например, топливо)",
  amountPh: "Сумма (€)"
},
      overview: {
        title: "📊 Обзор расходов",
        calculate: "Рассчитать",
        listIncome: "Список доходов",
        listFixed: "Фиксированные расходы",
        listCredits: "Активные кредиты",
        listOther: "Прочие расходы",
        sumIncome: "Доходы",
        sumFixed: "Ежемесячные расходы",
        sumCredits: "Кредиты",
        sumOther: "Прочие расходы",
        sumResult: "Баланс"
      }
    },
    obligation: {
  title: "Название",
  note: "Заметка",
  dateTime: "Дата и время",
  reminder: "Напоминание",
  urgent: "Срочно (игнорирует тихие часы)",
  quietHours: "Тихие часы",
  repeat: "Повтор",
  repeatNone: "Без повтора",
  repeatDaily: "Ежедневно",
  repeatWeekly: "Еженедельно",
  save: "💾 Сохранить",
  update: "Обновить",
  cancel: "Отмена"
},
popup: {
  newObligationTitle: "➕ Новая обязанность",
  newObligationSaved: "Обязанность сохранена"
},
    obligationsList: {
      title: "Мои обязанности",
      total: "Всего",
      noObligations: "Нет обязанностей",
      delete: "Удалить",
      deleteConfirm: "Удалить эту обязанность?",
      edit: "Редактировать",
      markDone: "✅ Выполнено",
      markActive: "⏳ Снова активно",
      statusActive: "Активно",
      statusDone: "Выполнено",
      reminder30: "За 30 мин",
      reminder60: "За 1 час",
      reminder120: "За 2 часа",
      reminder1440: "За 1 день"
    },
    obligationsView: {
      byDay: "📆 По дням",
      asList: "📋 Список",
      selectDate: "Выберите дату"
}
  },
  pt: {
    menu: {
      obligations: "🧭 Obrigações",
      shopping: "🛒 Compras",
      contacts: "👥 Contatos",
      finances: "💰 Finanças",
      health: "❤️ Saúde",
      diary: "📓 Diário",
      addObligation: "➕ Adicionar obrigação",
      viewObligations: "📅 Ver obrigações"
    },
shopping: {
  title: "🛒 Compras",
  placeholder: "Adicione item e pressione Enter",
  emptyTitle: "Sem itens",
  emptySub: "Adicione o primeiro item acima.",
  scanReceipt: "Inserir valor do recibo",
  showArchive: "Mostrar arquivo",
  hideArchive: "Ocultar arquivo"
},
finances: {
      menu: {
        income: "💵 Rendimentos",
        fixed: "📅 Custos mensais",
        credits: "🏦 Créditos",
        other: "🛒 Outros custos",
        overview: "📊 Visão geral de custos"
      },
      income: {
  title: "💵 Rendimentos",
  dateLabel: "Data",
  add: "Adicionar rendimento",
  amountPh: "Valor (€)",
  descPh: "Descrição (ex. Salário)"
},
      fixed: {
  title: "📅 Custos mensais",
  add: "Adicionar custo",
  descPh: "Nome do custo (ex. Renda)",
  amountPh: "Valor (€)"
},
      credits: {
  title: "🏦 Créditos",
  add: "Adicionar crédito",
  descPh: "Nome do crédito (ex. Empréstimo carro)",
  amountPh: "Valor da parcela (€)",
startLabel: "Início do crédito",
endLabel: "Fim do crédito",
lastPaidLabel: "Último pagamento"
},
      other: {
  title: "🧾 Outros custos",
  add: "Adicionar custo",
  descPh: "Descrição do custo (ex. Combustível)",
  amountPh: "Valor (€)"
},
      overview: {
        title: "📊 Visão geral de custos",
        calculate: "Calcular",
        listIncome: "Lista de rendimentos",
        listFixed: "Custos fixos",
        listCredits: "Créditos ativos",
        listOther: "Outros custos",
        sumIncome: "Rendimentos",
        sumFixed: "Custos mensais",
        sumCredits: "Créditos",
        sumOther: "Outros custos",
        sumResult: "Saldo"
      }
    },
    obligation: {
  title: "Título",
  note: "Nota",
  dateTime: "Data e hora",
  reminder: "Lembrete",
  urgent: "Urgente (ignora horas silenciosas)",
  quietHours: "Horas silenciosas",
  repeat: "Repetir",
  repeatNone: "Sem repetição",
  repeatDaily: "Diariamente",
  repeatWeekly: "Semanalmente",
  save: "💾 Salvar",
  update: "Atualizar",
  cancel: "Cancelar"
},
popup: {
  newObligationTitle: "➕ Nova obrigação",
  newObligationSaved: "Obrigação salva"
},
    obligationsList: {
      title: "Minhas obrigações",
      total: "Total",
      noObligations: "Sem obrigações",
      delete: "Excluir",
      deleteConfirm: "Excluir esta obrigação?",
      edit: "Editar",
      markDone: "✅ Concluído",
      markActive: "⏳ Tornar ativo",
      statusActive: "Ativo",
      statusDone: "Concluído",
      reminder30: "30 min antes",
      reminder60: "1 hora antes",
      reminder120: "2 horas antes",
      reminder1440: "1 dia antes"
    },
    obligationsView: {
    byDay: "📆 Ver por dia",
    asList: "📋 Ver como lista",
    selectDate: "Selecionar data"
}
  },
  tr: {
    menu: {
      obligations: "🧭 Yükümlülükler",
      shopping: "🛒 Alışveriş",
      contacts: "👥 Kişiler",
      finances: "💰 Finanslar",
      health: "❤️ Sağlık",
      diary: "📓 Günlük",
      addObligation: "➕ Yükümlülük ekle",
      viewObligations: "📅 Yükümlülükleri görüntüle"
    },
shopping: {
  title: "🛒 Alışveriş",
  placeholder: "Öğe ekle ve Enter'a bas",
  emptyTitle: "Öğe yok",
  emptySub: "Yukarıdan ilk öğeyi ekle.",
  scanReceipt: "Fiş tutarı gir",
  showArchive: "Arşivi göster",
  hideArchive: "Arşivi gizle"
},
finances: {
      menu: {
        income: "💵 Gelir",
        fixed: "📅 Aylık giderler",
        credits: "🏦 Krediler",
        other: "🛒 Diğer giderler",
        overview: "📊 Gider özeti"
      },
      income: {
  title: "💵 Gelir",
  dateLabel: "Tarih",
  add: "Gelir ekle",
  amountPh: "Tutar (€)",
  descPh: "Açıklama (örn. Maaş)"
},
      fixed: {
  title: "📅 Aylık giderler",
  add: "Gider ekle",
  descPh: "Gider adı (örn. Kira)",
  amountPh: "Tutar (€)"
},
      credits: {
  title: "🏦 Krediler",
  add: "Kredi ekle",
  descPh: "Kredi adı (örn. Araba kredisi)",
  amountPh: "Taksit tutarı (€)",
startLabel: "Kredi başlangıcı",
endLabel: "Kredi bitişi",
lastPaidLabel: "Son ödeme"
},
      other: {
  title: "🧾 Diğer giderler",
  add: "Gider ekle",
  descPh: "Gider açıklaması (örn. Yakıt)",
  amountPh: "Tutar (€)"
},
      overview: {
        title: "📊 Gider özeti",
        calculate: "Hesapla",
        listIncome: "Gelir listesi",
        listFixed: "Sabit giderler",
        listCredits: "Aktif krediler",
        listOther: "Diğer giderler",
        sumIncome: "Gelirler",
        sumFixed: "Aylık giderler",
        sumCredits: "Krediler",
        sumOther: "Diğer giderler",
        sumResult: "Bakiye"
      }
    },
    obligation: {
  title: "Başlık",
  note: "Not",
  dateTime: "Tarih ve saat",
  reminder: "Hatırlatma",
  urgent: "Acil (sessiz saatleri yok sayar)",
  quietHours: "Sessiz saatler",
  repeat: "Tekrar",
  repeatNone: "Tekrar yok",
  repeatDaily: "Günlük",
  repeatWeekly: "Haftalık",
  save: "💾 Kaydet",
  update: "Güncelle",
  cancel: "İptal"
},
popup: {
  newObligationTitle: "➕ Yeni yükümlülük",
  newObligationSaved: "Yükümlülük kaydedildi"
},
    obligationsList: {
      title: "Yükümlülüklerim",
      total: "Toplam",
      noObligations: "Yükümlülük yok",
      delete: "Sil",
      deleteConfirm: "Bu yükümlülüğü sil?",
      edit: "Düzenle",
      markDone: "✅ Tamamlandı",
      markActive: "⏳ Tekrar aktif",
      statusActive: "Aktif",
      statusDone: "Tamamlandı",
      reminder30: "30 dk önce",
      reminder60: "1 saat önce",
      reminder120: "2 saat önce",
      reminder1440: "1 gün önce"
    },
    obligationsView: {
    byDay: "📆 Güne göre",
    asList: "📋 Liste olarak",
    selectDate: "Tarih seç"
}
  },
   fr: {
  menu: {
    obligations: "🧭 Obligations",
    shopping: "🛒 Courses",
    contacts: "👥 Contacts",
    finances: "💰 Finances",
    health: "❤️ Santé",
    diary: "📓 Journal",
    addObligation: "➕ Ajouter obligation",
    viewObligations: "📅 Voir obligations"
  },

  shopping: {
  title: "🛒 Courses",
  placeholder: "Ajouter un article et appuyer sur Entrée",
  emptyTitle: "Aucun article",
  emptySub: "Ajoutez le premier article ci-dessus.",
  scanReceipt: "Entrer le montant du ticket",
  showArchive: "Afficher archive",
  hideArchive: "Masquer archive"
},

obligation: {
  title: "Titre",
  note: "Note",
  dateTime: "Date et heure",
  reminder: "Rappel",
  urgent: "Urgent (ignore les heures silencieuses)",
  quietHours: "Heures silencieuses",
  repeat: "Répétition",
  repeatNone: "Aucune répétition",
  repeatDaily: "Chaque jour",
  repeatWeekly: "Chaque semaine",
  save: "💾 Enregistrer",
  update: "Mettre à jour",
  cancel: "Annuler"
},
popup: {
  newObligationTitle: "➕ Nouvelle obligation",
  newObligationSaved: "Obligation enregistrée"
},
obligationsList: {
  title: "Mes obligations",
  total: "Total",
  noObligations: "Aucune obligation",
  delete: "Supprimer",
  deleteConfirm: "Supprimer cette obligation ?",
  edit: "Modifier",
  markDone: "✅ Terminé",
  markActive: "⏳ Revenir actif",
  statusActive: "Actif",
  statusDone: "Terminé",
  reminder30: "30 min avant",
  reminder60: "1 heure avant",
  reminder120: "2 heures avant",
  reminder1440: "1 jour avant"
},
obligationsView: {
  byDay: "📆 Par jour",
  asList: "📋 Voir en liste",
  selectDate: "Choisir une date"
},

  finances: {
  menu: {
    income: "💵 Revenus",
    fixed: "📅 Dépenses mensuelles",
    credits: "🏦 Crédits",
    other: "🛒 Autres dépenses",
    overview: "📊 Aperçu des dépenses"
  },

  income: {
    title: "💵 Revenus",
    dateLabel: "Date",
    add: "Ajouter revenu",
    amountPh: "Montant (€)",
    descPh: "Description (ex. Salaire)"
  },

  fixed: {
    title: "📅 Dépenses mensuelles",
    add: "Ajouter dépense",
    descPh: "Nom de la dépense (ex. Loyer)",
    amountPh: "Montant (€)"
  },

  credits: {
    title: "🏦 Crédits",
    add: "Ajouter crédit",
    descPh: "Nom du crédit (ex. Prêt auto)",
    amountPh: "Montant de la mensualité (€)",
    startLabel: "Début du crédit",
    endLabel: "Fin du crédit",
    lastPaidLabel: "Dernier paiement"
  },

  other: {
    title: "🧾 Autres dépenses",
    add: "Ajouter dépense",
    descPh: "Description (ex. Carburant)",
    amountPh: "Montant (€)"
  },

  overview: {
    title: "📊 Aperçu des dépenses",
    calculate: "Calculer",
    listIncome: "Liste des revenus",
    listFixed: "Dépenses fixes",
    listCredits: "Crédits actifs",
    listOther: "Autres dépenses",
    sumIncome: "Revenus",
    sumFixed: "Dépenses mensuelles",
    sumCredits: "Crédits",
    sumOther: "Autres dépenses",
    sumResult: "Solde"
  }
}
},

es: {
  menu: {
    obligations: "🧭 Obligaciones",
    shopping: "🛒 Compras",
    contacts: "👥 Contactos",
    finances: "💰 Finanzas",
    health: "❤️ Salud",
    diary: "📓 Diario",
    addObligation: "➕ Añadir obligación",
    viewObligations: "📅 Ver obligaciones"
  },

  shopping: {
  title: "🛒 Compras",
  placeholder: "Añadir artículo y pulsar Enter",
  emptyTitle: "Sin artículos",
  emptySub: "Añade el primer artículo arriba.",
  scanReceipt: "Introducir importe del ticket",
  showArchive: "Mostrar archivo",
  hideArchive: "Ocultar archivo"
},

obligation: {
  title: "Título",
  note: "Nota",
  dateTime: "Fecha y hora",
  reminder: "Recordatorio",
  urgent: "Urgente (ignora horas silenciosas)",
  quietHours: "Horas silenciosas",
  repeat: "Repetición",
  repeatNone: "Sin repetición",
  repeatDaily: "Cada día",
  repeatWeekly: "Cada semana",
  save: "💾 Guardar",
  update: "Actualizar",
  cancel: "Cancelar"
},
popup: {
  newObligationTitle: "➕ Nueva obligación",
  newObligationSaved: "Obligación guardada"
},
obligationsList: {
  title: "Mis obligaciones",
  total: "Total",
  noObligations: "Sin obligaciones",
  delete: "Eliminar",
  deleteConfirm: "¿Eliminar esta obligación?",
  edit: "Editar",
  markDone: "✅ Hecho",
  markActive: "⏳ Volver activo",
  statusActive: "Activo",
  statusDone: "Hecho",
  reminder30: "30 min antes",
  reminder60: "1 hora antes",
  reminder120: "2 horas antes",
  reminder1440: "1 día antes"
},
obligationsView: {
  byDay: "📆 Por día",
  asList: "📋 Ver como lista",
  selectDate: "Seleccionar fecha"
},

  finances: {
  menu: {
    income: "💵 Ingresos",
    fixed: "📅 Gastos mensuales",
    credits: "🏦 Créditos",
    other: "🛒 Otros gastos",
    overview: "📊 Resumen de gastos"
  },

  income: {
    title: "💵 Ingresos",
    dateLabel: "Fecha",
    add: "Añadir ingreso",
    amountPh: "Importe (€)",
    descPh: "Descripción (ej. Salario)"
  },

  fixed: {
    title: "📅 Gastos mensuales",
    add: "Añadir gasto",
    descPh: "Nombre del gasto (ej. Alquiler)",
    amountPh: "Importe (€)"
  },

  credits: {
    title: "🏦 Créditos",
    add: "Añadir crédito",
    descPh: "Nombre del crédito (ej. Préstamo coche)",
    amountPh: "Cuota (€)",
    startLabel: "Inicio del crédito",
    endLabel: "Fin del crédito",
    lastPaidLabel: "Último pago"
  },

  other: {
    title: "🧾 Otros gastos",
    add: "Añadir gasto",
    descPh: "Descripción (ej. Combustible)",
    amountPh: "Importe (€)"
  },

  overview: {
    title: "📊 Resumen de gastos",
    calculate: "Calcular",
    listIncome: "Lista de ingresos",
    listFixed: "Gastos fijos",
    listCredits: "Créditos activos",
    listOther: "Otros gastos",
    sumIncome: "Ingresos",
    sumFixed: "Gastos mensuales",
    sumCredits: "Créditos",
    sumOther: "Otros gastos",
    sumResult: "Saldo"
  }
}
},

hu: {
  menu: {
    obligations: "🧭 Kötelezettségek",
    shopping: "🛒 Bevásárlás",
    contacts: "👥 Kapcsolatok",
    finances: "💰 Pénzügyek",
    health: "❤️ Egészség",
    diary: "📓 Napló",
    addObligation: "➕ Kötelezettség hozzáadása",
    viewObligations: "📅 Kötelezettségek"
  },

  shopping: {
  title: "🛒 Bevásárlás",
  placeholder: "Adj hozzá elemet és nyomj Entert",
  emptyTitle: "Nincs elem",
  emptySub: "Add hozzá az első elemet fent.",
  scanReceipt: "Számla összeg megadása",
  showArchive: "Archívum mutatása",
  hideArchive: "Archívum elrejtése"
},

obligation: {
  title: "Cím",
  note: "Megjegyzés",
  dateTime: "Dátum és idő",
  reminder: "Emlékeztető",
  urgent: "Sürgős (figyelmen kívül hagyja a csendes órákat)",
  quietHours: "Csendes órák",
  repeat: "Ismétlés",
  repeatNone: "Nincs ismétlés",
  repeatDaily: "Minden nap",
  repeatWeekly: "Minden héten",
  save: "💾 Mentés",
  update: "Frissítés",
  cancel: "Mégse"
},
popup: {
  newObligationTitle: "➕ Új kötelezettség",
  newObligationSaved: "Kötelezettség elmentve"
},
obligationsList: {
  title: "Kötelezettségeim",
  total: "Összesen",
  noObligations: "Nincs kötelezettség",
  delete: "Törlés",
  deleteConfirm: "Törlöd a kötelezettséget?",
  edit: "Szerkesztés",
  markDone: "✅ Kész",
  markActive: "⏳ Újra aktív",
  statusActive: "Aktív",
  statusDone: "Kész",
  reminder30: "30 perccel előtte",
  reminder60: "1 órával előtte",
  reminder120: "2 órával előtte",
  reminder1440: "1 nappal előtte"
},
obligationsView: {
  byDay: "📆 Napi nézet",
  asList: "📋 Lista nézet",
  selectDate: "Dátum kiválasztása"
},

  finances: {
  menu: {
    income: "💵 Bevétel",
    fixed: "📅 Havi költségek",
    credits: "🏦 Hitelek",
    other: "🛒 Egyéb költségek",
    overview: "📊 Költség áttekintés"
  },

  income: {
    title: "💵 Bevétel",
    dateLabel: "Dátum",
    add: "Bevétel hozzáadása",
    amountPh: "Összeg (€)",
    descPh: "Leírás (pl. Fizetés)"
  },

  fixed: {
    title: "📅 Havi költségek",
    add: "Költség hozzáadása",
    descPh: "Költség neve (pl. Lakbér)",
    amountPh: "Összeg (€)"
  },

  credits: {
    title: "🏦 Hitelek",
    add: "Hitel hozzáadása",
    descPh: "Hitel neve (pl. Autóhitel)",
    amountPh: "Részlet összege (€)",
    startLabel: "Hitel kezdete",
    endLabel: "Hitel vége",
    lastPaidLabel: "Utolsó befizetés"
  },

  other: {
    title: "🧾 Egyéb költségek",
    add: "Költség hozzáadása",
    descPh: "Leírás (pl. Üzemanyag)",
    amountPh: "Összeg (€)"
  },

  overview: {
    title: "📊 Költség áttekintés",
    calculate: "Számítás",
    listIncome: "Bevételek listája",
    listFixed: "Fix költségek",
    listCredits: "Aktív hitelek",
    listOther: "Egyéb költségek",
    sumIncome: "Bevételek",
    sumFixed: "Havi költségek",
    sumCredits: "Hitelek",
    sumOther: "Egyéb költségek",
    sumResult: "Egyenleg"
  }
}
},

it: {
  menu: {
    obligations: "🧭 Obblighi",
    shopping: "🛒 Spesa",
    contacts: "👥 Contatti",
    finances: "💰 Finanze",
    health: "❤️ Salute",
    diary: "📓 Diario",
    addObligation: "➕ Aggiungi obbligo",
    viewObligations: "📅 Vedi obblighi"
  },

  shopping: {
  title: "🛒 Spesa",
  placeholder: "Aggiungi articolo e premi Invio",
  emptyTitle: "Nessun articolo",
  emptySub: "Aggiungi il primo articolo sopra.",
  scanReceipt: "Inserisci importo scontrino",
  showArchive: "Mostra archivio",
  hideArchive: "Nascondi archivio"
},

obligation: {
  title: "Titolo",
  note: "Nota",
  dateTime: "Data e ora",
  reminder: "Promemoria",
  urgent: "Urgente (ignora le ore silenziose)",
  quietHours: "Ore silenziose",
  repeat: "Ripetizione",
  repeatNone: "Nessuna ripetizione",
  repeatDaily: "Ogni giorno",
  repeatWeekly: "Ogni settimana",
  save: "💾 Salva",
  update: "Aggiorna",
  cancel: "Annulla"
},
popup: {
  newObligationTitle: "➕ Nuovo obbligo",
  newObligationSaved: "Obbligo salvato"
},
obligationsList: {
  title: "I miei obblighi",
  total: "Totale",
  noObligations: "Nessun obbligo",
  delete: "Elimina",
  deleteConfirm: "Eliminare questo obbligo?",
  edit: "Modifica",
  markDone: "✅ Completato",
  markActive: "⏳ Di nuovo attivo",
  statusActive: "Attivo",
  statusDone: "Completato",
  reminder30: "30 min prima",
  reminder60: "1 ora prima",
  reminder120: "2 ore prima",
  reminder1440: "1 giorno prima"
},
obligationsView: {
  byDay: "📆 Per giorno",
  asList: "📋 Vista elenco",
  selectDate: "Seleziona data"
},

  finances: {
  menu: {
    income: "💵 Entrate",
    fixed: "📅 Costi mensili",
    credits: "🏦 Crediti",
    other: "🛒 Altri costi",
    overview: "📊 Riepilogo costi"
  },

  income: {
    title: "💵 Entrate",
    dateLabel: "Data",
    add: "Aggiungi entrata",
    amountPh: "Importo (€)",
    descPh: "Descrizione (es. Stipendio)"
  },

  fixed: {
    title: "📅 Costi mensili",
    add: "Aggiungi costo",
    descPh: "Nome del costo (es. Affitto)",
    amountPh: "Importo (€)"
  },

  credits: {
    title: "🏦 Crediti",
    add: "Aggiungi credito",
    descPh: "Nome del credito (es. Prestito auto)",
    amountPh: "Rata (€)",
    startLabel: "Inizio credito",
    endLabel: "Fine credito",
    lastPaidLabel: "Ultimo pagamento"
  },

  other: {
    title: "🧾 Altri costi",
    add: "Aggiungi costo",
    descPh: "Descrizione (es. Carburante)",
    amountPh: "Importo (€)"
  },

  overview: {
    title: "📊 Riepilogo costi",
    calculate: "Calcola",
    listIncome: "Lista entrate",
    listFixed: "Costi fissi",
    listCredits: "Crediti attivi",
    listOther: "Altri costi",
    sumIncome: "Entrate",
    sumFixed: "Costi mensili",
    sumCredits: "Crediti",
    sumOther: "Altri costi",
    sumResult: "Saldo"
    }
   }
  }

};

I18N.hr.lang = 'hr-HR';
I18N.en.lang = 'en-US';
I18N.de.lang = 'de-DE';
I18N.ru.lang = 'ru-RU';
I18N.pt.lang = 'pt-PT';
I18N.tr.lang = 'tr-TR';
I18N.fr.lang = 'fr-FR';
I18N.es.lang = 'es-ES';
I18N.it.lang = 'it-IT';
I18N.hu.lang = 'hu-HU';

window.I18N = I18N;