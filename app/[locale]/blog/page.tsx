import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { blogUi, formatPostDate } from "@/app/lib/blog";
import { isLocale } from "@/app/lib/i18n";
import { localizedMetadata } from "@/app/lib/seo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getPublishedPosts } from "@/lib/posts";

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
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localizedMetadata({ locale, path: "/blog", ...metadataCopy[locale] });
}

export default async function LocalizedBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const ui = blogUi[locale];

  const posts = await getPublishedPosts(locale);

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
          {!isSupabaseConfigured ? (
            <p className="blog-empty">{ui.notConfigured}</p>
          ) : posts.length === 0 ? (
            <p className="blog-empty">{ui.noPosts}</p>
          ) : (
            <div className="blog-list">
              {posts.map((post) => {
                const imageUrl = post.cover_image_url;
                const publishedDate = formatPostDate(
                  locale,
                  post.published_at ?? post.created_at,
                );

                return (
                  <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="blog-list__card">
                    <div className="blog-list__media">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={post.title} width={1200} height={700} unoptimized />
                      ) : (
                        <div className="blog-list__placeholder" />
                      )}
                    </div>
                    <div className="blog-list__body">
                      {publishedDate ? <span>{publishedDate}</span> : null}
                      <h2>{post.title}</h2>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter locale={locale} />
      <MobileFooterNav locale={locale} />
    </main>
  );
}
