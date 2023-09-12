import { useAxios } from "../common/useAxios";
const $axios = useAxios();

export function clickLike(id, like_status) {
  return $axios.post(`/api/v1/like/${id}`, {
    like_status,
  });
}
export function userLikeStatus(id) {
  return $axios.get(`/api/v1/like/${id}`);
}
export function getAllLikeCounts(id) {
  return $axios.get(`/api/v1/like/blogLikes/${id}`);
}
