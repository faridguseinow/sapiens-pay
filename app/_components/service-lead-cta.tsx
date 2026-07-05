"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../lib/i18n";
import { LeadQuiz, type LeadContext, type ServiceKey } from "./lead-quiz";

const labels: Record<Locale, { button: string; close: string }> = {
  az: { button: "Konsultasiya al", close: "Bağla" },
  ru: { button: "Получить консультацию", close: "Закрыть" },
  en: { button: "Get a consultation", close: "Close" },
};

export function ServiceLeadCta({
  locale,
  service,
  sourceLabel = "service-cta",
}: {
  locale: Locale;
  service: ServiceKey;
  sourceLabel?: string;
}) {
  return (
    <a
      className="btn btn--primary"
      href="#consultation"
      data-service={service}
      data-source-label={sourceLabel}
    >
      {labels[locale].button} <span aria-hidden="true">→</span>
    </a>
  );
}

export function ServiceLeadModal({
  locale,
  service,
}: {
  locale: Locale;
  service: ServiceKey;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<LeadContext>({ service });
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleTrigger = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLAnchorElement>('a[href="#consultation"]');
      if (!trigger) return;
      event.preventDefault();
      setContext({
        service: (trigger.dataset.service as ServiceKey | undefined) ?? service,
        packageName: trigger.dataset.package,
        sourcePath: window.location.pathname,
        sourceLabel: trigger.dataset.sourceLabel || trigger.textContent?.trim() || "service-cta",
      });
      setIsOpen(true);
    };

    document.addEventListener("click", handleTrigger);
    return () => document.removeEventListener("click", handleTrigger);
  }, [service]);

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
    isOpen ? (
        <div
          className="consultation-modal"
          role="dialog"
          aria-modal="true"
          aria-label={labels[locale].button}
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
              aria-label={labels[locale].close}
            >
              ×
            </button>
            <LeadQuiz
              key={`${context.service}-${context.packageName}-${context.sourceLabel}`}
              locale={locale}
              embedded
              context={context}
            />
          </div>
        </div>
      ) : null
  );
}
