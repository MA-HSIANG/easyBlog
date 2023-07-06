<template>
  <div>
    <div class="loading" v-if="isLoading">
      <loading>頁面加載中...</loading>
    </div>
    <div class="container" v-else>
      <Header>
        <template #title> The EasyBlog </template>
        <template #subtitle> PROGRAMS & PERSONAL BLOG </template>
      </Header>
      <nav-bar
        @selectCategory_id="changeCategoryId"
        @keyword="searchKeyword"
        @checkLogined="isCheckLogined"
      ></nav-bar>

      <div class="content">
        <div v-show="data.length === 0">
          <h1>目前博主沒有發表文章...</h1>
        </div>
        <div v-for="d in data" :key="d.id" class="lists_container">
          <n-card>
            <template #header>
              <issuser :uid="d.uid" :createTime="d.create_time"></issuser>
              <h2>{{ d.title }}</h2>
            </template>
            <template #cover>
              <n-image object-fit="cover" :src="d.coverImage" alt="" />
            </template>
            <template #default>
              <div class="article_detail" @click="toDetail(d)">
                <!-- <v-md-preview-html
                  :html="d.content"
                  preview-class="vuepress-markdown-body"
                ></v-md-preview-html> -->
                <h3>{{ d.description }}</h3>
              </div>
            </template>

            <template #footer>
              <n-divider />

              <like-bar :counts="d.id"></like-bar>
            </template>
          </n-card>
        </div>
      </div>

      <n-pagination
        v-model:page="pageInfo.page"
        :page-count="pageInfo.pageCount"
        @click="loadArticleData"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject, watchEffect } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { NPagination, NIcon, NImage, NDivider } from "naive-ui";
import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";
import RichTextEditor from "../components/RichTextEditor.vue";
import VueMarkdownEditor, { xss } from "@kangc/v-md-editor";
import Header from "../components/home/Header.vue";
import NavBar from "../components/home/NavBar.vue";
import LikeBar from "../components/LikeBar.vue";
import Issuser from "../components/home/Issuser.vue";
import { CaretBackOutline } from "@vicons/ionicons5";
import Loading from "../components/common/Loading.vue";
const $axios = inject("$axios");
const authLogin = useAuthLogin();
const useCategory = useAuthCategory();
const AuthArticle = useAuthArticle();
const router = useRouter();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
const isLoading = ref(false);
//分頁初始值
const pageInfo = reactive({
  page: 1,
  pageSize: 6,
  pageMove: 0,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
  //關鍵字
  keyword: "",
  //分類
  category_id: 0,
});
//分類搜索
function changeCategoryId(category_id) {
  pageInfo.category_id = category_id;
  loadArticleData();
}
//關鍵詞搜索
function searchKeyword(keyword) {
  pageInfo.keyword = keyword;

  loadArticleData();
}

//載入文章
const data = ref([]); //文章內容

async function loadArticleData() {
  try {
    isLoading.value = true;
    const res = await AuthArticle.articleLists(pageInfo);
    const listRes = await res.datas.lists;

    for (const list of listRes) {
      //內容溢出
      if (list.content.length >= 30) {
        list.content = list.content.slice(0, 30);
        list.content += "...";
      }
      //--------------markdown----------//////////////
      list.content = xss.process(
        VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(
          list.content
        )
      );

      //時間
      let d = new Date(list.create_time);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1);
      const day = String(d.getDate());

      list.create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
        2,
        "0"
      )}`;
    }
    data.value = listRes;
    isLoading.value = false;
    //分頁
    pageInfo.pageMove = res.datas.lists.length;
    pageInfo.count = res.count.count;
    watchEffect(() => {
      if (pageInfo.keyword === "") {
        pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
      } else {
        pageInfo.pageCount = Math.ceil(pageInfo.pageMove / pageInfo.pageSize);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

//詳細跳轉
function toDetail(d) {
  router.push({ name: "detail", query: { id: d.id } });
}
//navBar登出後刷新
function isCheckLogined(loginStatus) {
  if (loginStatus) {
    router.replace("/");
  }
}
onMounted(() => {
  loadArticleData();
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
.container {
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 95vw;
    flex-wrap: wrap;
    .lists_container {
      margin: 1rem;
      .n-card {
        overflow: hidden;
        border: 1px solid black;
        height: 65vh;
        width: 25vw;
        .article_detail {
          cursor: pointer;
          &:hover {
            color: blue;
          }
        }
      }
    }
  }
  .n-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>
