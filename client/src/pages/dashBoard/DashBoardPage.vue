<template>
  <DashBoardLayout>
    <template #menu-title> DashBoard </template>
    <template #menu-items>
      <ul>
        <li
          v-for="item in menu"
          :key="item.key"
          @click="toPage(item.key, item.href)"
          :class="route.path === item.href ? 'active' : ''"
        >
          {{ item.label }}
        </li>
      </ul>
    </template>
  </DashBoardLayout>
</template>
<script setup>
import { onMounted, reactive, inject, h, ref, computed, nextTick } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";

import menuData from "../../data/dashBoard/menu.json";
import selectMenu from "naive-ui/es/_internal/select-menu";
import { createPinia } from "pinia";
import { EyeOutline, ThumbsUpSharp, Person } from "@vicons/ionicons5";
import { Comment16Regular } from "@vicons/fluent";

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const menus = reactive([...menuData.menus]);

import DashBoardLayout from "../../components/dashBoard/DashBoardLayout.vue";

const onReload = inject("onReload");
//列表
const menu = reactive([...menuData.menus]);

const toPage = (key, href) => {
  if (key !== "logout") {
    router.replace(href);
  } else {
    router.push("/login");
    authLogin.delToken();
    authLogin.adminToken = "";
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/dashBoardRwd.scss";
ul {
  color: $font-black-gray;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  letter-spacing: 1.5px;
  li {
    cursor: pointer;
    transition: all 0.3s;
    padding: 0 2rem;
    &:hover,
    &:active {
      border-left: 5px solid #075985;
      margin-left: 5px;
    }
  }
  .active {
    border-left: 5px solid #075985;
    margin-left: 5px;
  }
}
</style>
