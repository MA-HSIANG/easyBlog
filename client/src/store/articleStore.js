import { defineStore } from "pinia";
import { reactive, ref, inject } from "vue";
import { getAllBlogViewCounts } from "../api/blogViewApi";
import { userLikeStatus, getAllLikeCounts } from "../api/likeApi";
import { getBlogComments } from "../api/commentsApi";

export const getArticleData = defineStore("article", () => {
  //-----------data
  //分頁初始值
  const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    //列表資料總數
    count: 0,
    //總頁數
    pageCount: 0,
    //關鍵字
    keyword: "",
    //分類
    category_name: "",
  });

  //--------------------method
  //獲得單獨部落格觀看數
  const handleBlogViews = async (id) => {
    try {
      const res = await getAllBlogViewCounts(id);
      const resLength = res.data.data.data.length;
      return resLength;
    } catch (error) {
      console.error(error);
    }
  };
  //文章評論數
  const handleBlogCommentCounts = async (id) => {
    try {
      const res = await getBlogComments(id, pageInfo);
      return res.data.count.length;
    } catch (error) {
      console.error(error);
    }
  };

  //全局獲取後端點讚資料
  const loadLikeStatus = async (id) => {
    try {
      const res = await userLikeStatus(id);
      const likeStatusData = res.data.likeStatus.data;
      return likeStatusData;
    } catch (error) {}
  };
  //獲得單獨部落格點讚數量
  const handleBlogLikes = async (id) => {
    try {
      const countData = await getAllLikeCounts(id);
      const counts = countData.data.count;

      return counts;
    } catch (error) {
      console.error(error);
    }
  };
  return {
    handleBlogViews,
    handleBlogCommentCounts,
    handleBlogLikes,
    loadLikeStatus,
  };
});
