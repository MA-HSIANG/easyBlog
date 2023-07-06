<template>
  <div class="reply_list" v-for="reply in replyLists" :key="reply.id">
    <n-list :show-divider="false">
      <n-list-item>
        <template #prefix>
          <n-avatar round :size="25" :src="reply.avatar" />
        </template>

        <n-thing
          content-indented
          content-style="font-size:14px"
          description-style="font-size:10px;font-weight:200"
        >
          <template #header>{{ reply.user_name }}</template>
          <template #description> {{ reply.create_time }}</template>
          <template #default>{{ reply.content }}</template>
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
  <n-pagination
    v-model:page="pageInfo.page"
    :page-count="pageInfo.pageCount"
    @click="loadReply"
    simple
  />
</template>

<script setup>
import {
  defineComponent,
  defineEmits,
  onMounted,
  reactive,
  ref,
  inject,
  computed,
  watch,
  watchEffect,
  nextTick,
  provide,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  NInput,
  NList,
  NListItem,
  NThing,
  NPagination,
  NAvatar,
  NIcon,
} from "naive-ui";

import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";

import { useAuthUserLogin } from "../store/user/authUser";
import { ThumbsUpOutline, ThumbsUpSharp } from "@vicons/ionicons5";
import { Connector16Filled, ControlButton20Filled } from "@vicons/fluent";
const $axios = inject("$axios");
const AuthLogin = useAuthLogin();
const useCategory = useAuthCategory();
const AuthArticle = useAuthArticle();
const authUserLogin = useAuthUserLogin();
const router = useRouter();
const route = useRoute();
const msg = inject("message");
const emits = defineEmits(["update:isSubmit"]);
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

const props = defineProps({
  comment_id: {
    type: Number,
    default: 0,
  },
  isSubmit: {
    type: Boolean,
    default: false,
  },
});
const isSubmit = ref(false);

const replyLists = ref([]);
async function loadReply() {
  try {
    const res = await AuthArticle.allReplyData(props.comment_id, pageInfo);
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
    replyLists.value = listRes;
    //分頁
    pageInfo.count = res.count.count;
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    if (isSubmit) {
      isSubmit.value = false;
      emits("update:isSubmit", isSubmit.value);
    }
  } catch (error) {
    console.error(error);
  }
}

watchEffect(() => {
  loadReply();
  isSubmit.value = props.isSubmit;
});
</script>

<style lang="scss" scoped>
.reply_list {
  .n-input {
    width: 15vw;
    margin: 0 5px;
  }
}
</style>
