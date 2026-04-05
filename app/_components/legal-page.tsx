import Link from "next/link";
import { getLegalDocument, getLegalDocumentLabel, type LegalDocumentKey } from "../lib/legal";
import { dict, type Locale } from "../lib/i18n";
import { SiteFooter, SiteHeader } from "./site-chrome";

type LegalPageProps = {
  locale: Locale;
  slug: LegalDocumentKey;
};

export function LegalPage({ locale, slug }: LegalPageProps) {
  const t = dict[locale];
  const doc = getLegalDocument(locale, slug);

  return (
    <main className="legal-page" lang={locale}>
      <SiteHeader
        locale={locale}
        currentPath={`/${slug}`}
        actionHref={`/${locale}`}
        actionLabel={t.headerHome}
      />

      <section className="legal-hero">
        <div className="container legal-hero__inner">
          <p className="tag">{getLegalDocumentLabel(locale, slug)}</p>
          <h1>{doc.title}</h1>
          <p className="legal-hero__lead">{doc.description}</p>
          <p className="legal-hero__meta">
            {t.legalUpdated}: <strong>{doc.updatedAt}</strong>
          </p>
        </div>
      </section>

      <section className="legal-layout">
        <div className="container legal-layout__inner">
          <aside className="legal-toc">
            <p className="legal-toc__title">{t.legalContents}</p>
            <nav aria-label={t.legalContents}>
              {doc.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="legal-article">
            {doc.sections.map((section) => (
              <section key={section.id} id={section.id} className="legal-section">
                <h2>{section.title}</h2>

                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="legal-section legal-contact">
              <h2>{t.legalContactTitle}</h2>
              <p>{t.legalContactLead}</p>
              <p>
                <Link href="mailto:info@sapiens-pay.com">info@sapiens-pay.com</Link>
              </p>
            </section>
          </article>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
