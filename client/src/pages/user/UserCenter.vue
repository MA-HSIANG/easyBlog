<template>
  <DashBoardLayout>
    <template #menu-title>UserCenter</template>
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
import { onMounted, reactive, inject, h, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import selectMenu from "naive-ui/es/_internal/select-menu";
import { createPinia } from "pinia";
import { removeToken } from "../../utils/verify";
import { getArticleData } from "../../store/articleStore";
import { getAllWebDatas } from "../../api/blogApi";
import { transformTime } from "../../utils/transformTime";

import Upload from "../../components/Upload.vue";
import DashBoardLayout from "../../components/dashBoard/DashBoardLayout.vue";
import menuData from "../../data/dashBoard/userMenu.json";
const router = useRouter();
const route = useRoute();

const menu = reactive([...menuData.menus]);
const collapsed = ref(false);
const updateUserForm = ref(null);
const isEdit = ref(false);
const imgFile = ref(null);
const previewShow = ref(false);

const toPage = (key, href) => {
  if (key !== "logout") {
    router.replace(href);
  } else {
    router.push("/login");
    removeToken();
  }
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/userCardRwd.scss";
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
