<template>
  <div class="content">
    <div class="empty" v-if="likeData.length === 0">
      <n-empty size="large" description="沒有點讚的文章..."> </n-empty>
    </div>

    <div>
      <div class="card_content" v-for="likeList in likeData" v-if="!isLoading">
        <n-card
          :bordered="true"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <template #cover>
            <n-image height="200" :src="likeList.coverImage"></n-image>
          </template>
          <template #default>
            <h2>{{ likeList.title }}</h2>
            <h3>{{ likeList.description }}</h3>
          </template>
        </n-card>
      </div>
    </div>
    <n-pagination
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
      @click="loadLikeStatus"
    />
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
import { NPagination, NImage, NEmpty } from "naive-ui";
import { useAuthLogin } from "../../store/user/auth";
import { useAuthCategory } from "../../store/category/operate";
import { useAuthArticle } from "../../store/article/list";
import { useAuthUserLogin } from "../../store/user/authUser";
import VueMarkdownEditor, { xss } from "@kangc/v-md-editor";

const $axios = inject("$axios");
const AuthLogin = useAuthLogin();
const useCategory = useAuthCategory();
const AuthArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const router = useRouter();
const route = useRoute();
const msg = inject("message");

//點讚文章列表
const likeData = ref([]);

//使用者id
const userJson = authUserLogin.getUser();
const user_id = userJson.id;
const user_name = userJson.account;
const likeOptions = reactive({
  user_id,
});
//評論頁參數
const pageInfo = reactive({
  page: 1,
  pageSize: 8,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
  //blog
  blog_id: route.query.id,
});

async function loadLikeStatus() {
  try {
    const lists = await authUserLogin.userLikeList(likeOptions, pageInfo);
    const counts = await authUserLogin.likeListCounts(likeOptions);
    for (const list of lists) {
      if (list.content.length > 30) {
        list.content = list.content.slice(0, 30);
        list.content += "...";
      }

      //--------------markdown----------//////////////
      list.content = xss.process(
        VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(
          list.content
        )
      );
    }

    likeData.value = lists;

    //分頁
    pageInfo.count = counts;
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  loadLikeStatus();
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  .empty,
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
  div {
    display: flex;
    flex-wrap: wrap;
  }
  .card_content {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem;
  }
}
</style>
