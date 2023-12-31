<template>
  <loading class="loadingBar" v-if="isLoading">資料加載中...</loading>
  <div class="dashBoard-container" v-if="!isLoading && isAdmin">
    <n-grid cols="8" x-gap="8" y-gap="12" item-responsive>
      <n-grid-item span="0:8 800:8 1000:2">
        <n-card size="small" :header-style="card_header_style" hoverable>
          <template #header>
            <div class="card--header-content">
              <n-icon size="25"><EyeOutline /></n-icon>
              <h4>瀏覽人次</h4>
            </div>
          </template>
          <div class="card--content-container">
            <span>{{ allViewCounts }}</span>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="0:8 800:8 1000:2 ">
        <n-card size="small" :header-style="card_header_style" hoverable>
          <template #header>
            <div class="card--header-content">
              <n-icon size="25"><ThumbsUpSharp /></n-icon>
              <h4>點讚數量</h4>
            </div>
          </template>
          <div class="card--content-container">
            <span>{{ allLikeCounts }}</span>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="0:8 800:8 1000:2">
        <n-card size="small" :header-style="card_header_style" hoverable>
          <template #header>
            <div class="card--header-content">
              <n-icon size="25"><Comment16Regular /></n-icon>
              <h4>留言數量</h4>
            </div>
          </template>
          <div class="card--content-container">
            <span>{{ allCommentCounts }}</span>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="0:8 800:8 1000:2">
        <n-card size="small" :header-style="card_header_style" hoverable>
          <template #header>
            <div class="card--header-content">
              <n-icon size="25"><Person /></n-icon>
              <h4>註冊人數</h4>
            </div>
          </template>
          <div class="card--content-container">
            <span>{{ allUserCounts }}</span>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="0:8 800:8 1200:3">
        <n-card :header-style="card_header_style" hoverable>
          <template #header>
            <div class="card--new-container">
              <h1>最新留言</h1>
            </div>
          </template>

          <div class="card--new-commentZero" v-if="newCommentData.length === 0">
            <n-empty>目前沒有留言...</n-empty>
          </div>

          <div
            v-else
            class="card--new-content"
            v-for="data in newCommentData"
            :key="data.id"
          >
            <div class="avatar-container">
              <img :src="data.avatar" alt="" />
            </div>

            <div class="user--comment-container">
              <div class="user--nameAndtime">
                <h4>{{ data.user_name }}</h4>
                <span>{{ data.create_time }}</span>
              </div>
              <p>{{ data.content }}</p>
              <n-button
                color="#cccccc"
                size="tiny"
                @click="toDetail(data.blog_id)"
                >前往留言文章</n-button
              >
            </div>
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:8 800:8 1000:5 1700:5">
        <n-card :header-style="card_header_style" hoverable>
          <template #header>
            <div class="card--hot-container">
              <h1>熱門文章</h1>
              <span @click="toAllArticle" class="active_To_AllArticle"
                >全部文章&rarr;</span
              >
            </div>
          </template>

          <div class="card--hot--content-container">
            <n-data-table :columns="columns" :data="hotData" />
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
  <div v-if="!isLoading && !isAdmin">
    <UserDataCard
      :userDatas="userDatas"
      :likeCount="pageInfoUser.count"
    ></UserDataCard>
  </div>
</template>
<script setup>
import { onMounted, reactive, inject, h, ref, computed } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";

import selectMenu from "naive-ui/es/_internal/select-menu";
import { createPinia } from "pinia";
import { EyeOutline, ThumbsUpSharp, Person } from "@vicons/ionicons5";
import { Comment16Regular } from "@vicons/fluent";
import columnData from "../../data/dashBoard/dashBoardHotArticle.json";
import loading from "../../components/common/Loading.vue";
const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const isLoading = ref(false);
const message = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");

import { removeToken } from "../../utils/verify";
import { getArticleData } from "../../store/articleStore";
import { getAllWebDatas } from "../../api/blogApi";
import { transformTime } from "../../utils/transformTime";

//user
import { uploadAvatar, updateUser } from "../../api/userApi";
import UserDataCard from "../../components/userCenter/UserDataCard.vue";
import Upload from "../../components/Upload.vue";
import { getLikeBlogDatas } from "../../api/userApi";

const updateUserForm = ref(null);
const isEdit = ref(false);
const imgFile = ref(null);
const previewShow = ref(false);
const userDatas = reactive({
  id: "",
  avatar: "",
  name: "",
  email: "",
  create_time: "",
});

//驗證取得資料
const getUserData = async () => {
  try {
    if (route.meta.userData) {
      const data = await route.meta.userData;
      userDatas.id = data.user.id;
      userDatas.avatar = data.user.avatar;
      userDatas.name = data.user.account;
      userDatas.email = data.user.email;
      userDatas.create_time = transformTime(data.user.create_time);
      oldAvatar.value = data.user.avatar;
    } else {
      removeToken();
    }
  } catch (error) {}
};
//分頁參數
const pageInfoUser = reactive({
  page: 1,
  pageSize: 8,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
});
const loadLikeBlogs = async () => {
  try {
    const res = await getLikeBlogDatas(pageInfo);
    if (res.status === 200) {
      pageInfo.count = res.data.counts;
      pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    }
  } catch (error) {
    if (error.response.status === 419) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
    }
    if (error.response.status === 403) {
      message.error(error.response.data.msg);
      router.replace("/resgist");
    }
    if (error.response.status === 401) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
    }
  }
};

//編輯
const editor = () => {
  isEdit.value = true;
};
//儲存
async function isSave() {
  try {
    //頭貼
    isLoading.value = true;
    if (imgFile) {
      const formData = new FormData();
      formData.append("file", imgFile.value);
      const img = await uploadAvatar(formData);
      userDatas.avatar =
        img.data.data.url ||
        "http://localhost:3000/upload/avatar/defaultUser.jpg";
    }

    const res = await updateUser(userDatas);

    if (res.data.data.status === "success") {
      msg.success(res.data.data.msg);
      imgFile.value = null;
      previewShow.value = false;
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
      msg.error(error.response.data.msg);
    }
  }
  isEdit.value = false;
  isLoading.value = false;
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
//-------------------------------------
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

//文章列表
const columns_header = reactive(columnData.headers);
const columns = reactive([...columns_header]);
//判斷
const isAdmin = ref(true);
const loadWebDatas = async () => {
  try {
    isLoading.value = true;
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
      newCommentData.value = newCommentData.value.map((newComment) => {
        newComment.create_time = transformTime(newComment.create_time);
        return newComment;
      });
      //熱門文章
      const viewData = res.data.data[0].data;
      hotData.value = hotData.value.map((data) => {
        data.create_time = transformTime(data.create_time);
        const index = viewData.filter((d) => d.blog_id === data.id);
        data.view_count = index.length;
        return data;
      });
      isLoading.value = false;
    }
  } catch (error) {
    if (error.response.status === 403) {
      isLoading.value = false;
      isAdmin.value = false;
      // message.error(error.response.data.msg);
      // removeToken();
      // router.replace("/resgist");
    }
    if (error.response.status === 419) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
    }
    if (error.response.status === 401) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
    }
  }
};

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

//前往全部文章區
const toAllArticle = () => {
  router.push("/dashBoard/article");
};
//前往留言文章
const toDetail = (id) => {
  router.push(`/detail/${id}`);
};
//樣式
const card_header_style = reactive({
  backgroundColor: "#0284c7",
  borderRadius: "6px 6px 0 0",
});

onMounted(() => {
  loadWebDatas();
  getUserData();
  loadLikeBlogs();
});
</script>
<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/dataPanelRwd.scss";
.dashBoard-container {
  .n-card {
    border-radius: 6px;
    .card--header-content {
      display: flex;
      justify-content: center;
      gap: 1rem;

      h4 {
        font-size: 1.6rem;
        font-weight: 500;
        color: $primary-light;
        letter-spacing: 1.2px;
      }
      .n-icon {
        color: $primary-light;
      }
    }
    .card--content-container {
      text-align: center;
      font-size: 2.5rem;
      padding-top: 0.5rem;
    }
  }
  .card--new-container {
    h1 {
      font-size: 3rem;
      font-weight: 500;
      color: $primary-light;
      letter-spacing: 1.1px;
    }
  }
  .card--new-commentZero {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
  .card--new-content {
    display: flex;
    padding: 1.5rem 0;
    gap: 1rem;

    .avatar-container {
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user--comment-container {
      .user--nameAndtime {
        display: flex;
        align-items: center;
        gap: 1rem;
        h4 {
          font-size: 1.6rem;
          font-weight: 500;
        }
        span {
          font-size: 1.2rem;
          color: $font-gray;
        }
      }
      p {
        font-size: 1.4rem;
        color: $font-black-gray;
        width: 30rem;
      }
      .n-button {
        padding: 0.25rem 0.5rem;
      }
    }
  }
  .card--hot-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $primary-light;

    h1 {
      font-size: 3rem;
      font-weight: 500;
      letter-spacing: 1.1px;
    }
    span {
      padding-top: 1rem;
      font-size: 1.6rem;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: $font-light-gray;
        transform: translateX(10%);
      }
    }
  }
  .card--hot--content-container {
    margin-top: 1rem;
  }
}
</style>
