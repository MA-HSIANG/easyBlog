<template>
  <DashBoardLayout>
    <template #menu-title> DashBoard </template>
    <template #menu-items>
      <ul>
        <li
          v-for="item in menu[0]"
          :key="item.key"
          :class="[
            route.path === item.href ? 'active' : '',
            item.key === 'isLabel' ? 'noHover' : '',
          ]"
          @click="toPage(item.key, item.href)"
        >
          {{ item.label }}
          <div class="arrIcon" v-if="item.key === 'isLabel' && !openMenu">
            <CaretForwardOutline />
          </div>
          <div class="arrIcon" v-if="item.key === 'isLabel' && openMenu">
            <CaretDownOutline />
          </div>
          <!--2級菜單-->
          <div v-for="i in item.children" :key="i.key">
            <p
              :class="[
                openMenu ? 'menu--children' : 'menu--children-hide',
                route.path === i.href ? 'chilrenActive' : '',
              ]"
              @click="toPageChilren(i.key, i.href)"
            >
              {{ i.label }}
            </p>
          </div>
        </li>
      </ul>
    </template>
  </DashBoardLayout>
</template>
<script setup>
import { onMounted, reactive, inject, h, ref } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";

import menuData from "../../data/dashBoard/menu.json";
import selectMenu from "naive-ui/es/_internal/select-menu";
import { createPinia } from "pinia";
import {
  EyeOutline,
  ThumbsUpSharp,
  Person,
  CaretForwardOutline,
  CaretDownOutline,
} from "@vicons/ionicons5";
import { Comment16Regular } from "@vicons/fluent";
import DashBoardLayout from "../../components/dashBoard/DashBoardLayout.vue";

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const isLogin = ref(false);

const onReload = inject("onReload");

//列表
const menu = reactive([]);
const openMenu = ref(false);
//列表

const verifyLogin = async () => {
  try {
    if (route.meta.userData) {
      const data = await route.meta.userData;
      isLogin.value = true;
      menu.push(data.dashBoard);
    } else {
      isLogin.value = false;
      removeToken();
    }
  } catch (error) {}
};

const toPage = (key, href) => {
  if (key !== "logout" && key !== "isLabel") {
    router.push(href);
  } else if (key === "isLabel") {
    openMenu.value = !openMenu.value;
  } else {
    router.push("/login");
    authLogin.delToken();
    authLogin.adminToken = "";
  }
};
const toPageChilren = (key, href) => {
  router.push(href);
  openMenu.value = !openMenu.value;
  // if (key !== "logout") {
  //   router.push(href);

  // } else {
  //   router.push("/login");
  //   authLogin.delToken();
  //   authLogin.adminToken = "";
  // }
};
onMounted(() => {
  verifyLogin();
});
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
      border-left: 3px solid #075985;
      margin-left: 3px;
    }
    .menu--children {
      display: block;
      color: $font-black-gray;
      margin-left: 3px;
      font-size: 1.2rem;
      animation: open 0.6s ease-in-out;
      line-height: 4rem;
      transition: all 0.3s;
      pointer-events: auto;

      &:hover,
      &:active {
        color: $primary-color;
      }
    }
    .menu--children-hide {
      display: block;
      color: $font-black-gray;
      margin-left: 3px;
      font-size: 1.2rem;
      animation: open 0.6s ease-in-out;
      line-height: 4rem;
      transition: all 0.3s;
      pointer-events: auto;
      max-height: 0;
      overflow: hidden;
      animation: hide 0.6s ease-in-out;
    }
  }

  .noHover {
    position: relative;
    transition: all 0.3s;
    pointer-events: none;
    color: $font-gray;

    &:hover,
    &:active {
      border-left: none;
      margin-left: 0;
    }
    .arrIcon {
      position: absolute;
      pointer-events: auto;
      width: 2rem;
      height: 2rem;
      top: 2px;
      right: 0;
    }

  }
  .active {
    border-left: 3px solid #075985;
    margin-left: 3px;
  }
  .chilrenActive {
    border-left: 1px solid #075985;
    border: transparent;
    color: $primary-color !important;
  }
}
@keyframes open {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 100px;
    opacity: 1;
  }
}
@keyframes hide {
  from {
    max-height: 100px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
}
</style>
