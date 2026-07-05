import type { Locale } from "./i18n";

export type BlogUiCopy = {
  badge: string;
  title: string;
  lead: string;
  allPosts: string;
  backToSite: string;
  blogLabel: string;
  tableOfContents: string;
  readTime: string;
  readTimeShort: string;
  noPosts: string;
  notConfigured: string;
};

export const blogUi: Record<Locale, BlogUiCopy> = {
  az: {
    badge: "Sapiens Pay Blog",
    title: "Ödənişlər və beynəlxalq satışlar üzrə bloq",
    lead: "Xarici bank hesabları, Shopify Payments, şirkət qeydiyyatı və beynəlxalq ödənişlər üzrə praktik materiallar.",
    allPosts: "Bütün yazılar",
    backToSite: "Ana səhifə",
    blogLabel: "Bloq",
    tableOfContents: "Mündəricat",
    readTime: "dəqiqə oxu",
    readTimeShort: "dəq",
    noPosts: "Bu dil üçün yazı tapılmadı.",
    notConfigured: "Bloq sistemi hələ aktiv edilməyib.",
  },
  ru: {
    badge: "Sapiens Pay Blog",
    title: "Блог о платежах и международных продажах",
    lead: "Практические материалы о зарубежных счетах, Shopify Payments, регистрации компаний и международных платежах.",
    allPosts: "Все статьи",
    backToSite: "На главную",
    blogLabel: "Блог",
    tableOfContents: "Содержание",
    readTime: "мин чтения",
    readTimeShort: "мин",
    noPosts: "Для этого языка пока нет статей.",
    notConfigured: "Система блога пока не активирована.",
  },
  en: {
    badge: "Sapiens Pay Blog",
    title: "Blog about payments and global e-commerce",
    lead: "Practical guides to foreign accounts, Shopify Payments, company formation, and international payments.",
    allPosts: "All posts",
    backToSite: "Homepage",
    blogLabel: "Blog",
    tableOfContents: "Contents",
    readTime: "min read",
    readTimeShort: "min",
    noPosts: "No posts available for this language yet.",
    notConfigured: "The blog system has not been activated yet.",
  },
};

export const localeToIntl: Record<Locale, string> = {
  az: "az-AZ",
  ru: "ru-RU",
  en: "en-US",
};

export function formatPostDate(locale: Locale, value?: string) {
  if (!value) return null;

  return new Date(value).toLocaleDateString(localeToIntl[locale], {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
