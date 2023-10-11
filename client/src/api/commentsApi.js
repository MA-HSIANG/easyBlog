import { useAxios } from "../common/useAxios";
const $axios = useAxios();

export function getBlogComments(id, options) {
  return $axios.get(
    `/api/v1/comments/${id}?page=${options.page}&pageSize=${options.pageSize}`
  );
}

export function getBlogReply(
  id,
  parent_comment_id,
  parent_comment_user_id,
  options
) {
  return $axios.get(
    `/api/v1/comments/reply/${id}?parent_comment_id=${parent_comment_id}&parent_comment_user_id=${parent_comment_user_id}&page=${options.page}&pageSize=${options.pageSize}`
  );
}

//新增
export function createComment(id, content) {
  return $axios.post("/api/v1/comments/", { blog_id: id, content });
}

//新增2級
export function createReply(
  id,
  parent_comment_id,
  parent_comment_user_id,
  content
) {
  return $axios.post("/api/v1/comments/reply", {
    blog_id: id,
    parent_comment_id,
    parent_comment_user_id,
    content,
  });
}
