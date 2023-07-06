<template>
  <div class="container">
    <div class="loading">
      <loading v-if="isLoading">資料送出中...</loading>
    </div>
    <div v-show="commentLists.length === 0">
      <h1>目前沒有任何評論...</h1>
    </div>
    <div v-if="!isLoading">
      <n-list v-for="list in commentLists" :key="list.id">
        <n-divider />
        <n-list-item>
          <template #prefix>
            <n-avatar round :size="36" :src="list.headerImg" />
          </template>

          <n-thing
            content-indented
            content-style="font-size:18px"
            description-style="font-size:12px;font-weight:200"
          >
            <template #header>
              {{ list.user_name }}
            </template>
            <template #description> {{ list.create_time }} </template>
            <template #default>
              {{ list.content }}
              <div>
                <n-button
                  text
                  tag="a"
                  type="tiny"
                  text-color="#999999"
                  @click="submitReply(list.id)"
                  v-if="isUserLogined || isAdminLogined"
                  >回復</n-button
                >
                <n-button
                  text
                  tag="a"
                  type="tiny"
                  text-color="#999999"
                  v-if="!isUserLogined && !isAdminLogined"
                  @click="showReplyList"
                  >{{ !isShowReplyList ? "查看回復" : "收起" }}</n-button
                >
              </div>
            </template>

            <template
              #footer
              v-if="isUserLogined || isAdminLogined || isShowReplyList"
            >
              <reply :comment_id="list.id" v-model:isSubmit="isSubmit"></reply>
            </template>
            <template #action>
              <div class="reply" v-if="isShowReply && commentId === list.id">
                <n-avatar round :size="36" :src="admin_avatar || header_img" />
                <n-input
                  placeholder="請輸入回復"
                  maxlength="15"
                  show-count
                  v-model:value="reply_content"
                ></n-input>
                <n-button
                  v-if="isAdminLogined"
                  @click="adminReply_submit(list.id)"
                  >送出</n-button
                >
                <n-button
                  v-if="isUserLogined"
                  @click="userReply_submit(list.id)"
                  >送出</n-button
                >
              </div>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </div>

    <n-pagination
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
      @click="loadUserComment"
    />

    <n-divider />

    <div>
      <div class="write_comment" v-if="isUserLogined || isAdminLogined">
        <n-input
          v-model:value="commentData.content"
          type="textarea"
          placeholder="發表回復"
          maxlength="20"
          show-count
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </div>
      <div class="write_comment" v-if="!isUserLogined && !isAdminLogined">
        <n-input
          v-model:value="commentData.content"
          type="textarea"
          placeholder="請先登入....."
          disabled
          maxlength="20"
          show-count
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </div>
      <n-button v-if="isUserLogined" @click="writeComment">送出</n-button>
      <n-button v-if="isAdminLogined" @click="writeAdminComment">送出</n-button>
    </div>
  </div>
</template>
<script setup>
import {
  defineComponent,
  reactive,
  ref,
  inject,
  watchEffect,
  provide,
} from "vue";
import { useRouter, useRoute } from "vue-router";

import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";
import RichTextEditor from "../components/RichTextEditor.vue";
import Loading from "../components/common/Loading.vue";
import { useAuthUserLogin } from "../store/user/authUser";
import { ThumbsUpOutline, ThumbsUpSharp } from "@vicons/ionicons5";
import NavBar from "../components/home/NavBar.vue";
import LikeBar from "../components/LikeBar.vue";
import Reply from "../components/Reply.vue";
import {
  NInput,
  NButton,
  NSpace,
  NDivider,
  NList,
  NListItem,
  NThing,
  NPagination,
  NAvatar,
  NIcon,
} from "naive-ui";

import { Connector16Filled, ControlButton20Filled } from "@vicons/fluent";
const $axios = inject("$axios");
const AuthLogin = useAuthLogin();
const AuthArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const msg = inject("message");
const emits = defineEmits(["updateCommentCount"]);
defineComponent({
  ThumbsUpOutline,
  ThumbsUpSharp,
});

//評論頁參數
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
  //blog
  blog_id: route.query.id,
});

//user驗證
const isUserLogined = ref(false);
const userToken = authUserLogin.getToken();
async function checkUserLogin() {
  const res = await authUserLogin.isLoginIn(userToken);
  if (res.code === 200) {
    isUserLogined.value = true;
  }
}
//admin驗證
const isAdminLogined = ref(false);
async function checkAdminLogin() {
  AuthLogin.adminToken = AuthLogin.getToken();
  const res = await AuthLogin.isLoginIn(AuthLogin.adminToken);

  if (res.code === 200) {
    isAdminLogined.value = true;
  }
}
//取得admin資料
const admin_name = ref("");
const admin_avatar = ref("");
const admin_id = ref(0);

async function getAdminData() {
  try {
    const res = await AuthLogin.getAdminDate();
    if (res.data.code) {
      const adminDatas = res.data.results[0];
      admin_name.value = adminDatas.account;
      admin_avatar.value = adminDatas.avatar;
      admin_id.value = adminDatas.id;
    }
  } catch (error) {}
}

//轉換markdown格式
const html = ref("");
const listData = reactive({
  title: "",
  cover_image: "",
  content: "",
});

async function loadListData() {
  const id = route.query.id;
  const res = await AuthArticle.oldArticleList(id);
  listData.title = res[0].title;
  listData.cover_image = res[0].coverImage;
  listData.content = res[0].content;
}
//使用者資料

const user_id = ref(0);
const user_name = ref("");
const header_img = ref("");
async function getUserData() {
  try {
    const res = await authUserLogin.getUserData();
    user_id.value = res.data.results.id;
    user_name.value = res.data.results.account;
    header_img.value = res.data.results.headerImg;
  } catch (error) {}
}

//發送評論
const commentData = reactive({
  blog_id: route.query.id,
  user_id: 0,
  user_name: "",
  content: "",
  header_img: "",
});

//user發表評論
async function writeComment() {
  try {
    isLoading.value = true;
    commentData.user_id = user_id.value;
    commentData.user_name = user_name.value;
    commentData.header_img = header_img.value;
    const res = await authUserLogin.userComment(commentData);

    if (res.code === 200) {
      const updateCount = await AuthArticle.allCommentData(pageInfo);
      emits("updateCommentCount", updateCount.count.count);
      msg.success(res.msg);
      commentData.content = "";
      loadUserComment();
      isLoading.value = false;
    }
  } catch (error) {
    msg.error("評論發表失敗");
    console.error(error);
    isLoading.value = false;
  }
}
//admin發表評論
async function writeAdminComment() {
  try {
    isLoading.value = true;
    getAdminData();
    commentData.user_id = admin_id.value;
    commentData.user_name = admin_name.value;
    commentData.header_img = admin_avatar.value;
    const res = await AuthLogin.adminComment(commentData);
    if (res.code === 200) {
      const updateCount = await AuthArticle.allCommentData(pageInfo);
      emits("updateCommentCount", updateCount.count.count);
      msg.success(res.msg);
      commentData.content = "";
      loadUserComment();
      isLoading.value = false;
    }
  } catch (error) {
    console.error(error);
    msg.error("評論發表失敗");
    isLoading.value = false;
  }
}

//渲染評論內容
const commentLists = ref([]);
async function loadUserComment() {
  try {
    const res = await AuthArticle.allCommentData(pageInfo);
    const listRes = await res.data.results;

    for (const list of listRes) {
      let d = new Date(list.create_time);
      const year = d.getFullYear();

      const month = String(d.getMonth() + 1);
      const day = String(d.getDate());

      list.create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
        2,
        "0"
      )}`;
    }
    if (res.data.code === 200) {
      commentLists.value = listRes;
    }

    //分頁
    pageInfo.count = res.count.count;
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
}

//reply
const isShowReply = ref(false);
const isShowReplyList = ref(false);
const reply_content = ref("");
const commentId = ref(0);
const isSubmit = ref(false);
function submitReply(id) {
  commentId.value = id;
  isShowReply.value = true;
}
const showReplyList = () => {
  isShowReplyList.value = !isShowReplyList.value;
};

async function adminReply_submit(id) {
  try {
    isLoading.value = true;
    const options = {
      comment_id: id,
      user_id: admin_id.value,
      blog_id: route.query.id,
      user_name: admin_name.value,
      content: reply_content.value,
      avatar: admin_avatar.value,
    };
    const res = await AuthLogin.adminCommentReply(options);

    if (res.code === 200) {
      msg.success(res.msg);
      isSubmit.value = true;
      reply_content.value = "";
      isLoading.value = false;
    }
    if (res.code === 500) {
      isLoading.value = false;
      msg.error("發表回復失敗");
    }
  } catch (error) {
    console.error(error);
  }
}
async function userReply_submit(id) {
  try {
    isLoading.value = true;
    const options = {
      comment_id: id,
      user_id: user_id.value,
      blog_id: route.query.id,
      user_name: user_name.value,
      content: reply_content.value,
      avatar: header_img.value,
    };
    const res = await authUserLogin.userCommentReply(options);
    if (res.code === 200) {
      msg.success(res.msg);
      isSubmit.value = true;
      reply_content.value = "";
      isLoading.value = false;
    }
    if (res.code === 500) {
      isLoading.value = false;
      msg.error("發表回復失敗");
    }
  } catch (error) {
    console.error(error);
  }
}

watchEffect(() => {
  //響應發送

  checkUserLogin();
  checkAdminLogin();
  loadUserComment();
  loadListData();
  getAdminData();
  getUserData();
});
</script>

<style lang="scss" scoped>
.container {
  width: auto;
  height: auto;
  div {
    .n-pagination,
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .n-list {
      display: flex;
      flex-direction: column;

      .n-list-item {
        background: white;
        display: flex;
        align-items: flex-start;
      }
    }

    .n-input {
      width: 50vw;
    }

    .reply_list {
      .n-input {
        width: 15vw;
        margin: 0 5px;
      }
    }
    .reply {
      display: flex;
      .n-input {
        width: 30vw;
        margin: 0 3px;
      }
    }
  }
}
</style>
