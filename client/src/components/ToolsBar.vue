<template>
  <div class="container">
    <div class="btn-like" @click="toggleLike">
      <div v-if="isLiked" class="like--icon-container">
        <n-icon color="#0284c7"><ThumbsUpSharp /></n-icon>
        <span v-show="isLiked">{{ likeCount }}</span>
      </div>

      <div v-if="!isLiked" class="like--icon-container">
        <n-icon><ThumbsUpOutline /></n-icon>
        <span>{{ likeCount }}</span>
      </div>
    </div>

    <div class="viewContainer">
      <n-icon><EyeOutline /></n-icon>
      <span>{{ viewCount }}</span>
    </div>

    <div class="commentContainer" v-if="props.show">
      <n-icon><Comment16Regular /></n-icon>
      <span>{{ commentCount }}</span>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, inject, watchEffect, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ThumbsUpOutline, ThumbsUpSharp, EyeOutline } from "@vicons/ionicons5";
import { Comment16Regular } from "@vicons/fluent";

import { clickLike, userLikeStatus } from "../api/likeApi";
import { removeToken } from "../utils/verify";
import { getArticleData } from "../store/articleStore";

const router = useRouter();
const route = useRoute();
const message = inject("message");
//獲得部落格id
const props = defineProps({
  blogId: {
    type: Number,
    default: 0,
  },
  isUpdatedViewCount: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["handleLiked"]);
const onReload = inject("onReload");
//----點讚
const isLiked = ref(false);
const likeCount = ref(0);
//----觀看數
const viewCount = ref(0);
//----評論述
const commentCount = ref(0);
// const blog_id = Number(route.params.id);
// const blog_id = Number(props.blogId);
//點讚或沒點讚
const toggleLike = async () => {
  // isLiked.value = !isLiked.value;
  // isLiked.value ? (likeCount.value += 1) : (likeCount.value -= 1);
  try {
    const res = await clickLike(Number(props.blogId), isLiked.value);

    //更新icon
    if (res.data.result.status === "success") {
      likeCount.value = await getArticleData().handleBlogLikes(
        Number(props.blogId)
      );
      isLiked.value = await getArticleData().loadLikeStatus(
        Number(props.blogId)
      );
      emits("handleLiked", true);
    }
  } catch (error) {
    if (error.response.status === 419) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
    }
    if (error.response.status === 403) {
      message.error(error.response.data.msg);
    }
    if (error.response.status === 401) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
    }
  }
};

onMounted(async () => {
  //---pinia----//

  likeCount.value = await getArticleData().handleBlogLikes(
    Number(props.blogId)
  );
  viewCount.value = await getArticleData().handleBlogViews(
    Number(props.blogId)
  );
  commentCount.value = await getArticleData().handleBlogCommentCounts(
    Number(props.blogId)
  );
});
watchEffect(async () => {
  likeCount.value = await getArticleData().handleBlogLikes(
    Number(props.blogId)
  );
  isLiked.value = await getArticleData().loadLikeStatus(Number(props.blogId));
});
</script>

<style lang="scss" scoped>
@import "../common/style/main.scss";
@import "../common/style/color.scss";
.container {
  display: flex;
  gap: 2rem;
  padding-top: 1.2rem;
  border-top: 1px solid #999;
  color: $font-gray;
  font-size: 2.2rem;

  span {
    font-size: 1.6rem;
    padding-top: 2px;
    padding-left: 1.25px;
    font-weight: bold;
  }
  .btn-like {
    .like--icon-container {
      display: flex;
      gap: 1.5px;
      cursor: pointer;
      &:hover {
        font-size: 2.5rem;
      }
    }
  }
  .viewContainer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .commentContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.2rem;
  }
}
</style>
