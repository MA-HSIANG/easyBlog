<template>
  <SingUpLayout>
    <template #title> 歡迎回到EasyBlog! </template>
    <template #form>
      <n-form
        n-form
        ref="resgistForm"
        :rules="rules"
        :model="user"
        @keydown.enter.prevent
      >
        <n-form-item path="account" label="帳號">
          <n-input
            size="large"
            v-model:value="user.account"
            type="text"
            placeholder="請輸入帳號"
          />
        </n-form-item>
        <n-form-item path="email" label="郵件">
          <n-input
            size="large"
            :disabled="!user.account"
            v-model:value="user.email"
            type="email"
            placeholder="請輸入郵件"
          />
        </n-form-item>
        <n-form-item path="password" label="密碼">
          <n-input
            size="large"
            :disabled="!user.email"
            v-model:value="user.password"
            type="password"
            placeholder="請輸入密碼"
          />
        </n-form-item>
        <div class="btn_submit">
          <n-button type="primary" :disabled="!user.password" @click="userLogin"
            >登入</n-button
          >
        </div>
        <div class="btn_change">
          <n-button @click="toResgist" tag="a" text
            >沒有帳號?點我註冊!</n-button
          >
        </div>
      </n-form>
    </template>
  </SingUpLayout>
</template>

<script setup>
import { onMounted, reactive, inject, provide, ref } from "vue";
import { useRouter } from "vue-router";
import SingUpLayout from "../components/SignUpLayout.vue";
import { resgist, login } from "../api/authApi";
import { useUserStore } from "../store/user/authSave";
import { setToken, getToken } from "../utils/verify";

const router = useRouter();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
const resgistForm = ref(null);
const auth = useUserStore();

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

const userResgist = () => {
  resgistForm.value?.validate(async (errors) => {
    if (!errors) {
      try {
        const res = await resgist(user);
        if (res.status === 201) {
          msg.success(res.data.data.msg);
          user.account = "";
          user.email = "";
          user.password = "";
          isLogOrRes();
        }
      } catch (err) {
        if (err.response.status === 400) {
          msg.error(err.response.data.msg);
        }
      }
    } else {
      msg.error("請輸入正確的註冊資料...");
      return;
    }
  });
};

//登入
const userLogin = () => {
  resgistForm.value?.validate(async (errors) => {
    if (!errors) {
      try {
        const res = await login(user);

        if (res.status === 200) {
          // auth.saveUser(res.data.data.data); //存使用者資料localStorge到pinia
          setToken(res.data.data.token); //創建token
          msg.success(res.data.data.msg);
          user.account = "";
          user.email = "";
          user.password = "";
          router.replace("/");
        }
      } catch (err) {
        console.error(err);
        if (err.response.status === 400) {
          msg.error(err.response.data.msg);
        }
      }
    } else {
      msg.error("請輸入正確的登入資料...");
      return;
    }
  });
};

//跳轉
const toResgist = () => {
  router.push("/Resgist");
};
</script>

<style lang="scss" scoped>
@import "../common/style/main.scss";
@import "../common/style/color.scss";
@import "../common/style/signupRwd.scss";
.n-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  .btn_submit {
    .n-button {
      width: 100%;
      padding: 1.5rem 0;
      font-size: 1.8rem;
    }
  }
  .btn_change {
    text-align: center;
    margin-top: 2rem;
    .n-button {
      font-size: 1.6rem;
      color: $font-gray;
      letter-spacing: 1.2px;
      &:hover {
        color: $primary-color;
      }
    }
  }
}
</style>
