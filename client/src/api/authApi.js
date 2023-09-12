import { useAxios } from "../common/useAxios";

const $axios = useAxios();
//驗證登入狀態
export function verifyLoggined() {
  return $axios.get("/api/v1/users/verifyToken");
}
//確保用戶進入身分符合的後台
export function verifyId() {
  return $axios.get("/api/v1/users/verifyId");
}
//user註冊
export function resgist(data) {
  return $axios.post("/api/v1/users/resgist", {
    account: data.account,
    password: data.password,
    email: data.email,
  });
}
//user登入
export function login(data) {
  return $axios.post("/api/v1/users/login", {
    account: data.account,
    password: data.password,
    email: data.email,
    avatar: data.avatar,
  });
}
