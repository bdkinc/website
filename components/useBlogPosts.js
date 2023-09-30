import { blogFetcher } from "@/repository/blogRepository";
import useSWR from "swr";

export default function useBlogPosts(qs) {
  const { data, error } = useSWR(qs, blogFetcher);
  return {
    posts: data,
    isError: error,
    isLoading: !error && !data,
  };
}
