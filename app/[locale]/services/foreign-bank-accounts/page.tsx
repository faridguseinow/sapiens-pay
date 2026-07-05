import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceLeadCta, ServiceLeadModal } from "@/app/_components/service-lead-cta";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { dict, isLocale, locales, type Locale } from "@/app/lib/i18n";
import { localizedMetadata } from "@/app/lib/seo";

const content = {
  az: {
    eyebrow: "Xarici bank hesabları",
    title: "Beynəlxalq əməliyyatlar üçün xarici bank hesabı",
    lead: "Biznesinizin fəaliyyət modelinə uyğun bank və ya maliyyə platformasını müəyyənləşdirir, sənədləri hazırlayır və müraciət prosesində sizi müşayiət edirik.",
    home: "Ana səhifə",
    services: "Xidmətlər",
    features: ["Şirkət məlumatlarına rəsmiləşdirmə", "Çoxvalyutalı hesab imkanları", "Fərdi onboarding dəstəyi"],
    aboutEyebrow: "Xidmət haqqında",
    aboutTitle: "Sadəcə hesab deyil, işlək maliyyə infrastrukturu",
    aboutLead: "Doğru hesab seçimi biznes modelindən, dövriyyədən, fəaliyyət ölkələrindən və qəbul etdiyiniz ödənişlərin növündən asılıdır.",
    benefits: [
      ["Uyğun həllin seçilməsi", "Biznesinizin coğrafiyasını, fəaliyyət sahəsini və əməliyyat ehtiyaclarını analiz edirik."],
      ["Sənədlərin hazırlanması", "Müraciət üçün tələb olunan şirkət və təsisçi sənədlərini əvvəlcədən yoxlayırıq."],
      ["Onboarding və müraciət", "Formaların doldurulması və verifikasiya mərhələsində praktik dəstək göstəririk."],
      ["Beynəlxalq rekvizitlər", "Uyğun həll daxilində EUR, USD və digər valyutalarda rekvizit imkanlarını qiymətləndiririk."],
      ["Ödəniş axınının qurulması", "Marketplace, reklam və e-commerce gəlirlərinizə uyğun istifadə ssenarisi hazırlayırıq."],
      ["İstifadə üzrə yönləndirmə", "Hesab aktivləşdikdən sonra əsas əməliyyatlar və təhlükəsizlik qaydalarını izah edirik."],
    ],
    processEyebrow: "İş prosesi",
    processTitle: "Müraciətdən aktiv hesaba qədər aydın dörd mərhələ",
    pricingEyebrow: "Tariflər",
    pricingTitle: "Ehtiyacınıza uyğun hesab paketini seçin",
    pricingLead: "Şəxsi və biznes hesabları üçün xidmət paketlərini müqayisə edin və sizə uyğun variantı seçin.",
    pricingSub: "Birdəfəlik xidmət haqqı",
    pricingAction: "Müraciət et",
    popular: "Ən çox seçilən",
    packages: [
      ["Wise Personal", "$250", "$149", "40", ["İlkin uyğunluq qiymətləndirməsi", "Şəxsi sənədlərin yoxlanması", "Qeydiyyat və onboarding dəstəyi", "Verifikasiya mərhələsi üzrə yönləndirmə", "Hesabdan istifadə üzrə təlimat"]],
      ["Wise Business", "$400", "$249", "38", ["Şirkət uyğunluğunun analizi", "Korporativ sənədlərin yoxlanması", "Biznes hesabı qeydiyyat dəstəyi", "Verifikasiya prosesinin müşayiəti", "Çoxvalyutalı rekvizit imkanları", "Hesabdan istifadə üzrə təlimat"]],
      ["Payoneer Business", "$400", "$249", "38", ["Şirkət və fəaliyyət modelinin analizi", "Sayt və sənədlərin ilkin auditi", "Biznes hesabı qeydiyyat dəstəyi", "Verifikasiya sənədlərinin hazırlanması", "Ödəniş rekvizitlərinin aktivləşdirilməsi", "Vəsait çıxarışı üzrə yönləndirmə"]],
    ],
    pricingNote: "* Wise Business və Payoneer Business hesabları üçün aktiv, rəsmi qeydiyyatdan keçmiş şirkət və müvafiq korporativ sənədlər tələb olunur.",
    approvalNote: "Hesabın təsdiqi maliyyə platformasının yekun uyğunluq və risk yoxlamasından asılıdır.",
    steps: [
      ["İlkin konsultasiya", "Məqsədi, şirkət strukturunu və əməliyyat planını dəqiqləşdiririk."],
      ["Uyğunluq yoxlaması", "Sənədləri və layihənin maliyyə platformalarının tələblərinə uyğunluğunu yoxlayırıq."],
      ["Müraciət və verifikasiya", "Seçilmiş həll üzrə qeydiyyat və yoxlama prosesini müşayiət edirik."],
      ["Təhvil və dəstək", "Hesabın istifadəsi, rekvizitlər və növbəti addımlar üzrə yönləndirmə veririk."],
    ],
    ctaTitle: "Biznesiniz üçün hansı hesabın uyğun olduğunu müəyyənləşdirək",
    ctaText: "Qısa konsultasiyada fəaliyyət modelinizi nəzərdən keçirib sizə uyğun növbəti addımı təklif edəcəyik.",
  },
  ru: {
    eyebrow: "Зарубежные банковские счета",
    title: "Зарубежный банковский счет для международных операций",
    lead: "Подбираем банк или финансовую платформу под модель вашего бизнеса, готовим документы и сопровождаем процесс подачи заявки.",
    home: "Главная",
    services: "Услуги",
    features: ["Оформление на данные компании", "Мультивалютные возможности", "Персональная поддержка онбординга"],
    aboutEyebrow: "Об услуге",
    aboutTitle: "Не просто счет, а рабочая финансовая инфраструктура",
    aboutLead: "Выбор решения зависит от бизнес-модели, оборота, географии и типа платежей, которые вы планируете принимать.",
    benefits: [
      ["Выбор подходящего решения", "Анализируем географию, сферу деятельности и операционные задачи бизнеса."],
      ["Подготовка документов", "Предварительно проверяем корпоративные документы и данные учредителей."],
      ["Онбординг и заявка", "Помогаем с заполнением форм и прохождением этапов верификации."],
      ["Международные реквизиты", "Оцениваем доступность реквизитов в EUR, USD и других валютах."],
      ["Настройка платежного потока", "Прорабатываем сценарий для маркетплейсов, рекламы и e-commerce."],
      ["Инструкция по работе", "После активации объясняем основные операции и правила безопасности."],
    ],
    processEyebrow: "Процесс работы",
    processTitle: "Четыре понятных этапа от заявки до активного счета",
    pricingEyebrow: "Тарифы",
    pricingTitle: "Выберите пакет под ваши задачи",
    pricingLead: "Сравните пакеты для личных и бизнес-счетов и выберите подходящий вариант.",
    pricingSub: "Единоразовая стоимость услуги",
    pricingAction: "Оставить заявку",
    popular: "Популярный выбор",
    packages: [
      ["Wise Personal", "$250", "$149", "40", ["Предварительная оценка соответствия", "Проверка личных документов", "Поддержка регистрации и онбординга", "Сопровождение этапа верификации", "Инструкция по работе с аккаунтом"]],
      ["Wise Business", "$400", "$249", "38", ["Анализ соответствия компании", "Проверка корпоративных документов", "Поддержка регистрации бизнес-счета", "Сопровождение верификации", "Мультивалютные реквизиты", "Инструкция по работе с аккаунтом"]],
      ["Payoneer Business", "$400", "$249", "38", ["Анализ компании и бизнес-модели", "Предварительный аудит сайта и документов", "Поддержка регистрации бизнес-счета", "Подготовка к верификации", "Активация платежных реквизитов", "Рекомендации по выводу средств"]],
    ],
    pricingNote: "* Для Wise Business и Payoneer Business требуется действующая официально зарегистрированная компания и соответствующие корпоративные документы.",
    approvalNote: "Одобрение аккаунта зависит от итоговой проверки соответствия и рисков со стороны финансовой платформы.",
    steps: [
      ["Первая консультация", "Уточняем цели, структуру компании и планируемые операции."],
      ["Проверка соответствия", "Проверяем документы и соответствие проекта требованиям платформ."],
      ["Заявка и верификация", "Сопровождаем регистрацию и проверку по выбранному решению."],
      ["Передача и поддержка", "Объясняем работу со счетом, реквизитами и дальнейшие шаги."],
    ],
    ctaTitle: "Определим, какой счет подходит вашему бизнесу",
    ctaText: "На короткой консультации изучим вашу модель и предложим практичный следующий шаг.",
  },
  en: {
    eyebrow: "Foreign bank accounts",
    title: "A foreign bank account for international operations",
    lead: "We identify a bank or financial platform suited to your business model, prepare the documents, and support the application process.",
    home: "Home",
    services: "Services",
    features: ["Registered to your company", "Multi-currency capabilities", "Personal onboarding support"],
    aboutEyebrow: "About the service",
    aboutTitle: "More than an account: practical financial infrastructure",
    aboutLead: "The right solution depends on your business model, turnover, operating markets, and the types of payments you need to receive.",
    benefits: [
      ["Solution selection", "We assess your geography, industry, and operational requirements."],
      ["Document preparation", "We review company and founder documents before the application."],
      ["Onboarding and application", "We assist with forms and practical verification steps."],
      ["International details", "We assess available EUR, USD, and other currency account details."],
      ["Payment-flow planning", "We map usage for marketplaces, advertising, and e-commerce revenue."],
      ["Usage guidance", "After activation, we explain key operations and security practices."],
    ],
    processEyebrow: "How it works",
    processTitle: "Four clear stages from consultation to an active account",
    pricingEyebrow: "Plans",
    pricingTitle: "Choose the account package that fits your needs",
    pricingLead: "Compare personal and business account packages and choose the option that fits your needs.",
    pricingSub: "One-time service fee",
    pricingAction: "Submit a request",
    popular: "Most popular",
    packages: [
      ["Wise Personal", "$250", "$149", "40", ["Initial eligibility assessment", "Personal document review", "Registration and onboarding support", "Verification-stage guidance", "Account usage instructions"]],
      ["Wise Business", "$400", "$249", "38", ["Company eligibility assessment", "Corporate document review", "Business-account registration support", "Verification support", "Multi-currency account details", "Account usage instructions"]],
      ["Payoneer Business", "$400", "$249", "38", ["Company and business-model assessment", "Initial website and document audit", "Business-account registration support", "Verification preparation", "Receiving-account activation", "Payout setup guidance"]],
    ],
    pricingNote: "* Wise Business and Payoneer Business require an active, officially registered company and the relevant corporate documents.",
    approvalNote: "Account approval remains subject to the financial platform’s final eligibility and risk review.",
    steps: [
      ["Initial consultation", "We clarify goals, company structure, and planned operations."],
      ["Eligibility review", "We review documents and the project's fit with platform requirements."],
      ["Application and verification", "We support registration and checks for the selected solution."],
      ["Handover and support", "We explain account usage, details, and recommended next steps."],
    ],
    ctaTitle: "Let’s identify the right account for your business",
    ctaText: "In a short consultation, we will review your model and recommend a practical next step.",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return localizedMetadata({
    locale,
    path: "/services/foreign-bank-accounts",
    title: content[locale].title,
    description: content[locale].lead,
  });
}

export default async function ForeignBankAccountsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const page = content[locale];
  const t = dict[locale];
  const pricingPackages = page.packages as Array<
    [string, string, string, string, string[]]
  >;

  return (
    <main className="service-page" lang={locale}>
      <SiteHeader
        locale={locale}
        currentPath="/services/foreign-bank-accounts"
        actionHref="#consultation"
        actionLabel={t.headerCta}
      />

      <section className="service-detail-hero" id="home">
        <div className="container">
          <nav className="service-breadcrumbs" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{page.home}</Link>
            <span>›</span>
            <Link href={`/${locale}#services`}>{page.services}</Link>
            <span>›</span>
            <span>{page.eyebrow}</span>
          </nav>

          <div className="service-detail-hero__card">
            <div className="service-detail-hero__copy">
              <p className="service-eyebrow">{page.eyebrow}</p>
              <h1>{page.title}</h1>
              <p>{page.lead}</p>
              <ServiceLeadCta locale={locale} service="foreign-bank-accounts" sourceLabel="hero" />
            </div>

            <div className="service-account-visual" aria-hidden="true">
              <div className="service-account-visual__flags">
                <span>UK</span><span>US</span><span>EU</span>
              </div>
              <div className="service-account-visual__card">
                <small>SAPIENS PAY · BUSINESS</small>
                <strong>IBAN · USD · EUR</strong>
                <span>•••• 4826</span>
              </div>
            </div>
          </div>

          <div className="service-detail-features">
            {page.features.map((feature, index) => (
              <div key={feature}>
                <span>0{index + 1}</span>
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="service-about-section">
        <div className="container">
          <div className="service-section-heading">
            <p className="service-eyebrow">{page.aboutEyebrow}</p>
            <h2>{page.aboutTitle}</h2>
            <p>{page.aboutLead}</p>
          </div>

          <div className="service-benefits-grid">
            {page.benefits.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="service-pricing-section">
        <div className="container">
          <div className="service-section-heading">
            <p className="service-eyebrow">{page.pricingEyebrow}</p>
            <h2>{page.pricingTitle}</h2>
            <p>{page.pricingLead}</p>
          </div>

          <div className="service-pricing-grid">
            {pricingPackages.map(([name, oldPrice, price, discount, features], index) => (
              <article
                className={`service-price-card${index === 1 ? " service-price-card--featured" : ""}`}
                key={name}
              >
                <div className="service-price-card__head">
                  <div>
                    <span className="service-price-card__mark">
                      {name.slice(0, 1)}
                    </span>
                    <h3>{name}</h3>
                  </div>
                  {index === 1 ? <b>{page.popular}</b> : null}
                </div>

                <div className="service-price-card__price">
                  <div>
                    <strong>{price}</strong>
                    <del>{oldPrice}</del>
                    <b>−{discount}%</b>
                  </div>
                  <span>{page.pricingSub}</span>
                </div>

                <ul>
                  {features.map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#consultation"
                  className="service-price-card__action"
                  data-service="foreign-bank-accounts"
                  data-package={name}
                  data-source-label="pricing-card"
                >
                  {page.pricingAction} <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>

          <div className="service-pricing-notes">
            <p>{page.pricingNote}</p>
            <p>{page.approvalNote}</p>
          </div>
        </div>
      </section>

      <section className="service-process-section">
        <div className="container">
          <div className="service-section-heading">
            <p className="service-eyebrow">{page.processEyebrow}</p>
            <h2>{page.processTitle}</h2>
          </div>
          <ol className="service-process-list">
            {page.steps.map(([title, text], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="service-final-cta">
            <div>
              <h2>{page.ctaTitle}</h2>
              <p>{page.ctaText}</p>
            </div>
            <ServiceLeadCta locale={locale} service="foreign-bank-accounts" sourceLabel="bottom-cta" />
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
      <MobileFooterNav locale={locale} onHomePage />
      <ServiceLeadModal locale={locale} service="foreign-bank-accounts" />
    </main>
  );
}
