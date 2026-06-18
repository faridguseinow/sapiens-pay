import { groq } from "next-sanity";

export const postsQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    language == $locale
  ] | order(coalesce(publishedAt, _createdAt) desc){
    _id,
    language,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _createdAt,
    coverImage,
    coverImageUrl
  }
`;

export const postBySlugQuery = groq`
  *[
    _type == "post" &&
    slug.current == $slug &&
    language == $locale
  ][0]{
    _id,
    language,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    coverImageUrl,
    content,
    "_translations": coalesce(
      *[_type == "translation.metadata" && references(^._id)][0].translations[]{
        "language": coalesce(value->language, language),
        "slug": value->slug.current,
        "title": value->title
      }[defined(language) && defined(slug)],
      []
    )
  }
`;

export const postRoutesQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    language in $locales
  ][]{
    "locale": language,
    "slug": slug.current
  }
`;
