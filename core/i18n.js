// core/i18n.js
const I18N = {
  hr: {
    contacts: {
      title: "Kontakti",
      import: "📥 Uvezi iz imenika",
      add: "➕ Dodaj kontakt",
      search: "Pretraži...",
      form: {
        title: "Novi kontakt",
        firstName: "Ime",
        lastName: "Prezime",
        birthDate: "Datum rođenja",
        birthdayTime: "Vrijeme rođendanske notifikacije",
        address: "Adresa",
        email: "E-mail",
        phone: "Telefon",
        pickPhoto: "Odaberi sliku",
        save: "Spremi kontakt"
      },
      details: {
        title: "👤 Kontakt",
        edit: "Uredi kontakt",
        delete: "Obriši kontakt",
        birthdayNotify: "Rođendanska notifikacija"
      },
      messages: {
        importDone: "Import završen",
        noPermission: "Dozvola za kontakte nije dana",
        noContacts: "Nema dostupnih kontakata",
        error: "Greška",
        deleteConfirm: "Obrisati kontakt?",
        enterName: "Unesi ime i prezime"
      }
    },
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
      emptyTitle: "Još nema obveza",
      emptySub: "Dodaj prvu obvezu i rastereti glavu. LifeKompas će pamtiti umjesto tebe.",
      delete: "Izbriši",
      deleteConfirm: "Obrisati obvezu?",
      edit: "Uredi",
      markDone: "✅ Obavljeno",
      markActive: "⏳ Ponovo aktivno",
      statusActive: "Aktivno",
      statusDone: "Obavljeno",
      reminder0: "U trenutku obveze",
      reminder15: "15 minuta prije",
      reminder30: "30 minuta prije",
      reminder60: "1 sat prije",
      reminder120: "2 sata prije",
      reminder1440: "1 dan prije"
    },
    obligationsView: {
      byDay: "📆 Pregled po danima",
      asList: "📋 Pregled kao lista",
      selectDate: "Odaberi datum"
    },
    health: {
      title: "❤️ Zdravlje",
      add: "➕ Dodaj zdravstveni zapis",
      noRecords: "Nema zdravstvenih zapisa",
      symptoms: "Simptomi",
      medication: "Lijekovi",
      notes: "Bilješke",
      save: "Spremi zapis"
    },
    diary: {
      title: "📓 Dnevnik",
      add: "➕ Dodaj zapis",
      noEntries: "Nema zapisa u dnevniku",
      placeholder: "Napiši svoje misli...",
      save: "Spremi zapis"
    }
  },
  en: {
    contacts: {
      title: "Contacts",
      import: "📥 Import from phonebook",
      add: "➕ Add contact",
      search: "Search...",
      form: {
        title: "New contact",
        firstName: "First name",
        lastName: "Last name",
        birthDate: "Birth date",
        birthdayTime: "Birthday notification time",
        address: "Address",
        email: "E-mail",
        phone: "Phone",
        pickPhoto: "Choose photo",
        save: "Save contact"
      },
      details: {
        title: "👤 Contact",
        edit: "Edit contact",
        delete: "Delete contact",
        birthdayNotify: "Birthday notification"
      },
      messages: {
        importDone: "Import finished",
        noPermission: "Permission for contacts not granted",
        noContacts: "No contacts available",
        error: "Error",
        deleteConfirm: "Delete contact?",
        enterName: "Enter first and last name"
      }
    },
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
      emptyTitle: "No obligations yet",
      emptySub: "Add your first obligation and clear your mind. LifeKompas will remember for you.",
      delete: "Delete",
      deleteConfirm: "Delete this obligation?",
      edit: "Edit",
      markDone: "✅ Mark done",
      markActive: "⏳ Mark active",
      statusActive: "Active",
      statusDone: "Done",
      reminder0: "At time of obligation",
      reminder15: "15 minutes before",
      reminder30: "30 min before",
      reminder60: "1 hour before",
      reminder120: "2 hours before",
      reminder1440: "1 day before"
    },
    obligationsView: {
      byDay: "📆 View by day",
      asList: "📋 View as list",
      selectDate: "Select date"
    },
    health: {
      title: "❤️ Health",
      add: "➕ Add health record",
      noRecords: "No health records",
      symptoms: "Symptoms",
      medication: "Medication",
      notes: "Notes",
      save: "Save record"
    },
    diary: {
      title: "📓 Diary",
      add: "➕ Add entry",
      noEntries: "No diary entries",
      placeholder: "Write your thoughts...",
      save: "Save entry"
    }
  },

  de: {
    contacts: {
      title: "Kontakte",
      import: "📥 Aus Telefonbuch importieren",
      add: "➕ Kontakt hinzufügen",
      search: "Suchen...",
      form: {
        title: "Neuer Kontakt",
        firstName: "Vorname",
        lastName: "Nachname",
        birthDate: "Geburtsdatum",
        birthdayTime: "Zeit der Geburtstagsbenachrichtigung",
        address: "Adresse",
        email: "E-Mail",
        phone: "Telefon",
        pickPhoto: "Bild auswählen",
        save: "Kontakt speichern"
      },
      details: {
        title: "👤 Kontakt",
        edit: "Kontakt bearbeiten",
        delete: "Kontakt löschen",
        birthdayNotify: "Geburtstagsbenachrichtigung"
      },
      messages: {
        importDone: "Import abgeschlossen",
        noPermission: "Keine Berechtigung für Kontakte",
        noContacts: "Keine Kontakte verfügbar",
        error: "Fehler",
        deleteConfirm: "Kontakt löschen?",
        enterName: "Vor- und Nachname eingeben"
      }
    },
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
      reminder0: "Zum Zeitpunkt der Verpflichtung",
      reminder15: "15 Minuten vorher",
      reminder30: "30 Min. vorher",
      reminder60: "1 Std. vorher",
      reminder120: "2 Std. vorher",
      reminder1440: "1 Tag vorher"
    },
    obligationsView: {
      byDay: "📆 Nach Tagen",
      asList: "📋 Als Liste anzeigen",
      selectDate: "Datum auswählen"
    },
    health: {
      title: "❤️ Gesundheit",
      add: "➕ Gesundheitseintrag hinzufügen",
      noRecords: "Keine Gesundheitseinträge",
      symptoms: "Symptome",
      medication: "Medikamente",
      notes: "Notizen",
      save: "Eintrag speichern"
    },
    diary: {
      title: "📓 Tagebuch",
      add: "➕ Eintrag hinzufügen",
      noEntries: "Keine Tagebucheinträge",
      placeholder: "Schreibe deine Gedanken...",
      save: "Eintrag speichern"
    }
  },
  ru: {
    contacts: {
      title: "Контакты",
      import: "📥 Импорт из телефонной книги",
      add: "➕ Добавить контакт",
      search: "Поиск...",
      form: {
        title: "Новый контакт",
        firstName: "Имя",
        lastName: "Фамилия",
        birthDate: "Дата рождения",
        birthdayTime: "Время уведомления о дне рождения",
        address: "Адрес",
        email: "E-mail",
        phone: "Телефон",
        pickPhoto: "Выбрать изображение",
        save: "Сохранить контакт"
      },
      details: {
        title: "👤 Контакт",
        edit: "Редактировать контакт",
        delete: "Удалить контакт",
        birthdayNotify: "Уведомление о дне рождения"
      },
      messages: {
        importDone: "Импорт завершен",
        noPermission: "Нет разрешения на доступ к контактам",
        noContacts: "Нет доступных контактов",
        error: "Ошибка",
        deleteConfirm: "Удалить контакт?",
        enterName: "Введите имя и фамилию"
      }
    },
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
    },
    health: {
      title: "❤️ Здоровье",
      add: "➕ Добавить запись о здоровье",
      noRecords: "Нет записей о здоровье",
      symptoms: "Симптомы",
      medication: "Лекарства",
      notes: "Заметки",
      save: "Сохранить запись"
    },
    diary: {
      title: "📓 Дневник",
      add: "➕ Добавить запись",
      noEntries: "Нет записей в дневнике",
      placeholder: "Напишите свои мысли...",
      save: "Сохранить запись"
    }
  },
  pt: {
    contacts: {
      title: "Contatos",
      import: "📥 Importar da agenda",
      add: "➕ Adicionar contato",
      search: "Pesquisar...",
      form: {
        title: "Novo contato",
        firstName: "Nome",
        lastName: "Sobrenome",
        birthDate: "Data de nascimento",
        birthdayTime: "Hora da notificação de aniversário",
        address: "Endereço",
        email: "E-mail",
        phone: "Telefone",
        pickPhoto: "Escolher imagem",
        save: "Salvar contato"
      },
      details: {
        title: "👤 Contato",
        edit: "Editar contato",
        delete: "Excluir contato",
        birthdayNotify: "Notificação de aniversário"
      },
      messages: {
        importDone: "Importação concluída",
        noPermission: "Permissão para contatos não concedida",
        noContacts: "Nenhum contato disponível",
        error: "Erro",
        deleteConfirm: "Excluir contato?",
        enterName: "Digite nome e sobrenome"
      }
    },
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
    },
    health: {
      title: "❤️ Saúde",
      add: "➕ Adicionar registro de saúde",
      noRecords: "Nenhum registro de saúde",
      symptoms: "Sintomas",
      medication: "Medicação",
      notes: "Notas",
      save: "Salvar registro"
    },
    diary: {
      title: "📓 Diário",
      add: "➕ Adicionar entrada",
      noEntries: "Nenhuma entrada no diário",
      placeholder: "Escreva seus pensamentos...",
      save: "Salvar entrada"
    }
  },
  tr: {
    contacts: {
      title: "Kişiler",
      import: "📥 Rehberden içe aktar",
      add: "➕ Kişi ekle",
      search: "Ara...",
      form: {
        title: "Yeni kişi",
        firstName: "Ad",
        lastName: "Soyad",
        birthDate: "Doğum tarihi",
        birthdayTime: "Doğum günü bildirim saati",
        address: "Adres",
        email: "E-mail",
        phone: "Telefon",
        pickPhoto: "Resim seç",
        save: "Kişiyi kaydet"
      },
      details: {
        title: "👤 Kişi",
        edit: "Kişiyi düzenle",
        delete: "Kişiyi sil",
        birthdayNotify: "Doğum günü bildirimi"
      },
      messages: {
        importDone: "İçe aktarma tamamlandı",
        noPermission: "Kişilere erişim izni verilmedi",
        noContacts: "Kullanılabilir kişi yok",
        error: "Hata",
        deleteConfirm: "Kişi silinsin mi?",
        enterName: "Ad ve soyad giriniz"
      }
    },
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
        descPh: "Kredi adı (örn. Araç kredisi)",
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
      reminder30: "30 dakika önce",
      reminder60: "1 saat önce",
      reminder120: "2 saat önce",
      reminder1440: "1 gün önce"
    },
    obligationsView: {
      byDay: "📆 Güne göre",
      asList: "📋 Liste olarak",
      selectDate: "Tarih seç"
    },
    health: {
      title: "❤️ Sağlık",
      add: "➕ Sağlık kaydı ekle",
      noRecords: "Sağlık kaydı yok",
      symptoms: "Semptomlar",
      medication: "İlaçlar",
      notes: "Notlar",
      save: "Kaydı kaydet"
    },
    diary: {
      title: "📓 Günlük",
      add: "➕ Günlük yazısı ekle",
      noEntries: "Günlük yazısı yok",
      placeholder: "Düşüncelerini yaz...",
      save: "Yazıyı kaydet"
    }
  },
  fr: {
    contacts: {
      title: "Contacts",
      import: "📥 Importer du répertoire",
      add: "➕ Ajouter contact",
      search: "Rechercher...",
      form: {
        title: "Nouveau contact",
        firstName: "Prénom",
        lastName: "Nom",
        birthDate: "Date de naissance",
        birthdayTime: "Heure de notification d'anniversaire",
        address: "Adresse",
        email: "E-mail",
        phone: "Téléphone",
        pickPhoto: "Choisir une image",
        save: "Enregistrer contact"
      },
      details: {
        title: "👤 Contact",
        edit: "Modifier contact",
        delete: "Supprimer contact",
        birthdayNotify: "Notification d'anniversaire"
      },
      messages: {
        importDone: "Import terminé",
        noPermission: "Permission pour les contacts non accordée",
        noContacts: "Aucun contact disponible",
        error: "Erreur",
        deleteConfirm: "Supprimer le contact ?",
        enterName: "Entrez prénom et nom"
      }
    },
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
    health: {
      title: "❤️ Santé",
      add: "➕ Ajouter un dossier médical",
      noRecords: "Aucun dossier médical",
      symptoms: "Symptômes",
      medication: "Médicaments",
      notes: "Notes",
      save: "Enregistrer le dossier"
    },
    diary: {
      title: "📓 Journal",
      add: "➕ Ajouter une entrée",
      noEntries: "Aucune entrée dans le journal",
      placeholder: "Écrivez vos pensées...",
      save: "Enregistrer l'entrée"
    }
  },
  es: {
    contacts: {
      title: "Contactos",
      import: "📥 Importar de la agenda",
      add: "➕ Añadir contacto",
      search: "Buscar...",
      form: {
        title: "Nuevo contacto",
        firstName: "Nombre",
        lastName: "Apellido",
        birthDate: "Fecha de nacimiento",
        birthdayTime: "Hora de notificación de cumpleaños",
        address: "Dirección",
        email: "E-mail",
        phone: "Teléfono",
        pickPhoto: "Elegir imagen",
        save: "Guardar contacto"
      },
      details: {
        title: "👤 Contacto",
        edit: "Editar contacto",
        delete: "Eliminar contacto",
        birthdayNotify: "Notificación de cumpleaños"
      },
      messages: {
        importDone: "Importación finalizada",
        noPermission: "Permiso para contactos no concedido",
        noContacts: "No hay contactos disponibles",
        error: "Error",
        deleteConfirm: "¿Eliminar contacto?",
        enterName: "Ingrese nombre y apellido"
      }
    },
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
    health: {
      title: "❤️ Salud",
      add: "➕ Añadir registro de salud",
      noRecords: "No hay registros de salud",
      symptoms: "Síntomas",
      medication: "Medicamentos",
      notes: "Notas",
      save: "Guardar registro"
    },
    diary: {
      title: "📓 Diario",
      add: "➕ Añadir entrada",
      noEntries: "No hay entradas en el diario",
      placeholder: "Escribe tus pensamientos...",
      save: "Guardar entrada"
    }
  },
  hu: {
    contacts: {
      title: "Kapcsolatok",
      import: "📥 Importálás telefonkönyvből",
      add: "➕ Kapcsolat hozzáadása",
      search: "Keresés...",
      form: {
        title: "Új kapcsolat",
        firstName: "Keresztnév",
        lastName: "Vezetéknév",
        birthDate: "Születési dátum",
        birthdayTime: "Születésnapi értesítés ideje",
        address: "Cím",
        email: "E-mail",
        phone: "Telefon",
        pickPhoto: "Kép kiválasztása",
        save: "Kapcsolat mentése"
      },
      details: {
        title: "👤 Kapcsolat",
        edit: "Kapcsolat szerkesztése",
        delete: "Kapcsolat törlése",
        birthdayNotify: "Születésnapi értesítés"
      },
      messages: {
        importDone: "Importálás befejezve",
        noPermission: "Nincs engedély a kapcsolatokhoz",
        noContacts: "Nincsenek elérhető kapcsolatok",
        error: "Hiba",
        deleteConfirm: "Törölni a kapcsolatot?",
        enterName: "Adja meg a keresztnevet és vezetéknevet"
      }
    },
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
    health: {
      title: "❤️ Egészség",
      add: "➕ Egészségnapló hozzáadása",
      noRecords: "Nincsenek egészségnapló bejegyzések",
      symptoms: "Tünetek",
      medication: "Gyógyszerek",
      notes: "Jegyzetek",
      save: "Bejegyzés mentése"
    },
    diary: {
      title: "📓 Napló",
      add: "➕ Bejegyzés hozzáadása",
      noEntries: "Nincsenek naplóbejegyzések",
      placeholder: "Írd le a gondolataid...",
      save: "Bejegyzés mentése"
    }
  },
  it: {
    contacts: {
      title: "Contatti",
      import: "📥 Importa dalla rubrica",
      add: "➕ Aggiungi contatto",
      search: "Cerca...",
      form: {
        title: "Nuovo contatto",
        firstName: "Nome",
        lastName: "Cognome",
        birthDate: "Data di nascita",
        birthdayTime: "Ora notifica compleanno",
        address: "Indirizzo",
        email: "E-mail",
        phone: "Telefono",
        pickPhoto: "Scegli immagine",
        save: "Salva contatto"
      },
      details: {
        title: "👤 Contatto",
        edit: "Modifica contatto",
        delete: "Elimina contatto",
        birthdayNotify: "Notifica compleanno"
      },
      messages: {
        importDone: "Importazione completata",
        noPermission: "Permesso per i contatti non concesso",
        noContacts: "Nessun contatto disponibile",
        error: "Errore",
        deleteConfirm: "Eliminare il contatto?",
        enterName: "Inserisci nome e cognome"
      }
    },
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
    health: {
      title: "❤️ Salute",
      add: "➕ Aggiungi registro sanitario",
      noRecords: "Nessun registro sanitario",
      symptoms: "Sintomi",
      medication: "Farmaci",
      notes: "Note",
      save: "Salva registro"
    },
    diary: {
      title: "📓 Diario",
      add: "➕ Aggiungi voce",
      noEntries: "Nessuna voce nel diario",
      placeholder: "Scrivi i tuoi pensieri...",
      save: "Salva voce"
    }
  }
};

window.I18N = I18N;

// Postavke jezika
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