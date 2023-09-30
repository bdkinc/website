import axios from "axios";

const cmsBaseUrl =
  process.env.NEXT_PUBLIC_CMS === "directus"
    ? "https://cms.bdkinc.com/_/items"
    : "http://localhost:1337/api";

const fetcher = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { cmsBaseUrl, fetcher };
