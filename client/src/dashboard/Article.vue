<template>
  <div class="content">
    <n-tabs v-model:value="defaultList" justify-content="start" type="line">
      <n-tab-pane name="list" tab="列表">
        <div>
          <n-data-table :columns="columns" :data="data" :bordered="false" />
        </div>

        <n-space>
          <div
            class="page"
            v-for="(pageNum, index) in pageInfo.pageCount"
            :key="index"
            @click="toPage(pageNum)"
            :class="activePage(pageNum)"
          >
            {{ pageNum }}
          </div>
        </n-space>
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加">
        <div class="loading" v-if="isLoading">
          <loading>加載中...</loading>
        </div>
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
              v-model:value="addArticle.category_id"
              :options="categoryLists"
            />
          </n-form-item>

          <n-form-item label="內容">
            <markdown-editor v-model="addArticle.content"></markdown-editor>
          </n-form-item>

          <n-form-item label="">
            <add-btn @click="checkAdd" :disabled="!imgFile"></add-btn>
          </n-form-item>
        </n-form>
      </n-tab-pane>

      <n-tab-pane name="updata" tab="更新" v-if="isUpdata">
        <div class="loading" v-if="isLoading">
          <loading>加載中...</loading>
        </div>
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
              v-model:value="oldArticle.category_id"
              :options="categoryLists"
            />
          </n-form-item>

          <n-form-item label="內容">
            <markdown-editor v-model="oldArticle.content"></markdown-editor>
          </n-form-item>
          <n-form-item label="">
            <n-button @click="isUpdata ? checkUpdata() : checkAdd()">{{
              isUpdata ? "更新" : "新增"
            }}</n-button>
          </n-form-item>
        </n-form>
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
} from "vue";
import { useRouter } from "vue-router";
import {
  NTable,
  NTabs,
  NTabPane,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NModal,
  NSelect,
  NDataTable,
} from "naive-ui";

import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";
import { useAxios } from "../common/useAxios";
import { CloudUploadOutline } from "@vicons/ionicons5";
import columnData from "../data/article/columns.json";
import MarkdownEditor from "../components/MarkdownEditor.vue";
import Upload from "../components/Upload.vue";
import Loading from "../components/common/Loading.vue";
import AddBtn from "../components/common/AddBtn.vue";
import DelBtn from "../components/common/DelBtn.vue";
const $axios = inject("$axios");
const AuthLogin = useAuthLogin();
const useCategory = useAuthCategory();
const AuthArticle = useAuthArticle();
const categoryLists = ref([]);
const router = useRouter();
const token = ref("");
const $axiosToken = useAxios(true, token);
const isLoading = ref(false);
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
const valueHtml = ref("");
const isReload = inject("isReload");

//圖片
const imgFile = ref(null);
const previewShow = ref(false);
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
          NButton,
          {
            strong: true, //加粗
            tertiary: false, //三級按鈕
            size: "small",
            onClick: () => updateArticle(row), //事件
          },
          { default: () => "修改" }
        ),

        h(
          DelBtn,
          {
            style: {
              margin: "10px",
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
//新增文章
const addArticle = reactive({
  category_id: 0,
  cover_image: "",
  title: "",
  description: "",
  content: "hell",
});
//載入並更新文章
const oldArticle = reactive({
  id: 0,
  category_id: 0,
  cover_image: "",
  title: "",
  description: "",
  content: "",
});
//確認重更新跳轉
const isUpdata = ref(false);
//載入列表
async function loadcateGoryList() {
  const res = await useCategory.ResCategoryList();

  //select
  categoryLists.value = res.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
}
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
  category_id: 0,
});

//頁面選擇
async function toPage(pageNum) {
  pageInfo.page = pageNum;

  //渲染文章
  loadArticleData();
}
//分頁選擇到的頁面顏色
function activePage(pageNum) {
  return pageInfo.page === pageNum ? "colorPage" : "";
}
//載入文章
async function loadArticleData() {
  const res = await AuthArticle.articleLists(pageInfo);
  const listRes = res.datas.lists;
  for (const list of listRes) {
    //內容溢出
    if (list.content.length >= 50) {
      list.content = list.content.slice(0, 50);
      list.content += "...";
    }
    //uid查詢轉換
    const issuer = await AuthArticle.queryIssuer(list.uid);
    list.uid = issuer.account;
    //時間
    let d = new Date(list.create_time);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1);
    const day = String(d.getDate());

    list.create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
      2,
      "0"
    )}`;
    //category 轉換
    const categoryName = await useCategory.queryCategoryName(list.category_id);
    list.category_id = categoryName.name;
  }
  data.value = listRes;

  //分頁
  pageInfo.count = res.count.count;
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
}
//添加文章
async function checkAdd() {
  try {
    isLoading.value = true;
    const userJson = AuthLogin.getUser();
    const uid = userJson.id;
    //添加圖片
    if (imgFile) {
      const formData = new FormData();
      formData.append("file", imgFile.value);
      const img = await AuthArticle.uploadCoverImg(formData);
      addArticle.cover_image = img;
    }
    const res = await AuthArticle.addList(uid, addArticle);

    if (res.code === 200) {
      msg.success(res.msg);
      addArticle.category_id = 0;
      addArticle.title = "";
      addArticle.description = "";
      addArticle.cover_image = "";
      addArticle.content = "";
      //清除預覽圖片和提交狀態
      imgFile.value = null;
      defaultList.value = "list";
      //渲染文章
      loadArticleData();
      isLoading.value = false;
    }
    if (res.code === 500) {
      msg.error(res.msg);
    }
    if (res.code === 403) {
      msg.error(res.msg);
    }
  } catch (error) {
    console.error(error);
  }
}

//載入舊文章
async function updateArticle(row) {
  try {
    isLoading.value = true;
    isUpdata.value = true;
    defaultList.value = "updata";
    const id = row.id;
    const res = await AuthArticle.oldArticleList(id);

    oldArticle.category_id = res[0].category_id;
    oldArticle.title = res[0].title;
    oldArticle.description = res[0].description;
    oldArticle.content = res[0].content;
    oldArticle.id = res[0].id;
    oldArticle.cover_image = res[0].coverImage;
    oldFile.value = res[0].coverImage;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
}
const oldFile = ref(null);
//更新文章
async function checkUpdata() {
  try {
    //添加圖片
    if (typeof oldFile.value === "object") {
      const formData = new FormData();
      formData.append("file", oldFile.value);
      const img = await AuthArticle.uploadCoverImg(formData);
      oldArticle.cover_image = img;
    }
    const res = await AuthArticle.updataArticleList(oldArticle.id, oldArticle);
    if (res.code === 200) {
      msg.success(res.msg);
      oldArticle.category_id = 0;
      oldArticle.title = "";
      oldArticle.description = "";
      oldArticle.content = "";
      oldArticle.id = 0;
      oldArticle.cover_image = "";
      //清除預覽圖
      previewShow.value = false;
      isUpdata.value = false;
      defaultList.value = "list";
      //渲染文章
      loadArticleData();
    }
    if (res.code === 403) {
      msg.error(res.msg);
    }
    if (res.code === 500) {
      msg.error(res.msg);
    }
  } catch (error) {
    console.error(error);
  }
}
//刪除文章
async function delArticle(row) {
  const id = row.id;

  dialog.success({
    title: "是否刪除",
    content: "是否刪除分類列表？",
    positiveText: "確定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: async () => {
      const res = await AuthArticle.deleteArticleList(id);
      if (res.code === 403) {
        msg.error(res.msg);
      }
      if (res.code === 500) {
        msg.error(res.msg);
      }
      if (res.code === 200) {
        msg.success(res.msg);
        isReload.value = true;
        //渲染文章
        loadArticleData();
      }
    },
    onNegativeClick: () => {
      msg.success("取消成功");
    },
    onClose: () => {
      msg.success("取消成功");
    },
    onEsc: () => {
      msg.success("取消成功");
    },
  });
}

watchEffect(() => {
  if (token) {
    token.value = AuthLogin.getToken();
  }
});
onMounted(() => {
  //渲染分類
  loadcateGoryList();
  //渲染文章
  loadArticleData();
});
</script>

<style lang="scss" scoped>
.content,
.loading {
  display: flex;
  justify-content: center;
  align-items: center;

  .page {
    cursor: pointer;
  }
  .colorPage {
    color: blue;
  }
}
</style>
