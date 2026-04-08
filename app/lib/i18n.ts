export const locales = ["az", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export type Dictionary = {
  headerCta: string;
  headerHome: string;
  langSwitcherLabel: string;
  heroTag: string;
  heroTitle: string;
  heroLead: string;
  heroPrimary: string;
  heroSecondary: string;
  partnersTitle: string;
  partnersLead: string;
  aboutStoryEyebrow: string;
  aboutStoryTitle: string;
  aboutStoryLead: string;
  aboutStoryParagraph1: string;
  aboutStoryParagraph2: string;
  aboutStoryParagraph3: string;
  aboutStoryParagraph4: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesLead: string;
  service1Title: string;
  service1Text: string;
  service2Title: string;
  service2Text: string;
  service3Title: string;
  service3Text: string;
  servicesAction: string;
  aboutTitle: string;
  card1Title: string;
  card1Text: string;
  card2Title: string;
  card2Text: string;
  card3Title: string;
  card3Text: string;
  contactTitle: string;
  contactLead: string;
  formName: string;
  formNamePlaceholder: string;
  formEmail: string;
  formEmailPlaceholder: string;
  formPhone: string;
  formPhonePlaceholder: string;
  formMessage: string;
  formMessagePlaceholder: string;
  formSubmit: string;
  ctaText: string;
  ctaButton: string;
  mobileHome: string;
  mobileCall: string;
  mobileAbout: string;
  socialsTitle: string;
  socialsLead: string;
  socialInstagram: string;
  socialFacebook: string;
  socialLinkedin: string;
  socialTiktok: string;
  footerRights: string;
  footerFarid: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCookies: string;
  legalUpdated: string;
  legalContents: string;
  legalContactTitle: string;
  legalContactLead: string;
};

export const dict: Record<Locale, Dictionary> = {
  az: {
    headerCta: "Müraciət et",
    headerHome: "Ana səhifə",
    langSwitcherLabel: "Dil seçimi",
    heroTag: "Sapiens Pay",
    heroTitle: "Reklam büdcənizi bank komissiyalarına qurban verməyin!",
    heroLead:
      "Meta, Google Ads və TikTok reklam ödənişləri üçün xarici bank kartlarının rəsmi açılışı. Daha az xərc, daha çox nəticə.",
    heroPrimary: "İndi başla",
    heroSecondary: "Haqqımızda",
    partnersTitle: "Azərbaycanda bir çox şirkətlə əməkdaşlıq edirik",
    partnersLead:
      "Aşağıdakı loqolar hazırda placeholder formatındadır və istədiyiniz vaxt real brend loqoları ilə əvəz oluna bilər.",
    aboutStoryEyebrow: "Haqqımızda",
    aboutStoryTitle: "Sapiens Pay beynəlxalq işləmək istəyən bizneslər üçün qurulub.",
    aboutStoryLead:
      "Reklam ödənişləri, xarici kartlar və satış infrastrukturu kimi mövzuları daha aydın, daha rahat və daha dayanıqlı sistemə çeviririk.",
    aboutStoryParagraph1:
      "Sapiens Pay Azərbaycandakı sahibkarlar, agentliklər və onlayn bizneslər üçün beynəlxalq ödəniş və satış infrastrukturunu daha əlçatan etmək məqsədilə yaradılıb.",
    aboutStoryParagraph2:
      "Biz gördük ki, bir çox biznes reklam ödənişləri, xarici bank kartları, beynəlxalq ödəniş alətləri, marketplace hesabları və xarici şirkət strukturu kimi mövzularda çətinlik yaşayır. Bu çətinliklər isə əlavə xərc, vaxt itkisi və böyümənin ləngiməsi ilə nəticələnir.",
    aboutStoryParagraph3:
      "Sapiens Pay olaraq məqsədimiz bu prosesi sadələşdirməkdir. Biz müştərilərimizə reklam ödənişləri üçün uyğun həllər, xarici bank kartı dəstəyi, beynəlxalq ödəniş sistemlərinə çıxış, e-commerce və marketplace fəaliyyətləri üçün praktik istiqamətləndirmə təqdim edirik.",
    aboutStoryParagraph4:
      "Bizim yanaşmamız sadədir: şəffaf proses, aydın yönləndirmə və real nəticə. Hədəfimiz təkcə bir xidməti təqdim etmək deyil, biznesinizin beynəlxalq işləməsi üçün daha düzgün və dayanıqlı sistem qurmağa kömək etməkdir.",
    servicesEyebrow: "Xidmətlərimiz",
    servicesTitle: "Biznesiniz üçün ən çox tələb olunan 3 həll",
    servicesLead:
      "Komissiya itkisini azaldır, ödənişi rahatlaşdırır və satış prosesini aktiv edir.",
    service1Title: "Reklam ödənişlərində komissiyanı azalt",
    service1Text:
      "500$ reklam büdcəsi komissiya ilə 600$ olmasın. Wise kartı ilə ödəniş xərclərini minimuma endiririk.",
    service2Title: "Azərbaycandan Wise kart açılışı",
    service2Text:
      "Onlayn, sürətli və rahat proses. Heç yerə getmədən Wise kart dəstəyi ilə beynəlxalq ödənişlərə çıxış.",
    service3Title: "Shopify Payments quraşdırılması",
    service3Text:
      "Mağazanızda ödəniş sistemini düzgün qururuq ki, satış dayanmadan davam etsin.",
    servicesAction: "İndi yaz, birlikdə başlayaq",
    aboutTitle: "Niyə Sapiens Pay",
    card1Title: "Tam rəsmi proses",
    card1Text: "Bakı ofisində şəffaf və güvənli şəkildə bütün mərhələlər.",
    card2Title: "Maksimum qənaət",
    card2Text: "Davamlı komissiya ödəmək əvəzinə, bir dəfə düzgün sistem qur.",
    card3Title: "Biznesə fokus",
    card3Text: "Qənaət olunan büdcəni yenidən reklama və satışa yönəlt.",
    contactTitle: "Bizə mesaj göndərin",
    contactLead:
      "Forma hazırdır. Backend inteqrasiyası növbəti mərhələdə qoşulacaq.",
    formName: "Ad və soyad",
    formNamePlaceholder: "Adınız",
    formEmail: "E-poçt",
    formEmailPlaceholder: "mail@example.com",
    formPhone: "Telefon",
    formPhonePlaceholder: "+994 xx xxx xx xx",
    formMessage: "Mesaj",
    formMessagePlaceholder: "Biznesiniz və sorğunuz haqqında qısa məlumat yazın",
    formSubmit: "Göndər",
    ctaText: "Min dəfə komissiya ödəməkdənsə bir dəfə rəsmi kart sahibi ol.",
    ctaButton: "Bizimlə əlaqə",
    mobileHome: "Ana səhifə",
    mobileCall: "Zəng et",
    mobileAbout: "Haqqımızda",
    socialsTitle: "Sosial şəbəkələrdə bizi izləyin",
    socialsLead:
      "Daha çox məlumat və yeniliklər üçün platformalarımıza keçid edin.",
    socialInstagram: "Instagram",
    socialFacebook: "Facebook",
    socialLinkedin: "LinkedIn",
    socialTiktok: "TikTok",
    footerRights: "Bütün hüquqlar qorunur.",
    footerFarid: "Saytın hazırlanması - Farid Huseynov",
    footerPrivacy: "Məxfilik siyasəti",
    footerTerms: "İstifadə şərtləri",
    footerCookies: "Cookie siyasəti",
    legalUpdated: "Son yenilənmə tarixi",
    legalContents: "Bölmələr",
    legalContactTitle: "Əlaqə",
    legalContactLead:
      "Bu sənədlərlə bağlı sualınız varsa, bizimlə e-poçt vasitəsilə əlaqə saxlaya bilərsiniz.",
  },
  ru: {
    headerCta: "Оставить заявку",
    headerHome: "Главная",
    langSwitcherLabel: "Выбор языка",
    heroTag: "Sapiens Pay",
    heroTitle: "Не жертвуйте рекламным бюджетом ради банковских комиссий!",
    heroLead:
      "Официальное открытие зарубежных банковских карт для платежей в Meta, Google Ads и TikTok. Меньше расходов, больше результата.",
    heroPrimary: "Начать сейчас",
    heroSecondary: "О нас",
    partnersTitle: "Мы сотрудничаем со многими компаниями в Азербайджане",
    partnersLead:
      "Логотипы ниже пока в формате placeholder и могут быть заменены на реальные в любой момент.",
    aboutStoryEyebrow: "О нас",
    aboutStoryTitle: "Sapiens Pay создан для бизнеса, который хочет работать международно без лишней путаницы.",
    aboutStoryLead:
      "Мы упрощаем рекламные платежи, зарубежные карты и инфраструктуру продаж, превращая сложный процесс в понятную рабочую систему.",
    aboutStoryParagraph1:
      "Sapiens Pay был создан, чтобы сделать международные платежи и инфраструктуру продаж более доступными для предпринимателей, агентств и онлайн-бизнесов в Азербайджане.",
    aboutStoryParagraph2:
      "Мы увидели, что многие компании сталкиваются с трудностями в вопросах рекламных платежей, зарубежных банковских карт, международных платежных инструментов, аккаунтов marketplace и структуры иностранных компаний. Это приводит к дополнительным расходам, потере времени и замедлению роста.",
    aboutStoryParagraph3:
      "Наша цель в Sapiens Pay — упростить этот путь. Мы предлагаем подходящие решения для рекламных платежей, поддержку по зарубежным банковским картам, доступ к международным платежным системам и практическое сопровождение для e-commerce и работы с marketplace.",
    aboutStoryParagraph4:
      "Наш подход прост: прозрачный процесс, понятная навигация и реальный результат. Наша задача не просто оказать одну услугу, а помочь выстроить более правильную и устойчивую систему для международной работы вашего бизнеса.",
    servicesEyebrow: "Наши услуги",
    servicesTitle: "3 решения, которые чаще всего нужны бизнесу",
    servicesLead:
      "Снижаем потери на комиссиях, открываем доступ к международным платежам и запускаем прием оплат.",
    service1Title: "Меньше комиссий на рекламных платежах",
    service1Text:
      "Чтобы из бюджета 500$ не уходило 600$ с комиссиями. Настраиваем оплату через Wise и сокращаем лишние расходы.",
    service2Title: "Открытие Wise карты из Азербайджана",
    service2Text:
      "Онлайн, быстро и без лишних шагов. Получаете удобный инструмент для международных платежей.",
    service3Title: "Подключение Shopify Payments",
    service3Text:
      "Настраиваем платежную систему в магазине, чтобы вы могли стабильно принимать оплаты и не терять продажи.",
    servicesAction: "Напишите нам и начнем",
    aboutTitle: "Почему Sapiens Pay",
    card1Title: "Полностью официальный процесс",
    card1Text: "Все этапы прозрачно и безопасно в офисе в Баку.",
    card2Title: "Максимальная экономия",
    card2Text:
      "Вместо постоянных комиссий один раз выстройте правильную систему.",
    card3Title: "Фокус на бизнесе",
    card3Text: "Направляйте сэкономленный бюджет обратно в рекламу и продажи.",
    contactTitle: "Отправьте нам сообщение",
    contactLead:
      "Форма готова. Интеграция backend будет подключена на следующем этапе.",
    formName: "Имя и фамилия",
    formNamePlaceholder: "Ваше имя",
    formEmail: "Эл. почта",
    formEmailPlaceholder: "mail@example.com",
    formPhone: "Телефон",
    formPhonePlaceholder: "+994 xx xxx xx xx",
    formMessage: "Сообщение",
    formMessagePlaceholder: "Кратко опишите ваш бизнес и запрос",
    formSubmit: "Отправить",
    ctaText:
      "Вместо сотен комиссий выгоднее один раз стать владельцем официальной карты.",
    ctaButton: "Связаться с нами",
    mobileHome: "Главная",
    mobileCall: "Позвонить",
    mobileAbout: "О нас",
    socialsTitle: "Следите за нами в социальных сетях",
    socialsLead: "Переходите на наши площадки, чтобы узнать о нас больше.",
    socialInstagram: "Instagram",
    socialFacebook: "Facebook",
    socialLinkedin: "LinkedIn",
    socialTiktok: "TikTok",
    footerRights: "Все права защищены.",
    footerFarid: "Создание сайта - Farid Huseynov",
    footerPrivacy: "Политика конфиденциальности",
    footerTerms: "Условия использования",
    footerCookies: "Политика cookie",
    legalUpdated: "Дата последнего обновления",
    legalContents: "Разделы",
    legalContactTitle: "Контакты",
    legalContactLead:
      "Если у вас есть вопросы по этим документам, напишите нам по электронной почте.",
  },
  en: {
    headerCta: "Apply now",
    headerHome: "Home",
    langSwitcherLabel: "Language switcher",
    heroTag: "Sapiens Pay",
    heroTitle: "Stop sacrificing your ad budget to bank fees!",
    heroLead:
      "Official foreign bank card setup for Meta, Google Ads, and TikTok payments. Lower costs, stronger performance.",
    heroPrimary: "Start now",
    heroSecondary: "About us",
    partnersTitle: "We collaborate with many companies in Azerbaijan",
    partnersLead:
      "The logos below are placeholders for now and can be replaced with real brand logos anytime.",
    aboutStoryEyebrow: "About",
    aboutStoryTitle: "Sapiens Pay was built for businesses that want to operate internationally with less friction.",
    aboutStoryLead:
      "We simplify ad payments, foreign cards, and sales infrastructure so the path from local business to global operations feels clearer and more stable.",
    aboutStoryParagraph1:
      "Sapiens Pay was created to make international payments and sales infrastructure more accessible for entrepreneurs, agencies, and online businesses in Azerbaijan.",
    aboutStoryParagraph2:
      "We saw that many businesses struggle with ad payments, foreign bank cards, international payment tools, marketplace accounts, and foreign company structures. Those barriers often lead to extra costs, lost time, and slower growth.",
    aboutStoryParagraph3:
      "Our goal is to simplify that process. We provide practical guidance for ad payment solutions, support with foreign bank cards, access to international payment systems, and hands-on direction for e-commerce and marketplace activity.",
    aboutStoryParagraph4:
      "Our approach is simple: a transparent process, clear guidance, and real outcomes. We are not here just to deliver a one-off service, but to help build a more reliable system for your business to operate internationally.",
    servicesEyebrow: "Our Services",
    servicesTitle: "3 core solutions businesses ask for most",
    servicesLead:
      "We reduce fee losses, unlock international payments, and help you accept money without friction.",
    service1Title: "Cut extra fees on ad payments",
    service1Text:
      "Your 500 USD ad budget should not turn into 600 USD after commissions. We optimize the flow with Wise-based payments.",
    service2Title: "Wise card setup from Azerbaijan",
    service2Text:
      "Fast online onboarding with no unnecessary complexity, so you can use a practical tool for global payments.",
    service3Title: "Shopify Payments setup",
    service3Text:
      "We configure the payment layer in your store so you can start accepting payments and avoid losing ready-to-buy customers.",
    servicesAction: "Message us and get started",
    aboutTitle: "Why Sapiens Pay",
    card1Title: "Fully official process",
    card1Text: "Every step is transparent and secure at our Baku office.",
    card2Title: "Maximum savings",
    card2Text: "Instead of paying recurring fees, set up the right system once.",
    card3Title: "Business-first focus",
    card3Text: "Reinvest saved budget into ads and customer growth.",
    contactTitle: "Send us a message",
    contactLead:
      "The form is ready. Backend integration will be added in the next phase.",
    formName: "Full name",
    formNamePlaceholder: "Your name",
    formEmail: "Email",
    formEmailPlaceholder: "mail@example.com",
    formPhone: "Phone",
    formPhonePlaceholder: "+994 xx xxx xx xx",
    formMessage: "Message",
    formMessagePlaceholder: "Share a short note about your business and request",
    formSubmit: "Send",
    ctaText:
      "Instead of paying fees over and over, become an official card holder once.",
    ctaButton: "Contact us",
    mobileHome: "Home",
    mobileCall: "Call",
    mobileAbout: "About",
    socialsTitle: "Follow us on social media",
    socialsLead: "Visit our platforms to learn more about Sapiens Pay.",
    socialInstagram: "Instagram",
    socialFacebook: "Facebook",
    socialLinkedin: "LinkedIn",
    socialTiktok: "TikTok",
    footerRights: "All rights reserved.",
    footerFarid: "Website by Farid Huseynov",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Use",
    footerCookies: "Cookie Policy",
    legalUpdated: "Last updated",
    legalContents: "Contents",
    legalContactTitle: "Contact",
    legalContactLead:
      "If you have any questions about these documents, you can contact us by email.",
  },
};
