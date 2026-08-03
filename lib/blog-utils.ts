export function slugify(value: string) {
  return value
    .toLocaleLowerCase("az")
    .replace(/[а-яё]/g, (letter) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
        з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
        п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
        ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      };
      return map[letter] ?? "";
    })
    .replace(/ə/g, "e").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 96);
}

export function parseCommaList(value: string, maxItems = 12) {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))]
    .slice(0, maxItems).map((item) => item.slice(0, 80));
}

export function isPublicPost(status: string, publishedAt: string | null, now = new Date()) {
  return ["published", "scheduled"].includes(status)
    && Boolean(publishedAt)
    && new Date(publishedAt as string).getTime() <= now.getTime();
}

export function seoFallbacks(post: {
  title: string; excerpt?: string | null; seoTitle?: string | null; metaDescription?: string | null;
  ogTitle?: string | null; ogDescription?: string | null; featuredImage?: string | null; ogImage?: string | null;
}) {
  const title = post.seoTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;
  return {
    title,
    description,
    ogTitle: post.ogTitle || title,
    ogDescription: post.ogDescription || description,
    ogImage: post.ogImage || post.featuredImage || undefined,
  };
}
