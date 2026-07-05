import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/public";
import type { BlogPost, LocaleCode } from "./database.types";

function reportReadFailure(operation: string, message: string) {
  // A temporary Supabase/network failure is an expected recoverable state.
  // `console.error` opens Next.js' development error overlay even though the
  // page already falls back safely, so keep it as a non-blocking warning.
  console.warn(`[posts] ${operation}: ${message}`);
}

export async function getPublishedPosts(locale: LocaleCode, limit?: number) {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("locale", locale)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);
  const { data, error } = await query;

  if (error) {
    reportReadFailure("Published posts could not be loaded", error.message);
    return [];
  }

  return data as BlogPost[];
}

export async function getPublishedPost(locale: LocaleCode, slug: string) {
  if (!isSupabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("locale", locale)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    reportReadFailure("Post could not be loaded", error.message);
    return null;
  }

  return data as BlogPost | null;
}

export async function getPostTranslations(translationGroupId: string) {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("locale,slug,title")
    .eq("translation_group_id", translationGroupId)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());

  if (error) {
    reportReadFailure("Post translations could not be loaded", error.message);
    return [];
  }

  return (data ?? []) as Array<Pick<BlogPost, "locale" | "slug" | "title">>;
}

export async function getPublishedPostRoutes() {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("locale,slug,updated_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());

  if (error) {
    reportReadFailure("Post routes could not be loaded", error.message);
    return [];
  }

  return (data ?? []) as Array<Pick<BlogPost, "locale" | "slug" | "updated_at">>;
}
