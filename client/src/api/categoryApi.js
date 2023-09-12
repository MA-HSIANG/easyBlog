import { useAxios } from "../common/useAxios";
const $axios = useAxios();

//列出全部 + 分頁
export function getAllCategorys(options) {

  return $axios.get(
    `/api/v1/category/?page=${options.page}&pageSize=${options.pageSize}`
  );
}

//新增
export function createCategory(name) {
  return $axios.post("/api/v1/category/", { name });
}
//修改
export function updateCategory(id, name) {
  return $axios.put(`/api/v1/category/${id}`, {
    name,
  });
}
//刪除
export function deleteCategory(id) {
  return $axios.delete(`/api/v1/category/${id}`);
}
