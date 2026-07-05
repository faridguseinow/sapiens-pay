import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceLeadCta, ServiceLeadModal } from "@/app/_components/service-lead-cta";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { dict, isLocale, locales, type Locale } from "@/app/lib/i18n";
import { localizedMetadata } from "@/app/lib/seo";

const content = {
  az: {
    eyebrow: "Xarici şirkət açılması",
    title: "Biznesinizi beynəlxalq bazara uyğun hüquqi strukturla qurun",
    lead: "Fəaliyyət modelinizə uyğun ölkə və şirkət formasını seçir, qeydiyyat sənədlərini hazırlayır və prosesi uzaqdan müşayiət edirik.",
    home: "Ana səhifə",
    services: "Xidmətlər",
    features: ["Rəsmi dövlət qeydiyyatı", "Uzaqdan sənədləşmə prosesi", "Bank və ödəniş həllərinə hazırlıq"],
    aboutEyebrow: "Xidmət haqqında",
    aboutTitle: "Şirkət qeydiyyatından beynəlxalq əməliyyatlara qədər",
    aboutLead: "Yurisdiksiya seçimi yalnız qeydiyyat qiymətinə görə deyil, fəaliyyət sahəsi, müştəri coğrafiyası, bankçılıq, ödəniş sistemləri və hesabat öhdəliklərinə görə aparılmalıdır.",
    benefits: [
      ["Beynəlxalq ödəniş qəbulu", "Uyğun struktur Stripe, Shopify Payments və digər həllərə müraciət üçün hüquqi baza yarada bilər."],
      ["Xarici bank hesabları", "Şirkət məlumatları ilə biznes hesabına müraciət üçün sənəd bazası formalaşdırılır."],
      ["Marketplace fəaliyyəti", "Amazon, Etsy və digər platformalarda korporativ satıcı modeli üçün struktur yaradır."],
      ["Xarici tərəfdaşlarla iş", "Müqavilə və hesab-fakturaları hüquqi şəxs adından təqdim etməyə imkan verir."],
      ["Brend və investisiya hazırlığı", "Beynəlxalq tərəfdaşlıq və investisiya danışıqları üçün daha sistemli baza yaradır."],
      ["Rəsmi və şəffaf fəaliyyət", "Qeydiyyat, hesabat və vergi öhdəlikləri aydın hüquqi çərçivədə qurulur."],
    ],
    countriesEyebrow: "Yurisdiksiyalar",
    countriesTitle: "Məqsədinizə uyğun ölkəni birlikdə seçirik",
    countriesLead: "Aşağıdakı istiqamətlər nümunədir. Yekun seçim biznes modeliniz və hüquqi-vergi tələbləri təhlil edildikdən sonra edilir.",
    countries: [
      ["Böyük Britaniya", "LTD", "E-commerce, agentliklər və beynəlxalq xidmət biznesləri üçün geniş istifadə olunan struktur."],
      ["ABŞ", "LLC / C-Corp", "Onlayn biznes, SaaS, marketplace və investisiya planları üçün fərqli hüquqi forma seçimləri."],
      ["BƏƏ", "Mainland / Free Zone", "Yaxın Şərq bazarı, regional əməliyyatlar və uyğun lisenziyalı fəaliyyətlər üçün seçimlər."],
      ["Honq Konq", "Limited", "Asiya bazarı, beynəlxalq ticarət və xarici kontragentlərlə iş üçün nəzərdən keçirilən struktur."],
    ],
    countryAction: "Konsultasiya al",
    includedEyebrow: "Xidmətə daxildir",
    includedTitle: "Qeydiyyat prosesini vahid mərkəzdən idarə edirik",
    included: [
      ["Yurisdiksiya və hüquqi forma seçimi", "Məqsəd, əməliyyat coğrafiyası və planlaşdırılan ödəniş axınını təhlil edirik."],
      ["Ad və fəaliyyət yoxlaması", "Şirkət adı və fəaliyyət təsvirini qeydiyyat tələblərinə uyğun hazırlayırıq."],
      ["Sənədlərin hazırlanması", "Təsisçi və şirkət məlumatlarını qeydiyyat formatına uyğun formalaşdırırıq."],
      ["Qeydiyyatın müşayiəti", "Müraciət, dövlət rüsumları və tələb olunan yoxlamalar üzrə prosesi izləyirik."],
      ["Korporativ sənədlərin təhvili", "Qeydiyyat tamamlandıqdan sonra əsas şirkət sənədlərini sistemli şəkildə təqdim edirik."],
      ["Növbəti addımlar", "Bank hesabı, ödəniş sistemi və davamlı hesabat öhdəlikləri üzrə istiqamət veririk."],
    ],
    processEyebrow: "İş prosesi",
    processTitle: "Şirkət qeydiyyatını dörd mərhələdə tamamlayırıq",
    steps: [
      ["Konsultasiya", "Biznes modeli, ölkələr, müştərilər və ödəniş ehtiyaclarını müəyyənləşdiririk."],
      ["Struktur seçimi", "Uyğun yurisdiksiya, hüquqi forma və tələb olunan xidmət paketini hazırlayırıq."],
      ["Sənədlər və qeydiyyat", "Məlumatları toplayır, sənədləri hazırlayır və rəsmi müraciəti müşayiət edirik."],
      ["Təhvil və davam planı", "Şirkət sənədlərini təhvil verir, bankçılıq və hesabat üzrə növbəti addımları izah edirik."],
    ],
    note: "Qeydiyyat müddəti, qiymət, sənəd və hesabat tələbləri seçilən ölkə və hüquqi formadan asılıdır. Vergi və hüquqi qərarlar üçün müvafiq yurisdiksiyada lisenziyalı mütəxəssis rəyi tələb oluna bilər.",
    ctaTitle: "Biznesiniz üçün doğru yurisdiksiyanı seçək",
    ctaText: "Fəaliyyət modelinizi və planlarınızı nəzərdən keçirib uyğun şirkət strukturunu təklif edəcəyik.",
  },
  ru: {
    eyebrow: "Регистрация компании за рубежом",
    title: "Создайте юридическую структуру для работы на международном рынке",
    lead: "Подбираем страну и форму компании под ваш бизнес, готовим документы и дистанционно сопровождаем регистрацию.",
    home: "Главная", services: "Услуги",
    features: ["Официальная регистрация", "Дистанционное оформление", "Подготовка к банкингу и платежам"],
    aboutEyebrow: "Об услуге",
    aboutTitle: "От регистрации компании до международных операций",
    aboutLead: "Юрисдикцию выбирают с учетом деятельности, географии клиентов, банков, платежных систем и отчетных обязательств, а не только стоимости регистрации.",
    benefits: [
      ["Международные платежи", "Подходящая структура может создать юридическую основу для заявок в Stripe, Shopify Payments и другие сервисы."],
      ["Зарубежный бизнес-счет", "Формируется документальная база для подачи заявки на корпоративный счет."],
      ["Работа с маркетплейсами", "Структура для корпоративного продавца на Amazon, Etsy и других площадках."],
      ["Иностранные контрагенты", "Возможность заключать договоры и выставлять счета от имени юридического лица."],
      ["Бренд и инвестиции", "Более системная база для партнерств и переговоров с инвесторами."],
      ["Прозрачная деятельность", "Регистрация, отчетность и налоговые обязательства выстраиваются в правовом поле."],
    ],
    countriesEyebrow: "Юрисдикции", countriesTitle: "Подберем страну под ваши цели",
    countriesLead: "Направления ниже — примеры. Финальный выбор делается после анализа бизнес-модели и юридических и налоговых требований.",
    countries: [
      ["Великобритания", "LTD", "Популярная структура для e-commerce, агентств и международных услуг."],
      ["США", "LLC / C-Corp", "Разные формы для онлайн-бизнеса, SaaS, маркетплейсов и инвестиционных планов."],
      ["ОАЭ", "Mainland / Free Zone", "Варианты для рынка Ближнего Востока, региональных операций и лицензируемой деятельности."],
      ["Гонконг", "Limited", "Структура для азиатского рынка, международной торговли и иностранных контрагентов."],
    ],
    countryAction: "Получить консультацию",
    includedEyebrow: "Что входит", includedTitle: "Управляем регистрацией из одного центра",
    included: [
      ["Выбор юрисдикции и формы", "Анализируем цели, географию и планируемые платежные потоки."],
      ["Проверка названия и деятельности", "Готовим название и описание деятельности под требования регистрации."],
      ["Подготовка документов", "Формируем данные учредителей и компании в требуемом формате."],
      ["Сопровождение регистрации", "Отслеживаем подачу, пошлины и необходимые проверки."],
      ["Передача корпоративных документов", "После регистрации системно передаем основной пакет документов."],
      ["Следующие шаги", "Даем направление по банкингу, платежным системам и отчетности."],
    ],
    processEyebrow: "Процесс", processTitle: "Завершаем регистрацию за четыре этапа",
    steps: [
      ["Консультация", "Определяем модель бизнеса, рынки, клиентов и платежные задачи."],
      ["Выбор структуры", "Подбираем юрисдикцию, юридическую форму и пакет услуг."],
      ["Документы и регистрация", "Собираем данные, готовим документы и сопровождаем официальную подачу."],
      ["Передача и план", "Передаем документы и объясняем дальнейшие шаги по банкингу и отчетности."],
    ],
    note: "Сроки, стоимость, документы и отчетность зависят от страны и юридической формы. Для налоговых и юридических решений может потребоваться консультация лицензированного специалиста в выбранной юрисдикции.",
    ctaTitle: "Выберем подходящую юрисдикцию", ctaText: "Изучим вашу модель и предложим подходящую структуру компании.",
  },
  en: {
    eyebrow: "Foreign company formation",
    title: "Build a legal structure for operating in international markets",
    lead: "We help select a country and legal form for your business, prepare documents, and support remote registration.",
    home: "Home", services: "Services",
    features: ["Official registration", "Remote documentation", "Banking and payment readiness"],
    aboutEyebrow: "About the service",
    aboutTitle: "From company registration to international operations",
    aboutLead: "Jurisdiction selection should consider activity, customer geography, banking, payment systems, and reporting duties—not registration cost alone.",
    benefits: [
      ["International payments", "An appropriate structure can provide a legal basis for applying to Stripe, Shopify Payments, and other services."],
      ["Foreign business banking", "A corporate document base is created for business-account applications."],
      ["Marketplace operations", "A structure for corporate selling on Amazon, Etsy, and other platforms."],
      ["Foreign counterparties", "Contract and invoice through a registered legal entity."],
      ["Brand and investment readiness", "A more structured base for partnerships and investment discussions."],
      ["Transparent operations", "Registration, reporting, and tax duties are organized within a legal framework."],
    ],
    countriesEyebrow: "Jurisdictions", countriesTitle: "We select a country around your goals",
    countriesLead: "These are examples. Final selection follows an assessment of your business model and legal and tax requirements.",
    countries: [
      ["United Kingdom", "LTD", "A common structure for e-commerce, agencies, and international services."],
      ["United States", "LLC / C-Corp", "Different forms for online businesses, SaaS, marketplaces, and investment plans."],
      ["United Arab Emirates", "Mainland / Free Zone", "Options for Middle East markets, regional operations, and licensed activities."],
      ["Hong Kong", "Limited", "A structure considered for Asian markets, international trade, and foreign counterparties."],
    ],
    countryAction: "Get a consultation",
    includedEyebrow: "What is included", includedTitle: "We manage registration from one place",
    included: [
      ["Jurisdiction and form selection", "We assess goals, geography, and planned payment flows."],
      ["Name and activity review", "We prepare the company name and business description for filing."],
      ["Document preparation", "We organize founder and company information in the required format."],
      ["Registration support", "We track filing, government fees, and required checks."],
      ["Corporate document handover", "We provide an organized core document pack after registration."],
      ["Next-step guidance", "We outline banking, payment-system, and reporting next steps."],
    ],
    processEyebrow: "Process", processTitle: "Company formation in four stages",
    steps: [
      ["Consultation", "We define the business model, markets, customers, and payment needs."],
      ["Structure selection", "We select the jurisdiction, legal form, and service scope."],
      ["Documents and registration", "We collect data, prepare documents, and support official filing."],
      ["Handover and roadmap", "We provide documents and explain banking and reporting next steps."],
    ],
    note: "Timing, pricing, documentation, and reporting depend on the jurisdiction and legal form. Tax and legal decisions may require advice from a licensed professional in the selected jurisdiction.",
    ctaTitle: "Let’s select the right jurisdiction", ctaText: "We will assess your model and recommend an appropriate company structure.",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localizedMetadata({
    locale,
    path: "/services/company-formation",
    title: content[locale].title,
    description: content[locale].lead,
  });
}

export default async function CompanyFormationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam;
  const page = content[locale];
  const t = dict[locale];

  return (
    <main className="service-page" lang={locale}>
      <SiteHeader locale={locale} currentPath="/services/company-formation" actionHref="#consultation" actionLabel={t.headerCta} />

      <section className="service-detail-hero service-detail-hero--company" id="home">
        <div className="container">
          <nav className="service-breadcrumbs" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{page.home}</Link><span>›</span>
            <Link href={`/${locale}#services`}>{page.services}</Link><span>›</span><span>{page.eyebrow}</span>
          </nav>
          <div className="service-detail-hero__card">
            <div className="service-detail-hero__copy">
              <p className="service-eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.lead}</p>
              <ServiceLeadCta locale={locale} service="company-formation" sourceLabel="hero" />
            </div>
            <div className="company-service-visual" aria-hidden="true">
              <div className="company-service-visual__globe"><i /><i /><i /></div>
              <div className="company-service-visual__building"><span /><span /><span /><span /><span /><span /></div>
            </div>
          </div>
          <div className="service-detail-features">
            {page.features.map((feature, index) => <div key={feature}><span>0{index + 1}</span><p>{feature}</p></div>)}
          </div>
        </div>
      </section>

      <section className="service-about-section">
        <div className="container">
          <div className="service-section-heading"><p className="service-eyebrow">{page.aboutEyebrow}</p><h2>{page.aboutTitle}</h2><p>{page.aboutLead}</p></div>
          <div className="service-benefits-grid">
            {page.benefits.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="company-jurisdictions">
        <div className="container">
          <div className="service-section-heading"><p className="service-eyebrow">{page.countriesEyebrow}</p><h2>{page.countriesTitle}</h2><p>{page.countriesLead}</p></div>
          <div className="company-country-grid">
            {page.countries.map(([country, form, text], index) => (
              <article key={country}>
                <div><span>0{index + 1}</span><b>{form}</b></div><h3>{country}</h3><p>{text}</p>
                <a
                  href="#consultation"
                  data-service="company-formation"
                  data-package={country}
                  data-source-label="country-card"
                >{page.countryAction}<span>→</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="company-included-section">
        <div className="container">
          <div className="service-section-heading"><p className="service-eyebrow">{page.includedEyebrow}</p><h2>{page.includedTitle}</h2></div>
          <div className="company-included-grid">
            {page.included.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="service-process-section">
        <div className="container">
          <div className="service-section-heading"><p className="service-eyebrow">{page.processEyebrow}</p><h2>{page.processTitle}</h2></div>
          <ol className="service-process-list">
            {page.steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
          </ol>
          <p className="company-legal-note">* {page.note}</p>
          <div className="service-final-cta">
            <div><h2>{page.ctaTitle}</h2><p>{page.ctaText}</p></div><ServiceLeadCta locale={locale} service="company-formation" sourceLabel="bottom-cta" />
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} /><MobileFooterNav locale={locale} onHomePage />
      <ServiceLeadModal locale={locale} service="company-formation" />
    </main>
  );
}
