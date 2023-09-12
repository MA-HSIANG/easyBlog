import { useAxios } from "../common/useAxios";
const $axios = useAxios();

export function getBlogComments(id, options) {
  return $axios.get(
    `/api/v1/comments/${id}?page=${options.page}&pageSize=${options.pageSize}`
  );
}

//新增
export function createComment(id, content) {
  return $axios.post("/api/v1/comments/", { blog_id: id, content });
}
