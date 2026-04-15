import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import Image from "next/image";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { postBySlugQuery, postSlugsQuery } from "@/lib/sanity.queries";
import { urlForImage } from "@/lib/sanity.image";

type Post = {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  content?: PortableTextBlock[];
  coverImage?: unknown;
};

export const revalidate = 60;

type BlockChild = {
  _type?: string;
  text?: string;
};

type HeadingBlock = PortableTextBlock & {
  style?: string;
  children?: BlockChild[];
};

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

  const posts = await sanityClient.fetch<Array<{ slug: string }>>(postSlugsQuery);
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSanityConfigured) {
    notFound();
  }

  const post = await sanityClient.fetch<Post | null>(postBySlugQuery, { slug });

  if (!post) {
    notFound();
  }

  const headingBlocks = (post.content ?? [])
    .filter((block): block is HeadingBlock => {
      if (!block || typeof block !== "object") return false;
      const style = (block as HeadingBlock).style;
      return style === "h2" || style === "h3";
    })
    .map((block) => {
      const text = (block.children ?? [])
        .filter((child) => child?._type === "span" && typeof child.text === "string")
        .map((child) => child.text)
        .join(" ")
        .trim();
      return text;
    })
    .filter(Boolean);

  const readMinutes = Math.max(
    1,
    Math.ceil(
      (post.content ?? [])
        .flatMap((block) => (block as HeadingBlock).children ?? [])
        .map((child) => child?.text ?? "")
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length / 180,
    ),
  );

  const imageUrl = post.coverImage ? urlForImage(post.coverImage).width(1400).height(860).url() : null;

  const portableTextComponents = {
    block: {
      h2: ({ children }: { children?: React.ReactNode }) => {
        const text = String(children ?? "");
        return <h2 id={toAnchorId(text)}>{children}</h2>;
      },
      h3: ({ children }: { children?: React.ReactNode }) => {
        const text = String(children ?? "");
        return <h3 id={toAnchorId(text)}>{children}</h3>;
      },
    },
  };

  return (
    <main className="blog-post-page">
      <section className="section">
        <div className="container">
          <nav className="blog-post__crumbs" aria-label="Breadcrumb">
            <Link href="/">Главная</Link>
            <span>›</span>
            <Link href="/blog">Блог</Link>
            <span>›</span>
            <span>{post.title}</span>
          </nav>

          <div className="blog-post">
            <article className="blog-post__main">
              <h1>{post.title}</h1>
              {post.excerpt ? <p className="blog-post__excerpt">{post.excerpt}</p> : null}

              <div className="blog-post__meta">
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : ""}
                </span>
                <span>•</span>
                <span>{readMinutes} мин чтения</span>
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
                <h3>Содержание</h3>
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
    </main>
  );
}
