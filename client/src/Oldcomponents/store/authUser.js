import { defineStore } from "pinia";
import { inject, ref, watchEffect } from "vue";
import { useAxios } from "../../common/useAxios";

export const useAuthUserLogin = defineStore("authUser", () => {
  const userToken = ref(getToken());
  const $axios = inject("$axios");
  const $axiosToken = useAxios(true, userToken);

  //判斷是否登陸
  const isLogin = ref(false);

  //儲存使用者
  function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  //讀取登錄資料
  function getUser() {
    return JSON.parse(localStorage.getItem("user")) || "";
  }
  //保存token
  function setToken(token) {
    localStorage.setItem("UserToken", token);
  }
  //讀取token
  function getToken() {
    return localStorage.getItem("UserToken");
  }
  //登出刪除token和使用者資料
  function delTokenAndUserData() {
    localStorage.removeItem("UserToken");
    localStorage.removeItem("user");
  }
  //user註冊
  async function useUserResgist(user) {
    const res = await $axios.post("/userLogin/newUser", {
      account: user.account,
      password: user.password,
      email: user.email,
    });

    return res.data.data;
  }
  //user登入
  async function useUserLogin(user) {
    const res = await $axios.post("/userLogin/checkLogin", {
      account: user.account,
      password: user.password,
      email: user.email,
    });

    const userDate = {
      id: res.data.data.id,
      account: res.data.data.account,
      email: res.data.data.email,
      headerImg: res.data.data.headerImg,
    };

    if (res.data.data.code === 200) {
      saveUser(userDate);
      setToken(res.data.data.token);
      userToken.value = getToken();
    }
    return res.data.data;
  }
  //取得user資料
  async function getUserData() {
    const res = await $axiosToken.post("/userLogin/_userToken/userData");

    return res.data;
  }
  //修改user資料
  async function updateUserData(options) {
    const res = await $axiosToken.put("/userLogin/_userToken/updateUser", {
      id: options.id,
      email: options.email,
      headerImg: options.headerImg,
    });
    return res.data.results;
  }
  //驗證登入
  async function isLoginIn(token) {
    const res = await $axios.post("/isLoginIn/checkTokenUser", {
      token: token,
    });

    return res.data;
  }
  //發表評論
  async function userComment(options) {
    const res = await $axiosToken.post("/userLogin/_userToken/writeComment", {
      blog_id: options.blog_id,
      user_id: options.user_id,
      user_name: options.user_name,
      content: options.content,
      header_img: options.header_img,
    });
    return res.data.data;
  }
  //評論回復
  async function userCommentReply(options) {
    const res = await $axiosToken.post("/userLogin/_userToken/writeUserReply", {
      comment_id: options.comment_id,
      user_id: options.user_id,
      blog_id: options.blog_id,
      user_name: options.user_name,
      content: options.content,
      avatar: options.avatar,
    });

    return res.data.data;
  }
  //當前用戶點讚狀態
  async function likeStatus(options) {
    try {
      const res = await $axiosToken.post("/blog/_userToken/blogLike", {
        blog_id: options.blog_id,
        user_id: options.user_id,
      });

      return res.data.result.result;
    } catch (error) {
      //無登入無法獲取當前帳號讚數
    }
  }
  //當前用戶點讚文章列表
  async function userLikeList(options, pageInfo) {
    const respons = await $axiosToken.post("/blog/_userToken/blogLikeList", {
      user_id: options.user_id,
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
    });

    const res_lists = await respons.data.result.result;

    const like_blog = [];
    for (const res of res_lists) {
      const blog_like = await $axios.get("/blog/oldData", {
        params: {
          id: res.blog_id,
        },
      });

      const blogData = blog_like.data.oldData.list;
      if (blogData[0] != undefined) {
        like_blog.push(blogData[0]);
      }
    }

    return like_blog;
  }
  //當前用戶點讚總數
  async function likeListCounts(options) {
    const res = await $axiosToken.post("/blog/_userToken/blogLikeList", {
      user_id: options.user_id,
    });
    return res.data.count.results.length;
  }
  //使用者點讚
  async function clickLike(options) {
    const res = await $axiosToken.post("/blog/_userToken/clickBlogLike", {
      blog_id: options.blog_id,
      user_id: options.user_id,
    });

    return res.data.results;
  }
  //當前文章總讚數
  async function allLikeCount(options) {
    const res = await $axios.post("/blog/allLikes", {
      blog_id: options.blog_id,
    });
    return res.data.result;
  }
  //用戶觀看文章計數
  async function watchArticleAdd(options) {
    const res = await $axiosToken.post("/blog/_userToken/watchArticle", {
      blog_id: options.blog_id,
      user_id: options.user_id,
    });
   
    return res.data;
  }
  //頭貼上傳
  async function uploadAvatar(formData) {
    const res = await $axiosToken.post(`/upload2/_userToken/avatar`, formData);
    return res.data.url;
  }
  watchEffect(() => {
    userToken.value;
  });
  return {
    getUser,
    getToken,
    delTokenAndUserData,
    isLogin,
    useUserResgist,
    useUserLogin,
    isLoginIn,
    getUserData,
    updateUserData,
    userComment,
    likeStatus,
    clickLike,
    allLikeCount,
    userLikeList,
    likeListCounts,
    watchArticleAdd,
    uploadAvatar,
    userCommentReply,
  };
});
