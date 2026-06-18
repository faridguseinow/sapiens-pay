import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { MobileFooterNav, SiteFooter, SiteHeader } from "@/app/_components/site-chrome";
import { blogUi, formatPostDate } from "@/app/lib/blog";
import { dict, isLocale, locales, type Locale } from "@/app/lib/i18n";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { urlForImage } from "@/lib/sanity.image";
import { postBySlugQuery, postRoutesQuery } from "@/lib/sanity.queries";

type Post = {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  content?: PortableTextBlock[];
  coverImage?: unknown;
  coverImageUrl?: string;
  _translations?: Array<{
    language?: string;
    slug?: string;
    title?: string;
  }>;
};

type BlockChild = {
  _type?: string;
  text?: string;
};

type HeadingBlock = PortableTextBlock & {
  style?: string;
  children?: BlockChild[];
};

export const revalidate = 60;

const toAnchorId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

export async function generateStaticParams() {
  if (!isSanityConfigured) {
    return [];
  }

  const routes = await sanityClient.fetch<Array<{ locale?: string; slug?: string }>>(postRoutesQuery, { locales });
  return routes
    .filter((route): route is { locale: Locale; slug: string } => {
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

  if (!isSanityConfigured) {
    notFound();
  }

  const post = await sanityClient.fetch<Post | null>(postBySlugQuery, { slug, locale });

  if (!post) {
    notFound();
  }

  const ui = blogUi[locale];
  const t = dict[locale];

  const headingBlocks = (post.content ?? [])
    .filter((block): block is HeadingBlock => {
      if (!block || typeof block !== "object") {
        return false;
      }

      const style = (block as HeadingBlock).style;
      return style === "h2" || style === "h3";
    })
    .map((block) => {
      return (block.children ?? [])
        .filter((child) => child?._type === "span" && typeof child.text === "string")
        .map((child) => child.text)
        .join(" ")
        .trim();
    })
    .filter(Boolean);

  const wordCount = (post.content ?? [])
    .flatMap((block) => (block as HeadingBlock).children ?? [])
    .map((child) => child?.text ?? "")
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const imageUrl = post.coverImage
    ? urlForImage(post.coverImage).width(1400).height(860).url()
    : post.coverImageUrl ?? null;
  const publishedDate = formatPostDate(locale, post.publishedAt);
  const localeLinks = Object.fromEntries(
    locales.map((item) => {
      if (item === locale) {
        return [item, `/${locale}/blog/${slug}`];
      }

      const translation = (post._translations ?? []).find(
        (entry) => entry.language === item && typeof entry.slug === "string",
      );

      return [item, translation ? `/${item}/blog/${translation.slug}` : null];
    }),
  ) as Partial<Record<Locale, string | null>>;

  const portableTextComponents = {
    block: {
      h2: ({ children }: { children?: ReactNode }) => {
        const text = String(children ?? "");
        return <h2 id={toAnchorId(text)}>{children}</h2>;
      },
      h3: ({ children }: { children?: ReactNode }) => {
        const text = String(children ?? "");
        return <h3 id={toAnchorId(text)}>{children}</h3>;
      },
    },
  };

  return (
    <main className="blog-shell blog-post-page">
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
                  <Image src={imageUrl} alt={post.title} width={1400} height={860} />
                </div>
              ) : null}

              <div className="blog-post__content">
                {post.content ? <PortableText value={post.content} components={portableTextComponents} /> : null}
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
