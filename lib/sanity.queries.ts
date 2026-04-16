import { groq } from "next-sanity";

export const postsQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    (language == $locale || !defined(language))
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
    (language == $locale || !defined(language))
  ][0]{
    _id,
    language,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    coverImageUrl,
    content
  }
`;

export const postSlugsQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    (language == $locale || !defined(language))
  ][]{
    "slug": slug.current
  }
`;
