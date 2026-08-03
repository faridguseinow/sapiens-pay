import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  ArticleContent,
  getArticleHeadingEntries,
} from "@/app/_components/article-content";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { ArticleShare } from "@/app/_components/article-share";
import { blogUi, formatPostDate } from "@/app/lib/blog";
import { dict, isLocale, locales, type Locale } from "@/app/lib/i18n";
import {
  getPostTranslations,
  getPostByOldSlug,
  getRelatedPosts,
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
  const canonical = post.canonical_url || `/${locale}/blog/${slug}`;
  const ogTitle = post.og_title || title;
  const ogDescription = post.og_description || description;
  const ogImage = post.og_image_url || post.cover_image_url;
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
      canonical,
      languages,
    },
    openGraph: {
      type: "article",
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: "Sapiens Pay",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: ogImage ? [{ url: ogImage, alt: post.featured_image_alt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: post.robots_index, follow: true },
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
    const targetSlug = await getPostByOldSlug(locale, slug);
    if (targetSlug && targetSlug !== slug) permanentRedirect(`/${locale}/blog/${targetSlug}`);
    notFound();
  }

  const ui = blogUi[locale];
  const t = dict[locale];

  const headingBlocks = getArticleHeadingEntries(post.content);
  const wordCount = post.content
    .split(/\s+/)
    .filter(Boolean).length;

  const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const imageUrl = post.cover_image_url;
  const publishedDate = formatPostDate(locale, post.published_at ?? undefined);
  const modifiedDate = formatPostDate(locale, post.updated_at);
  const translations = await getPostTranslations(post.translation_group_id);
  const relatedPosts = await getRelatedPosts(post);
  const articleUrl = `https://sapiens-pay.com/${locale}/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description || post.excerpt || undefined,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    inLanguage: locale,
    articleSection: post.category ?? undefined,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: "Sapiens Pay", url: "https://sapiens-pay.com" },
    publisher: { "@type": "Organization", name: "Sapiens Pay", url: "https://sapiens-pay.com" },
    mainEntityOfPage: `https://sapiens-pay.com/${locale}/blog/${slug}`,
    url: articleUrl,
    keywords: [post.focus_keyword, ...(post.secondary_keywords ?? []), ...(post.tags ?? [])].filter(Boolean),
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
              {post.category ? <Link className="tag" href={`/${locale}/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</Link> : null}
              <h1>{post.title}</h1>
              {post.subtitle ? <p className="blog-post__subtitle">{post.subtitle}</p> : null}
              {post.excerpt ? <p className="blog-post__excerpt">{post.excerpt}</p> : null}

              <div className="blog-post__meta">
                {publishedDate ? <span>{publishedDate}</span> : null}
                {post.author ? <><span>•</span><span>{post.author}</span></> : null}
                {modifiedDate && post.published_at && new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 86_400_000 ? <><span>•</span><time dateTime={post.updated_at}>Yenilənib: {modifiedDate}</time></> : null}
                {publishedDate ? <span>•</span> : null}
                <span>
                  {readMinutes} {ui.readTime}
                </span>
              </div>

              {imageUrl ? (
                <div className="blog-post__cover">
                  <Image src={imageUrl} alt={post.featured_image_alt || ""} width={1400} height={860} priority sizes="(max-width: 900px) 100vw, 900px" />
                </div>
              ) : null}

              <div className="blog-post__content">
                <ArticleContent content={post.content} />
              </div>
              <ArticleShare url={articleUrl} title={post.title} />
              {relatedPosts.length ? <section className="related-posts"><h2>Oxşar yazılar</h2><div>{relatedPosts.map((item) => <Link key={item.id} href={`/${locale}/blog/${item.slug}`}><strong>{item.title}</strong><span>{item.excerpt}</span></Link>)}</div></section> : null}
            </article>

            {headingBlocks.length > 0 ? (
              <aside className="blog-post__toc">
                <h3>{ui.tableOfContents}</h3>
                <ul>
                  {headingBlocks.map((heading) => (
                    <li key={heading.id} className={`toc-level-${heading.level}`}>
                      <a href={`#${heading.id}`}>{heading.text}</a>
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
