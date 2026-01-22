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
  zh: {
    menu: {
      obligations: "🧭 义务",
      shopping: "🛒 购物",
      contacts: "👥 联系人",
      finances: "💰 财务",
      health: "❤️ 健康",
      diary: "📓 日记",
      addObligation: "➕ 添加义务",
      viewObligations: "📅 查看义务"
    },
shopping: {
  title: "🛒 购物",
  placeholder: "添加项目并按 Enter",
  emptyTitle: "没有项目",
  emptySub: "在上方添加第一个项目。",
  scanReceipt: "输入收据金额",
  showArchive: "显示存档",
  hideArchive: "隐藏存档"
},
finances: {
      menu: {
        income: "💵 收入",
        fixed: "📅 每月支出",
        credits: "🏦 贷款",
        other: "🛒 其他支出",
        overview: "📊 支出总览"
      },
      income: {
  title: "💵 收入",
  dateLabel: "日期",
  add: "添加收入",
  amountPh: "金额 (€)",
  descPh: "描述 (例如 工资)"
},
      fixed: {
  title: "📅 每月支出",
  add: "添加支出",
  descPh: "支出名称 (例如 房租)",
  amountPh: "金额 (€)"
},
      credits: {
  title: "🏦 贷款",
  add: "添加贷款",
  descPh: "贷款名称 (例如 车贷)",
  amountPh: "每期金额 (€)",
startLabel: "贷款开始",
endLabel: "贷款结束",
lastPaidLabel: "最后付款"
},
      other: {
  title: "🧾 其他支出",
  add: "添加支出",
  descPh: "支出说明 (例如 燃油)",
  amountPh: "金额 (€)"
},
      overview: {
        title: "📊 支出总览",
        calculate: "计算",
        listIncome: "收入列表",
        listFixed: "固定支出",
        listCredits: "活跃贷款",
        listOther: "其他支出",
        sumIncome: "收入",
        sumFixed: "每月支出",
        sumCredits: "贷款",
        sumOther: "其他支出",
        sumResult: "余额"
      }
    },
    obligation: {
  title: "标题",
  note: "备注",
  dateTime: "日期和时间",
  reminder: "提醒",
  urgent: "紧急（忽略安静时间）",
  quietHours: "安静时间",
  repeat: "重复",
  repeatNone: "不重复",
  repeatDaily: "每天",
  repeatWeekly: "每周",
  save: "💾 保存",
  update: "更新",
  cancel: "取消"
},
popup: {
  newObligationTitle: "➕ 新义务",
  newObligationSaved: "义务已保存"
},
    obligationsList: {
      title: "我的义务",
      total: "总计",
      noObligations: "没有义务",
      delete: "删除",
      deleteConfirm: "删除此义务？",
      edit: "编辑",
      markDone: "✅ 已完成",
      markActive: "⏳ 重新激活",
      statusActive: "活跃",
      statusDone: "已完成",
      reminder30: "提前30分钟",
      reminder60: "提前1小时",
      reminder120: "提前2小时",
      reminder1440: "提前1天"
    },
    obligationsView: {
      byDay: "📆 按日期查看",
      asList: "📋 列表视图",
      selectDate: "选择日期"
}
  },
  ja: {
    menu: {
      obligations: "🧭 義務",
      shopping: "🛒 買い物",
      contacts: "👥 連絡先",
      finances: "💰 財務",
      health: "❤️ 健康",
      diary: "📓 日記",
      addObligation: "➕ 義務を追加",
      viewObligations: "📅 義務を表示"
    },
shopping: {
  title: "🛒 買い物",
  placeholder: "項目を追加してEnter",
  emptyTitle: "項目なし",
  emptySub: "上で最初の項目を追加。",
  scanReceipt: "レシート金額を入力",
  showArchive: "アーカイブ表示",
  hideArchive: "アーカイブ非表示"
},
finances: {
      menu: {
        income: "💵 収入",
        fixed: "📅 月間支出",
        credits: "🏦 ローン",
        other: "🛒 その他の支出",
        overview: "📊 支出概要"
      },
      income: {
  title: "💵 収入",
  dateLabel: "日付",
  add: "収入を追加",
  amountPh: "金額 (€)",
  descPh: "説明 (例: 給与)"
},
      fixed: {
  title: "📅 月間支出",
  add: "支出を追加",
  descPh: "支出名 (例: 家賃)",
  amountPh: "金額 (€)"
},
      credits: {
  title: "🏦 ローン",
  add: "ローンを追加",
  descPh: "ローン名 (例: 車のローン)",
  amountPh: "分割支払額 (€)",
startLabel: "ローン開始",
endLabel: "ローン終了",
lastPaidLabel: "最終支払い"
},
      other: {
  title: "🧾 その他の費用",
  add: "費用を追加",
  descPh: "費用の説明 (例: 燃料)",
  amountPh: "金額 (€)"
},
      overview: {
        title: "📊 支出概要",
        calculate: "計算",
        listIncome: "収入一覧",
        listFixed: "固定費",
        listCredits: "アクティブローン",
        listOther: "その他の支出",
        sumIncome: "収入",
        sumFixed: "月間支出",
        sumCredits: "ローン",
        sumOther: "その他支出",
        sumResult: "残高"
      }
    },
    obligation: {
  title: "タイトル",
  note: "メモ",
  dateTime: "日付と時刻",
  reminder: "リマインダー",
  urgent: "緊急（サイレント時間を無視）",
  quietHours: "サイレント時間",
  repeat: "繰り返し",
  repeatNone: "繰り返しなし",
  repeatDaily: "毎日",
  repeatWeekly: "毎週",
  save: "💾 保存",
  update: "更新",
  cancel: "キャンセル"
},
popup: {
  newObligationTitle: "➕ 新しい義務",
  newObligationSaved: "義務が保存されました"
},
    obligationsList: {
      title: "私の義務",
      total: "合計",
      noObligations: "義務はありません",
      delete: "削除",
      deleteConfirm: "この義務を削除しますか？",
      edit: "編集",
      markDone: "✅ 完了",
      markActive: "⏳ 再アクティブ",
      statusActive: "アクティブ",
      statusDone: "完了",
      reminder30: "30分前",
      reminder60: "1時間前",
      reminder120: "2時間前",
      reminder1440: "1日前"
    },
    obligationsView: {
      byDay: "📆 日別表示",
      asList: "📋 リスト表示",
      selectDate: "日付を選択"
   }
  }
};

I18N.hr.lang = 'hr-HR';
I18N.en.lang = 'en-US';
I18N.de.lang = 'de-DE';
I18N.ru.lang = 'ru-RU';
I18N.pt.lang = 'pt-PT';
I18N.tr.lang = 'tr-TR';
I18N.zh.lang = 'zh-CN';
I18N.ja.lang = 'ja-JP';

window.I18N = I18N;