import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import partner1 from "../media/partners/partner-1.png";
import partner2 from "../media/partners/partner-2.png";
import partner3 from "../media/partners/partner-3.png";
import partner4 from "../media/partners/partner-4.png";
import { MobileFooterNav, SiteFooter, SiteHeader } from "../_components/site-chrome";
import { Parallax } from "../_components/parallax";
import { AboutStory } from "../_components/about-story";
import { ServicesShowcase } from "../_components/services-showcase";
import { ConsultationExperience } from "../_components/consultation-experience";
import { blogUi } from "../lib/blog";
import { getPublishedPosts } from "@/lib/posts";
import { dict, isLocale, locales, type Locale } from "../lib/i18n";
import { localizedMetadata } from "../lib/seo";

const partners = [
  { name: "Partner 1", src: partner1, href: "https://www.instagram.com/nurs_boymax/" },
  { name: "Partner 2", src: partner2, href: "https://www.instagram.com/hurucco/" },
  { name: "Partner 3", src: partner3, href: "https://www.instagram.com/flyfriendlyaz/" },
  { name: "Partner 4", src: partner4, href: "https://www.instagram.com/duomorecords/" },
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const homeMetadata = {
  az: {
    title: "Xarici bank hesabları və beynəlxalq ödəniş həlləri",
    description:
      "Wise, Payoneer, Shopify Payments, xarici şirkət qeydiyyatı, Stripe və PayPal üçün uyğunluq və quraşdırma dəstəyi.",
  },
  ru: {
    title: "Зарубежные счета и международные платежные решения",
    description:
      "Поддержка по Wise, Payoneer, Shopify Payments, регистрации зарубежных компаний, Stripe и PayPal.",
  },
  en: {
    title: "Foreign accounts and international payment solutions",
    description:
      "Support for Wise, Payoneer, Shopify Payments, foreign company formation, Stripe, and PayPal.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localizedMetadata({ locale, ...homeMetadata[locale] });
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
  const blogCopy = {
    az: {
      title: "Bloqdan son yazılar",
      lead: "Xarici hesablar, Shopify Payments, şirkət qeydiyyatı və beynəlxalq ödənişlərlə bağlı praktik materiallar.",
      cta: "Bütün yazılara bax",
    },
    ru: {
      title: "Последние статьи блога",
      lead: "Практические материалы о зарубежных счетах, Shopify Payments, компаниях и международных платежах.",
      cta: "Смотреть все статьи",
    },
    en: {
      title: "Latest Blog Articles",
      lead: "Practical guides to foreign accounts, Shopify Payments, company formation, and global payments.",
      cta: "View all posts",
    },
  }[locale];
  const blogSectionUi = blogUi[locale];

  const latestPosts = await getPublishedPosts(locale, 3);
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://sapiens-pay.com/#organization",
        name: "Sapiens Pay",
        url: "https://sapiens-pay.com",
      },
      {
        "@type": "WebSite",
        "@id": "https://sapiens-pay.com/#website",
        url: "https://sapiens-pay.com",
        name: "Sapiens Pay",
        publisher: { "@id": "https://sapiens-pay.com/#organization" },
        inLanguage: locale,
      },
    ],
  };

  const dateLocaleMap: Record<Locale, string> = {
    az: "az-AZ",
    ru: "ru-RU",
    en: "en-US",
  };

  return (
    <main className="landing" lang={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Parallax />
      <SiteHeader locale={locale} actionHref="#consultation" actionLabel={t.headerCta} />

      <ConsultationExperience locale={locale} copy={t} />

      <ServicesShowcase t={t} locale={locale} />

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

      <section className="section blog-preview" id="blog-preview">
        <div className="container">
          <div className="blog-preview__head">
            <div>
              <h2>{blogCopy.title}</h2>
              <p className="partners__lead">{blogCopy.lead}</p>
            </div>
            <Link className="btn btn--ghost" href={`/${locale}/blog`}>
              {blogCopy.cta}
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="blog-preview__grid">
              {latestPosts.map((post) => {
                const imageUrl = post.cover_image_url;
                const publishedDate = post.published_at
                  ? new Date(post.published_at).toLocaleDateString(dateLocaleMap[locale], {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : null;

                return (
                  <Link key={post.id} className="blog-preview__card" href={`/${locale}/blog/${post.slug}`}>
                    <div className="blog-preview__media">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={post.title} width={640} height={360} unoptimized />
                      ) : (
                        <div className="blog-preview__placeholder" />
                      )}
                    </div>

                    <div className="blog-preview__body">
                      <h3>{post.title}</h3>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                      {publishedDate ? <span>{publishedDate}</span> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="blog-empty">{blogSectionUi.noPosts}</p>
          )}
        </div>
      </section>

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
      <MobileFooterNav locale={locale} onHomePage />
    </main>
  );
}
