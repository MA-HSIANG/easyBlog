<template>
  <div class="user--comment-reply" v-for="data in datas" v-if="datas">
    <div class="reply--avatar-container">
      <img :src="data.avatar" alt="" />
    </div>

    <div>
      <h4>{{ data.user_name }}</h4>
      <div>{{ data.create_time }}</div>
      <p>{{ data.content }}</p>

      <span class="user--reply">回復</span>
    </div>
  </div>
  <div class="paginator-container">
    <n-pagination
      size="small"
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
      @click="loadReplyData"
    >
      <template #prev> 上一頁 </template>
      <template #next> 下一頁 </template>
    </n-pagination>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { getBlogReply } from "../api/commentsApi";
import { transformTime } from "../utils/transformTime";
const datas = ref([]);

const props = defineProps({
  blog_id: {
    type: Number,
  },
  parent_comment_id: {
    type: Number,
  },
  parent_comment_user_id: {
    type: Number,
  },
  subReply: {
    type: Boolean,
  },
});
const emits = defineEmits("handelUpdateReply");
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageMove: 0,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
  //關鍵字
  keyword: "",
  //分類
  category_name: "",
});
const updateReply = ref(false);
//--獲取回復---//
const loadReplyData = async () => {
  try {
    const res = await getBlogReply(
      props.blog_id,
      props.parent_comment_id,
      props.parent_comment_user_id,
      pageInfo
    );
    if (res.data.data.status === "success") {
      const replyData = res.data.data.data;
      for (const reply of replyData) {
        reply.create_time = transformTime(reply.create_time);
      }
      datas.value = replyData;

      //分頁
      pageInfo.count = res.data.count.data.length;
      pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    }
  } catch (error) {
    console.error(error);
  }
};

watchEffect(() => {
  if (props.subReply) {
    loadReplyData();
    emits("handelUpdateReply", true);
  }
});
onMounted(() => {
  loadReplyData();
});
</script>

<style lang="scss" scoped>
@import "../common/style/detailRwd.scss";
@import "../common/style/color.scss";
.user--comment-reply {
  border-top: 1px solid $primary-light;
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  .reply--avatar-container {
    margin-top: 1rem;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background-color: #fff;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.user--reply {
  font-size: 1.4rem;
  background-color: $reply-bgc;
  color: $reply-text;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  cursor: pointer;
}
.paginator-container {
  display: flex;
  justify-content: end;
}
</style>
