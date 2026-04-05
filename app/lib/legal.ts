import { dict, type Locale } from "./i18n";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalDocument = {
  slug: "privacy-policy" | "terms-of-use" | "cookie-policy";
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export type LegalDocumentKey = LegalDocument["slug"];

const updatedAt = "05.04.2026";

export const legalDocuments: Record<Locale, Record<LegalDocumentKey, LegalDocument>> = {
  az: {
    "privacy-policy": {
      slug: "privacy-policy",
      title: "Məxfilik siyasəti",
      description:
        "Sapiens Pay istifadəçi və müştəri məlumatlarını necə topladığını, istifadə etdiyini, saxladığını və qoruduğunu izah edir.",
      updatedAt,
      sections: [
        {
          id: "who-we-are",
          title: "1. Biz kimik",
          paragraphs: [
            "Sapiens Pay beynəlxalq ödəniş, rəqəmsal satış infrastrukturu və əlaqəli biznes prosesləri üzrə sahibkarlar, agentliklər və onlayn bizneslər üçün yönləndirmə, dəstək və praktik həllər təqdim edən platformadır.",
            "Bu siyasət saytımızdan istifadə etdiyiniz və ya xidmətlərimizlə bağlı bizimlə əlaqə saxladığınız bütün hallara ümumi şəkildə tətbiq olunur.",
          ],
        },
        {
          id: "data-we-collect",
          title: "2. Hansı məlumatları toplaya bilərik",
          paragraphs: [
            "Müraciət formasını doldurduqda, konsultasiya istədikdə və ya bizimlə yazışdıqda birbaşa təqdim etdiyiniz məlumatları toplaya bilərik.",
          ],
          items: [
            "ad və soyad",
            "telefon nömrəsi",
            "e-poçt ünvanı",
            "şirkət adı və fəaliyyət sahəsi",
            "müraciətin mövzusu və problemin təsviri",
            "xidmətin icrası üçün lazım ola biləcək əlavə məlumat və sənədlər",
          ],
        },
        {
          id: "technical-data",
          title: "3. Texniki məlumatlar",
          paragraphs: [
            "Saytdan istifadə zamanı avtomatik şəkildə müəyyən texniki məlumatlar da toplanıla bilər. Buraya IP ünvanı, brauzer növü, cihaz növü, əməliyyat sistemi, ziyarətin vaxtı, istinad mənbəyi və cookie məlumatları daxil ola bilər.",
            "Bu məlumatlar əsasən təhlükəsizlik, performansın ölçülməsi, analitika və saytın sabit işləməsi üçün istifadə olunur.",
          ],
        },
        {
          id: "purposes",
          title: "4. Məlumatlardan hansı məqsədlərlə istifadə edirik",
          paragraphs: [
            "Toplanan məlumatları sizin sorğularınıza cavab vermək, uyğun xidmət modelini müəyyənləşdirmək, ilkin analiz aparmaq, kommunikasiya qurmaq və xidmət proseslərini idarə etmək üçün istifadə edirik.",
            "Bundan əlavə, məlumatlar saytın funksionallığını yaxşılaşdırmaq, analitika aparmaq, inzibati öhdəlikləri yerinə yetirmək, fırıldaqçılıq və sui-istifadə riskini azaltmaq məqsədi daşıya bilər.",
          ],
        },
        {
          id: "legal-basis",
          title: "5. Hüquqi əsaslar",
          paragraphs: [
            "Məlumatların işlənməsi müraciətinizin icrası, qanuni maraqlarımızın qorunması, hüquqi öhdəliklərin yerinə yetirilməsi və zəruri hallarda verdiyiniz razılıq əsasında həyata keçirilə bilər.",
          ],
        },
        {
          id: "sharing",
          title: "6. Məlumatların paylaşılması",
          paragraphs: [
            "Məlumatlarınızı yalnız zəruri hallarda və məqsədlə uyğun şəkildə paylaşırıq. Bu, hostinq, analitika, kommunikasiya alətləri, hüquqi və ya texniki xidmət təminatçıları ilə əməkdaşlığı əhatə edə bilər.",
            "Qanunla tələb olunduqda və ya hüquqlarımızı qorumaq üçün səlahiyyətli dövlət orqanlarına məlumat təqdim edilə bilər.",
          ],
        },
        {
          id: "retention",
          title: "7. Saxlanma müddəti",
          paragraphs: [
            "Məlumatlar yalnız lazım olan müddətdə saxlanılır. Saxlanma müddəti müraciətin xarakterindən, davam edən əməkdaşlıqdan, hüquqi öhdəliklərdən və mühasibat və audit tələblərindən asılı olaraq dəyişə bilər.",
          ],
        },
        {
          id: "security",
          title: "8. Təhlükəsizlik",
          paragraphs: [
            "Məlumatların itirilməsi, icazəsiz açıqlanması və ya dəyişdirilməsi riskini azaltmaq üçün təşkilati və texniki tədbirlər tətbiq edirik. Bununla belə, internet üzərindən məlumat ötürülməsi tam risksiz hesab edilə bilməz.",
          ],
        },
        {
          id: "your-rights",
          title: "9. Hüquqlarınız",
          paragraphs: [
            "Mövcud qanunvericiliyə uyğun olaraq siz məlumatlarınıza çıxış istəmək, düzəliş tələb etmək, silinmə və ya emalın məhdudlaşdırılması barədə müraciət etmək, həmçinin razılığı geri götürmək hüququna malik ola bilərsiniz.",
          ],
        },
        {
          id: "third-party",
          title: "10. Üçüncü tərəf bağlantıları",
          paragraphs: [
            "Saytımızda üçüncü tərəf resurslarına keçidlər ola bilər. Həmin resursların məxfilik qaydalarına görə Sapiens Pay məsuliyyət daşımır və istifadə etməzdən əvvəl onların siyasətləri ilə tanış olmanız tövsiyə olunur.",
          ],
        },
        {
          id: "children",
          title: "11. Yetkinlik yaşı",
          paragraphs: [
            "Xidmətlərimiz əsasən sahibkarlıq və biznes subyektləri üçün nəzərdə tutulur. Yetkinlik yaşına çatmayan şəxslərdən qəsdən məlumat toplamaq məqsədimiz yoxdur.",
          ],
        },
        {
          id: "updates",
          title: "12. Dəyişikliklər",
          paragraphs: [
            "Bu siyasət vaxtaşırı yenilənə bilər. Əhəmiyyətli dəyişikliklər olduqda saytda yeni tarix göstəriləcək və lazım gələrsə əlavə bildiriş təqdim ediləcək.",
          ],
        },
      ],
    },
    "terms-of-use": {
      slug: "terms-of-use",
      title: "İstifadə şərtləri",
      description:
        "Sapiens Pay saytından, xidmətlərindən və əlaqəli kommunikasiya kanallarından istifadə qaydalarını müəyyən edir.",
      updatedAt,
      sections: [
        {
          id: "general",
          title: "1. Ümumi müddəalar",
          paragraphs: [
            "Bu şərtlər Sapiens Pay veb-saytından, xidmətlərindən və əlaqəli kommunikasiya kanallarından istifadə qaydalarını müəyyən edir.",
            "Saytımızdan istifadə etməklə, bizimlə əlaqə saxlayaraq müraciət göndərməklə və ya xidmətlərimizdən yararlanmaqla siz bu şərtlərlə tanış olduğunuzu və onları qəbul etdiyinizi təsdiq etmiş olursunuz.",
          ],
        },
        {
          id: "service-nature",
          title: "2. Xidmətlərin xarakteri",
          paragraphs: [
            "Sapiens Pay sahibkarlar, agentliklər və onlayn bizneslər üçün beynəlxalq ödəniş, rəqəmsal satış infrastrukturu, biznes yönləndirməsi və əlaqəli sahələr üzrə konsultasiya, ilkin analiz, proses dəstəyi və praktik həllər təqdim edə bilər.",
            "Xidmətlərin konkret məzmunu müraciətin növündən, ehtiyacdan və təqdim olunan məlumatlardan asılı olaraq dəyişə bilər.",
          ],
        },
        {
          id: "acceptance",
          title: "3. Xidmətə qəbul və uyğunluq",
          paragraphs: [
            "Saytda və ya kommunikasiya kanallarında müraciətin göndərilməsi avtomatik olaraq xidmətin təsdiq olunması demək deyil.",
            "Sapiens Pay aşağıdakı hallarda müraciəti qəbul etməmək, dayandırmaq və ya davam etdirməmək hüququnu özündə saxlayır:",
          ],
          items: [
            "təqdim olunan məlumatlar natamam və ya yanlış olduqda",
            "müraciət xidmət dairəmizə uyğun olmadıqda",
            "hüquqi, reputasiya və ya əməliyyat riski yüksək olduqda",
            "istifadəçi əməkdaşlıq üçün zəruri məlumatları təqdim etmədikdə",
            "xidmətlərdən sui-istifadə edildikdə",
          ],
        },
        {
          id: "user-obligations",
          title: "4. İstifadəçinin öhdəlikləri",
          paragraphs: [
            "İstifadəçi düzgün, aktual və mümkün qədər tam məlumat təqdim etməli, qanuni çərçivəyə uyğun davranmalı və sayt və xidmətlərdən dələduzluq, aldatma, manipulyasiya və ya digər zərərli məqsədlərlə istifadə etməməlidir.",
          ],
        },
        {
          id: "third-party-services",
          title: "5. Üçüncü tərəf xidmətləri",
          paragraphs: [
            "Xidmət prosesində banklar, ödəniş təminatçıları, marketplace platformaları, reklam kabinetləri və digər xarici resurslarla qarşılıqlı əlaqə yarana bilər.",
            "Sapiens Pay üçüncü tərəf platformalarının daxili qaydaları, qərarları və yekun nəticələri üzərində tam nəzarətə malik deyil.",
          ],
        },
        {
          id: "no-guarantee",
          title: "6. Zəmanət və nəticə məhdudiyyəti",
          paragraphs: [
            "Sapiens Pay hər bir müraciət üzrə eyni nəticəni və ya eyni müddəti vəd etmir. Hər müraciət ayrıca qiymətləndirilir və nəticə bir çox obyektiv amillərdən asılı ola bilər.",
          ],
        },
        {
          id: "intellectual-property",
          title: "7. Əqli mülkiyyət",
          paragraphs: [
            "Saytda yerləşdirilən dizayn, mətn, vizual materiallar, struktur və digər kontent Sapiens Pay və ya müvafiq hüquq sahiblərinə məxsusdur. Yazılı icazə olmadan onların köçürülməsi, yayılması və ya başqa məqsədlə istifadəsi qadağandır.",
          ],
        },
        {
          id: "prohibited-use",
          title: "8. Qadağan olunmuş istifadə",
          paragraphs: [
            "Sayta icazəsiz giriş cəhdləri, spam, xidmətə mane olan hücumlar, məlumatların manipulyasiyası, reputasiyaya zərər vuran hərəkətlər və hüquqa zidd istifadə halları qadağandır.",
          ],
        },
        {
          id: "liability",
          title: "9. Məsuliyyətin məhdudlaşdırılması",
          paragraphs: [
            "Qanunla yol verilən həddə Sapiens Pay dolayı zərərlər, itirilmiş gəlir, fasilə, gecikmə və ya üçüncü tərəf qərarlarından yaranan nəticələrə görə məsuliyyət daşımır.",
          ],
        },
        {
          id: "updates",
          title: "10. Şərtlərin yenilənməsi",
          paragraphs: [
            "Bu şərtlər vaxtaşırı yenilənə bilər. Yenilənmiş versiya saytda yerləşdirildiyi tarixdən qüvvəyə minir.",
          ],
        },
      ],
    },
    "cookie-policy": {
      slug: "cookie-policy",
      title: "Cookie siyasəti",
      description:
        "Sapiens Pay saytında cookie və oxşar texnologiyalardan necə istifadə edildiyini izah edir.",
      updatedAt,
      sections: [
        {
          id: "intro",
          title: "1. Cookie nədir",
          paragraphs: [
            "Cookie istifadəçinin cihazına brauzer vasitəsilə yerləşdirilən kiçik məlumat faylıdır. Bu fayllar saytın düzgün işləməsinə, istifadəçi seçimlərinin yadda saxlanmasına, performansın ölçülməsinə və istifadəçi təcrübəsinin yaxşılaşdırılmasına kömək edir.",
            "Cookie-lar adətən istifadəçini birbaşa tanımaq üçün deyil, brauzeri və cihazı müəyyən etmək, saytda davranışı anlamaq və bəzi funksiyaları işlətmək üçün istifadə olunur.",
          ],
        },
        {
          id: "types",
          title: "2. Hansı növ cookie-lardan istifadə oluna bilər",
          paragraphs: [
            "Sapiens Pay saytında aşağıdakı cookie kateqoriyalarından istifadə oluna bilər:",
          ],
        },
        {
          id: "essential",
          title: "2.1. Zəruri cookie-lar",
          paragraphs: [
            "Bu cookie-lar saytın əsas funksiyalarının işləməsi üçün lazımdır. Onlar olmadan saytın bəzi hissələri düzgün işləməyə bilər.",
          ],
          items: [
            "saytın təhlükəsiz işləməsi",
            "səhifələr arasında düzgün keçid",
            "forma göndərişlərinin işləməsi",
            "istifadəçi sessiyasının idarə olunması",
            "dil və əsas seçimlərin yadda saxlanması",
          ],
        },
        {
          id: "functional",
          title: "2.2. Funksional cookie-lar",
          paragraphs: [
            "Bu cookie-lar istifadəçinin seçimlərini yadda saxlamağa və saytı daha rahat istifadə etməyə kömək edir.",
          ],
          items: ["seçilmiş dil", "region və ya interfeys seçimi", "digər texniki seçimlər"],
        },
        {
          id: "analytics",
          title: "2.3. Analitik cookie-lar",
          paragraphs: [
            "Analitik cookie-lar istifadəçilərin saytdan necə yararlandığını, hansı səhifələrin daha çox baxıldığını, hansı məzmunun daha faydalı olduğunu və problemlərin harada yarandığını anlamağa kömək edir.",
          ],
        },
        {
          id: "marketing",
          title: "2.4. Marketinq cookie-ları",
          paragraphs: [
            "Marketinq cookie-ları reklam kampaniyalarının effektivliyini qiymətləndirmək, auditoriyanı daha yaxşı anlamaq və kommunikasiya fəaliyyətlərini optimallaşdırmaq üçün istifadə oluna bilər.",
          ],
        },
        {
          id: "third-party",
          title: "3. Üçüncü tərəf cookie-ları",
          paragraphs: [
            "Saytda analitika, video, hostinq, təhlükəsizlik və digər texniki xidmətlər üçün üçüncü tərəf alətləri tətbiq oluna bilər. Belə hallarda həmin xidmət təminatçılarının öz cookie mexanizmləri işləyə bilər.",
          ],
        },
        {
          id: "management",
          title: "4. Cookie seçimlərini necə idarə etmək olar",
          paragraphs: [
            "İstifadəçi cookie-ları brauzer parametrləri vasitəsilə bloklaya, silə və ya məhdudlaşdıra bilər. Lakin bu halda saytın bəzi funksiyaları düzgün işləməyə bilər.",
          ],
        },
        {
          id: "do-not-track",
          title: "5. Do Not Track siqnalları",
          paragraphs: [
            "Hazırda bütün brauzerlərdə vahid texniki standart olmadığı üçün Do Not Track siqnallarına eyni qaydada cavab verilməsi təmin edilmir.",
          ],
        },
        {
          id: "children",
          title: "6. Yetkinlik yaşı",
          paragraphs: [
            "Saytımız və xidmətlərimiz əsasən biznes subyektləri üçün nəzərdə tutulur və yetkinlik yaşına çatmayan şəxslər üçün məqsədli şəkildə cookie profilləşdirilməsi aparılmır.",
          ],
        },
        {
          id: "updates",
          title: "7. Dəyişikliklər",
          paragraphs: [
            "Cookie siyasəti vaxtaşırı yenilənə bilər. Əhəmiyyətli dəyişiklik olduqda yenilənmə tarixi bu səhifədə göstəriləcək.",
          ],
        },
      ],
    },
  },
  en: {
    "privacy-policy": {
      slug: "privacy-policy",
      title: "Privacy Policy",
      description:
        "Explains how Sapiens Pay collects, uses, stores, and protects user and customer information.",
      updatedAt,
      sections: [
        {
          id: "who-we-are",
          title: "1. Who we are",
          paragraphs: [
            "Sapiens Pay is a platform that provides guidance, support, and practical solutions for entrepreneurs, agencies, and online businesses in international payments, digital sales infrastructure, and related business operations.",
            "This policy applies generally whenever you use our website or contact us about our services.",
          ],
        },
        {
          id: "data-we-collect",
          title: "2. What information we may collect",
          paragraphs: [
            "We may collect information that you provide directly when you fill out a form, request a consultation, or communicate with us.",
          ],
          items: [
            "full name",
            "phone number",
            "email address",
            "company name and business activity",
            "subject of your request and description of the issue",
            "additional documents or information needed to deliver the service",
          ],
        },
        {
          id: "technical-data",
          title: "3. Technical information",
          paragraphs: [
            "When you use the site, certain technical information may be collected automatically, including your IP address, browser type, device type, operating system, visit time, referral source, and cookie data.",
            "We use this information mainly for security, performance measurement, analytics, and stable operation of the website.",
          ],
        },
        {
          id: "purposes",
          title: "4. How we use information",
          paragraphs: [
            "We use the information we collect to respond to your inquiries, determine a suitable service model, perform an initial review, communicate with you, and manage service-related processes.",
            "We may also use information to improve website functionality, run analytics, fulfill administrative obligations, and reduce the risk of fraud or misuse.",
          ],
        },
        {
          id: "legal-basis",
          title: "5. Legal bases",
          paragraphs: [
            "Processing may be based on the performance of your request, our legitimate interests, compliance with legal obligations, and, where required, your consent.",
          ],
        },
        {
          id: "sharing",
          title: "6. Information sharing",
          paragraphs: [
            "We only share information when necessary and in line with the intended purpose. This may include hosting, analytics, communications tools, legal, or technical service providers.",
            "We may also disclose information to authorized public authorities where required by law or where needed to protect our rights.",
          ],
        },
        {
          id: "retention",
          title: "7. Retention period",
          paragraphs: [
            "Information is retained only for as long as necessary. The retention period may vary depending on the nature of the request, ongoing cooperation, legal obligations, and accounting or audit requirements.",
          ],
        },
        {
          id: "security",
          title: "8. Security",
          paragraphs: [
            "We apply organizational and technical measures designed to reduce the risk of loss, unauthorized disclosure, or alteration of information. However, no data transmission over the internet can be considered completely risk-free.",
          ],
        },
        {
          id: "your-rights",
          title: "9. Your rights",
          paragraphs: [
            "Subject to applicable law, you may have the right to request access to your information, ask for corrections, request deletion or restriction of processing, and withdraw consent where processing is based on consent.",
          ],
        },
        {
          id: "third-party",
          title: "10. Third-party links",
          paragraphs: [
            "Our website may contain links to third-party resources. Sapiens Pay is not responsible for the privacy practices of those resources, and we recommend reviewing their policies before using them.",
          ],
        },
        {
          id: "children",
          title: "11. Age limitations",
          paragraphs: [
            "Our services are primarily intended for entrepreneurs and business entities. We do not intentionally collect information from minors.",
          ],
        },
        {
          id: "updates",
          title: "12. Updates",
          paragraphs: [
            "This policy may be updated from time to time. If material changes are made, the new update date will be posted on this page and additional notice may be provided where appropriate.",
          ],
        },
      ],
    },
    "terms-of-use": {
      slug: "terms-of-use",
      title: "Terms of Use",
      description:
        "Defines the rules for using the Sapiens Pay website, services, and related communication channels.",
      updatedAt,
      sections: [
        {
          id: "general",
          title: "1. General provisions",
          paragraphs: [
            "These Terms of Use define the rules for using the Sapiens Pay website, services, and related communication channels.",
            "By using our website, sending a request, or using our services, you confirm that you have reviewed and accepted these terms.",
          ],
        },
        {
          id: "service-nature",
          title: "2. Nature of the services",
          paragraphs: [
            "Sapiens Pay may provide consultation, initial assessment, process support, and practical solutions for entrepreneurs, agencies, and online businesses in international payments, digital sales infrastructure, business guidance, and related areas.",
            "The exact scope of services may vary depending on the nature of the request, the user's needs, and the information provided.",
          ],
        },
        {
          id: "acceptance",
          title: "3. Acceptance and eligibility",
          paragraphs: [
            "Submitting a request through our website or communication channels does not automatically mean the service has been accepted.",
            "Sapiens Pay reserves the right to decline, suspend, or discontinue a request in the following cases:",
          ],
          items: [
            "the information provided is incomplete or inaccurate",
            "the request falls outside our service scope",
            "legal, reputational, or operational risks are high",
            "required cooperation or documents are not provided",
            "our website or services are being misused",
          ],
        },
        {
          id: "user-obligations",
          title: "4. User obligations",
          paragraphs: [
            "Users must provide accurate, current, and reasonably complete information, act lawfully, and refrain from using the website or services for fraud, deception, manipulation, or any harmful purpose.",
          ],
        },
        {
          id: "third-party-services",
          title: "5. Third-party services",
          paragraphs: [
            "During the service process, interaction with banks, payment providers, marketplace platforms, advertising systems, and other external resources may be required.",
            "Sapiens Pay does not control the internal rules, decisions, or final outcomes of third-party platforms.",
          ],
        },
        {
          id: "no-guarantee",
          title: "6. No guarantee of outcome",
          paragraphs: [
            "Sapiens Pay does not guarantee the same outcome or the same time frame for every request. Each request is reviewed individually, and results may depend on objective factors beyond our control.",
          ],
        },
        {
          id: "intellectual-property",
          title: "7. Intellectual property",
          paragraphs: [
            "The design, text, visuals, structure, and other content published on the site belong to Sapiens Pay or the relevant rights holders. Copying, distributing, or using them without written permission is prohibited.",
          ],
        },
        {
          id: "prohibited-use",
          title: "8. Prohibited use",
          paragraphs: [
            "Unauthorized access attempts, spam, attacks that disrupt service, data manipulation, harmful conduct affecting reputation, and any unlawful use are prohibited.",
          ],
        },
        {
          id: "liability",
          title: "9. Limitation of liability",
          paragraphs: [
            "To the extent permitted by law, Sapiens Pay is not liable for indirect losses, lost profit, delays, interruptions, or outcomes caused by third-party decisions.",
          ],
        },
        {
          id: "updates",
          title: "10. Updates to these terms",
          paragraphs: [
            "These terms may be updated from time to time. The updated version becomes effective from the date it is published on the website.",
          ],
        },
      ],
    },
    "cookie-policy": {
      slug: "cookie-policy",
      title: "Cookie Policy",
      description:
        "Explains how cookies and similar technologies are used on the Sapiens Pay website.",
      updatedAt,
      sections: [
        {
          id: "intro",
          title: "1. What is a cookie",
          paragraphs: [
            "A cookie is a small data file placed on a user's device through the browser. Cookies help the website work properly, remember user preferences, measure performance, and improve user experience.",
            "Cookies are generally used not to identify a person directly, but to recognize the browser or device, understand behavior on the site, and enable certain functions.",
          ],
        },
        {
          id: "types",
          title: "2. Types of cookies we may use",
          paragraphs: [
            "The Sapiens Pay website may use the following cookie categories:",
          ],
        },
        {
          id: "essential",
          title: "2.1. Essential cookies",
          paragraphs: [
            "These cookies are necessary for the core functions of the website. Without them, some parts of the site may not work correctly.",
          ],
          items: [
            "secure operation of the website",
            "proper page-to-page navigation",
            "processing form submissions",
            "managing user sessions",
            "remembering language and core preferences",
          ],
        },
        {
          id: "functional",
          title: "2.2. Functional cookies",
          paragraphs: [
            "These cookies help remember user preferences and make the site easier to use.",
          ],
          items: ["selected language", "region or interface preferences", "other technical preferences"],
        },
        {
          id: "analytics",
          title: "2.3. Analytics cookies",
          paragraphs: [
            "Analytics cookies help us understand how visitors use the site, which pages are viewed most often, which content is useful, and where technical problems may occur.",
          ],
        },
        {
          id: "marketing",
          title: "2.4. Marketing cookies",
          paragraphs: [
            "Marketing cookies may be used to evaluate advertising effectiveness, better understand audiences, and optimize communication activity.",
          ],
        },
        {
          id: "third-party",
          title: "3. Third-party cookies",
          paragraphs: [
            "The website may use third-party tools for analytics, video, hosting, security, and other technical services. In those cases, the relevant providers may set and manage their own cookies.",
          ],
        },
        {
          id: "management",
          title: "4. Managing cookie choices",
          paragraphs: [
            "Users can block, delete, or restrict cookies through browser settings. However, some website features may stop working properly as a result.",
          ],
        },
        {
          id: "do-not-track",
          title: "5. Do Not Track signals",
          paragraphs: [
            "Because there is no single technical standard across all browsers, Do Not Track signals are not handled in a uniform way at this time.",
          ],
        },
        {
          id: "children",
          title: "6. Age limitations",
          paragraphs: [
            "Our website and services are mainly intended for businesses, and we do not intentionally use cookies to profile minors.",
          ],
        },
        {
          id: "updates",
          title: "7. Updates",
          paragraphs: [
            "This Cookie Policy may be updated from time to time. If material changes are made, the updated date will be shown on this page.",
          ],
        },
      ],
    },
  },
  ru: {
    "privacy-policy": {
      slug: "privacy-policy",
      title: "Политика конфиденциальности",
      description:
        "Объясняет, как Sapiens Pay собирает, использует, хранит и защищает данные пользователей и клиентов.",
      updatedAt,
      sections: [
        {
          id: "who-we-are",
          title: "1. Кто мы",
          paragraphs: [
            "Sapiens Pay — это платформа, которая предоставляет сопровождение, поддержку и практические решения для предпринимателей, агентств и онлайн-бизнесов в сфере международных платежей, цифровой инфраструктуры продаж и связанных бизнес-процессов.",
            "Эта политика в общем виде применяется во всех случаях, когда вы используете наш сайт или связываетесь с нами по поводу наших услуг.",
          ],
        },
        {
          id: "data-we-collect",
          title: "2. Какие данные мы можем собирать",
          paragraphs: [
            "Мы можем собирать информацию, которую вы предоставляете напрямую при заполнении формы, запросе консультации или общении с нами.",
          ],
          items: [
            "имя и фамилия",
            "номер телефона",
            "адрес электронной почты",
            "название компании и направление деятельности",
            "тема обращения и описание задачи",
            "дополнительные документы или сведения, необходимые для оказания услуги",
          ],
        },
        {
          id: "technical-data",
          title: "3. Технические данные",
          paragraphs: [
            "При использовании сайта автоматически могут собираться некоторые технические данные, включая IP-адрес, тип браузера, тип устройства, операционную систему, время посещения, источник перехода и данные cookie.",
            "Мы используем эти данные в основном для безопасности, измерения производительности, аналитики и стабильной работы сайта.",
          ],
        },
        {
          id: "purposes",
          title: "4. Для чего мы используем данные",
          paragraphs: [
            "Мы используем собранную информацию, чтобы отвечать на ваши запросы, определять подходящий формат услуги, проводить первичный анализ, поддерживать коммуникацию и управлять процессами оказания услуг.",
            "Также данные могут использоваться для улучшения функциональности сайта, проведения аналитики, выполнения административных обязанностей и снижения риска мошенничества или злоупотреблений.",
          ],
        },
        {
          id: "legal-basis",
          title: "5. Правовые основания",
          paragraphs: [
            "Обработка данных может осуществляться на основании исполнения вашего запроса, наших законных интересов, выполнения правовых обязанностей и, при необходимости, вашего согласия.",
          ],
        },
        {
          id: "sharing",
          title: "6. Передача данных",
          paragraphs: [
            "Мы передаем информацию только в необходимых случаях и в пределах заявленной цели. Это может включать хостинг, аналитику, коммуникационные инструменты, юридических или технических подрядчиков.",
            "Мы также можем раскрывать данные уполномоченным государственным органам, если этого требует закон или если это необходимо для защиты наших прав.",
          ],
        },
        {
          id: "retention",
          title: "7. Срок хранения",
          paragraphs: [
            "Информация хранится только столько, сколько это необходимо. Срок хранения зависит от характера запроса, текущего сотрудничества, правовых обязанностей, а также бухгалтерских и аудиторских требований.",
          ],
        },
        {
          id: "security",
          title: "8. Безопасность",
          paragraphs: [
            "Мы применяем организационные и технические меры, направленные на снижение риска утраты, несанкционированного раскрытия или изменения данных. При этом передача данных через интернет не может считаться полностью безопасной.",
          ],
        },
        {
          id: "your-rights",
          title: "9. Ваши права",
          paragraphs: [
            "В соответствии с применимым законодательством вы можете иметь право запросить доступ к своим данным, потребовать исправления, удаления или ограничения обработки, а также отозвать согласие, если обработка основана на согласии.",
          ],
        },
        {
          id: "third-party",
          title: "10. Ссылки на сторонние ресурсы",
          paragraphs: [
            "На нашем сайте могут размещаться ссылки на сторонние ресурсы. Sapiens Pay не несет ответственности за их правила конфиденциальности, и мы рекомендуем ознакомиться с их политиками до использования таких ресурсов.",
          ],
        },
        {
          id: "children",
          title: "11. Возрастные ограничения",
          paragraphs: [
            "Наши услуги в основном предназначены для предпринимателей и бизнес-субъектов. Мы не собираем данные несовершеннолетних намеренно.",
          ],
        },
        {
          id: "updates",
          title: "12. Обновления",
          paragraphs: [
            "Эта политика может периодически обновляться. Если изменения будут существенными, на странице появится новая дата обновления, а при необходимости будет предоставлено дополнительное уведомление.",
          ],
        },
      ],
    },
    "terms-of-use": {
      slug: "terms-of-use",
      title: "Условия использования",
      description:
        "Определяет правила использования сайта Sapiens Pay, услуг и связанных каналов коммуникации.",
      updatedAt,
      sections: [
        {
          id: "general",
          title: "1. Общие положения",
          paragraphs: [
            "Эти Условия использования определяют правила работы с сайтом Sapiens Pay, нашими услугами и связанными каналами коммуникации.",
            "Используя наш сайт, отправляя заявку или пользуясь нашими услугами, вы подтверждаете, что ознакомились с этими условиями и принимаете их.",
          ],
        },
        {
          id: "service-nature",
          title: "2. Характер услуг",
          paragraphs: [
            "Sapiens Pay может предоставлять консультации, первичную оценку, процессное сопровождение и практические решения для предпринимателей, агентств и онлайн-бизнесов в сфере международных платежей, цифровой инфраструктуры продаж, бизнес-навигации и смежных направлений.",
            "Конкретный объем услуг может меняться в зависимости от характера запроса, потребностей пользователя и предоставленной информации.",
          ],
        },
        {
          id: "acceptance",
          title: "3. Принятие запроса и соответствие",
          paragraphs: [
            "Отправка запроса через сайт или каналы коммуникации не означает автоматического подтверждения услуги.",
            "Sapiens Pay оставляет за собой право отклонить, приостановить или прекратить рассмотрение запроса в следующих случаях:",
          ],
          items: [
            "предоставленная информация неполная или недостоверная",
            "запрос не входит в сферу наших услуг",
            "высокий юридический, репутационный или операционный риск",
            "не предоставлены необходимые документы или содействие",
            "сайт или услуги используются недобросовестно",
          ],
        },
        {
          id: "user-obligations",
          title: "4. Обязанности пользователя",
          paragraphs: [
            "Пользователь обязан предоставлять точную, актуальную и по возможности полную информацию, действовать в рамках закона и не использовать сайт или услуги для мошенничества, введения в заблуждение, манипуляций или иных вредоносных целей.",
          ],
        },
        {
          id: "third-party-services",
          title: "5. Сторонние сервисы",
          paragraphs: [
            "В процессе оказания услуг может потребоваться взаимодействие с банками, платежными провайдерами, маркетплейсами, рекламными системами и другими внешними ресурсами.",
            "Sapiens Pay не контролирует внутренние правила, решения и итоговые результаты сторонних платформ.",
          ],
        },
        {
          id: "no-guarantee",
          title: "6. Отсутствие гарантии результата",
          paragraphs: [
            "Sapiens Pay не гарантирует одинаковый результат или одинаковые сроки по каждому обращению. Каждый кейс рассматривается индивидуально, а итог зависит в том числе от объективных факторов вне нашего контроля.",
          ],
        },
        {
          id: "intellectual-property",
          title: "7. Интеллектуальная собственность",
          paragraphs: [
            "Дизайн, тексты, визуальные материалы, структура и другой контент сайта принадлежат Sapiens Pay или соответствующим правообладателям. Их копирование, распространение или использование без письменного разрешения запрещено.",
          ],
        },
        {
          id: "prohibited-use",
          title: "8. Запрещенное использование",
          paragraphs: [
            "Запрещены попытки несанкционированного доступа, спам, атаки, нарушающие работу сервиса, манипуляции с данными, действия, наносящие вред репутации, и любое незаконное использование.",
          ],
        },
        {
          id: "liability",
          title: "9. Ограничение ответственности",
          paragraphs: [
            "В пределах, допустимых законом, Sapiens Pay не несет ответственности за косвенные убытки, упущенную прибыль, задержки, перерывы в работе и последствия решений третьих лиц.",
          ],
        },
        {
          id: "updates",
          title: "10. Обновление условий",
          paragraphs: [
            "Эти условия могут периодически обновляться. Обновленная версия вступает в силу с даты публикации на сайте.",
          ],
        },
      ],
    },
    "cookie-policy": {
      slug: "cookie-policy",
      title: "Политика cookie",
      description:
        "Объясняет, как на сайте Sapiens Pay используются cookie и аналогичные технологии.",
      updatedAt,
      sections: [
        {
          id: "intro",
          title: "1. Что такое cookie",
          paragraphs: [
            "Cookie — это небольшой файл данных, который размещается на устройстве пользователя через браузер. Cookie помогают сайту работать корректно, запоминать пользовательские настройки, измерять производительность и улучшать пользовательский опыт.",
            "Как правило, cookie используются не для прямой идентификации человека, а для распознавания браузера или устройства, понимания поведения на сайте и работы отдельных функций.",
          ],
        },
        {
          id: "types",
          title: "2. Какие типы cookie мы можем использовать",
          paragraphs: [
            "На сайте Sapiens Pay могут использоваться следующие категории cookie:",
          ],
        },
        {
          id: "essential",
          title: "2.1. Обязательные cookie",
          paragraphs: [
            "Эти cookie необходимы для основных функций сайта. Без них некоторые части сайта могут работать некорректно.",
          ],
          items: [
            "безопасная работа сайта",
            "корректная навигация между страницами",
            "обработка отправки форм",
            "управление пользовательской сессией",
            "запоминание языка и основных настроек",
          ],
        },
        {
          id: "functional",
          title: "2.2. Функциональные cookie",
          paragraphs: [
            "Эти cookie помогают запоминать пользовательские настройки и делают использование сайта удобнее.",
          ],
          items: ["выбранный язык", "регион или настройки интерфейса", "другие технические предпочтения"],
        },
        {
          id: "analytics",
          title: "2.3. Аналитические cookie",
          paragraphs: [
            "Аналитические cookie помогают понять, как пользователи взаимодействуют с сайтом, какие страницы просматриваются чаще всего, какой контент полезен и где возникают технические проблемы.",
          ],
        },
        {
          id: "marketing",
          title: "2.4. Маркетинговые cookie",
          paragraphs: [
            "Маркетинговые cookie могут использоваться для оценки эффективности рекламы, лучшего понимания аудитории и оптимизации коммуникационной активности.",
          ],
        },
        {
          id: "third-party",
          title: "3. Сторонние cookie",
          paragraphs: [
            "Сайт может использовать сторонние инструменты для аналитики, видео, хостинга, безопасности и других технических сервисов. В таких случаях соответствующие провайдеры могут устанавливать и управлять собственными cookie.",
          ],
        },
        {
          id: "management",
          title: "4. Управление настройками cookie",
          paragraphs: [
            "Пользователь может блокировать, удалять или ограничивать cookie через настройки браузера. Однако из-за этого некоторые функции сайта могут работать некорректно.",
          ],
        },
        {
          id: "do-not-track",
          title: "5. Сигналы Do Not Track",
          paragraphs: [
            "Поскольку во всех браузерах нет единого технического стандарта, сигналы Do Not Track сейчас не обрабатываются единообразно.",
          ],
        },
        {
          id: "children",
          title: "6. Возрастные ограничения",
          paragraphs: [
            "Наш сайт и услуги в основном предназначены для бизнеса, и мы не используем cookie для целенаправленного профилирования несовершеннолетних.",
          ],
        },
        {
          id: "updates",
          title: "7. Обновления",
          paragraphs: [
            "Эта Политика cookie может периодически обновляться. Если изменения будут существенными, на этой странице будет указана новая дата обновления.",
          ],
        },
      ],
    },
  },
};

export const getLegalDocument = (locale: Locale, slug: LegalDocumentKey) =>
  legalDocuments[locale][slug];

export const getLegalDocumentLabel = (locale: Locale, slug: LegalDocumentKey) => {
  const t = dict[locale];

  if (slug === "privacy-policy") {
    return t.footerPrivacy;
  }

  if (slug === "terms-of-use") {
    return t.footerTerms;
  }

  return t.footerCookies;
};
