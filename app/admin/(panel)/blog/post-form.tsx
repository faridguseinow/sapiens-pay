"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { BlogPost } from "@/lib/database.types";
import { ArticleContent } from "@/app/_components/article-content";
import { deletePost, savePost } from "../../actions";

export function PostForm({ post }: { post?: BlogPost }) {
  const [content, setContent] = useState(post?.content ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
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
  const insertList = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const start = content.lastIndexOf("\n", Math.max(0, editor.selectionStart - 1)) + 1;
    const selectionEnd = editor.selectionEnd;
    const endOfSelection = selectionEnd > start && content[selectionEnd - 1] === "\n"
      ? selectionEnd - 1
      : selectionEnd;
    const nextLineBreak = content.indexOf("\n", endOfSelection);
    const end = nextLineBreak === -1 ? content.length : nextLineBreak;
    const selectedLines = content.slice(start, end) || "Siyahı elementi";
    const formatted = selectedLines
      .split("\n")
      .map((line) => line.match(/^\s*[-*]\s+/) ? line : `- ${line}`)
      .join("\n");
    const next = `${content.slice(0, start)}${formatted}${content.slice(end)}`;

    setContent(next);
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start, start + formatted.length);
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
                value={title}
                onChange={(event) => setTitle(event.target.value)}
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
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="Boş saxlayın — başlıqdan avtomatik yaranacaq"
            />
          </label>
          <label>
            <span>Alt başlıq <small>(istəyə bağlı)</small></span>
            <input name="subtitle" defaultValue={post?.subtitle ?? ""} placeholder="Başlığı tamamlayan qısa cümlə" />
          </label>
          <label>
            <span>Qısa açıqlama</span>
            <textarea
              name="excerpt"
              rows={3}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Bloq kartında və başlıq altında görünəcək..."
            />
          </label>
          <div className="admin-editor-toolbar" aria-label="Mətn alətləri">
            <button type="button" onClick={() => insert("## ", "", "Bölmə başlığı")}>Başlıq</button>
            <button type="button" onClick={() => insert("### ", "", "Kiçik başlıq")}>Alt başlıq</button>
            <button type="button" onClick={() => insert("#### ", "", "Detallı başlıq")}>H4</button>
            <button type="button" onClick={() => insert("**", "**", "qalın mətn")}><b>Qalın</b></button>
            <button type="button" onClick={() => insert("*", "*", "italik mətn")}><i>İtalik</i></button>
            <button type="button" onClick={insertList}>• Siyahı</button>
            <button type="button" onClick={() => insert("1. ", "", "Siyahı elementi")}>1. Siyahı</button>
            <button type="button" onClick={() => insert("[", "](https://)", "keçid mətni")}>Keçid</button>
            <button type="button" onClick={() => insert("![", "](https://)", "şəkil alt mətni")}>Şəkil</button>
            <button type="button" onClick={() => insert("> ", "", "Sitat")}>Sitat</button>
            <button type="button" onClick={() => insert("> [!INFO] ", "", "Faydalı məlumat")}>Məlumat</button>
            <button type="button" onClick={() => insert("> [!WARNING] ", "", "Vacib xəbərdarlıq")}>Xəbərdarlıq</button>
            <button type="button" onClick={() => insert("\n| Başlıq 1 | Başlıq 2 |\n| --- | --- |\n| Məlumat | Məlumat |\n", "", "")}>Cədvəl</button>
            <button type="button" onClick={() => insert("[CTA: ", " | /az#contact]", "Məsləhət al")}>CTA</button>
            <button type="button" onClick={() => insert("\n---\n", "", "")}>Ayırıcı</button>
            <button type="button" className={showPreview ? "is-active" : ""} onClick={() => setShowPreview((value) => !value)}>
              {showPreview ? "Redaktora qayıt" : "Önizləmə"}
            </button>
          </div>
          <label>
            <span>Məzmun</span>
            <small className="admin-field-help">
              Bölmə başlığı üçün `##`, kiçik başlıq üçün `###`, siyahı üçün `-` və ya `*` yazın.
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
          <label><span>Teqlər</span><input name="tags" defaultValue={post?.tags?.join(", ") ?? ""} placeholder="Wise, Shopify, ödənişlər" /></label>
          <label><span>Müəllif <small>(yalnız real ad)</small></span><input name="author" defaultValue={post?.author ?? ""} /></label>
          <label>
              <span>Yazının vəziyyəti</span>
            <select name="status" defaultValue={post?.status ?? "draft"}>
              <option value="draft">Qaralama</option>
              <option value="published">Yayımla</option>
              <option value="scheduled">Planlaşdırılıb</option>
              <option value="archived">Arxiv</option>
            </select>
          </label>
          <label className="admin-check"><input type="checkbox" name="isFeatured" defaultChecked={post?.is_featured ?? false} /><span>Seçilmiş məqalə</span></label>
          <label>
            <span>Planlaşdırılmış tarix <small>(istəyə bağlı)</small></span>
            <input type="datetime-local" name="scheduledAt" defaultValue={scheduledValue} />
          </label>
          <button className="admin-button admin-button--primary">
            {post ? "Dəyişiklikləri saxla" : "Yazını yarat"}
          </button>
        </section>

        <details className="admin-panel admin-form-section admin-seo" open>
          <summary><strong>SEO ayarları</strong><span>İstəyə bağlı</span></summary>
          <label><span>Google başlığı</span><input name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || "Yazının SEO başlığı"} /></label>
          <small>{(seoTitle || title).length} simvol · tövsiyə: təxminən 50–60</small>
          <label><span>Meta açıqlama</span><textarea name="seoDescription" rows={4} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder={excerpt || "Axtarış nəticələrində görünəcək qısa açıqlama"} /></label>
          <small>{(seoDescription || excerpt).length} simvol · tövsiyə: təxminən 140–160</small>
          <label><span>Əsas açar söz</span><input name="focusKeyword" defaultValue={post?.focus_keyword ?? ""} /></label>
          <label><span>İkinci dərəcəli açar sözlər</span><input name="secondaryKeywords" defaultValue={post?.secondary_keywords?.join(", ") ?? ""} /></label>
          <label><span>Canonical URL</span><input type="url" name="canonicalUrl" defaultValue={post?.canonical_url ?? ""} placeholder="Boşdursa öz URL-i istifadə olunur" /></label>
          <label><span>Open Graph başlığı</span><input name="ogTitle" defaultValue={post?.og_title ?? ""} /></label>
          <label><span>Open Graph açıqlaması</span><textarea name="ogDescription" rows={3} defaultValue={post?.og_description ?? ""} /></label>
          <label><span>Open Graph şəkil URL-i</span><input type="url" name="ogImage" defaultValue={post?.og_image_url ?? ""} /></label>
          <label className="admin-check"><input type="checkbox" name="robotsIndex" defaultChecked={post?.robots_index ?? true} /><span>Axtarış sistemlərində indekslə</span></label>
          <label className="admin-check"><input type="checkbox" name="includeInSitemap" defaultChecked={post?.include_in_sitemap ?? true} /><span>Sitemap-a daxil et</span></label>
          <div className="admin-serp-preview"><small>Google önizləməsi</small><strong>{seoTitle || title || "Məqalə başlığı"}</strong><span>https://sapiens-pay.com/az/blog/{slug || "url-adi"}</span><p>{seoDescription || excerpt || "Meta açıqlama burada görünəcək."}</p></div>
          <div className="admin-seo-checklist"><strong>SEO yoxlaması</strong><ul>
            <li className={title ? "is-ok" : ""}>Başlıq</li><li className={slug || !post ? "is-ok" : ""}>URL adı</li>
            <li className={excerpt ? "is-ok" : ""}>Qısa açıqlama</li><li className={/^##\s/m.test(content) ? "is-ok" : ""}>Ən azı bir H2</li>
            <li className={/\[[^\]]+\]\(\//.test(content) ? "is-ok" : ""}>Daxili keçid</li>
          </ul></div>
        </details>

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
          <label><span>Şəkil alt mətni</span><input name="featuredImageAlt" defaultValue={post?.featured_image_alt ?? ""} placeholder="Şəkildə görünənləri qısa təsvir edin" /></label>
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
