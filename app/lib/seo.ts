import type { Metadata } from "next";
import type { Locale } from "./i18n";

const localeTags: Record<Locale, string> = {
  az: "az_AZ",
  ru: "ru_RU",
  en: "en_US",
};

const hrefLangTags: Record<Locale, string> = {
  az: "az-AZ",
  ru: "ru-RU",
  en: "en-US",
};

export function localizedMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const canonical = `/${locale}${normalizedPath}`;
  const languages = Object.fromEntries(
    (Object.keys(hrefLangTags) as Locale[]).map((item) => [
      hrefLangTags[item],
      `/${item}${normalizedPath}`,
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": `/az${normalizedPath}`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      locale: localeTags[locale],
      alternateLocale: (Object.keys(localeTags) as Locale[])
        .filter((item) => item !== locale)
        .map((item) => localeTags[item]),
      siteName: "Sapiens Pay",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
