import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleContent,
  getArticleHeadings,
  toAnchorId,
} from "@/app/_components/article-content";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { blogUi, formatPostDate } from "@/app/lib/blog";
import { dict, isLocale, locales, type Locale } from "@/app/lib/i18n";
import {
  getPostTranslations,
  getPublishedPost,
  getPublishedPostRoutes,
} from "@/lib/posts";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPublishedPost(locale, slug);
  if (!post) return {};
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;
  const translations = await getPostTranslations(post.translation_group_id);
  const languageTags: Record<Locale, string> = {
    az: "az-AZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const languages = Object.fromEntries(
    translations
      .filter((item): item is typeof item & { locale: Locale } => isLocale(item.locale))
      .map((item) => [languageTags[item.locale], `/${item.locale}/blog/${item.slug}`]),
  );
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/${locale}/blog/${slug}`,
      siteName: "Sapiens Pay",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const routes = await getPublishedPostRoutes();
  return routes
    .filter((route): route is typeof route & { locale: Locale } => {
      return typeof route.slug === "string" && typeof route.locale === "string" && isLocale(route.locale);
    })
    .map(({ locale, slug }) => ({ locale, slug }));
}

export default async function LocalizedBlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;

  const post = await getPublishedPost(locale, slug);

  if (!post) {
    notFound();
  }

  const ui = blogUi[locale];
  const t = dict[locale];

  const headingBlocks = getArticleHeadings(post.content);
  const wordCount = post.content
    .split(/\s+/)
    .filter(Boolean).length;

  const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const imageUrl = post.cover_image_url;
  const publishedDate = formatPostDate(locale, post.published_at ?? undefined);
  const translations = await getPostTranslations(post.translation_group_id);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.excerpt || undefined,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    inLanguage: locale,
    articleSection: post.category ?? undefined,
    author: { "@type": "Organization", name: "Sapiens Pay", url: "https://sapiens-pay.com" },
    publisher: { "@type": "Organization", name: "Sapiens Pay", url: "https://sapiens-pay.com" },
    mainEntityOfPage: `https://sapiens-pay.com/${locale}/blog/${slug}`,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.headerHome,
        item: `https://sapiens-pay.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: ui.blogLabel,
        item: `https://sapiens-pay.com/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://sapiens-pay.com/${locale}/blog/${slug}`,
      },
    ],
  };
  const localeLinks = Object.fromEntries(
    locales.map((item) => {
      if (item === locale) {
        return [item, `/${locale}/blog/${slug}`];
      }

      const translation = translations.find((entry) => entry.locale === item);

      return [item, translation ? `/${item}/blog/${translation.slug}` : null];
    }),
  ) as Partial<Record<Locale, string | null>>;

  return (
    <main className="blog-shell blog-post-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader
        locale={locale}
        currentPath={`/blog/${slug}`}
        localeLinks={localeLinks}
        actionHref={`/${locale}/blog`}
        actionLabel={ui.allPosts}
      />

      <section className="section blog-post__section">
        <div className="container">
          <nav className="blog-post__crumbs" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{t.headerHome}</Link>
            <span>›</span>
            <Link href={`/${locale}/blog`}>{ui.blogLabel}</Link>
            <span>›</span>
            <span>{post.title}</span>
          </nav>

          <div className="blog-post">
            <article className="blog-post__main">
              <h1>{post.title}</h1>
              {post.excerpt ? <p className="blog-post__excerpt">{post.excerpt}</p> : null}

              <div className="blog-post__meta">
                {publishedDate ? <span>{publishedDate}</span> : null}
                {publishedDate ? <span>•</span> : null}
                <span>
                  {readMinutes} {ui.readTime}
                </span>
              </div>

              {imageUrl ? (
                <div className="blog-post__cover">
                  <Image src={imageUrl} alt={post.title} width={1400} height={860} unoptimized />
                </div>
              ) : null}

              <div className="blog-post__content">
                <ArticleContent content={post.content} />
              </div>
            </article>

            {headingBlocks.length > 0 ? (
              <aside className="blog-post__toc">
                <h3>{ui.tableOfContents}</h3>
                <ul>
                  {headingBlocks.map((heading) => (
                    <li key={heading}>
                      <a href={`#${toAnchorId(heading)}`}>{heading}</a>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
      <MobileFooterNav locale={locale} />
    </main>
  );
}
