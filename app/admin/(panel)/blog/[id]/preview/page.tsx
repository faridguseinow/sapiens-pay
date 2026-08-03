import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/app/_components/article-content";
import { requireRole } from "@/lib/auth/access";
import type { BlogPost } from "@/lib/database.types";

export const metadata = { title: "Məqalə önizləməsi", robots: { index: false, follow: false } };

export default async function AdminPostPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireRole("admin", "/admin/login");
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as BlogPost;
  return <main className="admin-preview-page">
    <nav><Link href={`/admin/blog/${post.id}`}>← Redaktora qayıt</Link></nav>
    <article className="blog-post__main">
      {post.category ? <span className="tag">{post.category}</span> : null}
      <h1>{post.title}</h1>
      {post.subtitle ? <p className="blog-post__subtitle">{post.subtitle}</p> : null}
      {post.excerpt ? <p className="blog-post__excerpt">{post.excerpt}</p> : null}
      <div className="blog-post__content"><ArticleContent content={post.content} /></div>
    </article>
  </main>;
}
