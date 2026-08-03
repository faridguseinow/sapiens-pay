import assert from "node:assert/strict";
import test from "node:test";
import { isPublicPost, parseCommaList, seoFallbacks, slugify } from "../lib/blog-utils.ts";

test("slugify creates stable Azerbaijani and Cyrillic slugs", () => {
  assert.equal(slugify("Şirkət üçün Ödəniş Həlli"), "sirket-ucun-odenis-helli");
  assert.equal(slugify("Международные платежи"), "mezhdunarodnye-platezhi");
});

test("tag parsing removes duplicates and blanks", () => {
  assert.deepEqual(parseCommaList("Wise, Shopify, Wise,  "), ["Wise", "Shopify"]);
});

test("drafts and future scheduled articles stay private", () => {
  const now = new Date("2026-08-03T12:00:00Z");
  assert.equal(isPublicPost("draft", "2026-08-01T00:00:00Z", now), false);
  assert.equal(isPublicPost("scheduled", "2026-08-04T00:00:00Z", now), false);
  assert.equal(isPublicPost("scheduled", "2026-08-02T00:00:00Z", now), true);
  assert.equal(isPublicPost("published", "2026-08-02T00:00:00Z", now), true);
});

test("SEO fallbacks cascade without truncating stored values", () => {
  assert.deepEqual(seoFallbacks({ title: "Title", excerpt: "Excerpt", featuredImage: "/cover.jpg" }), {
    title: "Title", description: "Excerpt", ogTitle: "Title", ogDescription: "Excerpt", ogImage: "/cover.jpg",
  });
});
