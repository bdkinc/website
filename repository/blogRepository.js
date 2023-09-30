import { cmsBaseUrl } from "./index";
import axios from "axios";

export function createBlogUrl({ limit = "", sort = "", slug = "" } = {}) {
  return process.env.NEXT_PUBLIC_CMS === "directus"
    ? `${cmsBaseUrl}/posts?filter[websites.website.title][contains]=BDKinc&fields=*,featured_image.data,author.first_name,author.last_name${
        slug && "&filter[slug][eq]=" + slug
      }${sort && "&sort=-published"}${limit && "&limit=" + limit}`
    : `${cmsBaseUrl}/posts?populate=*
        ${slug && "/posts?populate=*&filters[slug][$eq]=" + slug}
        ${sort && "&sort=publishedAt:" + sort}
        ${limit && "&pagination[limit]=" + limit}`;
}

function formatData(data) {
  let initialValues = {
    id: 0,
    slug: "",
    title: "",
    lead: "",
    body: "",
    createdAt: "",
    publishedAt: "",
    author: "",
    featured: {},
    gallery: {},
  };

  if (process.env.NEXT_PUBLIC_CMS === "directus") {
    return {
      ...initialValues,
      id: data.id,
      slug: data.slug,
      title: data.title,
      lead: data.lead,
      body: data.body,
      createdAt: data.created_on,
      publishedAt: data.published,
      author: `${data.author.first_name} ${data.author.last_name}`,
      featured: data.featured_image,
    };
  }

  return { ...initialValues, id: data.id, ...data.attributes };
}

export async function blogFetcher(url) {
  try {
    const { data } = await axios.get(url);
    return {
      data: data.data.map((post) => formatData(post)),
      meta: data.meta || null,
    };
  } catch (e) {
    throw new Error(e);
  }
}
