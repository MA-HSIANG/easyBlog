<template>
  <div class="container">
    <div class="loading">
      <loading v-if="isLoading">資料送出中...</loading>
    </div>
    <div v-show="commentDatas.length === 0">
      <h1>目前沒有任何評論...</h1>
    </div>
    <div v-if="!isLoading">
      <n-list v-for="data in commentDatas" :key="data.id">
        <n-divider />
        <n-list-item>
          <template #prefix>
            <n-avatar round :size="36" :src="data.avatar" />
          </template>

          <n-thing
            content-indented
            content-style="font-size:18px"
            description-style="font-size:12px;font-weight:200"
          >
            <template #header>
              {{ data.user_name }}
            </template>
            <template #description> {{ data.create_time }} </template>
            <template #default>
              {{ data.content }}
              <div>
                <n-button
                  text
                  tag="a"
                  type="tiny"
                  text-color="#999999"
                  @click="clickReply(data.id)"
                  v-if="isLoggedIn"
                  >回復</n-button
                >

                <n-button
                  text
                  tag="a"
                  type="tiny"
                  text-color="#999999"
                  @click="showReplyList"
                  v-if="!isLoggedIn"
                  >{{ !isShowReplyList ? "查看回復" : "收起" }}</n-button
                >
              </div>
            </template>

            <template #footer v-if="isUserLogined">
              <Reply :comment_id="data.id" v-model:isSubmit="isSubmit"></Reply>
            </template>
            <template #action>
              <div
                class="reply"
                v-if="isShowReplyList && comment_id === data.id"
              >
                <n-avatar round :size="36" :src="avatar" />
                <n-input
                  placeholder="請輸入回復"
                  maxlength="15"
                  show-count
                  v-model:value="reply_content"
                ></n-input>

                <n-button
                  v-if="isUserLogined"
                  @click="userReply_submit(data.id)"
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
      @click="loadCommentsData"
    />

    <n-divider />

    <div>
      <div class="write_comment" v-if="isLoggedIn">
        <n-input
          v-model:value="comment_content"
          type="textarea"
          placeholder="發表回復"
          maxlength="20"
          show-count
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </div>
      <div class="write_comment" v-if="!isLoggedIn">
        <n-input
          type="textarea"
          placeholder="請先登入....."
          disabled
          maxlength="20"
          show-count
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </div>
      <n-button @click="writeComment" v-if="isLoggedIn">送出</n-button>
    </div>
  </div>
</template>

<script setup>
// const emits = defineEmits(["updateCommentCount"]);
defineComponent({
  ThumbsUpOutline,
  ThumbsUpSharp,
});
////------------重構---------------////
import { getBlogComments, createComment } from "../api/commentsApi";
import { transformTime } from "../utils/transformTime";
import { removeToken } from "../utils/verify";

//登陸了沒
const isLoggedIn = ref(false);
//評論頁參數
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
});
//渲染評論內容
const commentDatas = ref([]);
//發送評論
const comment_content = ref("");

//回復
const comment_id = ref(0);
const isShowReplyList = ref(false);
const reply_content = ref("");
//----------------重構--------------------//

const props = defineProps({
  blogId: {
    type: Number,
    required: true,
  },
});
//---------------重構--------------------//
//--------------------------------------//

//驗證登入
const verifyLogin = async () => {
  try {
    if (route.meta.userData) {
      const data = await route.meta.userData;
      isLoggedIn.value = true;
      console.log(data);
    } else {
      removeToken();
      isLoggedIn.value = false;
    }
  } catch (error) {}
};
//獲取comments
const loadCommentsData = async () => {
  try {
    const res = await getBlogComments(props.blogId, pageInfo);
    if (res.data.data.status === "success") {
      const commentData = res.data.data.data;
      for (const comment of commentData) {
        comment.create_time = transformTime(comment.create_time);
      }
      commentDatas.value = commentData;

      //分頁
      pageInfo.count = res.data.count.length;
      pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    }
  } catch (error) {
    console.error(error);
  }
};
//-----reply
//顯示隱藏查看回復
const showReplyList = () => {
  isShowReplyList.value = !isShowReplyList.value;
};
//回復顯示隱藏下拉回複選向
const clickReply = (id) => {
  comment_id.value = id;
  isShowReplyList.value = true;
};

//發表評論
const writeComment = async () => {
  try {
    const res = await createComment(props.blogId, comment_content.value);

    if (res.data.data.status === "success") {
      msg.success(res.data.data.msg);

      comment_content.value = "";
      loadCommentsData();
    }
    // const updateCount = await AuthArticle.allCommentData(pageInfo);
    // emits("updateCommentCount", updateCount.count.count);
    // msg.success(res.msg);
    // commentData.content = "";
  } catch (error) {
    console.error(error);
    if (error.response.status === 403) {
      msg.error(error.response.data.msg);
      router.replace("/resgist");
    }
    if (error.response.data.msg === "jwt expired") {
      removeToken();
      msg.error("登錄逾時...");
    }
  }
};

//-------------------------------------///
// //user驗證
// const isUserLogined = ref(false);
// const userToken = authUserLogin.getToken();
// async function checkUserLogin() {
//   const res = await authUserLogin.isLoginIn(userToken);
//   if (res.code === 200) {
//     isUserLogined.value = true;
//   }
// }
// //admin驗證
// const isAdminLogined = ref(false);
// async function checkAdminLogin() {
//   AuthLogin.adminToken = AuthLogin.getToken();
//   const res = await AuthLogin.isLoginIn(AuthLogin.adminToken);

//   if (res.code === 200) {
//     isAdminLogined.value = true;
//   }
// }
// //取得admin資料
// const admin_name = ref("");
// const admin_avatar = ref("");
// const admin_id = ref(0);

// async function getAdminData() {
//   try {
//     const res = await AuthLogin.getAdminDate();
//     if (res.data.code) {
//       const adminDatas = res.data.results[0];
//       admin_name.value = adminDatas.account;
//       admin_avatar.value = adminDatas.avatar;
//       admin_id.value = adminDatas.id;
//     }
//   } catch (error) {}
// }

//轉換markdown格式
const html = ref("");
const listData = reactive({
  title: "",
  cover_image: "",
  content: "",
});

// async function loadListData() {
//   const id = route.query.id;
//   const res = await AuthArticle.oldArticleList(id);
//   listData.title = res[0].title;
//   listData.cover_image = res[0].coverImage;
//   listData.content = res[0].content;
// }
// //使用者資料

// const user_id = ref(0);
// const user_name = ref("");
// const header_img = ref("");
// async function getUserData() {
//   try {
//     const res = await authUserLogin.getUserData();
//     user_id.value = res.data.results.id;
//     user_name.value = res.data.results.account;
//     header_img.value = res.data.results.headerImg;
//   } catch (error) {}
// }

// //發送評論
// const commentData = reactive({
//   blog_id: route.query.id,
//   user_id: 0,
//   user_name: "",
//   content: "",
//   header_img: "",
// });

// //user發表評論
// async function writeComment() {
//   try {
//     isLoading.value = true;
//     commentData.user_id = user_id.value;
//     commentData.user_name = user_name.value;
//     commentData.header_img = header_img.value;
//     const res = await authUserLogin.userComment(commentData);

//     if (res.code === 200) {
//       const updateCount = await AuthArticle.allCommentData(pageInfo);
//       emits("updateCommentCount", updateCount.count.count);
//       msg.success(res.msg);
//       commentData.content = "";
//       loadUserComment();
//       isLoading.value = false;
//     }
//   } catch (error) {
//     msg.error("評論發表失敗");
//     console.error(error);
//     isLoading.value = false;
//   }
// }
// //admin發表評論
// async function writeAdminComment() {
//   try {
//     isLoading.value = true;
//     getAdminData();
//     commentData.user_id = admin_id.value;
//     commentData.user_name = admin_name.value;
//     commentData.header_img = admin_avatar.value;
//     const res = await AuthLogin.adminComment(commentData);
//     if (res.code === 200) {
//       const updateCount = await AuthArticle.allCommentData(pageInfo);
//       emits("updateCommentCount", updateCount.count.count);
//       msg.success(res.msg);
//       commentData.content = "";
//       loadUserComment();
//       isLoading.value = false;
//     }
//   } catch (error) {
//     console.error(error);
//     msg.error("評論發表失敗");
//     isLoading.value = false;
//   }
// }

// //渲染評論內容
// const commentLists = ref([]);
// async function loadUserComment() {
//   try {
//     const res = await AuthArticle.allCommentData(pageInfo);
//     const listRes = await res.data.results;

//     for (const list of listRes) {
//       let d = new Date(list.create_time);
//       const year = d.getFullYear();

//       const month = String(d.getMonth() + 1);
//       const day = String(d.getDate());

//       list.create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
//         2,
//         "0"
//       )}`;
//     }
//     if (res.data.code === 200) {
//       commentLists.value = listRes;
//     }

//     //分頁
//     pageInfo.count = res.count.count;
//     pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
//     isLoading.value = false;
//   } catch (error) {
//     console.error(error);
//     isLoading.value = false;
//   }
// }

//reply
// const isShowReply = ref(false);
// const isShowReplyList = ref(false);
// const reply_content = ref("");
// const commentId = ref(0);
// const isSubmit = ref(false);
// function submitReply(id) {
//   commentId.value = id;
//   isShowReply.value = true;
// }
// const showReplyList = () => {
//   isShowReplyList.value = !isShowReplyList.value;
// };

// async function userReply_submit(id) {
//   try {
//     isLoading.value = true;
//     const options = {
//       comment_id: id,
//       user_id: user_id.value,
//       blog_id: route.query.id,
//       user_name: user_name.value,
//       content: reply_content.value,
//       avatar: header_img.value,
//     };
//     const res = await authUserLogin.userCommentReply(options);
//     if (res.code === 200) {
//       msg.success(res.msg);
//       isSubmit.value = true;
//       reply_content.value = "";
//       isLoading.value = false;
//     }
//     if (res.code === 500) {
//       isLoading.value = false;
//       msg.error("發表回復失敗");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

onMounted(() => {
  loadCommentsData();
  verifyLogin();
  //響應發送
  // checkUserLogin();
  // checkAdminLogin();
  // loadUserComment();
  // loadListData();
  // getAdminData();
  // getUserData();
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
