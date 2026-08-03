import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/public";
import type { BlogPost, LocaleCode } from "./database.types";

function reportReadFailure(operation: string, message: string) {
  // A temporary Supabase/network failure is an expected recoverable state.
  // `console.error` opens Next.js' development error overlay even though the
  // page already falls back safely, so keep it as a non-blocking warning.
  console.warn(`[posts] ${operation}: ${message}`);
}

export type PublishedPostFilters = {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
};

export function getPublishedPosts(locale: LocaleCode, limit?: number): Promise<BlogPost[]>;
export function getPublishedPosts(locale: LocaleCode, filters: PublishedPostFilters): Promise<{ posts: BlogPost[]; count: number; page: number; pageSize: number }>;
export async function getPublishedPosts(
  locale: LocaleCode,
  limitOrFilters?: number | PublishedPostFilters,
) {
  if (!isSupabaseConfigured) {
    return typeof limitOrFilters === "number" || limitOrFilters === undefined
      ? []
      : { posts: [], count: 0, page: Math.max(1, limitOrFilters.page ?? 1), pageSize: limitOrFilters.pageSize ?? 9 };
  }

  const supabase = createPublicClient();
  const filters = typeof limitOrFilters === "number" ? {} : limitOrFilters ?? {};
  const pageSize = typeof limitOrFilters === "number" ? limitOrFilters : filters.pageSize ?? 9;
  const page = Math.max(1, filters.page ?? 1);
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("locale", locale)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.query) {
    const term = filters.query.replace(/[%_,()]/g, " ").trim().slice(0, 100);
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,subtitle.ilike.%${term}%,excerpt.ilike.%${term}%,content.ilike.%${term}%,category.ilike.%${term}%,tags.cs.{${term}}`,
      );
    }
  }
  query = query.range((page - 1) * pageSize, page * pageSize - 1);
  const { data, error, count } = await query;

  if (error) {
    reportReadFailure("Published posts could not be loaded", error.message);
    return typeof limitOrFilters === "number" || limitOrFilters === undefined
      ? []
      : { posts: [], count: 0, page, pageSize };
  }

  const posts = data as BlogPost[];
  return typeof limitOrFilters === "number" || limitOrFilters === undefined
    ? posts
    : { posts, count: count ?? 0, page, pageSize };
}

export async function getBlogCategories(locale: LocaleCode) {
  const posts = await getPublishedPosts(locale, 500);
  return [...new Set(posts.map((post) => post.category).filter((value): value is string => Boolean(value)))].sort();
}

export async function getPublishedPost(locale: LocaleCode, slug: string) {
  if (!isSupabaseConfigured) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("locale", locale)
    .eq("slug", slug)
    .in("status", ["published", "scheduled"])
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
    .in("status", ["published", "scheduled"])
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
    .in("status", ["published", "scheduled"])
    .eq("robots_index", true)
    .eq("include_in_sitemap", true)
    .lte("published_at", new Date().toISOString());

  if (error?.message.includes("robots_index")) {
    // Keeps the existing sitemap intact during the deploy window before the
    // additive migration is applied. Remove only after every environment is migrated.
    const fallback = await supabase.from("posts").select("locale,slug,updated_at")
      .in("status", ["published", "scheduled"])
      .lte("published_at", new Date().toISOString());
    if (!fallback.error) {
      return (fallback.data ?? []) as Array<Pick<BlogPost, "locale" | "slug" | "updated_at">>;
    }
  }
  if (error) {
    reportReadFailure("Post routes could not be loaded", error.message);
    return [];
  }

  return (data ?? []) as Array<Pick<BlogPost, "locale" | "slug" | "updated_at">>;
}

export async function getPostByOldSlug(locale: LocaleCode, oldSlug: string) {
  if (!isSupabaseConfigured) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("post_slug_redirects")
    .select("posts!inner(slug,status,published_at)")
    .eq("locale", locale)
    .eq("old_slug", oldSlug)
    .maybeSingle();
  if (error || !data) return null;
  const target = Array.isArray(data.posts) ? data.posts[0] : data.posts;
  return target && typeof target.slug === "string" ? target.slug : null;
}

export async function getRelatedPosts(post: BlogPost, limit = 3) {
  if (!isSupabaseConfigured) return [];
  const supabase = createPublicClient();
  let query = supabase.from("posts").select("*")
    .eq("locale", post.locale).in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString()).neq("id", post.id)
    .order("published_at", { ascending: false }).limit(limit);
  if (post.category) query = query.eq("category", post.category);
  const { data } = await query;
  return (data ?? []) as BlogPost[];
}
