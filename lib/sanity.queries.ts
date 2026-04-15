import { groq } from "next-sanity";

export const postsQuery = groq`
  *[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _createdAt,
    coverImage
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    content
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][]{
    "slug": slug.current
  }
`;
