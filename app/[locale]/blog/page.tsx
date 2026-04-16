import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { blogUi, formatPostDate } from "@/app/lib/blog";
import { isLocale } from "@/app/lib/i18n";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { urlForImage } from "@/lib/sanity.image";
import { postsQuery } from "@/lib/sanity.queries";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  _createdAt?: string;
  coverImage?: unknown;
  coverImageUrl?: string;
};

export const revalidate = 60;

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

  const posts = isSanityConfigured
    ? await (async () => {
        const localized = await sanityClient.fetch<Post[]>(postsQuery, { locale });
        if (localized.length > 0 || locale === "az") {
          return localized;
        }

        return sanityClient.fetch<Post[]>(postsQuery, { locale: "az" });
      })()
    : [];

  return (
    <main className="blog-shell">
      <SiteHeader locale={locale} currentPath="/blog" actionHref={`/${locale}`} actionLabel={ui.backToSite} />

      <section className="section blog-page__hero">
        <div className="container">
          <p className="tag">{ui.badge}</p>
          <h1>{ui.title}</h1>
          <p className="lead">{ui.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!isSanityConfigured ? (
            <p className="blog-empty">{ui.notConfigured}</p>
          ) : posts.length === 0 ? (
            <p className="blog-empty">{ui.noPosts}</p>
          ) : (
            <div className="blog-list">
              {posts.map((post) => {
                const imageUrl = post.coverImage
                  ? urlForImage(post.coverImage).width(1200).height(700).url()
                  : post.coverImageUrl ?? null;
                const publishedDate = formatPostDate(locale, post.publishedAt ?? post._createdAt);

                return (
                  <Link key={post._id} href={`/${locale}/blog/${post.slug}`} className="blog-list__card">
                    <div className="blog-list__media">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={post.title} width={1200} height={700} />
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
