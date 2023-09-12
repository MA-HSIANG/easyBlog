<template>
  <Layout>
    <template #nav>
      <NavBar
        @selectCategory_value="changeCategory_value"
        @keyword="searchKeyword"
        @handleLogOut="handleLogOut"
      />
    </template>
    <template #hot_blog>
      <div
        v-if="hotBlogData.length > 0"
        class="hot-content"
        v-for="hot in hotBlogData"
        :key="hot.id"
        :style="{
          'background-image':
            'linear-gradient(rgba(0, 0, 0, 0.1), rgba(34, 34, 34, 0.6)),url(' +
            hot.coverImage +
            ')',
        }"
      >
        <div class="hot-main">
          <h1 @click="toPage(hot.id)">{{ hot.title }}</h1>
          <span>{{ hot.name }}</span>
          <span>{{ hot.create_time }}</span>
          <div>
            <NIcon><ThumbsUpSharp /></NIcon>
            {{ hot.likes }}
          </div>
        </div>
      </div>

      <div
        v-else
        class="hot-content"
        v-for="(data, index) in 3"
        :key="index"
        :style="{
          'background-image':
            'linear-gradient(rgba(0, 0, 0, 0.1), rgba(34, 34, 34, 0.6)),url()',
        }"
      >
        <div class="hot-main">
          <h1>目前沒有文章</h1>
          <span>user</span>
          <span>1970/01/01</span>
          <div>
            <NIcon><ThumbsUpSharp /></NIcon>
            9999
          </div>
        </div>
      </div>
    </template>
    <template #article>
      <h1 ref="articleTitle" class="article--title">文章列表</h1>
      <h1 class="article-zero" v-if="data.length === 0">
        很抱歉😧...當前沒有文章...
      </h1>
      <ul class="article--list-container" v-else>
        <li v-for="d in data" :key="d.id" class="article--list-content">
          <div class="content-container">
            <div class="article--img-container">
              <img :src="d.coverImage" alt="" />
            </div>
            <div class="content-main">
              <Tag :categoryName="d.category_name"></Tag>
              <PostUserBar
                :user_name="d.name"
                :createTime="d.create_time"
                :avatar="d.avatar"
                :show="false"
              ></PostUserBar>
              <h1 @click="toPage(d.id)">
                {{ d.title }}
              </h1>
              <p>{{ d.description }}</p>
              <ToolsBar :blogId="d.id" @handleLiked="handleLiked" />
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template #new_blog>
      <h2 class="article--new-title">最新文章</h2>
      <ul class="new--content-container" v-if="newBlogData.length > 0">
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

      <ul class="new--content-container" v-else>
        <li class="new--list-content" v-for="(b, index) in 3" :key="index">
          <div class="content-container">
            <div class="content--img-container">
              <img src="../assets/public/other/header/01.jpg" alt="" />
            </div>
            <div class="content-main">
              <h1>目前沒有文章</h1>
              <div>1970/01/01</div>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template #paginator>
      <n-pagination
        v-show="data.length !== 0"
        v-model:page="pageInfo.page"
        :page-count="pageInfo.pageCount"
        @click="loadArticleData"
      />
    </template>
  </Layout>
</template>

<script setup>
import { onMounted, reactive, ref, inject, watchEffect } from "vue";
import { useRouter } from "vue-router";
import Layout from "../components/home/Layout.vue";
import { CaretBackOutline, ThumbsUpSharp } from "@vicons/ionicons5";
import Loading from "../components/common/Loading.vue";
import { getAllBlogs, getNew3Blog, getTop3Blog } from "../api/blogApi";
import { transformTime } from "../utils/transformTime";
import NavBar from "../components/home/NavBar.vue";
import PostUserBar from "../components/home/PostUserBar.vue";
import ToolsBar from "../components/ToolsBar.vue";
import Tag from "../components/home/categoryTag.vue";
const router = useRouter();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
const isLoading = ref(false);
const onReload = inject("onReload");

//載入文章
const data = ref([]);
const articleTitle = ref(null);
//最新文章
const newBlogData = ref([]);
//hot文章
const hotBlogData = ref([]);

//分頁初始值
const pageInfo = reactive({
  page: 1,
  pageSize: 6,
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
//scroll
const scrollSearchContent = () => {
  if (articleTitle.value) {
    window.scrollTo({
      top: articleTitle.value.offsetTop,
      behavior: "smooth",
    });
  }
};
//分類搜索
const changeCategory_value = (category_value) => {
  pageInfo.category_name = category_value;
  loadArticleData();
  scrollSearchContent();
};
//關鍵詞搜索
const searchKeyword = (keyword) => {
  pageInfo.keyword = keyword;
  loadArticleData();
  scrollSearchContent();
};
//載入文章
const loadArticleData = async () => {
  try {
    const res = await getAllBlogs(pageInfo);
    const article_lists = res.data.data.lists;

    if (res.data.data.status === "success") {
      for (const list of article_lists) {
        //內容溢出
        if (list.content.length >= 50) {
          list.content = list.content.slice(0, 50);
          list.content += "...";
        } else {
          list.content;
        }

        list.create_time = transformTime(list.create_time);
      }
      data.value = article_lists;

      //總部落格資料數(全)
      pageInfo.count = res.data.results;
      //搜尋過濾出的資料數
      pageInfo.pageMove = article_lists.length;
      //搜索判斷 (1.如果空的就顯示總資料數的分頁 2.如果是搜尋過的就顯示搜尋過後顯示的資料數)

      if (pageInfo.keyword === "") {
        pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
      } else {
        pageInfo.pageCount = Math.ceil(pageInfo.pageMove / pageInfo.pageSize);
        //搜尋完畢跳轉到第一頁
        pageInfo.page = 1;
      }
      //分類邏輯(1.如果有傳入分類則顯示分類資料數的分頁 2.如果分類數資料為空則分頁為初始)
      if (pageInfo.category_name !== "") {
        pageInfo.pageCount = Math.ceil(pageInfo.pageMove / pageInfo.pageSize);
        pageInfo.page = 1;
      } else if (pageInfo.pageMove.length === 0) {
        pageInfo.pageCount = 1;
      }
    }
  } catch (error) {
    console.error(error);
  }
};
//跳轉
const toPage = (id) => {
  router.push(`/detail/${id}`);
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
const hotBlog = async () => {
  try {
    const res = await getTop3Blog();

    if (res.data.blogs.status === "success") {
      const hot_blog = res.data.blogs.blogs;
      for (const blog of hot_blog) {
        blog.create_time = transformTime(blog.create_time);
      }
      hotBlogData.value = hot_blog;
    }
  } catch (error) {
    console.error(error);
  }
};

//like update
const handleLiked = async (value) => {
  if (value) {
    hotBlog();
  }
};
//nav logout
const handleLogOut = (value) => {
  if (!value) {
    window.location.reload();
  }
};
onMounted(() => {
  loadArticleData();
  newBlog();
  hotBlog();
});
</script>

<style lang="scss" scoped>
@import "../common/style/color.scss";
@import "../common/style/rwd.scss";
.hot-content {
  position: relative;
  overflow: hidden;
  background-size: cover;

  &:hover .hot-main {
    transform: translate(-50%, 0);
  }
  .hot-main {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 90%);
    transition: transform 0.3s ease-in;
    color: $font-light-gray;
    background-image: none;
    background-color: rgba(0, 0, 0, 0.2);
    width: 100%;

    h1 {
      cursor: pointer;
      font-size: 3.5rem;
      letter-spacing: 1.1px;
      padding: 0 1rem;
      transition: all 0.3s;
      &:hover {
        color: $primary-light;
      }
    }
    span {
      font-size: 1.6rem;
      letter-spacing: 1.6px;
      padding: 0 0.5rem;
      &::after {
        content: "";
        display: inline-block;
        width: 4px;
        height: 4px;
        background-color: $font-light-gray;
        transform: translate(50%, -50%);
      }
    }
    div {
      display: inline-block;
      font-size: 1.6rem;
      letter-spacing: 1.6px;
      padding: 0 0.5rem;
    }
  }
}

.article--title {
  padding: 2rem 0;
  font-size: 3rem;
  font-weight: 600;
  color: $font-black;
}
.article-zero {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.6rem;
  font-weight: 500;
  letter-spacing: 1.1px;
  color: $font-gray;
  height: 100%;
}
.article--list-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .content-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
    .article--img-container {
      overflow: hidden;
      border-radius: 6px;

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
      h1 {
        font-size: 2.5rem;
        letter-spacing: 1.2px;
        color: $font-black;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          color: $primary-color;
          font-size: 2.6rem;
          text-shadow: 0 12px 6px rgba(0, 0, 0, 0.3);
        }
      }
      p {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.8;
        letter-spacing: 1px;
        color: $font-black-gray;
        margin-bottom: 1.5rem;
      }
    }
  }
}
.article--new-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 0;
  font-size: 2.5rem;
  font-weight: 600;
  color: $font-black;

  &::after {
    content: "new";
    display: inlent-block;
    font-style: italic;
    border-radius: 2px;
    font-size: 1.25rem;
    font-weight: 350;
    color: $new-text;
    background-color: $new-title;
    padding: 0 0.25rem;
  }
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
