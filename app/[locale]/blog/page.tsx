import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { blogUi, formatPostDate } from "@/app/lib/blog";
import { isLocale } from "@/app/lib/i18n";
import { localizedMetadata } from "@/app/lib/seo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getBlogCategories, getPublishedPosts } from "@/lib/posts";

export const revalidate = 60;

const metadataCopy = {
  az: {
    title: "Beynəlxalq ödənişlər və xarici hesablar bloqu",
    description:
      "Wise, Payoneer, Shopify Payments, Stripe, PayPal və xaricdə şirkət açılması haqqında Azərbaycan dilində praktik bələdçilər.",
  },
  ru: {
    title: "Блог о международных платежах и зарубежных счетах",
    description:
      "Практические материалы о Wise, Payoneer, Shopify Payments, Stripe, PayPal и регистрации компаний за рубежом.",
  },
  en: {
    title: "International payments and foreign accounts blog",
    description:
      "Practical guides to Wise, Payoneer, Shopify Payments, Stripe, PayPal, and company formation abroad.",
  },
} as const;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const search = await searchParams;
  if (!isLocale(locale)) return {};
  return {
    ...localizedMetadata({ locale, path: "/blog", ...metadataCopy[locale] }),
    robots: search.q ? { index: false, follow: true } : undefined,
  };
}

export default async function LocalizedBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const ui = blogUi[locale];

  const search = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(search.page || "1", 10) || 1);
  const [{ posts, count, pageSize }, categories] = await Promise.all([
    getPublishedPosts(locale, { query: search.q, category: search.category, page: currentPage, pageSize: 9 }),
    getBlogCategories(locale),
  ]);
  const featuredPost = !search.q && !search.category ? posts.find((post) => post.is_featured) : undefined;
  const totalPages = Math.ceil(count / pageSize);
  const queryHref = (page: number) => {
    const values = new URLSearchParams();
    if (search.q) values.set("q", search.q);
    if (search.category) values.set("category", search.category);
    if (page > 1) values.set("page", String(page));
    return `/${locale}/blog${values.size ? `?${values}` : ""}`;
  };

  return (
    <main className="blog-shell">
      <SiteHeader locale={locale} currentPath="/blog" actionHref={`/${locale}`} actionLabel={ui.backToSite} />

      <section className="section blog-page__hero">
        <div className="container blog-page__hero-content">
          <p className="tag">{ui.badge}</p>
          <h1>{ui.title}</h1>
          <p className="lead">{ui.lead}</p>
        </div>
      </section>

      <section className="section blog-section">
        <div className="container">
          <form className="blog-search" action={`/${locale}/blog`}>
            <label><span className="sr-only">Bloqda axtar</span><input type="search" name="q" defaultValue={search.q} placeholder="Bloqda axtar..." /></label>
            {search.category ? <input type="hidden" name="category" value={search.category} /> : null}
            <button>Axtar</button>
          </form>
          {categories.length ? <nav className="blog-categories" aria-label="Kateqoriyalar">
            <Link className={!search.category ? "is-active" : ""} href={`/${locale}/blog`}>Hamısı</Link>
            {categories.map((category) => <Link className={search.category === category ? "is-active" : ""} key={category} href={`/${locale}/blog?category=${encodeURIComponent(category)}`}>{category}</Link>)}
          </nav> : null}
          {featuredPost ? <Link href={`/${locale}/blog/${featuredPost.slug}`} className="blog-featured"><span>Seçilmiş məqalə</span><h2>{featuredPost.title}</h2><p>{featuredPost.excerpt}</p></Link> : null}
          {!isSupabaseConfigured ? (
            <p className="blog-empty">{ui.notConfigured}</p>
          ) : posts.length === 0 ? (
            <p className="blog-empty">{ui.noPosts}</p>
          ) : (
            <div className="blog-list">
              {posts.filter((post) => post.id !== featuredPost?.id).map((post) => {
                const imageUrl = post.cover_image_url;
                const publishedDate = formatPostDate(
                  locale,
                  post.published_at ?? post.created_at,
                );

                return (
                  <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="blog-list__card">
                    <div className="blog-list__media">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={post.featured_image_alt || ""} width={1200} height={700} sizes="(max-width: 760px) 100vw, 33vw" />
                      ) : (
                        <div className="blog-list__placeholder" />
                      )}
                    </div>
                    <div className="blog-list__body">
                      <div className="blog-list__meta">{post.category ? <b>{post.category}</b> : null}{publishedDate ? <span>{publishedDate}</span> : null}</div>
                      <h2>{post.title}</h2>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                      <small>{Math.max(1, Math.ceil(post.content.split(/\s+/).filter(Boolean).length / 180))} {ui.readTime}</small>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          {totalPages > 1 ? <nav className="blog-pagination" aria-label="Səhifələr">
            {currentPage > 1 ? <Link href={queryHref(currentPage - 1)}>← Əvvəlki</Link> : <span />}
            <span>{currentPage} / {totalPages}</span>
            {currentPage < totalPages ? <Link href={queryHref(currentPage + 1)}>Növbəti →</Link> : <span />}
          </nav> : null}
        </div>
      </section>

      <SiteFooter locale={locale} />
      <MobileFooterNav locale={locale} />
    </main>
  );
}
