import type { Dictionary } from "../lib/i18n";

const photos = [
  "https://assets-au-01.kc-usercontent.com/df4a25df-7d25-0294-ad5c-62528c8f82da/8f47f14f-3de2-496f-b992-a79baefb18a7/IMG_Meta%20Ads.jpg?q=75&fm=jpg&w=960",
  "https://easypayments.online/media/articles/img_1751884024.761801.jpg",
  "https://www.itsec.ru/hubfs/ISR/Shopify.jpg",
];

type ServicesShowcaseProps = {
  t: Dictionary;
};

export function ServicesShowcase({ t }: ServicesShowcaseProps) {
  const services = [
    {
      title: t.service1Title,
      text: t.service1Text,
      image: photos[0],
    },
    {
      title: t.service2Title,
      text: t.service2Text,
      image: photos[1],
    },
    {
      title: t.service3Title,
      text: t.service3Text,
      image: photos[2],
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
            <article className="service-card" key={service.title}>
              <div
                className="service-card__media"
                style={{ backgroundImage: `url(${service.image})` }}
                aria-hidden="true"
              />
              <div className="service-card__body">
                <p className="service-card__num">0{index + 1}</p>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="services-showcase__cta">
          <a className="btn btn--primary" href="#muraciet">
            {t.servicesAction}
          </a>
        </div>
      </div>
    </section>
  );
}
