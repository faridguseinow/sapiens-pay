import type { Dictionary } from "../lib/i18n";

const photos = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
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
          <a className="btn btn--primary" href="#elaqe">
            {t.servicesAction}
          </a>
        </div>
      </div>
    </section>
  );
}
