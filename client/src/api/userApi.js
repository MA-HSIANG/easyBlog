import { useAxios } from "../common/useAxios";

const $axios = useAxios();

export function uploadAvatar(avatar) {
  return $axios.post("/api/v1/users/isUser", avatar);
}

export function updateUser(options) {
  return $axios.patch("/api/v1/users/isUser", {
    avatar: options.avatar,
    email: options.email,
  });
}

//取得點讚內容
export function getLikeBlogDatas(options) {
  return $axios.get(
    `/api/v1/users/isUser?page=${options.page}&pageSize=${options.pageSize}`
  );
}

//取得所有用戶
export function getAllUserDatas(options) {
  return $axios.get(
    `/api/v1/users/?page=${options.page}&pageSize=${options.pageSize}`
  );
}
//取得角色表單
export function getRoleSelect() {
  return $axios.get("/api/v1/users/updateRole");
}
//修改角色
export function updateRole(id, role) {
  return $axios.patch("/api/v1/users/updateRole", {
    id,
    role,
  });
}
