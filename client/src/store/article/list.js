import { defineStore } from "pinia";
import { useAxios } from "../../common/useAxios";
import { useAuthLogin } from "../user/auth";
import { inject, ref, watchEffect } from "vue";

export const useAuthArticle = defineStore("list", () => {
  const authLogin = useAuthLogin();
  const token = ref("");
  const $axiosToken = useAxios(true, token);
  const $axios = inject("$axios");

  //添加
  async function addList(uid, options) {
    const res = await $axiosToken.post("/blog/_token/post", {
      uid,
      category_id: options.category_id,
      cover_image: options.cover_image,
      title: options.title,
      description: options.description,
      content: options.content,
    });
    return res.data.result;
  }
  //封面上傳
  async function uploadCoverImg(formData) {
    const res = await $axiosToken.post(`/upload2/_token/coverImage`, formData);

    return res.data.url;
  }
  //列表
  async function articleLists(pageInfo) {
    try {
      const res = await $axios.get(
        `/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&category_id=${pageInfo.category_id}`
      );

      return res.data;
    } catch (error) {
      console.error(error);
    }
  }
  //查詢發文者
  async function queryIssuer(id) {
    const res = await $axios.post("/blog/queryAdmin", {
      id: id,
    });
    return res.data.result.results[0];
  }
  //更新前舊資料
  async function oldArticleList(id) {
    const res = await $axios.get("/blog/oldData", {
      params: {
        id: id,
      },
    });
    return res.data.oldData.list;
  }
  //更新文章
  async function updataArticleList(id, options) {
    const res = await $axiosToken.put("/blog/_token/updata", {
      id: id,
      category_id: options.category_id,
      title: options.title,
      description: options.description,
      cover_image: options.cover_image,
      content: options.content,
    });
    return res.data.newDatas;
  }
  //刪除文章
  async function deleteArticleList(id) {
    try {
      const res = await $axiosToken.delete(`/blog/_token/delete?id=${id}`);

      return res.data.data;
    } catch (error) {
      console.error(error);
    }
  }
  //列出文章評論
  async function allCommentData(pageInfo) {
    const res = await $axios.get(
      `/blog/allComment?blog_id=${pageInfo.blog_id}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
    );
    return res.data;
  }
  //列出評論用戶
  async function allCommentUserData(user_id) {
    const res = await $axios.get(`/blog/allCommentDatas?user_id=${user_id}`);
    return res.data;
  }
  //列出單篇文章觀看數
  async function allWatchData(options) {
    const res = await $axios.post("/blog/allWatch", {
      blog_id: options.blog_id,
    });
    return res.data.results.count;
  }
  //列出評論回復
  async function allReplyData(comment_id, pageInfo) {
    const res = await $axios.get(
      `/blog/allReply?comment_id=${comment_id}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
    );
    return res.data;
  }
  //----------------dashBoard-------------////
  //後台列出文章總讚數
  async function dashBoardLikes() {
    const res = await $axiosToken.post(`/blog/_token/allLikeCount`);

    return res.data.results.result.length;
  }
  //後台列出留言總數
  async function dashBoardComments(new_num) {
    const res = await $axiosToken.post(`/blog/_token/allComments`, {
      new_num,
    });

    return res.data.results.results;
  }
  //後台列出總觀看數
  async function dashBoardWatchCounts() {
    const res = await $axiosToken.get(`/blog/_token/allWatchCounts`);
    return res.data.counts.counts;
  }
  watchEffect(() => {
    if (token) {
      token.value = authLogin.adminToken;
    }
  });
  return {
    addList,
    uploadCoverImg,
    articleLists,
    oldArticleList,
    updataArticleList,
    deleteArticleList,
    token,
    queryIssuer,
    allCommentData,
    allCommentUserData,
    allWatchData,
    dashBoardLikes,
    dashBoardComments,
    dashBoardWatchCounts,
    allReplyData,
  };
});
