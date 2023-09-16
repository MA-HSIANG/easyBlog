import { defineStore } from "pinia";
import { inject, ref, reactive } from "vue";
import { useAxios } from "../../common/useAxios";

export const useUserStore = defineStore("save", () => {

  //儲存使用者
  function saveUser(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  }
  //讀取登入資料
  function getUser() {
    return JSON.parse(localStorage.getItem("user")) || "";
  }
  
  return {
 
    saveUser,
    getUser,
  };
});
