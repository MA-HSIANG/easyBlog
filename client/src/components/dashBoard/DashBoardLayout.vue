<template>
  <div class="container">
    <div class="layout-container">
      <nav>
        <div class="nav-logo">
          <a href="/"> <img src="../../../Logo.svg" alt="" /></a>
        </div>

        <div
          class="nav--logout-container"
          v-for="(data, index) in navBarData"
          :key="index"
        >
          <n-icon><component :is="data.icon" /></n-icon>
          <h4 @click="toPage(data.key, data.href)">{{ data.label }}</h4>
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
  markRaw,
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
import {
  EyeOutline,
  ThumbsUpSharp,
  Person,
  LogOutOutline,
} from "@vicons/ionicons5";
import { Comment16Regular } from "@vicons/fluent";
import columnData from "../../data/dashBoard/dashBoardHotArticle.json";
import { removeToken } from "../../utils/verify";
const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const menus = reactive([...menuData.menus]);
const message = inject("message");
const onReload = inject("onReload");

// user登入下拉;
const navBarData = markRaw([
  { label: "登出", icon: LogOutOutline, key: "logout", href: "logout" },
]);

const toPage = (key, href) => {
  if (key !== "logout") {
    router.replace(href);
  } else {
    router.push("/login");
    removeToken();
  }
};
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
      .nav--logout-container {
        display: flex;
        align-items: center;
        font-size: 1.8rem;

        .n-icon {
          display: flex;
          margin-right: 5px;
          color: $primary-white;
        }
        h4 {
          font-weight: 500;
          letter-spacing: -0.25px;
          color: $primary-white;
          cursor: pointer;

          &:hover {
            color: $primary-light;
          }
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
