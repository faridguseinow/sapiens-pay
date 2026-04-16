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
    lead: "Komissiyalar, reklam ödənişləri və e-commerce infrastrukturu üzrə praktik materiallar.",
    allPosts: "Bütün yazılar",
    backToSite: "Ana səhifəyə qayıt",
    blogLabel: "Bloq",
    tableOfContents: "Mündəricat",
    readTime: "dəqiqə oxu",
    readTimeShort: "dəq",
    noPosts: "Bu dil üçün yazı tapılmadı.",
    notConfigured:
      "Sanity hələ qoşulmayıb. `NEXT_PUBLIC_SANITY_PROJECT_ID` və `NEXT_PUBLIC_SANITY_DATASET` əlavə edin.",
  },
  ru: {
    badge: "Sapiens Pay Blog",
    title: "Блог о платежах и международных продажах",
    lead: "Практические материалы о комиссиях, рекламных платежах и инфраструктуре e-commerce.",
    allPosts: "Все статьи",
    backToSite: "Вернуться на главную",
    blogLabel: "Блог",
    tableOfContents: "Содержание",
    readTime: "мин чтения",
    readTimeShort: "мин",
    noPosts: "Для этого языка пока нет статей.",
    notConfigured:
      "Sanity пока не настроен. Добавьте `NEXT_PUBLIC_SANITY_PROJECT_ID` и `NEXT_PUBLIC_SANITY_DATASET`.",
  },
  en: {
    badge: "Sapiens Pay Blog",
    title: "Blog about payments and global e-commerce",
    lead: "Practical guides on fees, ad payments, and checkout infrastructure.",
    allPosts: "All posts",
    backToSite: "Back to homepage",
    blogLabel: "Blog",
    tableOfContents: "Contents",
    readTime: "min read",
    readTimeShort: "min",
    noPosts: "No posts available for this language yet.",
    notConfigured:
      "Sanity is not configured yet. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.",
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
