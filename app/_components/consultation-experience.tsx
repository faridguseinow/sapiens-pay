"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "../lib/i18n";
import { LeadQuiz, type LeadContext, type ServiceKey } from "./lead-quiz";

const closeLabels: Record<Locale, string> = {
  az: "Bağla",
  ru: "Закрыть",
  en: "Close",
};

const platforms = [
  { label: "Wise", servicePath: "foreign-bank-accounts" },
  { label: "Payoneer", servicePath: "foreign-bank-accounts" },
  { label: "Shopify", servicePath: "shopify-payments" },
  { label: "Stripe", servicePath: "international-payments" },
  { label: "PayPal", servicePath: "international-payments" },
] as const;

export function ConsultationExperience({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  const [isOpen, setIsOpen] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#consultation",
  );
  const [leadContext, setLeadContext] = useState<LeadContext>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const openFromLink = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLAnchorElement>('a[href="#consultation"]');

      if (!trigger) return;
      event.preventDefault();
      setLeadContext({
        service: trigger.dataset.service as ServiceKey | undefined,
        packageName: trigger.dataset.package,
        sourcePath: window.location.pathname,
        sourceLabel: trigger.dataset.sourceLabel || trigger.textContent?.trim() || "homepage-cta",
      });
      setIsOpen(true);
    };

    document.addEventListener("click", openFromLink);
    if (window.location.hash === "#consultation") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    return () => document.removeEventListener("click", openFromLink);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <section className="hero hero--consultation section" id="home">
        <div className="container">
          <div className="hero-card">
            <span className="hero-card__watermark" aria-hidden="true">
              SAPIENS
            </span>

            <div className="hero-card__top">
              <p className="tag">{copy.heroTag}</p>
              <div className="hero-card__platforms" aria-label="Supported platforms">
                {platforms.map((platform) => (
                  <Link
                    key={platform.label}
                    href={`/${locale}/services/${platform.servicePath}`}
                  >
                    {platform.label}
                  </Link>
                ))}
              </div>
            </div>

            <h1>{copy.heroTitle}</h1>

            <div className="hero-card__bottom">
              <a className="btn btn--primary hero-card__cta" href="#consultation">
                {copy.heroPrimary}
                <span aria-hidden="true">→</span>
              </a>
              <p className="hero-card__lead">{copy.heroLead}</p>
            </div>

            <p className="hero-card__footnote">
              {locale === "az"
                ? "Bank hesabı, Shopify Payments, şirkət və beynəlxalq ödəniş sistemləri — bir mərkəzdən."
                : locale === "ru"
                  ? "Банковские счета, Shopify Payments, компании и международные платёжные системы — в одном месте."
                  : "Bank accounts, Shopify Payments, companies, and international payment systems — all in one place."}
            </p>
          </div>
        </div>
      </section>

      {isOpen ? (
        <div
          className="consultation-modal"
          role="dialog"
          aria-modal="true"
          aria-label={copy.heroPrimary}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div className="consultation-modal__panel">
            <button
              ref={closeButtonRef}
              type="button"
              className="consultation-modal__close"
              onClick={() => setIsOpen(false)}
              aria-label={closeLabels[locale]}
              title={closeLabels[locale]}
            >
              ×
            </button>
            <LeadQuiz
              key={`${leadContext.service}-${leadContext.packageName}-${leadContext.sourceLabel}`}
              locale={locale}
              embedded
              context={leadContext}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
