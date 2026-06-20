import { defineField, defineType, getPublishedId } from "sanity";

const SANITY_API_VERSION = "2025-02-19";

async function isUniquePostSlugPerLanguage(
  slug: string,
  context: {
    document?: { _id?: string; language?: string };
    getClient: (options: { apiVersion: string }) => {
      fetch: <T>(query: string, params: Record<string, unknown>) => Promise<T>;
    };
  },
) {
  const id = context.document?._id;
  const language = context.document?.language;

  if (!id || !language || !slug) {
    return true;
  }

  const client = context.getClient({ apiVersion: SANITY_API_VERSION });
  const publishedId = getPublishedId(id);
  const isUnique = await client.fetch<boolean>(
    `!defined(*[
      !sanity::versionOf($published) &&
      slug.current == $slug &&
      language == $language
    ][0]._id)`,
    {
      published: publishedId,
      slug,
      language,
    },
  );

  return isUnique || false;
}

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
      hidden: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: isUniquePostSlugPerLanguage,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverImageUrl",
      title: "Cover image URL (fallback)",
      description: "Paste an external image URL if upload is unavailable.",
      type: "url",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "language",
      media: "coverImage",
    },
  },
});
