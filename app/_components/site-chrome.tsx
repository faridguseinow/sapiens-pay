import Link from "next/link";
import { dict, locales, type Locale } from "../lib/i18n";

type HeaderProps = {
  locale: Locale;
  currentPath?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function SiteHeader({
  locale,
  currentPath = "",
  actionHref = `/${locale}`,
  actionLabel,
}: HeaderProps) {
  const t = dict[locale];

  return (
    <header className="header">
      <div className="container header__inner">
        <Link className="logo" href={`/${locale}`}>
          <span className="logo__word">sapiens</span>
          <span className="logo__badge">PAY</span>
        </Link>

        <div className="header__actions">
          <div className="lang-switch" role="group" aria-label={t.langSwitcherLabel}>
            {locales.map((item) => (
              <Link
                key={item}
                href={`/${item}${currentPath}`}
                className={item === locale ? "active" : ""}
                aria-current={item === locale ? "page" : undefined}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>

          {actionLabel ? (
            <Link className="link-draw" href={actionHref}>
              {actionLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dict[locale];

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__meta">
          <p>
            © {new Date().getFullYear()} Sapiens Pay. {t.footerRights}
          </p>
          <a
            className="site-footer__credit"
            href="https://faridguseinow.framer.website/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Создание сайта - Farid Huseynov
          </a>
        </div>
        <div className="site-footer__links">
          <Link href={`/${locale}/privacy-policy`}>{t.footerPrivacy}</Link>
          <Link href={`/${locale}/terms-of-use`}>{t.footerTerms}</Link>
          <Link href={`/${locale}/cookie-policy`}>{t.footerCookies}</Link>
        </div>
      </div>
    </footer>
  );
}

export function MobileFooterNav({ locale }: { locale: Locale }) {
  const t = dict[locale];

  return (
    <nav className="mobile-footer-nav" aria-label="Mobile navigation">
      <a href="#home">{t.mobileHome}</a>
      <a href="tel:+994000000000">{t.mobileCall}</a>
      <a href="#about">{t.mobileAbout}</a>
    </nav>
  );
}
