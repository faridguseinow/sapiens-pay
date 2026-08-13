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
  "Tapşırıq mərkəzi": "Центр задач", "Komandanın işlərini planlaşdırın və izləyin.": "Планируйте и отслеживайте работу команды.", "+ Yeni tapşırıq": "+ Новая задача", "Arxivlə": "Архивировать", "Yaradılır...": "Создание...", "Yenilənir...": "Обновление...", "Yadda saxlanılır...": "Сохранение...",
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
  "Müqayisə yoxdur": "Нет данных для сравнения", "Strukturlaşdırılmış məlumat əlavə edildikdən sonra göstəricilər burada görünəcək.": "Показатели появятся здесь после добавления структурированных данных.",
  "Lead": "Лид", "Uyğun": "Квалифицирован", "Uyğundur": "Подходит", "Qazanılıb": "Выигран", "Bağlanıb": "Закрыт", "Təklif": "Предложение", "İtirilib": "Потерян",
  "Mənbəsiz lead": "Лиды без источника", "Kampaniyasız lead": "Лиды без кампании", "Atribusiyasız müştəri": "Клиенты без атрибуции", "Məhsulsuz satış": "Сделки без продукта",
  "SDR təyin edilməyib": "SDR не назначен", "Satış meneceri yoxdur": "Менеджер продаж не назначен", "Xərcdən gəlirə qədər kanal nəticələri": "Результаты каналов от расходов до выручки",
  "Lead, satış və real gəlir üzrə": "По лидам, продажам и фактической выручке", "Hər mərhələdə əvvəlki və ilk mərhələyə nisbət": "Конверсия каждого этапа относительно предыдущего и первого",
  "Ən yaxşı və zəif kampaniyaları ROAS, CAC və gəlir üzrə müqayisə edin": "Сравнивайте лучшие и слабые кампании по ROAS, CAC и выручке", "Seçin": "Выберите", "Seçilməyib": "Не выбрано",
  "Təyin edilən lead-dən real gəlirə qədər": "От назначенного лида до фактической выручки", "Menecer": "Менеджер", "Satış meneceri üzrə əlaqələndirilmiş məlumat yoxdur.": "Нет данных, связанных с менеджерами продаж.",
  "Əlaqə, kvalifikasiya və satışa ötürmə": "Контакт, квалификация и передача в продажи", "Əlaqə": "Контакт", "Satışa ötürülüb": "Передано в продажи", "Faiz": "Процент", "SDR təyinatları hələ aparılmayıb.": "Назначения SDR пока не выполнены.",
  "Agentlik, kontent, influencer, software və digər xərclər": "Агентство, контент, инфлюенсеры, ПО и прочие расходы", "Marketinq xərci əlavə edilməyib.": "Маркетинговые расходы не добавлены.",
  "Influencer": "Инфлюенсер", "Kontent": "Контент", "Kreativ istehsal": "Производство креативов", "Agentlik": "Агентство", "Proqram təminatı": "Программное обеспечение", "Reklam": "Реклама", "Digər": "Другое", "Xərci əlavə et": "Добавить расход",
  "Gəlir yalnız bu real ödənişlərdən hesablanır": "Выручка рассчитывается только по фактическим платежам", "Müştəri ID": "ID клиента", "Birbaşa xərc": "Прямые расходы",
  "Real ödəniş daxil edilməyib; buna görə gəlir və ROAS hesablanmır.": "Фактические платежи не внесены, поэтому выручка и ROAS не рассчитываются.", "CRM-dən götür": "Взять из CRM", "Ödənişi qeydə al": "Зарегистрировать платёж", "Telefon": "Телефон", "Bu filtrə uyğun müraciət yoxdur.": "Нет заявок, соответствующих этому фильтру.",
  "Yalnız reklam spend-i": "Только рекламные расходы", "Yalnız real ödənişlər": "Только фактические платежи", "Bütün marketinq xərci / müştəri": "Все маркетинговые расходы / клиенты",
  "Atribusiya edilmiş gəlir / reklam xərci": "Атрибутированная выручка / рекламные расходы", "Birbaşa xərc tam daxil edilməlidir": "Необходимо внести все прямые расходы",
  "Recurring model üçün məlumat yoxdur": "Нет данных по регулярной модели", "Cari dövr üzrə MRR bazası": "База MRR за текущий период", "Başlanğıc mərhələ": "Начальный этап",
  "Daily metrics cədvəlindən": "Из таблицы дневных метрик", "Reklamdan ayrı saxlanılır": "Учитываются отдельно от рекламы", "Blended CAC bazası": "База для смешанного CAC",
  "Paid statuslu ödənişlər": "Платежи со статусом Paid", "Ödənişli müştəri": "Оплативший клиент", "Recurring ödənişlər": "Регулярные платежи", "Direct cost tam olduqda hesablanır": "Рассчитывается при наличии всех прямых расходов",
  "Analitika bölmələri": "Разделы аналитики", "← Redaktora qayıt": "← Вернуться в редактор", "Yazı əlavə etmək üçün yuxarıdakı “Yeni yazı” düyməsinə klikləyin.": "Чтобы добавить публикацию, нажмите кнопку «Новая публикация» выше.",
  "Dil": "Язык", "(istəyə bağlı)": "(необязательно)", "Qalın": "Жирный", "İtalik": "Курсив", "• Siyahı": "• Список", "1. Siyahı": "1. Список", "Keçid": "Ссылка", "Şəkil": "Изображение", "Sitat": "Цитата",
  "Məlumat": "Информация", "Xəbərdarlıq": "Предупреждение", "Cədvəl": "Таблица", "Ayırıcı": "Разделитель", "Yayımlama": "Публикация", "(yalnız real ad)": "(только настоящее имя)",
  "Yazının vəziyyəti": "Статус публикации", "Planlaşdırılıb": "Запланировано", "Arxiv": "Архив", "Seçilmiş məqalə": "Избранная статья", "Planlaşdırılmış tarix": "Дата публикации",
  "SEO ayarları": "Настройки SEO", "İstəyə bağlı": "Необязательно", "Google başlığı": "Заголовок Google", "Meta açıqlama": "Мета-описание", "Əsas açar söz": "Основной ключевой запрос",
  "İkinci dərəcəli açar sözlər": "Дополнительные ключевые запросы", "Open Graph başlığı": "Заголовок Open Graph", "Open Graph açıqlaması": "Описание Open Graph", "Open Graph şəkil URL-i": "URL изображения Open Graph",
  "Axtarış sistemlərində indekslə": "Индексировать в поисковых системах", "Sitemap-a daxil et": "Добавить в Sitemap", "Google önizləməsi": "Предпросмотр Google", "SEO yoxlaması": "Проверка SEO",
  "URL adı": "URL-адрес", "Ən azı bir H2": "Минимум один H2", "Daxili keçid": "Внутренняя ссылка", "Üz qabığı": "Обложка", "Şəkil alt mətni": "Альтернативный текст изображения", "Şəkil seç": "Выбрать изображение",
  "JPG, PNG və ya WEBP · maksimum 8 MB": "JPG, PNG или WEBP · максимум 8 МБ", "Yazını sil": "Удалить публикацию", "Zəng et": "Позвонить", "Əvvəlki formanın cavabları": "Ответы из предыдущей формы", "Köhnə müraciətdən qalan məlumatlar": "Данные из старой заявки",
  "Satış axını": "Процесс продаж", "Kartları sürüşdürərək mərhələni dəyişin və vacib müraciətləri önə çıxarın.": "Перетаскивайте карточки между этапами и выделяйте важные заявки.",
  "Müştəri müraciətləri": "Заявки клиентов", "Müştərilərlə əlaqəni və növbəti addımları rahat idarə edin.": "Удобно управляйте коммуникацией с клиентами и следующими шагами.", "CSV yüklə": "Скачать CSV",
  "Axtarış": "Поиск", "Bütün xidmətlər": "Все услуги", "Bütün paketlər": "Все пакеты", "Başlanğıc tarixi": "Дата начала", "Diqqət tələb edən": "Требуют внимания", "Oxunmamış": "Непрочитанные", "oxunmamış müraciət": "непрочитанных заявок", "əlaqə vaxtı çatıb": "ожидают связи",
  "Yüksək prioritet": "Высокий приоритет", "Əlaqə vaxtı keçib": "Контакт просрочен", "Aç →": "Открыть →", "Mailbox idarəetməsi": "Управление почтовым ящиком",
  "Məsələn: support, sales və ya əməkdaşın adı.": "Например: support, sales или имя сотрудника.", "Yeni mailbox-lar üçün daimi maksimum limit": "Постоянный максимальный лимит для новых ящиков",
  "Əsas info mailbox-u deaktiv edilə və silinə bilməz.": "Основной ящик info нельзя отключить или удалить.", "Ayrıca mailbox yaratmadan ünvanı mövcud hesaba yönləndirin.": "Перенаправляйте адрес на существующий ящик без создания отдельного ящика.",
  "Minimum 12 simvol: böyük/kiçik hərf, rəqəm və xüsusi işarə.": "Минимум 12 символов: заглавные и строчные буквы, цифра и специальный символ.", "Statistika üçün müraciət yoxdur.": "Нет заявок для статистики.", "Hələ paket seçimi yoxdur.": "Пакеты пока не выбраны.", "Hələ müraciət daxil olmayıb.": "Заявки пока не поступили.",
  "Təmsilçilərin bütün qeydləri": "Все записи представителей", "Satış prosesində": "В процессе продажи", "Müştəriyə çevrilib": "Конвертированы в клиентов", "Ümumi nəticə": "Общий результат", "Açıq potensial": "Открытый потенциал",
  "müştəri": "клиентов", "satış": "продаж", "Satış təmsilçisi təyin edilməyib.": "Представитель продаж не назначен.", "Satış müştərisi əlavə edilməyib.": "Клиенты продаж не добавлены.",
  "Daxili iş bölgüsü": "Распределение внутренних задач", "Lead-lərdən ayrı, komandanın gündəlik işlərini izləyin.": "Отслеживайте ежедневные задачи команды отдельно от лидов.", "açıq iş": "открытых задач", "gecikib": "просрочено",
  "Tapşırıq bazası hələ qurulmayıb.": "База задач пока не настроена.", "Yeni Supabase migration-u tətbiq etdikdən sonra bölmə istifadəyə hazır olacaq.": "Раздел будет готов после применения новой миграции Supabase.", "Yeni tapşırıq": "Новая задача",
  "Kim, nəyi və nə vaxta qədər etməlidir?": "Кто, что и к какому сроку должен выполнить?", "Tapşırıq *": "Задача *", "Ətraflı qeyd": "Подробное описание", "Məsul əməkdaş *": "Ответственный сотрудник *", "Əməkdaş seçin": "Выберите сотрудника", "Son tarix *": "Срок *",
  "✓ Gördüm": "✓ Просмотрено", "İş barədə qeyd *": "Комментарий о работе *", "Yenilə": "Обновить", "Statusu məsul əməkdaş yeniləyir.": "Статус обновляет ответственный сотрудник.", "Bu mərhələdə tapşırıq yoxdur.": "На этом этапе задач нет.",
  "Giriş və icazələr": "Доступ и разрешения", "Komanda və rollar": "Команда и роли", "Auth hesablarını admin və satış iş sahələrinə ayırın.": "Разделяйте Auth-аккаунты между рабочими областями администратора и продаж.",
  "Yalnız baxış rejimi": "Режим только для просмотра", "Rolları yalnız sistem sahibi dəyişə bilər.": "Роли может изменять только владелец системы.", "Panel istifadəçiləri": "Пользователи панели", "Yeni Auth hesabları avtomatik satış rolunda yaranır": "Новые Auth-аккаунты автоматически получают роль продаж",
  "Admin": "Администратор", "Satış təmsilçisi": "Представитель продаж", "Rolu yadda saxla": "Сохранить роль",
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
