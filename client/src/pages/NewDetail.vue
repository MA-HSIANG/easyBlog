PrimaryButton
<template>
  <Layout :hot_open="false" :closeFixed="true">
    <template #nav>
      <NavBar :open="false" @handleLogOut="handleLogOut" />
    </template>

    <template #article>
      <h1 class="article-title">
        {{ data.title }}
      </h1>
      <div class="article-postUser">
        <Tag :categoryName="data.category_name"></Tag>
        <PostUserBar
          :user_name="data.name"
          :createTime="data.create_time"
          :avatar="data.avatar"
        />
      </div>
      <div class="article--cover-container">
        <img :src="data.cover_image" alt="文章封面" v-if="data.cover_image" />
        <img src="../assets/public/other/header/01.jpg" alt="默認圖" v-else />
      </div>
      <div class="article--main-container">
        <div class="article-content">
          <v-md-preview-html
            :html="html"
            preview-class="vuepress-markdown-body"
          ></v-md-preview-html>
        </div>
      </div>
      <div class="toolsContainer">
        <ToolsBar :blogId="blog_id" :show="false" />
      </div>
      <div class="action-container">
        <div class="action--comment">{{ comments_reply_count }} comment</div>

        <div class="action--comment-border">
          <div class="comment-zero" v-if="commentDatas.length === 0">
            成為這篇文章的第一名吧!
          </div>
          <div
            v-else
            class="action---comment-content"
            v-for="(data, index) in commentDatas"
            :key="data.id"
          >
            <div class="avatar-container">
              <img :src="data.avatar" alt="" />
            </div>

            <div class="user--comment-container">
              <h4>{{ data.user_name }}</h4>
              <div>{{ data.create_time }}</div>
              <p>{{ data.content }}</p>
              <span class="user--reply">回復</span>
              <!--2級回復-->
              <Reply
                :blog_id="route.params.id"
                :parent_comment_id="data.id"
                :parent_comment_user_id="data.user_id"
                :subReply="subReply"
                @handelUpdateReply="handelUpdateReply"
              />

              <div class="reply--container" v-if="isLoggedIn">
                <input
                  v-model="reply_content[index]"
                  type="text"
                  :placeholder="'請回復' + data.user_name + '的文章'"
                />

                <PrimaryButton @click="writeReply(data.id, data.user_id)">
                  <template #name> 送出 </template>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        <div class="paginator-container" v-if="commentDatas.length !== 0">
          <n-pagination
            size="small"
            v-model:page="pageInfo.page"
            :page-count="pageInfo.pageCount"
            @click="loadCommentsData"
          />
        </div>
      </div>

      <div class="subComment-container" v-if="isLoggedIn">
        <div class="subComment-avatar">
          <img :src="userData.avatar" alt="評論頭貼" />
        </div>

        <div class="subComment-input">
          <textarea
            rows="60"
            cols="50"
            placeholder="說點什麼吧~"
            v-model="comment_content"
            @keydown="writeComment"
          ></textarea>
          <div class="mobile--commemnt-submit" @click="writeComment">
            <n-icon><Send /></n-icon>
          </div>
        </div>
      </div>
      <div class="subComment-container" v-if="!isLoggedIn">
        <div class="subComment-zero">
          <span>點</span>
          <RouterLink to="/resgist" class="link">我</RouterLink>
          <span>&larr;登錄開始評論吧!!</span>
        </div>
      </div>
    </template>
    <template #new_blog>
      <h2 class="article--new-title">最新文章</h2>
      <ul class="new--content-container">
        <li
          class="new--list-content"
          v-for="newBlog in newBlogData"
          :key="newBlog.id"
        >
          <div class="content-container">
            <div class="content--img-container">
              <img :src="newBlog.coverImage" alt="" />
            </div>
            <div class="content-main">
              <h1 @click="toPage(newBlog.id)">{{ newBlog.title }}</h1>
              <div>{{ newBlog.create_time }}</div>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </Layout>
</template>

<script setup>
import { onMounted, reactive, ref, inject, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import VueMarkdownEditor, { xss } from "@kangc/v-md-editor";
import { Send } from "@vicons/ionicons5";
import Layout from "../components/home/Layout.vue";
import Comments from "../Oldcomponents/Comments.vue";
import PrimaryButton from "../components/common/PrimaryButton.vue";
import Tag from "../components/home/categoryTag.vue";

const router = useRouter();
const route = useRoute();
const message = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");

const onReload = inject("onReload");
import PostUserBar from "../components/home/PostUserBar.vue";
import NavBar from "../components/home/NavBar.vue";
import ToolsBar from "../components/ToolsBar.vue";
import Reply from "../components/Reply.vue";
import { getBlog, getNew3Blog } from "../api/blogApi";
import { createArticleView } from "../api/blogViewApi";
import { transformTime } from "../utils/transformTime";
import {
  getBlogComments,
  getBlogReply,
  createComment,
  createReply,
} from "../api/commentsApi";
import { removeToken } from "../utils/verify";

const blog_id = Number(route.params.id);
//觀看數去確認更新
const isUpdatedViewCount = ref(false);
//轉換markdown格式
const html = ref("");
const data = reactive({
  title: "",
  avatar: "",
  cover_image: "",
  content: "",
  name: "",
  create_time: "",
  category_name: "",
});

//登陸了沒
const isLoggedIn = ref(false);
//渲染評論內容
const commentDatas = ref([]);
//發送評論
const comment_content = ref("");
//登錄資料
const userData = ref({});
//最新文章
const newBlogData = ref([]);
//發送回復
const reply_content = ref([]);
const subReply = ref(false);
//評論+回復總數
const comments_reply_count = ref(0);
//驗證登入
const verifyLogin = async () => {
  try {
    if (route.meta.userData) {
      isLoggedIn.value = true;
      const data = await route.meta.userData;
      userData.value = data.user;
    } else {
      isLoggedIn.value = false;
      removeToken();
    }
  } catch (error) {}
};

//文章
const loadArticleData = async () => {
  try {
    const res = await getBlog(blog_id);
    const detailData = res.data.user.data[0];

    //資料
    data.create_time = transformTime(detailData.create_time);
    data.title = detailData.title;
    data.avatar = detailData.avatar;
    data.cover_image = detailData.coverImage;
    data.content = detailData.content;
    data.name = detailData.name;
    data.category_name = detailData.category_name;
    //頁頭
    document.title = data.title;
    //增加白名單
    html.value = xss.process(
      VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(
        data.content
      )
    );
  } catch (error) {
    console.error(error);
  }
};
//登出刷新
const handleLogout = (value) => {
  if (value) {
    location.reload();
  }
};
//增加觀看
const habdleArticleViewCount = async () => {
  try {
    const res = await createArticleView(blog_id);
    if (res.data.data.status) {
      isUpdatedViewCount.value = true;
    }
  } catch (error) {
    if (error.response.status === 500) {
      msg.error("資料庫出現問題...請聯繫管理人員或重新訪問...");
    }
  }
};
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
//----評論-----//
//獲取comments
const loadCommentsData = async () => {
  try {
    const res = await getBlogComments(blog_id, pageInfo);

    if (res.data.data.status === "success") {
      const commentData = res.data.data.data;

      for (const comment of commentData) {
        comment.create_time = transformTime(comment.create_time);
      }
      commentDatas.value = commentData;

      //分頁
      pageInfo.count = res.data.count.length;
      pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
      //獲取評論跟回復總數
      comments_reply_count.value = res.data.counts;
    }
  } catch (error) {
    console.error(error);
  }
};

//發表評論(一級)
const writeComment = async (e) => {
  try {
    if (e.key === "Enter" || e.button === 0) {
      if (comment_content.value === "") {
        message.error("評論內容不能為空!!");
        return;
      }
      const res = await createComment(blog_id, comment_content.value);
      if (res.data.data.status === "success") {
        message.success(res.data.data.msg);
        comment_content.value = "";
        loadCommentsData();
      }
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
//發表評論(二級)
const writeReply = async (parent_comment_id, parent_comment_user_id) => {
  try {
    if (reply_content.value === "") {
      message.error("評論內容不能為空!!");
      return;
    }

    const res = await createReply(
      blog_id,
      parent_comment_id,
      parent_comment_user_id,
      reply_content.value
    );

    if (res.data.data.status === "success") {
      message.success(res.data.data.msg);
      reply_content.value.length = 0;
      subReply.value = true;
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
//回傳reply刷新完畢
const handelUpdateReply = (value) => {
  if (value) {
    subReply.value = false;
  }
};
const newBlog = async () => {
  try {
    const res = await getNew3Blog();
    if (res.data.data.status === "success") {
      const lists = res.data.data.lists;
      for (const list of lists) {
        list.create_time = transformTime(list.create_time);
      }
      newBlogData.value = lists;
    }
  } catch (error) {
    console.error(error);
  }
};
//logout
const handleLogOut = (value) => {
  if (!value) {
    isLoggedIn.value = false;
  }
};
//跳轉
const toPage = (id) => {
  router.push(`/detail/${id}`);

  onReload();
};

onMounted(() => {
  loadArticleData();
  habdleArticleViewCount();
  loadCommentsData();
  verifyLogin();
  newBlog();
});
</script>

<style lang="scss" scoped>
@import "../common/style/detailRwd.scss";
@import "../common/style/color.scss";

.left-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  .article-title {
    font-size: 3.6rem;
    letter-spacing: 1.5px;
    font-weight: 500;
    color: $font-black;
  }
  .article-postUser {
    font-size: 1.5rem;
    color: $font-gray;
    letter-spacing: 1.1px;
  }
  .article--cover-container {
    margin-bottom: 5rem;
    max-width: 80rem;
    img {
      width: 100%;
      border-radius: 6px;
    }
  }
  .article--main-container {
    font-size: 2rem;
    line-height: 4.5rem;
    letter-spacing: 0.75px;
    max-width: 80rem;

    .article-content {
      width: 100%;
      word-wrap: break-word;
    }
  }

  .action-container {
    margin-bottom: 5rem;
    padding: 2rem 0.75rem;

    .action--comment {
      font-size: 1.8rem;
      color: $font-gray;
      border-bottom: 2px solid $primary-color;
      margin-bottom: 2rem;
    }
    .action--comment-border {
      border: 3px dashed $primary-light;
      font-size: 1.6rem;
      letter-spacing: 0.5px;
      line-height: 3rem;

      .comment-zero {
        padding: 5rem 0;
        text-align: center;
        color: $font-gray;
        font-size: 1.8rem;
      }
      .action---comment-content {
        display: flex;

        padding: 2rem 1rem;
        gap: 1rem;

        .avatar-container {
          width: 10rem;
          height: 10rem;
          border-radius: 50%;
          background-color: #fff;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .user--comment-container {
          width: 80%;
          word-wrap: break-word;

          h4 {
            font-size: 2.5rem;
            font-weight: 500;
          }
          div {
            font-size: 1.6rem;
            color: $font-gray;
          }
          p {
            color: $font-black-gray;
          }

          .user--reply {
            font-size: 1.4rem;
            background-color: $reply-bgc;
            color: $reply-text;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            cursor: pointer;
          }
          .reply--container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            border-top: 1px solid $reply-bgc;

            input {
              display: inline-block;
              margin-top: 1rem;
              width: 80%;
              border-radius: 2px;
              border: 1px solid black;
              padding: 1rem 0.75rem;
              caret-color: $fouce-color;
              padding-left: 2rem;
            }
          }
        }
      }
    }

    .paginator-container {
      margin-top: 2rem;
    }
  }
  .subComment-container {
    display: flex;
    gap: 1rem;
    padding: 2rem 1rem;
    border: 3px dashed $primary-light;
    height: 17rem;

    .subComment-zero {
      display: flex;
      align-items: center;
      margin: 0 auto;
      font-size: 1.8rem;
      color: $font-gray;
    }
    .subComment-avatar {
      width: 12rem;
      border-radius: 50%;
      background-color: #fff;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .subComment-input {
      textarea {
        border: 1px solid $font-gray;
        border-radius: 8px;
        padding: 0.75rem 0.5rem;
        width: 75%;
        height: 5rem;
        transition: all 0.3s ease-in;
        font-size: 1.6rem;
        letter-spacing: 1.2px;
        overflow: hidden;
        &::placeholder {
          font-size: 1.4rem;
          color: $font-gray;
        }
        &:hover,
        &:active {
          height: 12rem;
        }
      }
    }
  }
}

.right-content {
  display: flex;
  flex-direction: column;

  .article--new-title {
    padding: 2rem 0;
    font-size: 2.5rem;
    font-weight: 600;
    color: $font-black;
  }
}
.article--list-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  .content-container {
    display: grid;
    grid-template-columns: 45rem 1fr;
    column-gap: 1.2rem;

    .article--img-container {
      overflow: hidden;
      img {
        width: 100%;
        transition: all 0.3s;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .content-main {
      display: flex;
      flex-direction: column;

      h1 {
        font-size: 2.5rem;
        letter-spacing: 1.2px;
        color: $font-black;
      }
      p {
        font-size: 1.4rem;
        letter-spacing: 1px;
        color: $font-gray;
        margin-bottom: 1.5rem;
      }
    }
  }
}
.article--new-title {
  padding: 2rem 0;
  font-size: 2.5rem;
  font-weight: 600;
  color: $font-black;
}

.new--list-content {
  padding: 1rem 1.5rem;
  border-radius: 6px;
  background-color: $primary-white;
  color: $font-gray;

  .content-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1.2rem;

    .content--img-container {
      overflow: hidden;
      border-radius: 6px;
      max-width: 45rem;
      min-width: 10rem;

      img {
        width: 100%;
        height: 100%;
        transition: all 0.3s;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .content-main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      h1 {
        cursor: pointer;
        font-size: 1.6rem;
        letter-spacing: 1.1px;
        padding-top: 1.5rem;
        transition: color 0.3s;
        max-width: 15rem;
        word-wrap: break-word;
        &:hover {
          color: $primary-color;
        }
      }
      div {
        font-size: 1.2rem;
        letter-spacing: 1.1px;
      }
    }
  }
}
</style>
