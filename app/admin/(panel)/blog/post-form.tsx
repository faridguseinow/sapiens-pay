"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { BlogPost } from "@/lib/database.types";
import { ArticleContent } from "@/app/_components/article-content";
import { deletePost, savePost } from "../../actions";

export function PostForm({ post }: { post?: BlogPost }) {
  const [content, setContent] = useState(post?.content ?? "");
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const insert = (before: string, after = "", placeholder = "Mətn") => {
    const editor = editorRef.current;
    if (!editor) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const next = `${content.slice(0, start)}${before}${selected}${after}${content.slice(end)}`;
    setContent(next);
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };
  const scheduledValue = post?.scheduled_at
    ? new Date(post.scheduled_at).toISOString().slice(0, 16)
    : "";

  return (
    <form action={savePost} className="admin-post-form">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input
        type="hidden"
        name="translationGroupId"
        value={post?.translation_group_id ?? ""}
      />
      <input
        type="hidden"
        name="existingCoverImage"
        value={post?.cover_image_url ?? ""}
      />
      <input
        type="hidden"
        name="existingPublishedAt"
        value={post?.published_at ?? ""}
      />

      <div className="admin-post-form__main">
        <section className="admin-panel admin-form-section">
          <div className="admin-field-row">
            <label className="admin-field--grow">
              <span>Başlıq</span>
              <input
                name="title"
                defaultValue={post?.title}
                placeholder="Yazının başlığını daxil edin"
                required
              />
            </label>
            <label>
              <span>Dil</span>
              <select name="locale" defaultValue={post?.locale ?? "az"}>
                <option value="az">AZ</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
              </select>
            </label>
          </div>
          <label>
            <span>Link adı <small>(istəyə bağlı)</small></span>
            <input
              name="slug"
              defaultValue={post?.slug}
              placeholder="Boş saxlayın — başlıqdan avtomatik yaranacaq"
            />
          </label>
          <label>
            <span>Qısa açıqlama</span>
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={post?.excerpt ?? ""}
              placeholder="Bloq kartında və başlıq altında görünəcək..."
            />
          </label>
          <div className="admin-editor-toolbar" aria-label="Mətn alətləri">
            <button type="button" onClick={() => insert("## ", "", "Bölmə başlığı")}>Başlıq</button>
            <button type="button" onClick={() => insert("### ", "", "Kiçik başlıq")}>Alt başlıq</button>
            <button type="button" onClick={() => insert("**", "**", "qalın mətn")}><b>Qalın</b></button>
            <button type="button" onClick={() => insert("- ", "", "Siyahı elementi")}>• Siyahı</button>
            <button type="button" onClick={() => insert("[", "](https://)", "keçid mətni")}>Keçid</button>
            <button type="button" className={showPreview ? "is-active" : ""} onClick={() => setShowPreview((value) => !value)}>
              {showPreview ? "Redaktora qayıt" : "Önizləmə"}
            </button>
          </div>
          <label>
            <span>Məzmun</span>
            <small className="admin-field-help">
              Bölmə başlığı üçün `##`, kiçik başlıq üçün `###`, siyahı üçün `-` yazın.
            </small>
            <textarea
              ref={editorRef}
              name="content"
              className="admin-content-editor"
              rows={22}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={"## İlk başlıq\n\nMəqalənin mətnini burada yazın..."}
              required
            />
          </label>
          {showPreview ? (
            <div className="admin-article-preview">
              <ArticleContent content={content} />
            </div>
          ) : null}
        </section>
      </div>

      <aside className="admin-post-form__side">
        <section className="admin-panel admin-form-section">
          <h2>Yayımlama</h2>
          <label>
            <span>Kateqoriya</span>
            <input name="category" defaultValue={post?.category ?? ""} placeholder="Məsələn: Shopify" />
          </label>
          <label>
              <span>Yazının vəziyyəti</span>
            <select name="status" defaultValue={post?.status ?? "draft"}>
              <option value="draft">Qaralama</option>
              <option value="published">Yayımla</option>
            </select>
          </label>
          <label>
            <span>Planlaşdırılmış tarix <small>(istəyə bağlı)</small></span>
            <input type="datetime-local" name="scheduledAt" defaultValue={scheduledValue} />
          </label>
          <button className="admin-button admin-button--primary">
            {post ? "Dəyişiklikləri saxla" : "Yazını yarat"}
          </button>
        </section>

        <section className="admin-panel admin-form-section">
          <h2>SEO</h2>
          <label><span>Google başlığı</span><input name="seoTitle" maxLength={70} defaultValue={post?.seo_title ?? ""} placeholder={post?.title ?? "Yazının SEO başlığı"} /></label>
          <label><span>Google açıqlaması</span><textarea name="seoDescription" maxLength={170} rows={4} defaultValue={post?.seo_description ?? ""} placeholder={post?.excerpt ?? "Axtarış nəticələrində görünəcək qısa açıqlama"} /></label>
        </section>

        <section className="admin-panel admin-form-section">
          <h2>Üz qabığı</h2>
          {post?.cover_image_url ? (
            <Image
              className="admin-cover-preview"
              src={post.cover_image_url}
              alt=""
              width={640}
              height={360}
            />
          ) : null}
          <label className="admin-file-field">
            <span>Şəkil seç</span>
            <input name="coverImage" type="file" accept="image/jpeg,image/png,image/webp" />
            <small>JPG, PNG və ya WEBP · maksimum 8 MB</small>
          </label>
        </section>

        {post ? (
          <section className="admin-panel admin-danger-zone">
            <h2>Yazını sil</h2>
            <button
              className="admin-button admin-button--danger"
              formAction={deletePost}
              name="id"
              value={post.id}
            >
              Yazını sil
            </button>
          </section>
        ) : null}
      </aside>
    </form>
  );
}
