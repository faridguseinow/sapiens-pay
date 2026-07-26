"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, LocaleCode, PostStatus } from "@/lib/database.types";

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

function slugify(value: string) {
  return value
    .toLocaleLowerCase("az")
    .replace(/[а-яё]/g, (letter) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
        ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
        н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
        ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
        ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      };
      return map[letter] ?? "";
    })
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
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

  const payload = {
    title,
    slug,
    locale,
    excerpt: excerpt || null,
    content,
    cover_image_url: coverImageUrl,
    seo_title: seoTitle.slice(0, 70) || null,
    seo_description: seoDescription.slice(0, 170) || null,
    category: category.slice(0, 80) || null,
    scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
    status,
    published_at:
      status === "published"
        ? scheduledAt
          ? new Date(scheduledAt).toISOString()
          : existingPublishedAt || new Date().toISOString()
        : null,
    ...(translationGroupId ? { translation_group_id: translationGroupId } : {}),
  };

  if (id) {
    const { error } = await supabase.from("posts").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("posts").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
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
