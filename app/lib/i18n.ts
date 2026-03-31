export const locales = ["az", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export type Dictionary = {
  headerCta: string;
  heroTag: string;
  heroTitle: string;
  heroLead: string;
  heroPrimary: string;
  heroSecondary: string;
  partnersTitle: string;
  partnersLead: string;
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
  footerPrivacy: string;
  footerTerms: string;
  footerCookies: string;
};

export const dict: Record<Locale, Dictionary> = {
  az: {
    headerCta: "Müraciət et",
    heroTag: "Sapiens Pay",
    heroTitle: "Reklam büdcənizi bank komissiyalarına qurban verməyin.",
    heroLead:
      "Meta, Google Ads və TikTok reklam ödənişləri üçün xarici bank kartlarının rəsmi açılışı. Daha az xərc, daha çox nəticə.",
    heroPrimary: "İndi başla",
    heroSecondary: "Haqqımızda",
    partnersTitle: "Azərbaycanda bir çox şirkətlə əməkdaşlıq edirik",
    partnersLead:
      "Aşağıdakı loqolar hazırda placeholder formatındadır və istədiyiniz vaxt real brend loqoları ilə əvəz oluna bilər.",
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
    footerPrivacy: "Məxfilik siyasəti",
    footerTerms: "İstifadə şərtləri",
    footerCookies: "Cookie siyasəti",
  },
  ru: {
    headerCta: "Оставить заявку",
    heroTag: "Sapiens Pay",
    heroTitle: "Не жертвуйте рекламным бюджетом ради банковских комиссий.",
    heroLead:
      "Официальное открытие зарубежных банковских карт для платежей в Meta, Google Ads и TikTok. Меньше расходов, больше результата.",
    heroPrimary: "Начать сейчас",
    heroSecondary: "О нас",
    partnersTitle: "Мы сотрудничаем со многими компаниями в Азербайджане",
    partnersLead:
      "Логотипы ниже пока в формате placeholder и могут быть заменены на реальные в любой момент.",
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
    footerPrivacy: "Политика конфиденциальности",
    footerTerms: "Условия использования",
    footerCookies: "Политика cookie",
  },
  en: {
    headerCta: "Apply now",
    heroTag: "Sapiens Pay",
    heroTitle: "Stop sacrificing your ad budget to bank fees.",
    heroLead:
      "Official foreign bank card setup for Meta, Google Ads, and TikTok payments. Lower costs, stronger performance.",
    heroPrimary: "Start now",
    heroSecondary: "About us",
    partnersTitle: "We collaborate with many companies in Azerbaijan",
    partnersLead:
      "The logos below are placeholders for now and can be replaced with real brand logos anytime.",
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
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Use",
    footerCookies: "Cookie Policy",
  },
};
