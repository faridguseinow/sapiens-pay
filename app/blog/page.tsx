import Link from "next/link";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { postsQuery } from "@/lib/sanity.queries";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
};

export const revalidate = 60;

export default async function BlogPage() {
  if (!isSanityConfigured) {
    return (
      <main className="section">
        <div className="container">
          <h1>Blog</h1>
          <p style={{ marginTop: "0.75rem" }}>
            Sanity is not configured yet. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and
            `NEXT_PUBLIC_SANITY_DATASET` to enable blog content.
          </p>
        </div>
      </main>
    );
  }

  const posts = await sanityClient.fetch<Post[]>(postsQuery);

  return (
    <main className="section">
      <div className="container">
        <h1>Blog</h1>
        <div className="grid" style={{ marginTop: "1.25rem" }}>
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug}`} className="card">
              <h2>{post.title}</h2>
              {post.excerpt ? <p>{post.excerpt}</p> : null}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
