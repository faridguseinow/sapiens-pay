import type { Dictionary, Locale } from "../lib/i18n";

type ServicesShowcaseProps = {
  t: Dictionary;
  locale: Locale;
};

export function ServicesShowcase({ t, locale }: ServicesShowcaseProps) {
  const services = [
    {
      title: t.service1Title,
      text: t.service1Text,
      visual: "bank",
      href: `/${locale}/services/foreign-bank-accounts`,
      linkLabel: t.serviceDetails,
      service: "foreign-bank-accounts",
    },
    {
      title: t.service2Title,
      text: t.service2Text,
      visual: "shopify",
      href: `/${locale}/services/shopify-payments`,
      linkLabel: t.serviceDetails,
      service: "shopify-payments",
    },
    {
      title: t.service3Title,
      text: t.service3Text,
      visual: "company",
      href: `/${locale}/services/company-formation`,
      linkLabel: t.serviceDetails,
      service: "company-formation",
    },
    {
      title: t.service4Title,
      text: t.service4Text,
      visual: "payments",
      href: `/${locale}/services/international-payments`,
      linkLabel: t.serviceDetails,
      service: "international-payments",
    },
  ];

  return (
    <section className="section services-showcase" id="services">
      <div className="container">
        <div className="services-showcase__top">
          <p className="tag">{t.servicesEyebrow}</p>
          <h2>{t.servicesTitle}</h2>
          <p className="services-showcase__lead">{t.servicesLead}</p>
        </div>

        <div className="services-showcase__grid">
          {services.map((service, index) => (
            <article
              className={`service-card service-card--${service.visual}`}
              key={service.title}
            >
              <div className="service-card__body">
                <p className="service-card__num">0{index + 1}</p>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a
                  href={service.href}
                  className="service-card__link"
                  data-service={service.service}
                  data-source-label="homepage-service-card"
                >
                  {service.linkLabel} <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="service-card__visual" aria-hidden="true">
                {service.visual === "bank" ? (
                  <>
                    <div className="service-flags">
                      <span>UK</span>
                      <span>US</span>
                      <span>EU</span>
                    </div>
                    <div className="service-bank-card">
                      <small>SAPIENS PAY</small>
                      <strong>•••• 4826</strong>
                      <span>VISA</span>
                    </div>
                  </>
                ) : null}

                {service.visual === "shopify" ? (
                  <>
                    <div className="service-shopify-mark">S</div>
                    <div className="service-paid-card">
                      <span>PAYMENT</span>
                      <strong>PAID</strong>
                      <small>Shopify Payments</small>
                    </div>
                  </>
                ) : null}

                {service.visual === "company" ? (
                  <>
                    <div className="service-globe">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="service-building">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </>
                ) : null}

                {service.visual === "payments" ? (
                  <>
                    <div className="service-payment-orbit">
                      <span>S</span>
                      <span>P</span>
                      <span>W</span>
                    </div>
                    <div className="service-payment-terminal">
                      <small>PAYMENT RECEIVED</small>
                      <strong>✓</strong>
                      <span>Global checkout</span>
                    </div>
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="services-showcase__cta">
          <a className="btn btn--primary" href="#consultation" data-source-label="homepage-services-cta">
            {t.servicesAction}
          </a>
        </div>
      </div>
    </section>
  );
}
