"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, LocaleCode, PostStatus } from "@/lib/database.types";
import { parseCommaList, slugify } from "@/lib/blog-utils";

export type AuthState = { error?: string } | undefined;

async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/admin/login");
  }
  const userId = typeof data.claims.sub === "string" ? data.claims.sub : "";
  const { data: member } = await supabase
    .from("team_members")
    .select("role")
    .eq("auth_user_id", userId)
    .maybeSingle();
  if (member?.role !== "admin") redirect("/sales");

  return supabase;
}

export async function login(_state: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-poçt və şifrəni daxil edin." };
  }

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        error:
          "E-poçt ünvanı hələ təsdiqlənməyib. Gələn təsdiq məktubundakı linki açın.",
      };
    }

    return { error: "E-poçt və ya şifrə yanlışdır." };
  }

  const { data: member } = await supabase
    .from("team_members")
    .select("role")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();
  if (member?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Bu hesab satış panelinə aiddir. Satış girişindən istifadə edin." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function listValue(value: FormDataEntryValue | null, maxItems = 12) {
  return parseCommaList(String(value ?? ""), maxItems);
}

function optionalHttpUrl(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    return url.toString();
  } catch {
    throw new Error("Canonical və Open Graph ünvanları etibarlı HTTP(S) URL olmalıdır.");
  }
}

export async function savePost(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const manualSlug = String(formData.get("slug") ?? "").trim();
  const locale = String(formData.get("locale") ?? "az") as LocaleCode;
  const status = String(formData.get("status") ?? "draft") as PostStatus;
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const existingImage = String(formData.get("existingCoverImage") ?? "").trim();
  const existingPublishedAt = String(formData.get("existingPublishedAt") ?? "").trim();
  const translationGroupId = String(formData.get("translationGroupId") ?? "").trim();
  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const seoDescription = String(formData.get("seoDescription") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const scheduledAt = String(formData.get("scheduledAt") ?? "").trim();
  const image = formData.get("coverImage");

  if (!["draft", "published", "scheduled", "archived"].includes(status)) {
    throw new Error("Yazının vəziyyəti yanlışdır.");
  }
  if (status === "scheduled" && !scheduledAt) {
    throw new Error("Planlaşdırılmış yazı üçün yayım tarixini seçin.");
  }
  const publicationMoment = scheduledAt ? new Date(scheduledAt) : null;
  if (publicationMoment && Number.isNaN(publicationMoment.getTime())) {
    throw new Error("Yayım tarixi yanlışdır.");
  }

  if (!title || !content || !["az", "ru", "en"].includes(locale)) {
    throw new Error("Başlıq, dil və məzmun mütləqdir.");
  }

  let coverImageUrl = existingImage || null;

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/") || image.size > 8 * 1024 * 1024) {
      throw new Error("Şəkil JPG, PNG və ya WEBP formatında, maksimum 8 MB olmalıdır.");
    }

    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(path, image, { contentType: image.type, upsert: false });

    if (uploadError) {
      throw new Error(`Şəkil yüklənmədi: ${uploadError.message}`);
    }

    coverImageUrl = supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
  }

  const slug = slugify(manualSlug || title);
  if (!slug) {
    throw new Error("URL adı yaradıla bilmədi. URL adı sahəsini latın hərfləri ilə doldurun.");
  }

  const previousPost = id
    ? await supabase.from("posts").select("slug,locale,published_at").eq("id", id).single()
    : null;
  if (previousPost?.error) throw new Error(previousPost.error.message);

  const duplicateQuery = supabase.from("posts").select("id", { count: "exact", head: true })
    .eq("locale", locale).eq("slug", slug);
  if (id) duplicateQuery.neq("id", id);
  const { count: duplicateCount, error: duplicateError } = await duplicateQuery;
  if (duplicateError) throw new Error(duplicateError.message);
  if (duplicateCount) throw new Error("Bu dil üçün həmin URL adı artıq istifadə olunur.");

  const originalPublishedAt = previousPost?.data?.published_at || existingPublishedAt || null;
  const payload = {
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim().slice(0, 240) || null,
    slug,
    locale,
    excerpt: excerpt || null,
    content,
    cover_image_url: coverImageUrl,
    featured_image_alt: String(formData.get("featuredImageAlt") ?? "").trim().slice(0, 240) || null,
    seo_title: seoTitle.slice(0, 70) || null,
    seo_description: seoDescription.slice(0, 170) || null,
    category: category.slice(0, 80) || null,
    tags: listValue(formData.get("tags")),
    author: String(formData.get("author") ?? "").trim().slice(0, 120) || null,
    is_featured: formData.get("isFeatured") === "on",
    focus_keyword: String(formData.get("focusKeyword") ?? "").trim().slice(0, 120) || null,
    secondary_keywords: listValue(formData.get("secondaryKeywords")),
    canonical_url: optionalHttpUrl(formData.get("canonicalUrl")),
    og_title: String(formData.get("ogTitle") ?? "").trim().slice(0, 120) || null,
    og_description: String(formData.get("ogDescription") ?? "").trim().slice(0, 240) || null,
    og_image_url: optionalHttpUrl(formData.get("ogImage")),
    robots_index: formData.get("robotsIndex") === "on",
    include_in_sitemap: formData.get("includeInSitemap") === "on",
    scheduled_at: status === "scheduled" && publicationMoment ? publicationMoment.toISOString() : null,
    status,
    published_at:
      status === "published"
        ? originalPublishedAt || new Date().toISOString()
        : status === "scheduled" && publicationMoment
          ? publicationMoment.toISOString()
          : originalPublishedAt,
    ...(translationGroupId ? { translation_group_id: translationGroupId } : {}),
  };

  if (id) {
    const { error } = await supabase.from("posts").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
    const previous = previousPost?.data;
    if (previous && (previous.slug !== slug || previous.locale !== locale)) {
      const { error: redirectError } = await supabase.from("post_slug_redirects").upsert({
        post_id: id,
        locale: previous.locale,
        old_slug: previous.slug,
      }, { onConflict: "locale,old_slug" });
      if (redirectError) throw new Error(redirectError.message);
    }
  } else {
    const { error } = await supabase.from("posts").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/${locale}/blog`);
  revalidatePath(`/${locale}/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateLead(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new") as LeadStatus;
  const notes = String(formData.get("notes") ?? "").trim();
  const nextFollowUpAt = String(formData.get("nextFollowUpAt") ?? "").trim();
  const priority = String(formData.get("priority") ?? "medium");

  if (!["new", "contacted", "qualified", "won", "closed"].includes(status)) {
    throw new Error("Yanlış lead statusu.");
  }
  if (!["high", "medium", "low"].includes(priority)) {
    throw new Error("Yanlış prioritet.");
  }

  const { data: currentLead } = await supabase
    .from("leads")
    .select("profile")
    .eq("id", id)
    .single();
  const currentProfile =
    currentLead?.profile && typeof currentLead.profile === "object"
      ? currentLead.profile
      : {};

  const { error } = await supabase
    .from("leads")
    .update({
      status,
      notes: notes || null,
      profile: { ...currentProfile, priority },
      next_follow_up_at: nextFollowUpAt ? new Date(nextFollowUpAt).toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/board");
  redirect("/admin/leads");
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await requireAdmin();
  if (!id || !["new", "contacted", "qualified", "won", "closed"].includes(status)) {
    return { error: "Mərhələ dəyişdirilə bilmədi." };
  }

  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { error: "Mərhələ yadda saxlanmadı." };

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/board");
  return { ok: true };
}

export async function updateLeadPriority(
  id: string,
  priority: "high" | "medium" | "low",
) {
  const supabase = await requireAdmin();
  if (!id || !["high", "medium", "low"].includes(priority)) {
    return { error: "Prioritet dəyişdirilə bilmədi." };
  }

  const { data, error: readError } = await supabase
    .from("leads")
    .select("profile")
    .eq("id", id)
    .single();
  if (readError) return { error: "Müraciət tapılmadı." };

  const profile = data?.profile && typeof data.profile === "object" ? data.profile : {};
  const { error } = await supabase
    .from("leads")
    .update({ profile: { ...profile, priority } })
    .eq("id", id);
  if (error) return { error: "Prioritet yadda saxlanmadı." };

  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/board");
  return { ok: true };
}

export async function markLeadRead(id: string) {
  const supabase = await requireAdmin();
  if (!id) return;

  const { data } = await supabase.from("leads").select("profile").eq("id", id).single();
  const profile = data?.profile && typeof data.profile === "object" ? data.profile : {};
  if ("readAt" in profile && profile.readAt) return;

  await supabase
    .from("leads")
    .update({ profile: { ...profile, readAt: new Date().toISOString() } })
    .eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/board");
}

export async function deleteLead(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/board");
  redirect("/admin/leads");
}
