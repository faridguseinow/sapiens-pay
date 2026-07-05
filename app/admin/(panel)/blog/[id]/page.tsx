import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/database.types";
import { PostForm } from "../post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).single();
  if (!data) notFound();

  const post = data as BlogPost;

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <Link href="/admin/blog" className="admin-back">
            ← Bloqa qayıt
          </Link>
          <h1>Yazını redaktə et</h1>
          <p>Son yenilənmə: {new Date(post.updated_at).toLocaleString("az-AZ")}</p>
        </div>
        {post.status === "published" ? (
          <Link
            href={`/${post.locale}/blog/${post.slug}`}
            target="_blank"
            className="admin-button"
          >
            Saytda bax ↗
          </Link>
        ) : null}
      </div>
      <PostForm post={post} />
    </main>
  );
}
