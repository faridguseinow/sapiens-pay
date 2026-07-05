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
  service4Title: string;
  service4Text: string;
  serviceDetails: string;
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
  mobileLead: string;
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
    heroTitle: "Beynəlxalq bazarda işləmək üçün kompleks ödəniş həlləri",
    heroLead:
      "Xarici bank hesabı, Shopify Payments, xarici şirkət və beynəlxalq ödəniş sistemlərini bir mərkəzdən qururuq.",
    heroPrimary: "Konsultasiya al",
    heroSecondary: "Haqqımızda",
    partnersTitle: "Azərbaycanda bir çox şirkətlə əməkdaşlıq edirik",
    partnersLead:
      "Bizneslərin beynəlxalq ödəniş və satış infrastrukturunu daha rahat qurmasına dəstək oluruq.",
    aboutStoryEyebrow: "Haqqımızda",
    aboutStoryTitle: "Sapiens Pay beynəlxalq işləmək istəyən bizneslər üçün qurulub.",
    aboutStoryLead:
      "Bank hesabından şirkət qeydiyyatına və ödəniş qəbuluna qədər beynəlxalq biznes infrastrukturunu aydın prosesə çeviririk.",
    aboutStoryParagraph1:
      "Sapiens Pay Azərbaycandakı sahibkarlar, agentliklər və onlayn bizneslər üçün beynəlxalq ödəniş və satış infrastrukturunu daha əlçatan etmək məqsədilə yaradılıb.",
    aboutStoryParagraph2:
      "Bir çox biznes xarici hesab seçimi, Shopify Payments, şirkət strukturu və Stripe və PayPal kimi ödəniş sistemlərinə çıxış zamanı çətinlik yaşayır. Biz bu mərhələləri vahid plan üzrə idarə edirik.",
    aboutStoryParagraph3:
      "Wise Personal, Wise Business və Payoneer Business hesablarından Shopify Payments quraşdırılmasına, xarici şirkət qeydiyyatından beynəlxalq ödəniş sistemlərinə qədər ehtiyacınıza uyğun həll təqdim edirik.",
    aboutStoryParagraph4:
      "Bizim yanaşmamız sadədir: şəffaf proses, aydın yönləndirmə və real nəticə. Hədəfimiz təkcə bir xidməti təqdim etmək deyil, biznesinizin beynəlxalq işləməsi üçün daha düzgün və dayanıqlı sistem qurmağa kömək etməkdir.",
    servicesEyebrow: "Xidmətlərimiz",
    servicesTitle: "Biznesinizi dünyaya açan dörd əsas xidmət",
    servicesLead:
      "Bankçılıqdan ödəniş qəbuluna və şirkət strukturuna qədər beynəlxalq fəaliyyətiniz üçün vahid həll təqdim edirik.",
    service1Title: "Xarici bank hesablarının açılması",
    service1Text:
      "Şəxsi və biznes ehtiyaclarınıza uyğun xarici bank hesabının seçilməsi, sənədlərin hazırlanması və müraciət prosesi boyunca dəstək.",
    service2Title: "Shopify Payments quraşdırılması",
    service2Text:
      "Shopify mağazanızda beynəlxalq ödənişləri stabil qəbul etmək üçün ödəniş infrastrukturunu düzgün qurur və aktivləşdiririk.",
    service3Title: "Xarici şirkət açılması",
    service3Text:
      "Fəaliyyətinizə uyğun ölkə və şirkət modelini müəyyənləşdirir, qeydiyyat və ilkin sənədləşmə prosesini bir mərkəzdən idarə edirik.",
    service4Title: "Beynəlxalq ödəniş sistemlərinin qoşulması",
    service4Text:
      "Stripe, PayPal və digər beynəlxalq ödəniş həllərini biznes modelinizə uyğun şəkildə quraraq stabil ödəniş qəbuluna kömək edirik.",
    serviceDetails: "Ətraflı məlumat",
    servicesAction: "Biznesiniz üçün uyğun həlli seçək",
    aboutTitle: "Niyə Sapiens Pay",
    card1Title: "Tam rəsmi proses",
    card1Text: "Tələblər, sənədlər və mərhələlər əvvəlcədən aydın şəkildə təqdim olunur.",
    card2Title: "Ehtiyaca uyğun həll",
    card2Text: "Şəxsi hesabdan tam şirkət və ödəniş infrastrukturuna qədər uyğun modeli seçirik.",
    card3Title: "Bir mərkəzdən dəstək",
    card3Text: "Bank, Shopify, şirkət və ödəniş sistemi proseslərini əlaqəli şəkildə idarə edirik.",
    contactTitle: "Bizə mesaj göndərin",
    contactLead:
      "Xidmətinizi və ehtiyacınızı seçin, müraciətiniz birbaşa komandamıza daxil olsun.",
    formName: "Ad və soyad",
    formNamePlaceholder: "Adınız",
    formEmail: "E-poçt",
    formEmailPlaceholder: "mail@example.com",
    formPhone: "Telefon",
    formPhonePlaceholder: "+994 xx xxx xx xx",
    formMessage: "Mesaj",
    formMessagePlaceholder: "Biznesiniz və sorğunuz haqqında qısa məlumat yazın",
    formSubmit: "Göndər",
    ctaText: "Hansı həllin uyğun olduğunu bilmirsiniz? Ehtiyacınızı qeyd edin, sizə doğru istiqaməti göstərək.",
    ctaButton: "Konsultasiya al",
    mobileHome: "Ana səhifə",
    mobileCall: "Zəng et",
    mobileLead: "Müraciət et",
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
    heroTitle: "Комплексные платёжные решения для работы на международном рынке",
    heroLead:
      "В одном месте настраиваем зарубежные счета, Shopify Payments, иностранные компании и международные платёжные системы.",
    heroPrimary: "Получить консультацию",
    heroSecondary: "О нас",
    partnersTitle: "Мы сотрудничаем со многими компаниями в Азербайджане",
    partnersLead:
      "Помогаем бизнесу выстраивать удобную инфраструктуру международных платежей и продаж.",
    aboutStoryEyebrow: "О нас",
    aboutStoryTitle: "Sapiens Pay создан для бизнеса, который хочет работать международно без лишней путаницы.",
    aboutStoryLead:
      "Превращаем международную инфраструктуру — от банковского счёта до компании и приёма платежей — в понятный процесс.",
    aboutStoryParagraph1:
      "Sapiens Pay был создан, чтобы сделать международные платежи и инфраструктуру продаж более доступными для предпринимателей, агентств и онлайн-бизнесов в Азербайджане.",
    aboutStoryParagraph2:
      "Многие компании сталкиваются со сложностями при выборе зарубежного счёта, подключении Shopify Payments, построении структуры компании и доступе к Stripe или PayPal. Мы объединяем эти этапы в единый план.",
    aboutStoryParagraph3:
      "Мы сопровождаем открытие Wise Personal, Wise Business и Payoneer Business, настройку Shopify Payments, регистрацию зарубежной компании и подключение международных платёжных систем.",
    aboutStoryParagraph4:
      "Наш подход прост: прозрачный процесс, понятная навигация и реальный результат. Наша задача не просто оказать одну услугу, а помочь выстроить более правильную и устойчивую систему для международной работы вашего бизнеса.",
    servicesEyebrow: "Наши услуги",
    servicesTitle: "Четыре ключевые услуги для выхода бизнеса на международный рынок",
    servicesLead:
      "Объединяем зарубежный банкинг, прием платежей и корпоративную структуру в одном понятном процессе.",
    service1Title: "Открытие зарубежных банковских счетов",
    service1Text:
      "Подбираем подходящий зарубежный счет для личных или бизнес-задач, готовим документы и сопровождаем процесс подачи заявки.",
    service2Title: "Настройка Shopify Payments",
    service2Text:
      "Настраиваем платежную инфраструктуру Shopify, чтобы магазин стабильно принимал международные платежи.",
    service3Title: "Открытие зарубежной компании",
    service3Text:
      "Помогаем выбрать страну и формат компании, сопровождаем регистрацию и оформление стартового пакета документов.",
    service4Title: "Подключение международных платежных систем",
    service4Text:
      "Подключаем Stripe, PayPal и другие международные решения под вашу бизнес-модель для стабильного приема платежей.",
    serviceDetails: "Подробнее",
    servicesAction: "Подберем решение для вашего бизнеса",
    aboutTitle: "Почему Sapiens Pay",
    card1Title: "Полностью официальный процесс",
    card1Text: "Требования, документы и этапы процесса понятны заранее.",
    card2Title: "Решение под задачу",
    card2Text: "Подбираем модель от личного счёта до компании и полной платёжной инфраструктуры.",
    card3Title: "Поддержка в одном месте",
    card3Text: "Связываем банковские, Shopify, корпоративные и платёжные процессы.",
    contactTitle: "Отправьте нам сообщение",
    contactLead:
      "Выберите услугу и опишите задачу — заявка сразу поступит нашей команде.",
    formName: "Имя и фамилия",
    formNamePlaceholder: "Ваше имя",
    formEmail: "Эл. почта",
    formEmailPlaceholder: "mail@example.com",
    formPhone: "Телефон",
    formPhonePlaceholder: "+994 xx xxx xx xx",
    formMessage: "Сообщение",
    formMessagePlaceholder: "Кратко опишите ваш бизнес и запрос",
    formSubmit: "Отправить",
    ctaText: "Не уверены, какое решение подходит? Опишите задачу, и мы предложим правильное направление.",
    ctaButton: "Получить консультацию",
    mobileHome: "Главная",
    mobileCall: "Позвонить",
    mobileLead: "Оставить заявку",
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
    heroTitle: "Complete payment solutions for operating in global markets",
    heroLead:
      "We set up foreign accounts, Shopify Payments, foreign companies, and international payment systems in one place.",
    heroPrimary: "Get a consultation",
    heroSecondary: "About us",
    partnersTitle: "We collaborate with many companies in Azerbaijan",
    partnersLead:
      "We help businesses build a more practical infrastructure for international payments and sales.",
    aboutStoryEyebrow: "About",
    aboutStoryTitle: "Sapiens Pay was built for businesses that want to operate internationally with less friction.",
    aboutStoryLead:
      "We turn international business infrastructure—from bank accounts to company formation and payment acceptance—into a clear process.",
    aboutStoryParagraph1:
      "Sapiens Pay was created to make international payments and sales infrastructure more accessible for entrepreneurs, agencies, and online businesses in Azerbaijan.",
    aboutStoryParagraph2:
      "Many businesses face challenges when choosing a foreign account, enabling Shopify Payments, forming a company, or accessing Stripe and PayPal. We manage these stages as one plan.",
    aboutStoryParagraph3:
      "We support Wise Personal, Wise Business and Payoneer Business accounts, Shopify Payments setup, foreign company formation, and international payment system integration.",
    aboutStoryParagraph4:
      "Our approach is simple: a transparent process, clear guidance, and real outcomes. We are not here just to deliver a one-off service, but to help build a more reliable system for your business to operate internationally.",
    servicesEyebrow: "Our Services",
    servicesTitle: "Four essential services for taking your business global",
    servicesLead:
      "We bring international banking, payment acceptance, and company setup into one clear process.",
    service1Title: "Foreign bank account setup",
    service1Text:
      "We help select the right foreign account for personal or business use, prepare the documents, and support the application process.",
    service2Title: "Shopify Payments setup",
    service2Text:
      "We configure the payment infrastructure your Shopify store needs to accept international payments reliably.",
    service3Title: "Foreign company formation",
    service3Text:
      "We help choose the right jurisdiction and company structure, then guide registration and initial documentation.",
    service4Title: "International payment system integration",
    service4Text:
      "We connect Stripe, PayPal, and other global payment solutions to help your business accept payments reliably.",
    serviceDetails: "Learn more",
    servicesAction: "Choose the right solution for your business",
    aboutTitle: "Why Sapiens Pay",
    card1Title: "Fully official process",
    card1Text: "Requirements, documents, and process stages are clear from the start.",
    card2Title: "A solution that fits",
    card2Text: "We select the right model, from a personal account to a company and full payment infrastructure.",
    card3Title: "One-point support",
    card3Text: "We coordinate banking, Shopify, company, and payment-system processes.",
    contactTitle: "Send us a message",
    contactLead:
      "Choose a service and describe your needs—your request will go directly to our team.",
    formName: "Full name",
    formNamePlaceholder: "Your name",
    formEmail: "Email",
    formEmailPlaceholder: "mail@example.com",
    formPhone: "Phone",
    formPhonePlaceholder: "+994 xx xxx xx xx",
    formMessage: "Message",
    formMessagePlaceholder: "Share a short note about your business and request",
    formSubmit: "Send",
    ctaText: "Not sure which solution fits? Tell us what you need and we will recommend the right direction.",
    ctaButton: "Get a consultation",
    mobileHome: "Home",
    mobileCall: "Call",
    mobileLead: "Apply now",
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
