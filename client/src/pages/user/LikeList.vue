<template>
  <loading class="loadingBar" v-if="isLoading">資料加載中...</loading>
  <div class="dashBoard-container" v-else>
    <div class="zero-container" v-if="likeData.length === 0">
      <n-empty></n-empty>
    </div>
    <n-grid cols="0:1 600:4" x-gap="8" y-gap="8" y-hap="4" v-else>
      <n-grid-item span="1" v-for="likeList in likeData" :key="likeList.id">
        <n-card size="large" hoverable>
          <template #cover>
            <img :src="likeList.coverImage" height="200" />
          </template>
          <div class="card--content-container">
            <h2 @click="toDetail(likeList.id)">{{ likeList.title }}</h2>
            <p>點讚時間:{{ likeList.create_time }}</p>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
    <div class="pagination-container">
      <n-pagination
        v-if="likeData.length > 0"
        v-model:page="pageInfo.page"
        :page-count="pageInfo.pageCount"
        @click="loadLikeBlogs"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const message = inject("message");
import { removeToken } from "../../utils/verify";
import { getLikeBlogDatas } from "../../api/userApi";
import { transformTime } from "../../utils/transformTime";
import loading from "../../components/common/Loading.vue";
const isLoading = ref(false);
//點讚文章列表
const likeData = ref([]);
//分頁參數
const pageInfo = reactive({
  page: 1,
  pageSize: 8,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
});
const loadLikeBlogs = async () => {
  try {
    isLoading.value = true;
    const res = await getLikeBlogDatas(pageInfo);
    console.log(res);
    if (res.status === 200) {
      res.data.like_blogs = res.data.like_blogs.map((like) => {
        like.create_time = transformTime(like.create_time);
        return like;
      });
      likeData.value = res.data.like_blogs;
      pageInfo.count = res.data.counts;
      pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    }
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    if (error.response.status === 403) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
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
const toDetail = (id) => {
  router.replace(`/detail/${id}`);
};

onMounted(() => {
  loadLikeBlogs();
});
</script>

<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/likeListRwd.scss";
.dashBoard-container {
  .zero-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .n-card {
    height: 100%;
    max-width: 100%;

    .card--content-container {
      display: flex;
      flex-direction: column;
      gap: 10rem;
      h2 {
        padding-top: 1rem;
        font-size: 2.2rem;
        letter-spacing: 1.1px;
        color: $font-black;
      }
      p {
        font-size: 1.5rem;
        font-weight: 300;
        letter-spacing: 1.1px;
        color: $font-gray;
      }
    }
  }
  .pagination-container {
    margin-top: 1rem;
  }
}
</style>
