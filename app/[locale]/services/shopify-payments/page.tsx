import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceLeadCta, ServiceLeadModal } from "@/app/_components/service-lead-cta";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { dict, isLocale, locales, type Locale } from "@/app/lib/i18n";
import { localizedMetadata } from "@/app/lib/seo";

const content = {
  az: {
    eyebrow: "Shopify Payments",
    title: "Shopify mağazanızda beynəlxalq ödəniş qəbulunu qurun",
    lead: "Mağazanızın uyğunluğunu yoxlayır, Shopify Payments onboarding və verifikasiya prosesini hazırlayır, payout axınını düzgün qurmağa kömək edirik.",
    home: "Ana səhifə",
    services: "Xidmətlər",
    features: ["Mağaza və məhsul auditi", "Onboarding və verifikasiya", "Payout hesabının qoşulması"],
    aboutEyebrow: "Xidmət haqqında",
    aboutTitle: "Checkout-dan payout-a qədər tam quraşdırma",
    aboutLead: "Shopify Payments uyğun ölkə, fəaliyyət kateqoriyası, hesab sahibi məlumatları, bank hesabı və təhlükəsizlik tələblərinə əsasən aktivləşdirilir.",
    benefits: [
      ["Uyğunluq auditi", "Mağaza, məhsullar, siyasət səhifələri və biznes modelini ilkin yoxlayırıq."],
      ["Hesab strukturunun seçilməsi", "Şirkətsiz fərdi model və ya şirkət üzərindən biznes modeli arasında uyğun variantı müəyyənləşdiririk."],
      ["Məlumatların hazırlanması", "Şəxsiyyət, ünvan, mağaza və tələb olunduqda şirkət sənədlərini quraşdırmaya hazırlayırıq."],
      ["Shopify Payments aktivləşməsi", "Admin paneldə aktivləşmə və hesab məlumatlarının düzgün daxil edilməsini müşayiət edirik."],
      ["Payout bağlantısı", "Uyğun bank hesabı və payout valyutası üzrə texniki quraşdırmanı tamamlayırıq."],
      ["Təhlükəsizlik və təhvil", "İki addımlı doğrulama, payout yoxlaması və əsas istifadə qaydalarını təhvil veririk."],
    ],
    pricingEyebrow: "Paketlər",
    pricingTitle: "Mağazanızın mərhələsinə uyğun iki quraşdırma modeli",
    pricingLead: "Hər paket üzrə yekun qiymət mağaza, ölkə, sənədlər və quraşdırma mürəkkəbliyinə görə konsultasiyada müəyyən edilir.",
    customPrice: "Fərdi tarif",
    customSub: "Konsultasiyadan sonra",
    action: "Müraciət et",
    popular: "Böyüyən biznes üçün",
    packages: [
      ["Şirkətsiz quraşdırma", "Fərdi model", "595 AZN", "474.30 AZN", "20", ["Şirkət qeydiyyatı olmadan uyğunluq analizi", "Ayda təxminən 6 800–8 500 AZN dövriyyəyə qədər tövsiyə olunan model", "Xarici bank hesabının açılması", "Mağaza və məhsul auditi", "Şəxsi məlumatlarla onboarding dəstəyi", "Verifikasiya və payout quraşdırması"]],
      ["Şirkət üzərindən quraşdırma", "Biznes model", "765 AZN", "593.30 AZN", "22", ["Rəsmi şirkət üzərindən Shopify Payments", "Şirkət və təsisçi sənədlərinin yoxlanması", "Mağaza uyğunluğu və siyasət səhifələrinin auditi", "Biznes verifikasiyasının müşayiəti", "Bank hesabı və payout bağlantısı", "Böyüyən əməliyyatlar üçün daha strukturlaşdırılmış model"]],
    ],
    note: "* Şirkət üzərindən paket üçün aktiv, rəsmi qeydiyyatdan keçmiş şirkət və korporativ sənədlər tələb olunur.",
    turnoverNote: "6 800–8 500 AZN aylıq dövriyyə şirkətsiz paket üçün Sapiens Pay-in tövsiyə etdiyi əməliyyat diapazonudur və Shopify tərəfindən müəyyən edilmiş rəsmi limit deyil.",
    complianceNote: "Shopify Payments yalnız dəstəklənən ölkə, uyğun fəaliyyət kateqoriyası və tələb olunan verifikasiya şərtləri təmin edildikdə aktivləşdirilə bilər. Yekun qərarı Shopify və onun maliyyə tərəfdaşları verir.",
    processEyebrow: "İş prosesi",
    processTitle: "Quraşdırmanı dörd aydın mərhələdə tamamlayırıq",
    steps: [
      ["Mağaza auditi", "Məhsulları, siyasət səhifələrini, domeni və checkout hazırlığını yoxlayırıq."],
      ["Model və sənədlər", "Fərdi və ya şirkət modelini seçib tələb olunan məlumatları hazırlayırıq."],
      ["Aktivləşmə", "Shopify Payments onboarding, verifikasiya və təhlükəsizlik addımlarını müşayiət edirik."],
      ["Payout və təhvil", "Bank hesabını qoşur, testləri tamamlayır və istifadə qaydalarını təqdim edirik."],
    ],
    ctaTitle: "Mağazanız üçün uyğun Shopify Payments modelini seçək",
    ctaText: "Qısa konsultasiyada mağazanızı və planlaşdırılan dövriyyəni qiymətləndirib uyğun paketi təklif edəcəyik.",
  },
  ru: {
    eyebrow: "Shopify Payments",
    title: "Настройте прием международных платежей в магазине Shopify",
    lead: "Проверяем магазин, готовим онбординг и верификацию Shopify Payments и помогаем правильно настроить выплаты.",
    home: "Главная",
    services: "Услуги",
    features: ["Аудит магазина и товаров", "Онбординг и верификация", "Подключение счета для выплат"],
    aboutEyebrow: "Об услуге",
    aboutTitle: "Полная настройка от checkout до выплат",
    aboutLead: "Активация зависит от поддерживаемой страны, категории бизнеса, данных владельца, банковского счета и требований безопасности.",
    benefits: [
      ["Аудит соответствия", "Проверяем магазин, товары, политики и бизнес-модель."],
      ["Выбор структуры", "Определяем подходящий вариант: индивидуальная модель без компании или корпоративная модель."],
      ["Подготовка данных", "Готовим личные, адресные, магазинные и при необходимости корпоративные данные."],
      ["Активация Shopify Payments", "Сопровождаем включение и корректное заполнение информации."],
      ["Подключение выплат", "Настраиваем подходящий банковский счет и валюту выплат."],
      ["Безопасность и передача", "Настраиваем 2FA, проверяем выплаты и передаем инструкцию."],
    ],
    pricingEyebrow: "Пакеты",
    pricingTitle: "Две модели настройки под этап развития магазина",
    pricingLead: "Финальная стоимость определяется после консультации с учетом страны, документов и сложности настройки.",
    customPrice: "Индивидуальный тариф",
    customSub: "После консультации",
    action: "Оставить заявку",
    popular: "Для растущего бизнеса",
    packages: [
      ["Настройка без компании", "Индивидуальная модель", "595 AZN", "474.30 AZN", "20", ["Анализ возможности работы без регистрации компании", "Рекомендуемый диапазон оборота — до 6 800–8 500 AZN в месяц", "Открытие зарубежного банковского счета", "Аудит магазина и товаров", "Поддержка онбординга на личные данные", "Верификация и настройка выплат"]],
      ["Настройка через компанию", "Бизнес-модель", "765 AZN", "593.30 AZN", "22", ["Shopify Payments через официальную компанию", "Проверка документов компании и учредителя", "Аудит магазина и политик", "Сопровождение бизнес-верификации", "Подключение банковского счета и выплат", "Структурированная модель для растущих операций"]],
    ],
    note: "* Для корпоративного пакета требуется действующая официально зарегистрированная компания и корпоративные документы.",
    turnoverNote: "6 800–8 500 AZN в месяц — рекомендуемый Sapiens Pay диапазон для пакета без компании, а не официальный лимит Shopify.",
    complianceNote: "Shopify Payments доступен только при соблюдении требований поддерживаемой страны, категории бизнеса и верификации. Финальное решение принимает Shopify и его финансовые партнеры.",
    processEyebrow: "Процесс",
    processTitle: "Настраиваем сервис за четыре понятных этапа",
    steps: [
      ["Аудит магазина", "Проверяем товары, политики, домен и готовность checkout."],
      ["Модель и документы", "Выбираем индивидуальный или корпоративный вариант и готовим данные."],
      ["Активация", "Сопровождаем онбординг, верификацию и настройку безопасности."],
      ["Выплаты и передача", "Подключаем счет, завершаем проверки и передаем инструкцию."],
    ],
    ctaTitle: "Выберем подходящую модель Shopify Payments",
    ctaText: "Оценим магазин и планируемый оборот и предложим подходящий пакет.",
  },
  en: {
    eyebrow: "Shopify Payments",
    title: "Set up international payment acceptance in your Shopify store",
    lead: "We review your store, prepare Shopify Payments onboarding and verification, and help configure the payout flow correctly.",
    home: "Home",
    services: "Services",
    features: ["Store and product audit", "Onboarding and verification", "Payout account connection"],
    aboutEyebrow: "About the service",
    aboutTitle: "Complete setup from checkout to payouts",
    aboutLead: "Activation depends on a supported country, eligible business category, owner information, bank-account requirements, and security controls.",
    benefits: [
      ["Eligibility audit", "We review the store, products, policies, and business model."],
      ["Structure selection", "We assess an individual model without a company or a company-based business model."],
      ["Information preparation", "We prepare identity, address, store, and where required company information."],
      ["Shopify Payments activation", "We support activation and accurate account setup in Shopify admin."],
      ["Payout connection", "We configure an eligible bank account and payout currency."],
      ["Security and handover", "We set up 2FA, review payouts, and provide usage guidance."],
    ],
    pricingEyebrow: "Packages",
    pricingTitle: "Two setup models for different stages of your store",
    pricingLead: "Final pricing is confirmed after consultation based on country, documentation, and setup complexity.",
    customPrice: "Custom plan",
    customSub: "After consultation",
    action: "Submit a request",
    popular: "For growing businesses",
    packages: [
      ["Setup without a company", "Individual model", "AZN 595", "AZN 474.30", "20", ["Eligibility assessment without company registration", "Recommended for approximately up to AZN 6,800–8,500 monthly turnover", "Foreign bank account setup", "Store and product audit", "Personal onboarding support", "Verification and payout setup"]],
      ["Company-based setup", "Business model", "AZN 765", "AZN 593.30", "22", ["Shopify Payments through a registered company", "Company and owner document review", "Store and policy audit", "Business verification support", "Bank-account and payout connection", "A structured model for growing operations"]],
    ],
    note: "* The company-based package requires an active, officially registered company and corporate documents.",
    turnoverNote: "AZN 6,800–8,500 monthly turnover is Sapiens Pay’s recommended operating range for the no-company package, not an official Shopify limit.",
    complianceNote: "Shopify Payments can only be activated when supported-country, business-category, and verification requirements are met. Shopify and its financial partners make the final decision.",
    processEyebrow: "Process",
    processTitle: "We complete setup in four clear stages",
    steps: [
      ["Store audit", "We review products, policies, domain, and checkout readiness."],
      ["Model and documents", "We select the individual or company model and prepare information."],
      ["Activation", "We support onboarding, verification, and security setup."],
      ["Payout and handover", "We connect the account, complete checks, and provide instructions."],
    ],
    ctaTitle: "Let’s choose the right Shopify Payments model",
    ctaText: "We will assess your store and planned turnover and recommend the right package.",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localizedMetadata({
    locale,
    path: "/services/shopify-payments",
    title: content[locale].title,
    description: content[locale].lead,
  });
}

export default async function ShopifyPaymentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const page = content[locale];
  const t = dict[locale];
  const packages = page.packages as Array<
    [string, string, string, string, string, string[]]
  >;

  return (
    <main className="service-page" lang={locale}>
      <SiteHeader locale={locale} currentPath="/services/shopify-payments" actionHref="#consultation" actionLabel={t.headerCta} />

      <section className="service-detail-hero service-detail-hero--shopify" id="home">
        <div className="container">
          <nav className="service-breadcrumbs" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{page.home}</Link><span>›</span>
            <Link href={`/${locale}#services`}>{page.services}</Link><span>›</span>
            <span>{page.eyebrow}</span>
          </nav>
          <div className="service-detail-hero__card">
            <div className="service-detail-hero__copy">
              <p className="service-eyebrow">{page.eyebrow}</p>
              <h1>{page.title}</h1>
              <p>{page.lead}</p>
              <ServiceLeadCta locale={locale} service="shopify-payments" sourceLabel="hero" />
            </div>
            <div className="shopify-service-visual" aria-hidden="true">
              <div className="shopify-service-visual__logo">S</div>
              <div className="shopify-service-visual__checkout">
                <small>CHECKOUT</small><strong>Payment accepted</strong><span>✓</span>
              </div>
            </div>
          </div>
          <div className="service-detail-features">
            {page.features.map((feature, index) => <div key={feature}><span>0{index + 1}</span><p>{feature}</p></div>)}
          </div>
        </div>
      </section>

      <section className="service-about-section">
        <div className="container">
          <div className="service-section-heading">
            <p className="service-eyebrow">{page.aboutEyebrow}</p>
            <h2>{page.aboutTitle}</h2><p>{page.aboutLead}</p>
          </div>
          <div className="service-benefits-grid">
            {page.benefits.map(([title, text], index) => (
              <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="service-pricing-section service-pricing-section--shopify">
        <div className="container">
          <div className="service-section-heading">
            <p className="service-eyebrow">{page.pricingEyebrow}</p>
            <h2>{page.pricingTitle}</h2><p>{page.pricingLead}</p>
          </div>
          <div className="service-pricing-grid service-pricing-grid--two">
            {packages.map(([name, model, oldPrice, price, discount, features], index) => (
              <article className={`service-price-card${index === 1 ? " service-price-card--featured" : ""}`} key={name}>
                <div className="service-price-card__head">
                  <div><span className="service-price-card__mark">S</span><h3>{name}</h3></div>
                  {index === 1 ? <b>{page.popular}</b> : null}
                </div>
                <div className="service-price-card__price">
                  <div>
                    <strong>{price}</strong>
                    <del>{oldPrice}</del>
                    <b>−{discount}%</b>
                  </div>
                  <span>{model} · {page.customSub}</span>
                </div>
                <ul>{features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
                <a
                  href="#consultation"
                  className="service-price-card__action"
                  data-service="shopify-payments"
                  data-package={name}
                  data-source-label="pricing-card"
                >{page.action}<span>→</span></a>
              </article>
            ))}
          </div>
          <div className="service-pricing-notes">
            <p>{page.note}</p><p>{page.turnoverNote}</p><p>{page.complianceNote}</p>
          </div>
        </div>
      </section>

      <section className="service-process-section">
        <div className="container">
          <div className="service-section-heading">
            <p className="service-eyebrow">{page.processEyebrow}</p><h2>{page.processTitle}</h2>
          </div>
          <ol className="service-process-list">
            {page.steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
          </ol>
          <div className="service-final-cta">
            <div><h2>{page.ctaTitle}</h2><p>{page.ctaText}</p></div>
            <ServiceLeadCta locale={locale} service="shopify-payments" sourceLabel="bottom-cta" />
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
      <MobileFooterNav locale={locale} onHomePage />
      <ServiceLeadModal locale={locale} service="shopify-payments" />
    </main>
  );
}
