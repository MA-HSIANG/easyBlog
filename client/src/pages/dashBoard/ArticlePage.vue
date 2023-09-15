<template>
  <div class="dashBoard-container">
    <loading class="loadingBar" v-if="isLoading">資料加載中...</loading>
    <n-tabs
      v-else
      v-model:value="defaultList"
      justify-content="start"
      type="line"
      :pagination="pageInfo"
      :default-value="defaultList"
      :animated="true"
      display-directive="show-lazy"
    >
      <n-tab-pane name="list" tab="列表">
        <div class="tab-container">
          <n-data-table
            scroll-x="1300"
            :columns="columns"
            :data="data"
            :bordered="false"
          />
        </div>

        <div class="paginator-container">
          <n-pagination
            v-model:page="pageInfo.page"
            :page-count="pageInfo.pageCount"
            @click="loadArticleData"
          />
        </div>
      </n-tab-pane>

      <n-tab-pane name="add" tab="添加">
        <div class="form-container">
          <n-form v-if="!isLoading">
            <n-form-item label="封面" path="uploadValue">
              <div class="upload_container">
                <upload
                  v-model:imgFile="imgFile"
                  v-model:previewShow="previewShow"
                ></upload>
              </div>
            </n-form-item>
            <n-form-item label="標題">
              <n-input
                v-model:value="addArticle.title"
                placeholder="請輸入標題..."
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item label="描述">
              <n-input
                v-model:value="addArticle.description"
                placeholder="請輸入描述..."
                maxlength="50"
                show-count
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item label="分類">
              <n-select
                v-model:value="addArticle.category_name"
                :options="categoryLists"
              />
            </n-form-item>

            <n-form-item label="內容" class="form--content-container">
              <markdown-editor v-model="addArticle.content"></markdown-editor>
            </n-form-item>

            <n-form-item label="">
              <PrimaryButton
                @click="checkAdd"
                :disabled="!imgFile"
              ></PrimaryButton>
            </n-form-item>
          </n-form>
        </div>
      </n-tab-pane>

      <n-tab-pane name="update" tab="更新" v-if="isUpdate">
        <div class="form-container">
          <n-form v-if="!isLoading">
            <n-form-item label="封面" path="uploadValue">
              <div class="upload_container">
                <upload
                  v-model:imgFile="imgFile"
                  v-model:oldFile="oldFile"
                  v-model:previewShow="previewShow"
                ></upload>
              </div>
            </n-form-item>
            <n-form-item label="標題">
              <n-input
                v-model:value="oldArticle.title"
                placeholder="請輸入標題..."
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item label="描述">
              <n-input
                v-model:value="oldArticle.description"
                placeholder="請輸入描述..."
                maxlength="50"
                show-count
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item label="分類">
              <n-select
                v-model:value="oldArticle.category_name"
                :options="categoryLists"
              />
            </n-form-item>

            <n-form-item label="內容">
              <markdown-editor v-model="oldArticle.content"></markdown-editor>
            </n-form-item>
            <n-form-item label="">
              <SecondButton v-if="isUpdate" @click="checkUpdate" />
              <PrimaryButton v-else @click="checkAdd" />
            </n-form-item>
          </n-form>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  inject,
  h,
  watchEffect,
  nextTick,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import { CloudUploadOutline } from "@vicons/ionicons5";
import columnData from "../../data/article/columns.json";
import MarkdownEditor from "../../components/MarkdownEditor.vue";
import Upload from "../../components/Upload.vue";
import loading from "../../components/common/Loading.vue";
import PrimaryButton from "../../components/common/PrimaryButton.vue";
import SecondButton from "../../components/common/SecondButton.vue";
import ImportButton from "../../components/common/ImportButton.vue";
import { removeToken } from "../../utils/verify";
const router = useRouter();
const message = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const valueHtml = ref("");
const isLoading = ref(false);
const isSubmit = ref(false);
//更新
const isUpdate = ref(false);
//圖片
const imgFile = ref(null);
const oldFile = ref(null);
const previewShow = ref(false);

import { getAllCategorys } from "../../api/categoryApi";
import {
  uploadCover,
  updateBlog,
  createBlog,
  getAllBlogs,
  getBlog,
  deleteBlog,
} from "../../api/blogApi";
import { transformTime } from "../../utils/transformTime";

const onReload = inject("onReload");
//文章列表
const columns_header = reactive(columnData.headers);
const columns = reactive([
  ...columns_header,
  {
    title: "功能",
    key: "actions",
    render(row) {
      return [
        h(
          SecondButton,
          {
            strong: true, //加粗
            tertiary: false, //三級按鈕
            size: "small",
            onClick: () => updateArticle(row), //事件
          },
          { default: () => "修改" }
        ),

        h(
          ImportButton,
          {
            style: {
              margin: "5px",
            },
            strong: true, //加粗
            tertiary: false, //三級按鈕
            size: "small",
            onClick: () => delArticle(row), //事件
          },
          { default: () => "刪除" }
        ),
      ];
    },
  },
]);

//默認切換到列表
const defaultList = ref("list");
//文章內容
const data = ref([]);
//分類select
const categoryLists = ref([{ label: "test", value: "test" }]);
//新增文章
const addArticle = reactive({
  cover_image: "",
  category_name: "",
  title: "",
  description: "",
  content: "",
});
//載入並更新文章
const oldArticle = reactive({
  id: 0,
  cover_image: "",
  title: "",
  description: "",
  content: "",
});

//分頁初始值
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
  //關鍵字
  keyword: "",
  //分類
  category_name: "",
});

const checkAdd = async () => {
  try {
    //添加圖片
    if (imgFile) {
      const formData = new FormData();
      formData.append("files", imgFile.value);
      const img = await uploadCover(formData);

      addArticle.cover_image = img.data.data.url;
    }
    isLoading.value = true;
    const res = await createBlog(addArticle);
    if (res.data.data.status === "success") {
      message.success(res.data.data.msg);
      //清空
      addArticle.category_id = 0;
      addArticle.title = "";
      addArticle.description = "";
      addArticle.cover_image = "";
      addArticle.content = "";
      //清除預覽圖片和提交狀態
      imgFile.value = null;
      previewShow.value = false;
      //跳轉
      defaultList.value = "list";
      //渲染文章
      loadArticleData();
      isLoading.value = false;
    }
  } catch (error) {
    if (error.response.status === 403) {
      message.error(error.response.data.msg);
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

//載入文章
const loadArticleData = async () => {
  try {
    isLoading.value = true;
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
      }
      isLoading.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};
//載入舊文章
const updateArticle = async (row) => {
  try {
    isLoading.value = true;
    isUpdate.value = true;
    const id = row.id;
    const res = await getBlog(id);

    if (res.data.user.status === "success") {
      oldFile.value = res.data.user.data[0].coverImage;
      oldArticle.category_name = res.data.user.data[0].category_name;
      oldArticle.id = res.data.user.data[0].id;
      oldArticle.title = res.data.user.data[0].title;
      oldArticle.description = res.data.user.data[0].description;
      oldArticle.content = res.data.user.data[0].content;
      oldArticle.cover_image = res.data.user.data[0].coverImage;
    }
    isLoading.value = false;
    defaultList.value = "update";
  } catch (error) {
    console.error(error);
  }
};

//更新文章
const checkUpdate = async () => {
  try {
    //添加圖片
    if (typeof oldFile.value === "object") {
      const formData = new FormData();
      formData.append("file", oldFile.value);
      const img = await uploadCover(formData);
      oldArticle.cover_image = img.data.data.url;
    }
    isLoading.value = true;
    const res = await updateBlog(oldArticle.id, oldArticle);
    if (res.data.data.status === "success") {
      message.success(res.data.data.msg);
      oldArticle.category_id = 0;
      oldArticle.title = "";
      oldArticle.description = "";
      oldArticle.content = "";
      oldArticle.id = 0;
      oldArticle.cover_image = "";
      //清除預覽圖
      previewShow.value = false;
      isUpdate.value = false;
      defaultList.value = "list";
      //渲染文章
      loadArticleData();
    }
    isLoading.value = false;
  } catch (error) {
    if (error.response.status === 403) {
      message.error(error.response.data.msg);
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

//刪除文章
async function delArticle(row) {
  const id = row.id;

  dialog.success({
    title: "是否刪除",
    content: "是否刪除文章列表？",
    positiveText: "確定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: async () => {
      try {
        const res = await deleteBlog(id);
        if (res.status === 204) {
          message.success("刪除成功!");
          onReload();
          router.replace("/dashBoard/article");
        }
      } catch (error) {
        console.error(error);
      }
    },
    onNegativeClick: () => {
      message.success("取消成功");
    },
    onClose: () => {
      message.success("取消成功");
    },
    onEsc: () => {
      message.success("取消成功");
    },
  });
}

//載入分類列表
const loadCategoryData = async () => {
  const res = await getAllCategorys(pageInfo);
  console.log(res);
  //categoty select 轉換成符合組件的資料類別
  categoryLists.value = res.data.results.map((item) => {
    return {
      label: item.name,
      value: item.name,
    };
  });
};

onMounted(() => {
  loadCategoryData();
  // //渲染文章
  loadArticleData();
});
</script>

<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/dashBoardRwd.scss";

.dashBoard-container {
  max-width: 130rem;
  .form-container {
    width: 100rem;

    .n-form {
      width: 100%;
    }
  }

  .tab-container {
    width: 120rem;
    .n-data-table {
      font-size: 1.6rem;
    }
  }
  .paginator-container {
    margin-top: 1rem;
  }
}
</style>
