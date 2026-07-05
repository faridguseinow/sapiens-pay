import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { ServiceLeadCta, ServiceLeadModal } from "@/app/_components/service-lead-cta";
import { dict, isLocale, locales, type Locale } from "@/app/lib/i18n";
import { localizedMetadata } from "@/app/lib/seo";

const content = {
  az: {
    title: "Beynəlxalq ödəniş sistemlərini biznesinizə uyğun qoşuruq",
    lead: "Stripe, PayPal və alternativ ödəniş həlləri üçün biznes modelinizi, şirkət strukturunu və satış ölkələrinizi birlikdə qiymətləndiririk.",
    eyebrow: "Beynəlxalq ödənişlər",
    benefitsTitle: "Sadəcə hesab deyil, işlək ödəniş axını",
    benefits: [
      ["Uyğun sistemin seçilməsi", "Satış ölkələri, məhsul və dövriyyəyə əsasən uyğun provayderi müəyyənləşdiririk."],
      ["Strukturun yoxlanması", "Şirkət, bank hesabı, sayt və tələb olunan sənədlərin uyğunluğunu əvvəlcədən qiymətləndiririk."],
      ["Quraşdırma dəstəyi", "Hesabın hazırlanması, verifikasiya və ilkin ödəniş axınının qurulmasında dəstək veririk."],
    ],
    systemsTitle: "Biznesiniz üçün mümkün istiqamətlər",
    systems: [
      ["Stripe", "Onlayn mağaza, xidmət və abunə modelləri üçün beynəlxalq kart ödənişləri."],
      ["PayPal", "Qlobal auditoriyadan ödəniş qəbulu və tanınan checkout təcrübəsi."],
      ["Alternativ həllər", "Ölkə və biznes modelinə uyğun digər provayder və checkout variantları."],
    ],
    processTitle: "Müraciətdən aktiv ödəniş qəbuluna qədər",
    process: [
      ["Analiz", "Biznes, sayt, ölkələr və planlanan dövriyyəni dəqiqləşdiririk."],
      ["Həll planı", "Uyğun sistem, şirkət və bank tələblərini təqdim edirik."],
      ["Quraşdırma", "Sənədləşmə, hesab və texniki inteqrasiya mərhələsini müşayiət edirik."],
    ],
    ctaTitle: "Ödəniş qəbuluna düzgün strukturla başlayın",
    ctaText: "Müraciətdə istədiyiniz sistemi seçin; komanda ilkin uyğunluğu sizinlə dəqiqləşdirsin.",
  },
  ru: {
    title: "Подключаем международные платёжные системы под ваш бизнес",
    lead: "Оцениваем бизнес-модель, структуру компании и географию продаж для Stripe, PayPal и альтернативных решений.",
    eyebrow: "Международные платежи",
    benefitsTitle: "Не просто аккаунт, а рабочий платёжный поток",
    benefits: [
      ["Выбор системы", "Подбираем провайдера под страны продаж, продукт и планируемый оборот."],
      ["Проверка структуры", "Заранее оцениваем компанию, банковский счёт, сайт и документы."],
      ["Поддержка настройки", "Сопровождаем подготовку аккаунта, проверку и запуск первого платёжного потока."],
    ],
    systemsTitle: "Возможные решения для бизнеса",
    systems: [
      ["Stripe", "Международные карточные платежи для магазинов, услуг и подписок."],
      ["PayPal", "Приём платежей от глобальной аудитории через узнаваемый checkout."],
      ["Альтернативы", "Другие провайдеры и варианты checkout под страну и бизнес-модель."],
    ],
    processTitle: "От заявки до активного приёма платежей",
    process: [
      ["Анализ", "Уточняем бизнес, сайт, рынки и планируемый оборот."],
      ["План решения", "Фиксируем требования к системе, компании и банковскому счёту."],
      ["Настройка", "Сопровождаем документы, аккаунт и техническую интеграцию."],
    ],
    ctaTitle: "Начните принимать платежи с правильной структурой",
    ctaText: "Выберите нужную систему в заявке, и команда проверит первичное соответствие.",
  },
  en: {
    title: "International payment systems configured for your business",
    lead: "We assess your business model, company structure, and sales markets for Stripe, PayPal, and alternative payment solutions.",
    eyebrow: "International payments",
    benefitsTitle: "More than an account—a working payment flow",
    benefits: [
      ["Solution selection", "We match providers to your sales markets, product, and expected turnover."],
      ["Structure review", "We review company, bank account, website, and document requirements upfront."],
      ["Setup support", "We support account preparation, verification, and the initial payment flow."],
    ],
    systemsTitle: "Possible directions for your business",
    systems: [
      ["Stripe", "International card payments for stores, services, and subscription models."],
      ["PayPal", "A familiar checkout for accepting payments from a global audience."],
      ["Alternative solutions", "Other providers and checkout options matched to your country and model."],
    ],
    processTitle: "From request to active payment acceptance",
    process: [
      ["Assessment", "We clarify your business, website, markets, and expected turnover."],
      ["Solution plan", "We outline payment-system, company, and banking requirements."],
      ["Setup", "We support documentation, account creation, and technical integration."],
    ],
    ctaTitle: "Start accepting payments with the right structure",
    ctaText: "Choose the system in the request and our team will confirm initial eligibility.",
  },
} satisfies Record<Locale, Record<string, string | string[][]>>;

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
    path: "/services/international-payments",
    title: content[locale].eyebrow as string,
    description: content[locale].lead as string,
  });
}

export default async function InternationalPaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam;
  const page = content[locale];
  const t = dict[locale];

  return (
    <main className="service-page" lang={locale}>
      <SiteHeader locale={locale} currentPath="/services/international-payments" actionHref="#consultation" actionLabel={t.headerCta} />
      <section className="service-detail-hero" id="home">
        <div className="container service-detail-hero__grid">
          <div className="service-detail-hero__copy">
            <p className="service-eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.lead}</p>
            <ServiceLeadCta locale={locale} service="international-payments" sourceLabel="hero" />
          </div>
          <div className="service-detail-hero__visual service-detail-hero__visual--shopify" aria-hidden="true">
            <div className="service-payment-orbit"><span>S</span><span>P</span><span>W</span></div>
            <div className="service-payment-terminal"><small>PAYMENT RECEIVED</small><strong>✓</strong><span>Global checkout</span></div>
          </div>
        </div>
      </section>

      <section className="service-benefits">
        <div className="container">
          <div className="service-section-heading"><p className="service-eyebrow">{page.eyebrow}</p><h2>{page.benefitsTitle}</h2></div>
          <div className="service-benefits-grid">
            {(page.benefits as string[][]).map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="company-jurisdictions">
        <div className="container">
          <div className="service-section-heading"><h2>{page.systemsTitle}</h2></div>
          <div className="company-country-grid">
            {(page.systems as string[][]).map(([name, text], index) => (
              <article key={name}><div><span>0{index + 1}</span><b>PAY</b></div><h3>{name}</h3><p>{text}</p>
                <a href="#consultation" data-service="international-payments" data-package={name} data-source-label="payment-system-card">{t.headerCta}<span>→</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="service-process">
        <div className="container">
          <div className="service-section-heading"><h2>{page.processTitle}</h2></div>
          <div className="service-process-grid">
            {(page.process as string[][]).map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="service-final-cta"><div className="container"><div><h2>{page.ctaTitle}</h2><p>{page.ctaText}</p></div><ServiceLeadCta locale={locale} service="international-payments" sourceLabel="bottom-cta" /></div></section>
      <SiteFooter locale={locale} />
      <MobileFooterNav locale={locale} onHomePage />
      <ServiceLeadModal locale={locale} service="international-payments" />
    </main>
  );
}
