import { notFound } from "next/navigation";
import Image from "next/image";
import partner1 from "../media/partners/partner-1.png";
import partner2 from "../media/partners/partner-2.png";
import partner3 from "../media/partners/partner-3.png";
import partner4 from "../media/partners/partner-4.png";
import { MobileFooterNav, SiteFooter, SiteHeader } from "../_components/site-chrome";
import { Parallax } from "../_components/parallax";
import { MoneyRain } from "../_components/money-rain";
import { AboutStory } from "../_components/about-story";
import { ServicesShowcase } from "../_components/services-showcase";
import { LeadQuiz } from "../_components/lead-quiz";
import { dict, isLocale, locales, type Locale } from "../lib/i18n";

const partners = [
  { name: "Partner 1", src: partner1, href: "https://www.instagram.com/nurs_boymax/" },
  { name: "Partner 2", src: partner2, href: "https://www.instagram.com/hurucco/" },
  { name: "Partner 3", src: partner3, href: "https://www.instagram.com/flyfriendlyaz/" },
  { name: "Partner 4", src: partner4, href: "https://www.instagram.com/duomorecords/" },
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const t = dict[locale];

  return (
    <main className="landing" lang={locale}>
      <Parallax />
      <SiteHeader locale={locale} actionHref="#muraciet" actionLabel={t.headerCta} />

      <section className="hero section" id="home">
        <MoneyRain />
        <div className="container">
          <p className="tag" data-parallax data-speed="-0.03">
            {t.heroTag}
          </p>
          <h1>{t.heroTitle}</h1>
          <p className="lead">{t.heroLead}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#muraciet">
              {t.heroPrimary}
            </a>
            <a className="btn btn--ghost" href="#about">
              {t.heroSecondary}
            </a>
          </div>
        </div>
        <div className="orb orb--one" data-parallax data-speed="0.08" />
        <div className="orb orb--two" data-parallax data-speed="0.12" />
      </section>

      <ServicesShowcase t={t} />

      <AboutStory
        eyebrow={t.aboutStoryEyebrow}
        title={t.aboutStoryTitle}
        lead={t.aboutStoryLead}
        paragraphs={[
          t.aboutStoryParagraph1,
          t.aboutStoryParagraph2,
          t.aboutStoryParagraph3,
          t.aboutStoryParagraph4,
        ]}
      />

      <section className="section partners" id="emekdasliq">
        <div className="container">
          <h2>{t.partnersTitle}</h2>
          <p className="partners__lead">{t.partnersLead}</p>
          <div className="partners__grid">
            {partners.map((partner) => (
              <a
                className="partner-card"
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={partner.name}
              >
                <Image src={partner.src} alt={partner.name} width={180} height={56} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="ustunlukler">
        <div className="container">
          <h2>{t.aboutTitle}</h2>
          <ul className="grid">
            <li className="card">
              <h3>{t.card1Title}</h3>
              <p>{t.card1Text}</p>
            </li>
            <li className="card">
              <h3>{t.card2Title}</h3>
              <p>{t.card2Text}</p>
            </li>
            <li className="card">
              <h3>{t.card3Title}</h3>
              <p>{t.card3Text}</p>
            </li>
          </ul>
        </div>
      </section>

      <LeadQuiz locale={locale} />

      <section className="section socials" id="socials">
        <div className="container">
          <h2>{t.socialsTitle}</h2>
          <p className="partners__lead">{t.socialsLead}</p>

          <div className="socials__grid">
            <a href="https://instagram.com/sapienspay" target="_blank" rel="noopener noreferrer">
              {t.socialInstagram}
            </a>
            <a href="https://www.facebook.com/profile.php?id=61586634017012&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
              {t.socialFacebook}
            </a>
            <a href="https://linkedin.com/company/sapiens-pay" target="_blank" rel="noopener noreferrer">
              {t.socialLinkedin}
            </a>
            <a href="https://tiktok.com/@sapienspay" target="_blank" rel="noopener noreferrer">
              {t.socialTiktok}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
      <MobileFooterNav locale={locale} />
    </main>
  );
}
