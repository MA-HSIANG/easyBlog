import { useAxios } from "../common/useAxios";

const $axios = useAxios();

//網站看板全部資料
export function getAllWebDatas() {
  return $axios.get("/api/v1/blogs/webAllDatas");
}

//---------查詢
/*
  const keyword = req.query.keyword;
    const category_id = req.query.category_id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
*/
export function getAllBlogs(options) {
  return $axios.get(
    `/api/v1/blogs/?keyword=${options.keyword}&page=${options.page}&pageSize=${options.pageSize}&category_name=${options.category_name}`
  );
}
//單獨查詢
export function getBlog(id) {
  return $axios.get(`/api/v1/blogs/${id}`);
}
//new 3 blog
export function getNew3Blog() {
  return $axios.get("/api/v1/blogs/new_3_blog");
}
//top 3 blog
export function getTop3Blog() {
  return $axios.get("/api/v1/blogs/get_top3_blog");
}
//新增
export function createBlog(options) {
  return $axios.post("/api/v1/blogs/", {
    cover_image: options.cover_image || "",
    category_id: options.category_id,
    category_name: options.category_name,
    title: options.title,
    description: options.description,
    content: options.content,
  });
}
//修改
export function updateBlog(id, options) {
  return $axios.put(`/api/v1/blogs/${id}`, {
    category_id: options.category_id,
    title: options.title,
    description: options.description,
    cover_image: options.cover_image,
    content: options.content,
  });
}
//刪除
export function deleteBlog(id) {
  return $axios.patch(`/api/v1/blogs/${id}`);
}
//上傳封面
export function uploadCover(imageCover) {
  return $axios.post("/api/v1/blogs/uploadImage", imageCover);
}
