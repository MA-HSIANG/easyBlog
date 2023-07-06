<template>
  <div class="login-content">
    <n-card v-if="!isLoading" title="管理後台登錄">
      <n-form
        ref="adminFrom"
        :rules="rules"
        :model="admin"
        @keydown.enter.prevent
      >
        <n-form-item path="account" label="帳號">
          <n-input
            v-model:value="admin.account"
            type="text"
            placeholder="請輸入帳號"
          />
        </n-form-item>
        <n-form-item path="password" label="密碼">
          <n-input
            :disabled="!admin.account"
            v-model:value="admin.password"
            type="password"
            placeholder="請輸入密碼"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:checked="admin.rember" label="記住我" />
        <n-button :disabled="!admin.password" @click="login">登錄</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import {
  onMounted,
  reactive,
  inject,
  provide,
  ref,
  nextTick,
  watchEffect,
} from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { NForm, NFormItem, NInput, NCheckbox } from "naive-ui";
import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";
import { useAuthUserLogin } from "../store/user/authUser";

const router = useRouter();
const route = useRoute();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
const authCategory = useAuthCategory();
const authArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const adminFrom = ref(null);

const rules = {
  account: [
    {
      required: true,
      validator(rule, val) {
        if (!val) {
          return new Error("請輸入帳號....");
        }
        if (!/^[a-zA-Z\d]{3,12}$/.test(val)) {
          return new Error("請輸入3至12個字符之間的英文字母或數字");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
  password: [
    {
      required: true,
      validator(rule, val) {
        if (!val) {
          return new Error("請輸入密碼....");
        }
        if (!/^[a-zA-Z\d]{5,18}$/.test(val)) {
          return new Error("請輸入6到18個字符以上的英文字母或數字");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
};
//piain的user狀態
const authLogin = useAuthLogin();
//取出儲存狀態
const userJson = authLogin.getUser();
const getAccount = userJson.account;
const getPassword = userJson.password;
const getRember = userJson.rember;
//登入狀態
const admin = reactive({
  account: getAccount,
  password: getPassword,
  rember: getRember == 1 ? true : false,
});

//登入
async function login() {
  adminFrom.value?.validate(async (errors) => {
    if (!errors) {
      const res = await authLogin.useLogin(admin);
      if (res.code === 401) {
        msg.error(res.msg);
      }
      if (res.code === 200) {
        //登入成功傳狀態pinia
        authLogin.isLogin = true;

        msg.success(res.msg);
        //登入後更新token到pinia
        authCategory.token = authLogin.getToken();
        authArticle.token = authLogin.getToken();
        authLogin.adminToken = authLogin.getToken();
        router.replace("/dashBoard");
      }
      if (res.code === 500) {
        msg.error(res.msg);
      }
    } else {
      msg.error("請輸入正確帳號密碼");
      return;
    }
  });
}
//damin驗證
const isAdminLogined = ref(false);
const adminToken = authLogin.adminToken;
async function checkAdminLogin() {
  const res = await authLogin.isLoginIn(adminToken);
  if (res.code === 200) {
    isAdminLogined.value = true;
    router.replace("/dashBoard");
  } else {
    router.replace("/login");
  }
}

onMounted(() => {
  checkAdminLogin();
});
</script>

<style lang="scss" scoped>
.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30vw;
  height: 85vh;
}
</style>
