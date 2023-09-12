<!---
<template>
  <div>
    <div class="loading" v-if="isLoading">
      <loading>頁面加載中...</loading>
    </div>
    <div class="detail_container" v-if="!isLoading">
      <NavBar :open="false" @isLogout="handleLogout"></NavBar>

      <n-card embedded :bordered="false">
        <template #header>
          <PostUserBar
            :user_name="data.name"
            :createTime="data.create_time"
            :avatar="data.avatar"
          >
          </PostUserBar>

          <h3>{{ data.title }}</h3>
          <n-image
            width="300"
            height="300"
            object-fit="contain"
            :src="data.cover_image"
            alt="文章封面"
          />
        </template>
        <template #default>
          <v-md-preview-html
            :html="html"
            preview-class="vuepress-markdown-body"
          ></v-md-preview-html>
        </template>

        <template #action>
          <LikeBar
            :blogId="route.params.id"
            :isUpdatedViewCount="isUpdatedViewCount"
            
          ></LikeBar>

        </template>
      </n-card>

      <div class="comments_container">
        <h1>Comments</h1>
        <Comments :blogId="blog_id"></Comments>
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
//---------------重構---------------//
import PostUserBar from "../components/home/PostUserBar.vue";
import { getBlog } from "../api/blogApi";
import { createArticleView } from "../api/blogViewApi";
import { transformTime } from "../utils/transformTime";

//---------------------------------//
//----------------重構--------------//
const blog_id = Number(route.params.id);
//觀看數去確認更新
const isUpdatedViewCount = ref(false);
//轉換markdown格式
const html = ref("");
const data = reactive({
  title: "",
  avatar: "",
  cover_image: "",
  content: "",
  name: "",
  create_time: "",
});

//------------重構-----------------//

//驗證登入
const verifyLogin = async () => {
  try {
    if (route.meta.userData) {
      const data = await route.meta.userData;
      console.log(data);
    } else {
      removeToken();
    }
  } catch (error) {}
};

//文章
const loadArticleData = async () => {
  try {
    const res = await getBlog(blog_id);
    const detailData = res.data.user.data[0];

    //資料
    data.create_time = transformTime(detailData.create_time);
    data.title = detailData.title;
    data.avatar = detailData.avatar;
    data.cover_image = detailData.coverImage;
    data.content = detailData.content;
    data.name = detailData.name;
    //增加白名單
    html.value = xss.process(
      VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(
        data.content
      )
    );
  } catch (error) {
    console.error(error);
  }
};
//登出刷新
const handleLogout = (value) => {
  if (value) {
    location.reload();
  }
};
//增加觀看
const habdleArticleViewCount = async () => {
  try {
    const res = await createArticleView(blog_id);
    if (res.data.data.status) {
      isUpdatedViewCount.value = true;
    }
  } catch (error) {
    console.error(error);
    if (error.response.status === 500) {
      msg.error("資料庫出現問題...請聯繫管理人員或重新訪問...");
    }
  }
};




//--------------------------------//
// async function loadListData() {
//   try {
//     isLoading.value = true;
//     const id = route.params.id;
//     const res = await AuthArticle.oldArticleList(id);

//     //時間
//     let d = new Date(res[0].create_time);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1);
//     const day = String(d.getDate());

//     res[0].create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
//       2,
//       "0"
//     )}`;
//     listData.title = res[0].title;
//     listData.cover_image = res[0].coverImage;
//     listData.content = res[0].content;
//     listData.uid = res[0].uid;
//     listData.create_time = res[0].create_time;
//     isLoading.value = false;
//   } catch (error) {
//     console.error(error);
//   }
// }

// //--使用者id

// const user_id = ref(0);
// const user_name = ref("");

// async function getUserData() {
//   try {
//     const res = await authUserLogin.getUserData();
//     user_id.value = res.data.results.id;
//     user_name.value = res.data.results.account;
//   } catch (error) {}
// }

// //觀看文章用戶計數
// async function userWatchCount() {
//   try {
//     const userData = await authUserLogin.getUserData();
//     const user_id = await userData.data.results.id;
//     const options = {
//       blog_id: route.query.id,
//       user_id,
//     };

//     const res = await authUserLogin.watchArticleAdd(options);
//     loadWatchCount();
//     return res;
//   } catch (error) {
//     console.error(error);
//   }
// }
// //文章觀看數
// const watchCount = ref(0);
// async function loadWatchCount() {
//   try {
//     const options = {
//       blog_id: route.query.id,
//     };
//     watchCount.value = await AuthArticle.allWatchData(options);
//   } catch (error) {
//     console.error(error);
//   }
// }
// //評論發送後及時更新
// const updateCommentCount = ref(0);
// function loadUpdateCommentCount(d) {
//   updateCommentCount.value = d;
// }
// //navBar登出後刷新
// function isCheckLogined(loginStatus) {
//   if (loginStatus) {
//     loadListData();
//   }
// }
onMounted(() => {
  // userWatchCount();
  // loadListData();
  //渲染預覽markdown格式文件

  //----重構-------//
  loadArticleData();
  habdleArticleViewCount();
  // watchEffect(() => {
  //   html.value = xss.process(
  //     VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(
  //       data.content
  //     )
  //   );
  // });
});
//----------------------------//
// watchEffect(() => {
//   //渲染預覽markdown格式文件
//   html.value = xss.process(
//     VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(
//       listData.content
//     )
//   );
//   loadListData();
//   loadWatchCount();
//   loadUpdateCommentCount();
// });
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
