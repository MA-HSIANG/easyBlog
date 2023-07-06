<template>
  <div class="login-content">
    <n-card :title="isLogin ? '登入' : '註冊'">
      <n-form
        n-form
        ref="resgistForm"
        :rules="rules"
        :model="user"
        @keydown.enter.prevent
      >
        <n-form-item path="account" label="帳號">
          <n-input
            v-model:value="user.account"
            type="text"
            placeholder="請輸入帳號"
          />
        </n-form-item>
        <n-form-item path="email" label="郵件">
          <n-input
            :disabled="!user.account"
            v-model:value="user.email"
            type="email"
            placeholder="請輸入郵件"
          />
        </n-form-item>
        <n-form-item path="password" label="密碼">
          <n-input
            :disabled="!user.email"
            v-model:value="user.password"
            type="password"
            placeholder="請輸入密碼"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space>
          <div class="btn_isLogin">
            <n-button v-if="!isLogin" @click="isLogOrRes" tag="a" text
              >有帳號了?馬上登入!!</n-button
            >
            <n-button v-if="isLogin" @click="isLogOrRes" tag="a" text
              >沒有帳號?馬上註冊!!</n-button
            >
            <n-button v-if="isLogin" @click="toDashboard" tag="a" text
              >管理員登入</n-button
            >
            <n-button
              :disabled="!user.password"
              @click="isLogin ? userLogin() : userResgist()"
              >{{ isLogin ? "登入" : "註冊" }}</n-button
            >
          </div>
        </n-space>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import {
  defineComponent,
  onMounted,
  reactive,
  inject,
  provide,
  ref,
  nextTick,
  watchEffect,
} from "vue";
import { useRouter } from "vue-router";
import { NForm, NFormItem, NInput, NSpace } from "naive-ui";
import { useAuthUserLogin } from "../store/user/authUser";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";

const router = useRouter();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
const authCategory = useAuthCategory();
const authArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const resgistForm = ref(null);
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
  email: [
    {
      required: true,
      validator(rule, val) {
        if (!val) {
          return new Error("請輸入郵件...");
        }
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-z0-9]+$/.test(val)) {
          return new Error("請輸入正確的電子郵件格式...");
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
          return new Error("請輸入6至18個字符之間的英文字母或數字");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
};

//註冊
const isLogin = ref(false);
const user = reactive({
  account: "",
  email: "",
  password: "",
});
function isLogOrRes() {
  isLogin.value = !isLogin.value;
}
function userResgist() {
  resgistForm.value?.validate(async (errors) => {
    if (!errors) {
      const res = await authUserLogin.useUserResgist(user);
      if (res.code === 402) {
        msg.error(res.msg);
      }
      if (res.code === 200) {
        msg.success(res.msg);
        user.account = "";
        user.email = "";
        user.password = "";
        isLogOrRes();
      }
    } else {
      msg.error("請輸入完整註冊資料");
      return;
    }
  });
}
//登入
async function userLogin() {
  resgistForm.value?.validate(async (errors) => {
    try {
      if (!errors) {
        const res = await authUserLogin.useUserLogin(user);
        console.log(res);
        if (res.code === 402) {
          msg.error(res.msg);
        }
        if (res.code === 200) {
          msg.success(res.msg);
          user.account = "";
          user.email = "";
          user.password = "";
          router.replace("/");
        }
        if (res.code === 403) {
          msg.error(res.msg);
        }
      }
    } catch (error) {}
  });
}
//跳轉
function toDashboard() {
  router.push("/login");
}

//user驗證

async function checkUserLogin() {
  try {
    const userToken = authUserLogin.getToken();
    const res = await authUserLogin.isLoginIn(userToken);
    if (res.code === 200) {
      router.replace("/userCenter");
    } else {
      router.replace("/resgist");
    }
  } catch (error) {
    console.error(error);
  }
}

watchEffect(() => {
  checkUserLogin();
});
</script>

<style lang="scss" scoped>
.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25vw;
  height: 85vh;

  .btn_isLogin {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 20vw;
  }
}
</style>
