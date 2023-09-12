<template>
  <div class="container">
    <div class="layout-container">
      <nav>
        <div class="nav-logo">
          <a href="/"> <img src="../../../Logo.svg" alt="" /></a>
        </div>

        <div class="nav--user-container">
          <div class="nav--avatar-container">
            <img :src="userData.avatar" alt="" />
          </div>
          <n-dropdown :options="userDropDown" @select="toUserSelect">
            <h4>{{ userData.name }}</h4>
          </n-dropdown>
        </div>
      </nav>
      <menu class="left--menu-container">
        <h1><slot name="menu-title">DashBoard</slot></h1>

        <slot name="menu-items"></slot>
      </menu>

      <div class="right--content-container">
        <RouterView></RouterView>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  defineComponent,
  onMounted,
  onBeforeMount,
  reactive,
  inject,
  h,
  ref,
  computed,
  watchEffect,
  nextTick,
} from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";

import menuData from "../../data/dashBoard/menu.json";
import selectMenu from "naive-ui/es/_internal/select-menu";
import { createPinia } from "pinia";
import { EyeOutline, ThumbsUpSharp, Person } from "@vicons/ionicons5";
import { Comment16Regular } from "@vicons/fluent";
import columnData from "../../data/dashBoard/dashBoardHotArticle.json";

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const menus = reactive([...menuData.menus]);
const message = inject("message");

const onReload = inject("onReload");
const userData = reactive({
  avatar: "",
  name: "",
});
// user登入下拉;
const userDropDown = reactive([
  { label: "退出", key: "logout", href: "logout" },
]);
//下拉選單
const toUserSelect = (key) => {
  if (key === "logout") {
    router.push("/login");
    removeToken();
  }
};
//登錄資料
const verifyLogin = async () => {
  try {
    if (route.meta.userData) {
      const data = await route.meta.userData;
      userData.avatar = data.user.avatar;
      userData.name = data.user.account;
    } else {
      removeToken();
    }
  } catch (error) {}
};

const toPage = (key, href) => {
  if (key !== "logout") {
    router.replace(href);
  } else {
    router.push("/login");
    authLogin.delToken();
    authLogin.adminToken = "";
  }
};

onMounted(() => {
  verifyLogin();
});
</script>
<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/dashBoardRwd.scss";
.container {
  .layout-container {
    display: grid;
    grid-template-columns: 0.1fr 1fr;
    grid-template-rows: 0.1fr;
    height: 100vh;
    nav {
      grid-column: span 3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 2rem;
      background-color: #374151;
      box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1);
      z-index: 1;
      .nav-logo {
        font-size: 2.5rem;
        padding: 0 1rem;
        width: 15rem;
       
        img {
          width: 100%;
          height: 100%;
        }
      }
      .nav--user-container {
        display: flex;
        align-items: center;

        .nav--avatar-container {
          display: flex;

          width: 3rem;
          border-radius: 50%;
          overflow: hidden;
          background-color: #fff;
          margin-right: 10px;
          img {
            width: 100%;
          }
        }
        h4 {
          font-size: 2rem;
          font-weight: 500;
          letter-spacing: -0.25px;
          color: #f3f4f6;
          cursor: pointer;
        }
      }
    }
    .left--menu-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.25rem 2.5rem;
      gap: 1.5rem;
      background-color: #f9fafb;

      h1 {
        color: $font-black-gray;
        font-size: 2.5rem;
        font-weight: 500;
        letter-spacing: 1.3px;
      }
    }
    .right--content-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
