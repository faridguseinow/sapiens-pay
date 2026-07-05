import type { MetadataRoute } from "next";
import { getPublishedPostRoutes } from "@/lib/posts";

const SITE_URL = "https://sapiens-pay.com";
const locales = ["az", "ru", "en"] as const;
const routes = [
  "",
  "/blog",
  "/services/foreign-bank-accounts",
  "/services/shopify-payments",
  "/services/company-formation",
  "/services/international-payments",
  "/privacy-policy",
  "/terms-of-use",
  "/cookie-policy",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      changeFrequency: route === "/blog" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route.startsWith("/services/") ? 0.9 : 0.6,
    })),
  );
  const blogRoutes = await getPublishedPostRoutes();
  return [
    ...staticRoutes,
    ...blogRoutes.map((post) => ({
      url: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
