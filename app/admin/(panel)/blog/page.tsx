import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/database.types";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  const posts = (data ?? []) as BlogPost[];

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Kontent mərkəzi</span>
          <h1>Bloq yazıları</h1>
          <p>Yazıları yaradın, redaktə edin və yayımlayın.</p>
        </div>
        <Link href="/admin/blog/new" className="admin-button admin-button--primary">
          + Yeni yazı
        </Link>
      </div>

      <section className="admin-post-grid">
        {posts.map((post) => (
          <article key={post.id} className="admin-post-card">
            <div className="admin-post-card__image">
              {post.cover_image_url ? (
                <Image src={post.cover_image_url} alt="" width={640} height={360} />
              ) : (
                <span>✦</span>
              )}
              <b>{post.locale.toUpperCase()}</b>
            </div>
            <div className="admin-post-card__body">
              <span className={`admin-status admin-status--${post.status}`}>
                {post.status === "published" ? "Yayımlanıb"
                  : post.status === "scheduled" ? "Planlaşdırılıb"
                  : post.status === "archived" ? "Arxiv" : "Qaralama"}
              </span>
              {post.category ? <small>{post.category}</small> : null}
              <h2>{post.title}</h2>
              <p>{post.excerpt || "Qısa açıqlama əlavə edilməyib."}</p>
              <div>
                <small>
                  {new Date(post.updated_at).toLocaleDateString("az-AZ", {
                    day: "2-digit",
                    month: "short",
                  })}
                </small>
                <Link href={`/admin/blog/${post.id}`}>Redaktə et →</Link>
              </div>
            </div>
          </article>
        ))}
        {!posts.length ? (
          <div className="admin-empty admin-empty--wide">
            <strong>İlk bloq yazınızı yaradın</strong>
            <p>Yazı əlavə etmək üçün yuxarıdakı “Yeni yazı” düyməsinə klikləyin.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
