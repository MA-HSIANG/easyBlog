import { defineStore } from "pinia";
import { inject, ref, watchEffect, reactive, computed } from "vue";
import { useAxios } from "../../common/useAxios";
import { useAuthLogin } from "../user/auth";
export const useAuthCategory = defineStore("operate", () => {
  const authLogin = useAuthLogin();
  const token = ref("");
  const $axios = inject("$axios");
  const $axiosToken = useAxios(true, token);

  //分類頁面api
  async function ResCategoryList() {
    const res = await $axios.get("/category/list");
    return res.data.results.data;
  }
  //新增分類api
  async function addCategory(name) {
    const res = await $axiosToken.post("/category/_token/add", {
      name,
    });
    return res.data.result;
  }
  //刪除分類api
  async function delCategory(id) {
    const res = await $axiosToken.delete("/category/_token/del", {
      data: {
        id,
      },
    });

    return res.data.result;
  }
  //修改分類api
  async function updateCategory(id, name) {
    const res = await $axiosToken.put("/category/_token/update", {
      id,
      name,
    });

    return res.data.result;
  }

  //分類功能
  const categoryLists = ref([]);
  watchEffect(() => {
    token.value = authLogin.adminToken;
  });

  //查詢分類
  async function queryCategoryName(id) {
    const res = await $axiosToken.post("/category/_token/queryCategory", {
      id: id,
    });

    return res.data.result.list[0];
  }
  return {
    ResCategoryList,
    addCategory,
    delCategory,
    token,
    categoryLists,
    updateCategory,
    queryCategoryName,
  };
});
