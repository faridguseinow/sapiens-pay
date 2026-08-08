"use client";

import { useEffect, useState } from "react";

type AdminLocale = "az" | "ru";

const azToRu: Record<string, string> = {
  "Şəxsi idarəetmə paneli": "Панель управления",
  "Xoş gəldiniz": "Добро пожаловать",
  "Müştəri müraciətlərini və bloq yazılarını bir mərkəzdən idarə edin.": "Управляйте заявками клиентов и публикациями блога в одном месте.",
  "Supabase bağlantısı gözlənilir": "Ожидается подключение Supabase",
  "Panel hazırda qoşulmayıb. Sayt administratoru ilə əlaqə saxlayın.": "Панель пока не подключена. Обратитесь к администратору сайта.",
  "Qorunan giriş · Sapiens Pay komandası üçün": "Защищённый вход · Для команды Sapiens Pay",
  "E-poçt": "Электронная почта", "Şifrə": "Пароль", "Daxil ol": "Войти",
  "İcmal": "Обзор", "Müraciətlər": "Заявки", "Tapşırıqlar": "Задачи", "Satış CRM": "CRM продаж",
  "Marketinq analitikası": "Маркетинговая аналитика", "Komanda": "Команда", "Bloq": "Блог", "Mail ünvanları": "Почтовые адреса",
  "Sayta bax ↗": "Открыть сайт ↗", "Çıxış et": "Выйти", "Yeni bildiriş yoxdur": "Новых уведомлений нет",
  "Bu gün nə baş verir?": "Что происходит сегодня?", "Ümumi baxış": "Общий обзор", "Əsas göstəricilər və son müraciətlər bir baxışda.": "Ключевые показатели и последние заявки.",
  "+ Yeni yazı": "+ Новая публикация", "Ümumi müraciət": "Всего заявок", "Bütün müraciətlər": "Все заявки",
  "Bu gün": "Сегодня", "Bu gün daxil olub": "Получено сегодня", "Son 7 gün": "Последние 7 дней", "Son bir həftə": "За последнюю неделю",
  "Bu ay": "Этот месяц", "Cari ay üzrə": "За текущий месяц", "Əlaqə gözləyən": "Ожидают связи", "Yeni müraciətlər": "Новые заявки",
  "Müştəriyə çevrilmə": "Конверсия в клиента", "Xidmətlər üzrə müraciətlər": "Заявки по услугам", "Hansı xidmətə daha çox maraq var": "Какие услуги вызывают больший интерес",
  "Paketlər üzrə maraq": "Интерес по пакетам", "Ən çox seçilən paket və istiqamətlər": "Самые популярные пакеты и направления",
  "Son müraciətlər": "Последние заявки", "Saytdan daxil olan son müraciətlər": "Последние заявки с сайта", "Hamısına bax →": "Смотреть все →",
  "Müştəri": "Клиент", "Xidmət": "Услуга", "Paket": "Пакет", "Status": "Статус", "Tarix": "Дата",
  "Yeni": "Новый", "Əlaqə saxlanılıb": "Связались", "Maraqlanır": "Заинтересован", "Müştəri oldu": "Стал клиентом", "Uyğun deyil": "Не подходит",
  "Müraciət mərkəzi": "Центр заявок", "Bütün müraciətlər və satış axını.": "Все заявки и воронка продаж.", "Siyahı": "Список", "Satış lövhəsi": "Доска продаж",
  "Bildirişlər": "Уведомления", "Axtar": "Поиск", "Hamısı": "Все", "Filtrlə": "Фильтровать", "Təmizlə": "Очистить",
  "Müraciət yoxdur": "Заявок нет", "Mərhələ": "Этап", "Prioritet": "Приоритет", "Yüksək": "Высокий", "Orta": "Средний", "Aşağı": "Низкий",
  "Müştəri profili": "Профиль клиента", "Müraciətdən alınan əsas məlumatlar": "Основные данные из заявки", "Paket / istiqamət": "Пакет / направление",
  "Əlaqə üsulu": "Способ связи", "Şirkət statusu": "Статус компании", "Başlama vaxtı": "Срок начала", "Müştərinin mesajı": "Сообщение клиента",
  "Müraciət yeri": "Источник заявки", "Müraciəti idarə et": "Управление заявкой", "Marketinq mənbəyi": "Маркетинговый источник",
  "Kampaniya": "Кампания", "Məhsul": "Продукт", "Satış meneceri": "Менеджер продаж", "Potensial satış məbləği (AZN)": "Потенциальная сумма продажи (AZN)",
  "Növbəti əlaqə": "Следующий контакт", "Daxili qeydlər": "Внутренние заметки", "Yadda saxla": "Сохранить", "Müraciəti sil": "Удалить заявку",
  "Təyin edilməyib": "Не назначен", "Mənbə yoxdur": "Источник не указан", "Kampaniya yoxdur": "Кампания не указана", "Məhsul seçilməyib": "Продукт не выбран",
  "Satış komandası": "Отдел продаж", "Bütün təmsilçilər, müştərilər və satış göstəriciləri.": "Все представители, клиенты и показатели продаж.",
  "Ümumi müştəri": "Всего клиентов", "Aktiv imkanlar": "Активные возможности", "Qazanılan": "Выиграно", "Konversiya": "Конверсия", "Təmsilçi göstəriciləri": "Показатели представителей",
  "Komanda üzrə müqayisə": "Сравнение команды", "Bütün satış müştəriləri": "Все клиенты продаж", "Təmsilçilərin daxil etdiyi məlumatlar": "Данные, внесённые представителями",
  "Təmsilçi": "Представитель", "Potensial": "Потенциал",
  "Tapşırıq mərkəzi": "Центр задач", "Komandanın işlərini planlaşdırın və izləyin.": "Планируйте и отслеживайте работу команды.", "+ Yeni tapşırıq": "+ Новая задача",
  "Başlıq": "Название", "Açıqlama": "Описание", "İcraçı": "Исполнитель", "Son tarix": "Срок", "Vaciblik": "Приоритет", "Tapşırıq yarat": "Создать задачу",
  "Gözləyir": "Ожидает", "İcradadır": "В работе", "Tamamlandı": "Завершено", "Yeniləmə əlavə et": "Добавить обновление",
  "Komanda idarəetməsi": "Управление командой", "İstifadəçiləri və rolları idarə edin.": "Управляйте пользователями и ролями.", "Yeni əməkdaş": "Новый сотрудник",
  "Ad": "Имя", "Rol": "Роль", "Aktiv": "Активен", "Satış": "Продажи", "Administrator": "Администратор", "Əlavə et": "Добавить", "Sil": "Удалить",
  "Kontent mərkəzi": "Контент-центр", "Bloq yazıları": "Публикации блога", "Yazıları yaradın, redaktə edin və yayımlayın.": "Создавайте, редактируйте и публикуйте материалы.",
  "Redaktə et →": "Редактировать →", "İlk bloq yazınızı yaradın": "Создайте первую публикацию", "Yeni bloq yazısı": "Новая публикация блога",
  "Məzmunu hazırlayın və istədiyiniz zaman yayımlayın.": "Подготовьте материал и опубликуйте его в удобное время.", "Yazını redaktə et": "Редактировать публикацию",
  "Təhlükəsiz önizləmə ↗": "Безопасный предпросмотр ↗", "Link adı": "URL-адрес", "Alt başlıq": "Подзаголовок", "Qısa açıqlama": "Краткое описание",
  "Məzmun": "Содержание", "Kateqoriya": "Категория", "Teqlər": "Теги", "Müəllif": "Автор", "Yayım statusu": "Статус публикации", "Qaralama": "Черновик", "Yayımla": "Опубликовать",
  "Şirkət mailbox-larını Mailcow panelinə girmədən idarə edin.": "Управляйте корпоративными ящиками без входа в Mailcow.",
  "Yeni mail ünvanı": "Новый почтовый адрес", "Yaddaş limiti": "Лимит хранилища", "+ Ünvan yarat": "+ Создать адрес", "Mövcud mailbox-lar": "Существующие ящики",
  "Şifrəni dəyiş": "Изменить пароль", "Birdəfəlik sil": "Удалить навсегда", "Mailbox tapılmadı.": "Почтовые ящики не найдены.",
  "Yönləndirmə aliasları": "Алиасы переадресации", "Alias ünvanı": "Адрес алиаса", "Çatacağı mailbox": "Целевой ящик", "+ Alias yarat": "+ Создать алиас", "Alias yaradılmayıb.": "Алиасы не созданы.",
  "Cəlbetmə": "Привлечение", "Satış hunisi": "Воронка продаж", "Kampaniyalar": "Кампании", "Mənbələr": "Источники", "Xərclər": "Расходы", "Gəlir": "Выручка", "Hesabatlar": "Отчёты",
  "Mənbədən real ödənişə qədər tam müştəri yolu.": "Полный путь клиента от источника до фактической оплаты.", "CSV ixrac et": "Экспорт CSV",
  "Başlanğıc": "Начало", "Son": "Конец", "Mənbə": "Источник", "Kanal": "Канал", "Ölkə": "Страна", "Lead statusu": "Статус лида", "Müştəri statusu": "Статус клиента",
  "Atribusiya": "Атрибуция", "Son təmas": "Последнее касание", "İlk təmas": "Первое касание", "Tətbiq et": "Применить",
  "Reklam xərci": "Расходы на рекламу", "Ödənişli müştərilər": "Оплатившие клиенты", "Blended CAC": "Смешанный CAC",
  "Göstərişlər": "Показы", "Kliklər": "Клики", "Uyğun lead": "Квалифицированные лиды", "Ümumi marketinq xərci": "Общие расходы на маркетинг",
  "Ümumi mənfəət": "Валовая прибыль", "Təkrarlanan gəlir": "Регулярная выручка", "Xərc və gəlir dinamikası": "Динамика расходов и выручки",
  "Seçilmiş dövr üzrə gündəlik müqayisə": "Ежедневное сравнение за выбранный период", "Tracking sağlamlığı": "Качество отслеживания", "Analitikanın etibarlılıq göstəriciləri": "Показатели достоверности аналитики",
  "Mənbələrin performansı": "Эффективность источников", "Məhsulların performansı": "Эффективность продуктов", "Marketinq → satış hunisi": "Воронка маркетинг → продажи",
  "Mənbə analitikası": "Аналитика источников", "Yeni mənbə": "Новый источник", "Sistem açarı": "Системный ключ", "Ödənişli mənbədir": "Платный источник", "Mənbə əlavə et": "Добавить источник",
  "Kampaniya performansı": "Эффективность кампаний", "Kampaniya yarat": "Создать кампанию", "Platforma": "Платформа", "Məqsəd": "Цель", "Yarat": "Создать",
  "Gündəlik reklam göstəricisi": "Дневные рекламные показатели", "Kampaniyasız": "Без кампании", "Xərc": "Расход", "AZN qarşılığı": "Эквивалент в AZN", "Valyuta": "Валюта",
  "Göstəriş": "Показы", "Klik": "Клики", "Göstəricini yadda saxla": "Сохранить показатели", "Satış menecerləri": "Менеджеры продаж", "SDR performansı": "Эффективность SDR",
  "Digər marketinq xərci": "Другие маркетинговые расходы", "Xərc reyestri": "Реестр расходов", "Marketinq xərci əlavə et": "Добавить маркетинговый расход",
  "Növ": "Тип", "Məbləğ": "Сумма", "Real gəlir": "Фактическая выручка", "Ödəniş reyestri": "Реестр платежей", "Ödəniş əlavə et": "Добавить платёж",
  "Ödəniş vaxtı": "Время оплаты", "Birbaşa xərc (AZN)": "Прямые расходы (AZN)", "Gəlir növü": "Тип выручки", "Birdəfəlik": "Разовая", "Təkrarlanan": "Регулярная",
  "Drill-down və hesabatlar": "Детализация и отчёты", "Seçilmiş filtrə uyğun konkret müraciətlər": "Конкретные заявки по выбранным фильтрам", "Lead CSV yüklə": "Скачать CSV лидов",
  "Hələ məlumat yoxdur": "Данных пока нет", "Məlumat yetərli deyil": "Недостаточно данных", "Dinamika üçün məlumat yoxdur.": "Нет данных для отображения динамики.",
};

const attributeNames = ["placeholder", "title", "aria-label"] as const;
const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();

function translated(value: string, locale: AdminLocale) {
  if (locale === "az") return value;
  const trimmed = value.trim();
  const exact = azToRu[trimmed];
  if (exact) return value.replace(trimmed, exact);
  return value
    .replace(/(\d+) oxunmamış/g, "$1 непрочитанных")
    .replace(/(\d+) əlaqə vaxtı çatıb/g, "$1 ожидают связи")
    .replace(/(\d+) nəfər müştəri olub/g, "$1 стали клиентами")
    .replace(/əvvəlki dövrə görə/g, "к предыдущему периоду")
    .replace(/Məlumat yetərli deyil/g, "Недостаточно данных");
}

function translateTree(root: ParentNode, locale: AdminLocale) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const textNode = node as Text;
    if (!textNode.parentElement?.closest("script,style,[data-admin-no-translate]")) {
      if (!originalText.has(textNode)) originalText.set(textNode, textNode.data);
      const original = originalText.get(textNode)!;
      const next = translated(original, locale);
      if (textNode.data !== next) textNode.data = next;
    }
    node = walker.nextNode();
  }
  const elements = root instanceof Element ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
  for (const element of elements) {
    let originals = originalAttributes.get(element);
    if (!originals) { originals = new Map(); originalAttributes.set(element, originals); }
    for (const name of attributeNames) {
      const value = element.getAttribute(name);
      if (value === null) continue;
      if (!originals.has(name)) originals.set(name, value);
      const next = translated(originals.get(name)!, locale);
      if (value !== next) element.setAttribute(name, next);
    }
  }
}

function cookieLocale(): AdminLocale {
  return document.cookie.match(/(?:^|; )admin_locale=(az|ru)(?:;|$)/)?.[1] === "ru" ? "ru" : "az";
}

export function AdminLanguageLayer() {
  const [locale, setLocale] = useState<AdminLocale>("az");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLocale(cookieLocale()));
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    translateTree(document.body, locale);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.parentNode) translateTree(mutation.target.parentNode, locale);
        mutation.addedNodes.forEach((node) => { if (node instanceof Element) translateTree(node, locale); else if (node.parentNode) translateTree(node.parentNode, locale); });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [locale]);

  const choose = (next: AdminLocale) => {
    document.cookie = `admin_locale=${next}; Path=/admin; Max-Age=31536000; SameSite=Lax`;
    setLocale(next);
  };

  return <div className="admin-language-switch" role="group" aria-label={locale === "az" ? "Panel dili" : "Язык панели"} data-admin-no-translate>
    <button type="button" className={locale === "az" ? "is-active" : ""} onClick={() => choose("az")}>AZ</button>
    <button type="button" className={locale === "ru" ? "is-active" : ""} onClick={() => choose("ru")}>RU</button>
  </div>;
}
