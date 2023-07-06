<template>
  <div class="content">
    <div class="loading" v-if="isLoading">
      <loading>資料加載中...</loading>
    </div>
    <n-card
      v-if="!isLoading"
      :bordered="true"
      title="個人資料"
      :segmented="{
        content: true,
        footer: 'soft',
      }"
    >
      <template #default>
        <div v-show="!isEdit" class="isEdit">
          <div class="dataList">
            <n-form>
              <n-form-item label="編號">
                {{ userLists.id }}
              </n-form-item>
              <n-form-item label="帳號">
                {{ userLists.account }}
              </n-form-item>
              <n-form-item label="信箱">
                {{ userLists.email }}
              </n-form-item>
            </n-form>
          </div>
          <div class="avatar">
            <n-avatar round :size="120" :src="userLists.headerImg" />
            <span>圖片最大5MB</span>
          </div>
        </div>
        <div v-show="isEdit" class="isEdit">
          <div class="dataList">
            <n-form
              n-form
              ref="updateUserForm"
              :rules="rules"
              :model="userLists"
              @keydown.enter.prevent
            >
              <n-form-item path="id" label="編號">
                {{ userLists.id }}
              </n-form-item>
              <n-form-item path="account" label="帳號">
                {{ userLists.account }}
              </n-form-item>

              <n-form-item path="email" label="郵件">
                <n-input
                  v-model:value="userLists.email"
                  type="email"
                  placeholder="請輸入郵件"
                />
              </n-form-item>
            </n-form>
          </div>
          <div class="avatar">
            <upload
              v-model:imgFile="imgFile"
              v-model:previewShow="previewShow"
            ></upload>
            <span>圖片最大5MB</span>
          </div>
        </div>
      </template>
      <template #action>
        <n-button @click="editor" v-show="!isEdit">{{ "編輯" }}</n-button>
        <n-button @click="isSave" v-show="isEdit">{{ "儲存" }}</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  inject,
  computed,
  watch,
  watchEffect,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { NForm, NFormItem, NInput, NAvatar } from "naive-ui";

import { useAuthLogin } from "../../store/user/auth";
import { useAuthCategory } from "../../store/category/operate";
import { useAuthArticle } from "../../store/article/list";
import { useAuthUserLogin } from "../../store/user/authUser";
import Upload from "../../components/Upload.vue";
import Loading from "../../components/common/Loading.vue";
const $axios = inject("$axios");
const AuthLogin = useAuthLogin();
const useCategory = useAuthCategory();
const AuthArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const router = useRouter();
const route = useRoute();
const msg = inject("message");
const updateUserForm = ref(null);
const isEdit = ref(false);
const imgFile = ref(null);
const previewShow = ref(false);
const userLists = reactive({
  id: "",
  headerImg: "",
  account: "",
  email: "",
});
const isLoading = ref(false);
//後端取的資料
async function userDates() {
  try {
    isLoading.value = true;
    const lists = await authUserLogin.getUserData();
    if (lists.data.code === 200) {
      userLists.id = lists.data.results.id;
      userLists.headerImg = lists.data.results.headerImg;
      userLists.account = lists.data.results.account;
      userLists.email = lists.data.results.email;
      isLoading.value = false;
    }
  } catch (error) {
    if (lists.results.code === 403) {
      msg.error(lists.results.msg);
      previewShow.value = false;
    }
  }
}
//編輯
function editor() {
  isEdit.value = true;
}
//儲存
async function isSave() {
  try {
    //頭貼
    isLoading.value = true;
    if (imgFile) {
      const formData = new FormData();
      formData.append("file", imgFile.value);
      const img = await authUserLogin.uploadAvatar(formData);
      userLists.headerImg = img;
    }

    const res = await authUserLogin.updateUserData(userLists);
    if (res.code === 200) {
      previewShow.value = false;
      userLists.email = "";
      imgFile.value = null;
      userLists.headerImg = "";
      msg.success(res.msg);
      userDates();
      isLoading.value = false;
    }

    if (res.code === 403) {
      msg.error(res.msg);
      previewShow.value = false;
      userDates();
    }
  } catch (error) {
    console.log(error);
  }
  isEdit.value = false;
}
const rules = {
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
};

watchEffect(() => {
  userDates();
});
</script>

<style lang="scss" scoped>
.content,
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40vw;
  height: 85vh;

  .isEdit {
    display: flex;
    justify-content: space-around;
    .dataList {
      width: 177px;
    }
    .avatar {
      display: flex;
      justify-content: center;
      flex-direction: column;
      span {
        text-align: center;
        font-size: 0.75rem;
        font-weight: 300;
      }
      :deep(.n-upload-dragger),
      n-upload :deep(n-upload--dragger-inside) {
        padding: 0;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        overflow: hidden;
        width: 120px;
        height: 120px;
        svg {
          font-size: 80px;
        }
      }
    }
  }
}
</style>
