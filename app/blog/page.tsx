import Link from "next/link";
import Image from "next/image";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { postsQuery } from "@/lib/sanity.queries";
import { urlForImage } from "@/lib/sanity.image";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  _createdAt?: string;
  coverImage?: unknown;
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
    <main className="blog-page">
      <section className="section blog-page__hero">
        <div className="container">
          <p className="tag">Sapiens Pay Blog</p>
          <h1>Блог о платежах и международных продажах</h1>
          <p className="lead">
            Практические материалы о комиссиях, рекламных платежах, инфраструктуре checkout и росте
            e-commerce.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-list">
            {posts.map((post) => {
              const imageUrl = post.coverImage
                ? urlForImage(post.coverImage).width(1200).height(700).url()
                : null;
              const published = post.publishedAt ?? post._createdAt;
              const publishedDate = published
                ? new Date(published).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : null;

              return (
                <Link key={post._id} href={`/blog/${post.slug}`} className="blog-list__card">
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
        </div>
      </section>
    </main>
  );
}
