<template>
  <div>
    <div class="loading" v-if="isLoading">
      <loading>頁面加載中..</loading>
    </div>
    <div class="container" v-else>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="5"
          :width="200"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menus"
            key-field="key"
            label-field="label"
            children-field="whateverChildren"
            @update:value="toPage"
          />
        </n-layout-sider>
        <n-layout>
          <router-view></router-view>
        </n-layout>
        <n-layout />
      </n-layout>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, inject, h, ref, watchEffect } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { NLayout, NMenu, NLayoutSider } from "naive-ui";

import { useAuthLogin } from "../../store/user/auth";
import { useAuthUserLogin } from "../../store/user/authUser";
import selectMenu from "naive-ui/es/_internal/select-menu";
import { createPinia } from "pinia";
import Loading from "../../components/common/Loading.vue";
const router = useRouter();
const route = useRoute();
const authLogin = useAuthLogin();
const authUserLogin = useAuthUserLogin();

const menus = reactive([
  { label: "個人資料", key: "setting", href: "/userCenter/setting" },
  {
    label: "點讚列表",
    key: "myLike",
    href: "/userCenter/myLike",
  },
  { label: "退出", key: "logout", href: "logout" },
]);
const collapsed = ref(false);
const isLoading = ref(false);
function toPage(key, menu) {
  if (key !== "logout") {
    router.replace(menu.href);
    checkUserLogin();
  } else {
    router.push("/resgist");
    authUserLogin.delTokenAndUserData();
  }
}
//user驗證
async function checkUserLogin() {
  try {
    const userToken = authUserLogin.getToken();
    const res = await authUserLogin.isLoginIn(userToken);
    if (res.code === 403) {
      authUserLogin.delTokenAndUserData();
      router.replace("/resgist");
    }
  } catch (error) {
    console.error(error);
  }
}
onMounted(() => {
  checkUserLogin();
});
</script>

<style lang="scss" scoped>
div {
  .loading {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  margin: 1rem;
  .container {
    min-height: auto;
    width: 100vw;
  }
  .main-parcel {
    display: flex;
    color: #6f676a;
  }
  .n-menu {
    width: auto;
    height: 100vh;
    font-size: 18px;
  }

  .title {
    font-size: 65px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0, 0, 0, 20%);
    right: calc((100vw - 1500px) / 2);
    bottom: 20px;
  }
}
</style>
