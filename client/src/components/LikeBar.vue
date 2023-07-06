<template>
  <div>
    <n-space>
      <n-button circle @click="toggleLike">
        <template #icon>
          <div>
            <n-icon v-show="!isLiked"><ThumbsUpOutline /></n-icon>
            <span v-show="!isLiked">{{ likeCount }}</span>
          </div>

          <div>
            <n-icon v-show="isLiked"><ThumbsUpSharp /></n-icon>
            <span v-show="isLiked">{{ likeCount }}</span>
          </div>
        </template>
      </n-button>

      <div>
        <n-icon size="30"><Comment16Regular /></n-icon>
        <span>{{
          !props.updateCommentCount ? commentCount : props.updateCommentCount
        }}</span>
      </div>
      <div>
        <n-icon size="30"><EyeOutline /></n-icon>
        <span>{{ props.watchCount || watchCount }}</span>
      </div>
    </n-space>
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
import { NSpace, NIcon } from "naive-ui";

import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";
import { useAuthUserLogin } from "../store/user/authUser";
import { ThumbsUpOutline, ThumbsUpSharp, EyeOutline } from "@vicons/ionicons5";
import { Comment16Regular } from "@vicons/fluent";

const $axios = inject("$axios");
const AuthLogin = useAuthLogin();
const useCategory = useAuthCategory();
const AuthArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const router = useRouter();
const route = useRoute();
const msg = inject("message");

defineComponent({
  ThumbsUpOutline,
  ThumbsUpSharp,
});
//獲得部落格id
const props = defineProps({
  counts: {
    type: Number,
    defautl: 0,
  },
  watchCount: {
    type: Number,
    default: 0,
  },
  //emits及時更新評論
  updateCommentCount: {
    type: Number,
    default: 0,
  },
});

//使用者id
const userJson = authUserLogin.getUser();
const user_id = userJson.id;
const user_name = userJson.account;

//user驗證
const isUserLogined = ref(false);
const userToken = authUserLogin.getToken();
async function checkUserLogin() {
  const res = await authUserLogin.isLoginIn(userToken);
  if (res.code === 200) {
    isUserLogined.value = true;
  }
}

//點讚
const isLiked = ref(false);
const likeCount = ref(0);
const likeOptions = reactive({
  blog_id: route.query.id || props.counts,
  user_id: user_id,
  likeStatus: likeCount,
});
async function allLikeCount() {
  const count = await authUserLogin.allLikeCount(likeOptions);
  likeCount.value = count.count;
}
async function loadLikeStatus() {
  const res = await authUserLogin.likeStatus(likeOptions);

  isLiked.value = res;

  allLikeCount();
}
async function toggleLike() {
  // isLiked.value = !isLiked.value;
  // isLiked.value ? (likeCount.value += 1) : (likeCount.value -= 1);
  const res = await authUserLogin.clickLike(likeOptions);
  //點或取消讚
  const count = await authUserLogin.allLikeCount(likeOptions);

  if (res.code === 200) {
    likeCount.value = count.count;
  } else if (res.code === 403) {
    msg.error(res.msg);
    likeCount.value = count.count;
  }
  loadLikeStatus();
}

//評論頁參數
const pageInfo = reactive({
  page: 0,
  pageSize: 0,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
  //blog
  blog_id: route.query.id || props.counts,
});

//文章頻論總數
const commentCount = ref(0);
async function loadCommentCount() {
  const res = await AuthArticle.allCommentData(pageInfo);
  commentCount.value = res.count.count;
}
//文章觀看數
const watchCount = ref(0);
async function loadWatchCount() {
  watchCount.value = await AuthArticle.allWatchData(likeOptions);
}

watchEffect(() => {
  loadLikeStatus();
  allLikeCount();
  loadWatchCount();
});
onMounted(() => {
  loadCommentCount();
});
</script>

<style lang="scss" scoped>
div {
  span {
    font-size: 16px;
    font-weight: 550;
  }
}
</style>
