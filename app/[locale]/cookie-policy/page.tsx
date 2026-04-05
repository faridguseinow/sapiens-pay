import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "../../_components/legal-page";
import { getLegalDocument } from "../../lib/legal";
import { isLocale, locales } from "../../lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const doc = getLegalDocument(locale, "cookie-policy");

  return {
    title: `Sapiens Pay | ${doc.title}`,
    description: doc.description,
  };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LegalPage locale={locale} slug="cookie-policy" />;
}
