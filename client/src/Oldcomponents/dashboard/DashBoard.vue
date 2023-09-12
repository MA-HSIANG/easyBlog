<template>
  <div>
    <div v-if="isLoading" class="loading">
      <loading>頁面加載中...</loading>
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
            @update:value="toPage"
          />
        </n-layout-sider>

        <n-layout>
          <div class="dashBoard_container" v-if="route.path === '/dashBoard'">
            <h2>首頁</h2>

            <n-grid cols="6 xs:1 s:1 m:1 l:1 xl:4" responsive="screen">
              <n-gi>
                <n-card hoverable>
                  <div class="card_container">
                    <div class="card_iocn">
                      <n-icon size="25"><EyeOutline /></n-icon>
                    </div>
                    <div class="card_content">
                      <h4>瀏覽人次</h4>
                      <span>{{ allViewCounts }}</span>
                    </div>
                  </div>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card hoverable>
                  <div class="card_container">
                    <div class="card_iocn">
                      <n-icon size="25"><ThumbsUpSharp /></n-icon>
                    </div>
                    <div class="card_content">
                      <h4>點讚數</h4>
                      <span>{{ allLikeCounts }}</span>
                    </div>
                  </div>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card hoverable>
                  <div class="card_container">
                    <div class="card_iocn">
                      <n-icon size="25"><Comment16Regular /></n-icon>
                    </div>
                    <div class="card_content">
                      <h4>留言數</h4>
                      <span>{{ allCommentCounts }}</span>
                    </div>
                  </div>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card hoverable>
                  <div class="card_container">
                    <div class="card_iocn">
                      <n-icon size="25"><Person /></n-icon>
                    </div>
                    <div class="card_content">
                      <h4>註冊人數</h4>
                      <span>{{ allUserCounts }}</span>
                    </div>
                  </div>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="new_comment" hoverable>
                  <div class="comment_title">
                    <h3>最新留言</h3>
                  </div>
                  <div v-for="data in newCommentData" :key="data.id">
                    <n-thing
                      content-indented
                      content-style="font-size:12px"
                      description-style="font-size:10px;font-weight:200"
                    >
                      <template #avatar>
                        <n-avatar round :size="25" :src="data.avatar">
                        </n-avatar>
                      </template>
                      <template #header> {{ data.user_name }}</template>
                      <template #default> {{ data.content }} </template>
                      <template #action>
                        <n-button
                          color="#cccccc"
                          size="tiny"
                          @click="toDetail(data.blog_id)"
                          >前往留言文章</n-button
                        >
                      </template>
                    </n-thing>
                  </div>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="hot_list" hoverable>
                  <div class="hot_title">
                    <h3>熱門文章</h3>
                    <span @click="toAllArticle" class="active_To_AllArticle"
                      >全部文章>></span
                    >
                  </div>
                  <div class="hot_content">
                    <n-data-table :columns="columns" :data="hotData" />
                  </div>
                </n-card>
              </n-gi>
            </n-grid>
          </div>
          <router-view></router-view>
        </n-layout>
        <n-layout />
      </n-layout>
    </div>
  </div>
</template>
<script setup>
import {
  defineComponent,
  onMounted,
  onBeforeMount,
  reactive,
  inject,
  h,
  ref,
  computed,
  watchEffect,
  nextTick,
} from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import {
  NDataTable,
  NLayout,
  NMenu,
  NLayoutSider,
  NIcon,
  NGrid,
  NGi,
  NAvatar,
  NList,
  NListItem,
  NThing,
} from "naive-ui";

import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";
import { useAuthUserLogin } from "../store/user/authUser";
import menuData from "../data/dashBoard/dashBoardMenus.json";
import selectMenu from "naive-ui/es/_internal/select-menu";
import { createPinia } from "pinia";
import { EyeOutline, ThumbsUpSharp, Person } from "@vicons/ionicons5";
import { Comment16Regular } from "@vicons/fluent";
import columnData from "../data/dashBoard/dashBoardHotArticle.json";
import Loading from "../components/common/Loading.vue";
const router = useRouter();
const route = useRoute();
const authLogin = useAuthLogin();
const $axios = inject("$axios");
const useCategory = useAuthCategory();
const AuthArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const collapsed = ref(false);
const menus = reactive([...menuData.menus]);
const isLoading = ref(false);
const $init = inject("$init");
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
/////---------重構區--------------////
import { removeToken } from "../utils/verify";
import { getArticleData } from "../store/articleStore";
import { getAllWebDatas } from "../api/blogApi";
import { transformTime } from "../utils/transformTime";
/////---------重構區--------------////
const onReload = inject("onReload");
const toPage = (key, menu) => {
  if (key !== "logout") {
    router.replace(menu.href);
  } else {
    router.push("/login");
    authLogin.delToken();
    authLogin.adminToken = "";
  }
};
//後台資料
const allLikeCounts = ref(0); //讚
const allCommentCounts = ref(0); //留言
const allViewCounts = ref(0); //觀看
const allUserCounts = ref(0); //註冊數
const newCommentData = ref([]); //最新留言
const hotData = ref([]); //文章內容
const categoryLists = ref([]); //熱門文章列

//---------重構--------------//
//文章列表
const columns_header = reactive(columnData.headers);
const columns = reactive([...columns_header]);

const loadWebDatas = async () => {
  try {
    const res = await getAllWebDatas();

    if (res.status === 200) {
      allViewCounts.value = res.data.data[0].views;
      allUserCounts.value = res.data.data[1].users;
      allLikeCounts.value = res.data.data[2].likes;
      allCommentCounts.value = res.data.data[3].comments;
      hotData.value = res.data.data[4].blogs;
      //desc
      newCommentData.value = res.data.data[3].data;
      newCommentData.value.sort((a, b) => b.create_time - a.create_time);
      //顯示前幾筆
      newCommentData.value = newCommentData.value.slice(0, 7);
      //熱門文章
      const viewData = res.data.data[0].data;
      hotData.value = hotData.value.map((data) => {
        data.create_time = transformTime(data.create_time);
        const index = viewData.filter((d) => d.blog_id === data.id);
        data.view_count = index.length;
        return data;
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// //轉換key
// async function loadcateGoryList() {
//   const res = await useCategory.ResCategoryList();
//   //select
//   categoryLists.value = res.map((item) => {
//     return {
//       label: item.name,
//       value: item.id,
//     };
//   });
// }

//分頁初始值
const pageInfo = reactive({
  page: 1,
  pageSize: 8,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
  //關鍵字
  keyword: "",
  //分類
  category_id: 0,
});

// //載入文章
// async function loadArticleData() {
//   try {
//     isLoading.value = true;
//     const res = await AuthArticle.articleLists(pageInfo);

//     const listRes = res.datas.lists;

//     for (const list of listRes) {
//       //內容溢出
//       if (list.content.length >= 50) {
//         list.content = list.content.slice(0, 50);
//         list.content += "...";
//       }

//       //觀看人次查詢
//       const options = {
//         blog_id: list.id,
//       };
//       //加入對應的觀看數
//       const watchs = await AuthArticle.allWatchData(options);
//       list.watch_count = watchs;
//       //uid查詢轉換
//       const issuer = await AuthArticle.queryIssuer(list.uid);
//       list.uid = issuer.account;
//       //時間
//       let d = new Date(list.create_time);
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1);
//       const day = String(d.getDate());
//       list.create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
//         2,
//         "0"
//       )}`;
//     }

//     data.value = listRes;
//     isLoading.value = false;
//     //分頁
//     pageInfo.count = res.count.count;
//     pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
//   } catch (error) {
//     console.log(error);
//   }
// }
//前往全部文章區
function toAllArticle() {
  router.push("/dashBoard/article");
}

// //後台總讚數
// async function dashBoardLikeCountData() {
//   try {
//     allLikeCount.value = await AuthArticle.dashBoardLikes();
//   } catch (error) {
//     console.error(error);
//   }
// }
// //後台留言總數
// async function dashBoardWatchCountData() {
//   try {
//     const res = await AuthArticle.dashBoardComments();
//     allCommentCount.value = res.length;
//   } catch (error) {}
// }
// //後台文章瀏覽總數
// async function dashBoardCommentDataCount() {
//   try {
//     const res = await AuthArticle.dashBoardWatchCounts();
//     allWatchCount.value = res.length;
//   } catch (error) {
//     console.error(error);
//   }
// }
// //後台最新留言
// async function dashBoardNewComment() {
//   try {
//     const new_num = $init.new_number; //最新留言數

//     hotCommentData.value = await AuthArticle.dashBoardComments(new_num);
//   } catch (error) {
//     console.error(error);
//   }
// }
// //後台統註冊人員總數
// async function dashBoardAllUserData() {
//   try {
//     const res = await authLogin.allUser();

//     allUserCount.value = res.length;
//   } catch (error) {
//     console.error(error);
//   }
// }
// //前往留言詳情
// function toDetail(d) {
//   router.push({ name: "detail", query: { id: d } });
// }
// //呼叫刷新
// function reloadAllData() {
//   if (isReload) {
//     dashBoardAllUserData();
//     dashBoardLikeCountData();
//     dashBoardWatchCountData();
//     dashBoardCommentDataCount();
//     dashBoardNewComment();
//     loadArticleData();
//   }
// }
watchEffect(() => {
  // loadArticleData();
  // reloadAllData();
  //------重構區-----///
});
onMounted(() => {
  loadWebDatas();
  // // checkLogin();
  // authLogin.adminToken;
  // dashBoardAllUserData();
  // dashBoardLikeCountData();
  // dashBoardWatchCountData();
  // dashBoardCommentDataCount();
  // dashBoardNewComment();
});
</script>
<style lang="scss" scoped>
div {
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
  margin: 1rem;
  .container {
    height: auto;
    width: 100vw;

    .main-parcel {
      display: flex;
      color: #6f676a;
    }
    .n-menu {
      width: auto;
      height: 90vh;
      font-size: 18px;
    }
  }

  .dashBoard_container {
    display: flex;
    flex-direction: column;
    .new_comment.n-card {
      height: auto;
      width: auto;
      overflow: hidden;
      align-items: flex-start;
    }
    .hot_list.n-card {
      display: inline-block;
      width: auto;
      height: auto;
      .hot_content {
        display: flex;
        width: 54.7vw;
      }
      .hot_title {
        display: flex;
        justify-content: space-between;
        .active_To_AllArticle {
          display: flex;
          align-items: center;
          &:hover {
            cursor: pointer;
            color: blue;
          }
        }
      }
    }
    .n-card {
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      height: 10vh;
      overflow: hidden;

      .card_container {
        display: flex;
        align-items: center;
        justify-content: center;
        .card_iocn {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .card_content {
          display: flex;
          flex-direction: column;
          line-height: 50%;

          h4 {
            font-size: 0.5rem;
            font-weight: 350;
          }
          span {
            font-size: 1rem;
          }
        }
      }
    }
  }
}
</style>
