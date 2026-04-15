import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { postBySlugQuery, postSlugsQuery } from "@/lib/sanity.queries";

type Post = {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  content?: PortableTextBlock[];
};

export const revalidate = 60;

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

  return (
    <main className="section">
      <article className="container" style={{ maxWidth: 760 }}>
        <h1>{post.title}</h1>
        {post.excerpt ? <p style={{ marginTop: "0.75rem" }}>{post.excerpt}</p> : null}
        {post.content ? (
          <div style={{ marginTop: "1.2rem" }}>
            <PortableText value={post.content} />
          </div>
        ) : null}
      </article>
    </main>
  );
}
