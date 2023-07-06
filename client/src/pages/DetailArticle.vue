<template>
  <div>
    <div class="loading" v-if="isLoading">
      <loading>頁面加載中...</loading>
    </div>
    <div class="detail_container" v-if="!isLoading">
      <nav-bar @checkLogined="isCheckLogined" :open="false"></nav-bar>

      <n-card embedded :bordered="false">
        <template #header>
          <issuser
            :uid="listData.uid"
            :createTime="listData.create_time"
          ></issuser>

          <h3>{{ listData.title }}</h3>
          <n-image
            width="300"
            height="300"
            object-fit="contain"
            :src="listData.cover_image"
            alt=""
          />
        </template>
        <template #default>
          <v-md-preview-html
            :html="html"
            preview-class="vuepress-markdown-body"
          ></v-md-preview-html>
        </template>

        <template #action>
          <like-bar
            :watchCount="watchCount"
            :updateCommentCount="updateCommentCount"
          ></like-bar>
        </template>
      </n-card>

      <div class="comments_container">
        <h1>Comments</h1>
        <comments @updateCommentCount="loadUpdateCommentCount"></comments>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  inject,
  watchEffect,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { NIcon, NImage } from "naive-ui";
import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";
import VueMarkdownEditor, { xss } from "@kangc/v-md-editor";
import { useAuthUserLogin } from "../store/user/authUser";
import { ThumbsUpOutline, ThumbsUpSharp } from "@vicons/ionicons5";
import NavBar from "../components/home/NavBar.vue";
import LikeBar from "../components/LikeBar.vue";
import Comments from "../components/Comments.vue";
import Issuser from "../components/home/Issuser.vue";
import Loading from "../components/common/Loading.vue";
const $axios = inject("$axios");
const AuthLogin = useAuthLogin();
const useCategory = useAuthCategory();
const AuthArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const router = useRouter();
const route = useRoute();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
const isLoading = ref(false);
defineComponent({
  NIcon,
  ThumbsUpOutline,
  ThumbsUpSharp,
});

//轉換markdown格式
const html = ref("");
const listData = reactive({
  title: "",
  cover_image: "",
  content: "",
  uid: "",
  create_time: "",
});

async function loadListData() {
  try {
    isLoading.value = true;
    const id = route.query.id;
    const res = await AuthArticle.oldArticleList(id);

    //時間
    let d = new Date(res[0].create_time);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1);
    const day = String(d.getDate());

    res[0].create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
      2,
      "0"
    )}`;
    listData.title = res[0].title;
    listData.cover_image = res[0].coverImage;
    listData.content = res[0].content;
    listData.uid = res[0].uid;
    listData.create_time = res[0].create_time;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
}

//--使用者id

const user_id = ref(0);
const user_name = ref("");

async function getUserData() {
  try {
    const res = await authUserLogin.getUserData();
    user_id.value = res.data.results.id;
    user_name.value = res.data.results.account;
  } catch (error) {}
}

//觀看文章用戶計數
async function userWatchCount() {
  try {
    const options = {
      blog_id: route.query.id,
      user_id: user_id.value,
    };
    const res = await authUserLogin.watchArticleAdd(options);
    loadWatchCount();
    return res;
  } catch (error) {
    console.error(error);
  }
}
//文章觀看數
const watchCount = ref(0);
async function loadWatchCount() {
  try {
    const options = {
      blog_id: route.query.id,
    };
    watchCount.value = await AuthArticle.allWatchData(options);
  } catch (error) {
    console.error(error);
  }
}
//評論發送後及時更新
const updateCommentCount = ref(0);
function loadUpdateCommentCount(d) {
  updateCommentCount.value = d;
}
//navBar登出後刷新
function isCheckLogined(loginStatus) {
  if (loginStatus) {
    loadListData();
  }
}
watchEffect(() => {
  //渲染預覽markdown格式文件
  html.value = xss.process(
    VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(
      listData.content
    )
  );
  loadListData();
  userWatchCount();
  loadWatchCount();
  loadUpdateCommentCount();
});
</script>

<style lang="scss" scoped>
.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.detail_container {
  width: auto;
  height: auto;
  .n-card {
    width: auto;
  }
}
.comments_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
