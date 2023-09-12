import { useAxios } from "../common/useAxios";
const $axios = useAxios();

export function createArticleView(id) {
  return $axios.get(`/api/v1/blogView/${id}`);
}

export function getAllBlogViewCounts(id) {
  return $axios.get(`/api/v1/blogView/blogViewCounts/${id}`);
}
