import { defineStore } from "pinia";
import { inject, ref } from "vue";
import { useAxios } from "../../common/useAxios";
export const useAuthLogin = defineStore("auth", () => {
  const adminToken = ref("");
  const $axios = inject("$axios");
  const $axiosToken = useAxios(true, adminToken);

  //判斷是否登陸
  const isLogin = ref(false);

  //儲存使用者
  function saveUser(adminUser) {
    localStorage.setItem("adminUser", JSON.stringify(adminUser));
  }
  //讀取登入資料
  function getUser() {
    return JSON.parse(localStorage.getItem("adminUser")) || "";
  }
  //保存token
  function setToken(token) {
    localStorage.setItem("token", token);
  }
  //讀取token
  function getToken() {
    return localStorage.getItem("token");
  }
  //登出刪除token
  function delToken() {
    localStorage.removeItem("token");
  }

  //admin登入
  async function useLogin(admin) {
    try {
      const res = await $axios.post("/admin/login", {
        account: admin.account,
        password: admin.password,
      });

      const adminUser = {
        id: res.data.data.id,
        account: res.data.data.account,
        password: res.data.data.password,
        avatar: res.data.data.avatar,
        rember: admin.rember ? 1 : 0,
      };
      //確定登入更新token
      if (isLogin) {
        setToken(res.data.data.token);
      }
      //記住我更新token
      if (
        adminUser.rember === 1 &&
        adminUser.account !== "" &&
        adminUser.password !== ""
      ) {
        saveUser(adminUser);
        setToken(res.data.data.token);
      }

      return res.data.data;
    } catch (error) {
      console.error(error);
    }
  }
  //驗證登入
  async function isLoginIn(token) {
    const res = await $axios.post("/isLoginIn/checkToken", {
      token: token,
    });
    return res.data;
  }
  //取得admin資料
  async function getAdminDate() {
    const res = await $axiosToken.post("/admin/_token/adminDate");

    return res.data;
  }
  //發表評論
  async function adminComment(options) {
    const res = await $axiosToken.post("/admin/_token/writeAdminComment", {
      blog_id: options.blog_id,
      user_id: options.user_id,
      user_name: options.user_name,
      content: options.content,
      header_img: options.header_img,
    });

    return res.data.data;
  }
  //評論回復
  async function adminCommentReply(options) {
    const res = await $axiosToken.post("/admin/_token/writeAdminReply", {
      comment_id: options.comment_id,
      user_id: options.user_id,
      blog_id: options.blog_id,
      user_name: options.user_name,
      content: options.content,
      avatar: options.avatar,
    });

    return res.data.data;
  }
  ///-----------後台功能-----------------------////
  //列出管理員
  async function allAdmin() {
    const res = await $axiosToken.post("/admin/_token/lists");

    return res.data.results.data;
  }
  //列出user
  async function allUser() {
    const res = await $axiosToken.post("/admin/_token/userLists");

    return res.data.results.data;
  }
  //新增
  async function addAdmin(options) {
    const res = await $axiosToken.post("/admin/_token/add", {
      account: options.account,
      password: options.password,
    });
    return res.data.result;
  }
  //修改
  async function updateAdmin(id, options) {
    const res = await $axiosToken.put("/admin/_token/update", {
      id,
      account: options.account,
      password: options.password,
    });
    return res.data.result;
  }
  //刪除
  async function delAdmin(id) {
    const res = await $axiosToken.delete("/admin/_token/delete", {
      data: {
        id,
      },
    });
    return res.data.result;
  }

  return {
    useLogin,
    getUser,
    getToken,
    delToken,
    isLogin,
    isLoginIn,
    allAdmin,
    addAdmin,
    updateAdmin,
    delAdmin,
    adminToken,
    allUser,
    getAdminDate,
    adminComment,
    adminCommentReply,
  };
});
