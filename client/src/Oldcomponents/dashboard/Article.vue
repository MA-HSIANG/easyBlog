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
          <Loading>加載中...</Loading>
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
              v-model:value="addArticle.category_name"
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
          <Loading>加載中...</Loading>
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
              v-model:value="oldArticle.category_name"
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


//圖片
const imgFile = ref(null);
const oldFile = ref(null);
const previewShow = ref(false);
//-----------重構-----------------////
import { getAllCategorys } from "../api/categoryApi";
import {
  uploadCover,
  updateBlog,
  createBlog,
  getAllBlogs,
  getBlog,
  deleteBlog,
} from "../api/blogApi";
import { transformTime } from "../utils/transformTime";
//-------------------------------////
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
//////-----重構-------////////////
//默認切換到列表
const defaultList = ref("list");
//文章內容
const data = ref([]);
//分類select
const categoryLists = ref([]);
//新增文章
const addArticle = reactive({
  cover_image: "",
  category_id: 0,
  category_name: "",
  title: "",
  description: "",
  content: "",
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

async function checkAdd() {
  try {
    //添加圖片
    if (imgFile) {
      const formData = new FormData();
      formData.append("files", imgFile.value);
      const img = await uploadCover(formData);
      addArticle.cover_image = img.data.data.url;
    }
    const res = await createBlog(addArticle);

    if (res.data.data.status === "success") {
      msg.success(res.data.data.msg);
      //清空
      addArticle.category_id = 0;
      addArticle.title = "";
      addArticle.description = "";
      addArticle.cover_image = "";
      addArticle.content = "";
      //清除預覽圖片和提交狀態
      imgFile.value = null;
      //跳轉
      defaultList.value = "list";
      //渲染文章
      loadArticleData();
      isLoading.value = false;
    }
  } catch (error) {
    console.log(error);
  }
}

//載入文章
const loadArticleData = async () => {
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
  }

  // const listRes = res.datas.lists;
  // for (const list of listRes) {
  //   //內容溢出
  //   if (list.content.length >= 50) {
  //     list.content = list.content.slice(0, 50);
  //     list.content += "...";
  //   }
  //   //uid查詢轉換
  //   // const issuer = await AuthArticle.queryIssuer(list.uid);
  //   // list.uid = issuer.account;
  //   //時間
  //   let d = new Date(list.create_time);
  //   const year = d.getFullYear();
  //   const month = String(d.getMonth() + 1);
  //   const day = String(d.getDate());

  //   list.create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
  //     2,
  //     "0"
  //   )}`;
  //   //category 轉換
  //   const categoryName = await useCategory.queryCategoryName(list.category_id);
  //   list.category_id = categoryName.name;
  // }
  // data.value = listRes;

  ////分頁
  // pageInfo.count = res.count.count;
  // pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
};
//載入舊文章
const updateArticle = async (row) => {
  try {
    isLoading.value = true;
    isUpdata.value = true;
    defaultList.value = "updata";
    const id = row.id;
    const res = await getBlog(id);

    if (res.data.user.status === "success") {
      oldFile.value = res.data.user.data[0].coverImage;
      oldArticle.category_id = res.data.user.data[0].category_id;
      oldArticle.id = res.data.user.data[0].id;
      oldArticle.title = res.data.user.data[0].title;
      oldArticle.description = res.data.user.data[0].description;
      oldArticle.content = res.data.user.data[0].content;
      oldArticle.cover_image = res.data.user.data[0].coverImage;
      isLoading.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

//更新文章
const checkUpdata = async () => {
  try {
    //添加圖片
    if (typeof oldFile.value === "object") {
      const formData = new FormData();
      formData.append("file", oldFile.value);
      const img = await uploadCover(formData);
      oldArticle.cover_image = img.data.data.url;
    }
    const res = await updateBlog(oldArticle.id, oldArticle);
    
    if (res.data.data.status === "success") {
      msg.success(res.data.data.msg);
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
  } catch (error) {
    console.error(error);
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
          msg.success("刪除成功!");
          onReload();
          router.replace("/dashBoard/article");
        }
      } catch (error) {
        console.error(error);
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

//載入分類列表
const loadCategoryData = async () => {
  const res = await getAllCategorys();
  //categoty select 轉換成符合組件的資料類別
  categoryLists.value = res.data.data.data.map((item) => {
    return {
      label: item.name,
      value: item.name,
    };
  });
};

/////////-----重構-------///////

// //載入列表
// async function loadcateGoryList() {
//   const res = await useCategory.ResCategoryList();
//   //select
//   categoryLists.value = res.map((item) => {
//     return {
//       label: item.name,
//       value: item.id,
//     };
//   });
// }
// //分頁初始值
// const pageInfo = reactive({
//   page: 1,
//   pageSize: 3,
//   //列表資料總數
//   count: 0,
//   //總頁數
//   pageCount: 0,
//   //關鍵字
//   keyword: "",
//   //分類
//   category_id: 0,
// });

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

// //載入文章
// async function loadArticleData() {
//   const res = await AuthArticle.articleLists(pageInfo);
//   const listRes = res.datas.lists;
//   for (const list of listRes) {
//     //內容溢出
//     if (list.content.length >= 50) {
//       list.content = list.content.slice(0, 50);
//       list.content += "...";
//     }
//     //uid查詢轉換
//     // const issuer = await AuthArticle.queryIssuer(list.uid);
//     // list.uid = issuer.account;
//     //時間
//     let d = new Date(list.create_time);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1);
//     const day = String(d.getDate());

//     list.create_time = `${year}/${month.padStart(2, "0")}/${day.padStart(
//       2,
//       "0"
//     )}`;
//     //category 轉換
//     const categoryName = await useCategory.queryCategoryName(list.category_id);
//     list.category_id = categoryName.name;
//   }
//   data.value = listRes;

//   //分頁
//   pageInfo.count = res.count.count;
//   pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
// }

//添加文章
// async function checkAdd() {
//   try {
//     isLoading.value = true;
//     const userJson = AuthLogin.getUser();
//     const uid = userJson.id;
//     //添加圖片
//     if (imgFile) {
//       const formData = new FormData();

//       formData.append("file", imgFile.value);

//       const img = await AuthArticle.uploadCoverImg(formData);
//       console.log(img);
//       addArticle.cover_image = img;
//     }
//     const res = await AuthArticle.addList(uid, addArticle);

//     if (res.code === 200) {
//       msg.success(res.msg);
//       addArticle.category_id = 0;
//       addArticle.title = "";
//       addArticle.description = "";
//       addArticle.cover_image = "";
//       addArticle.content = "";
//       //清除預覽圖片和提交狀態
//       imgFile.value = null;
//       defaultList.value = "list";
//       //渲染文章
//       loadArticleData();
//       isLoading.value = false;
//     }
//     if (res.code === 500) {
//       msg.error(res.msg);
//     }
//     if (res.code === 403) {
//       msg.error(res.msg);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// //載入舊文章
// async function updateArticle(row) {
//   try {
//     isLoading.value = true;
//     isUpdata.value = true;
//     defaultList.value = "updata";
//     const id = row.id;
//     const res = await AuthArticle.oldArticleList(id);

//     oldArticle.category_id = res[0].category_id;
//     oldArticle.title = res[0].title;
//     oldArticle.description = res[0].description;
//     oldArticle.content = res[0].content;
//     oldArticle.id = res[0].id;
//     oldArticle.cover_image = res[0].coverImage;
//     oldFile.value = res[0].coverImage;
//     isLoading.value = false;
//   } catch (error) {
//     console.error(error);
//   }
// }

// //更新文章
// async function checkUpdata() {
//   try {
//     //添加圖片
//     if (typeof oldFile.value === "object") {
//       const formData = new FormData();
//       formData.append("file", oldFile.value);
//       const img = await AuthArticle.uploadCoverImg(formData);
//       oldArticle.cover_image = img;
//     }
//     const res = await AuthArticle.updataArticleList(oldArticle.id, oldArticle);
//     if (res.code === 200) {
//       msg.success(res.msg);
//       oldArticle.category_id = 0;
//       oldArticle.title = "";
//       oldArticle.description = "";
//       oldArticle.content = "";
//       oldArticle.id = 0;
//       oldArticle.cover_image = "";
//       //清除預覽圖
//       previewShow.value = false;
//       isUpdata.value = false;
//       defaultList.value = "list";
//       //渲染文章
//       loadArticleData();
//     }
//     if (res.code === 403) {
//       msg.error(res.msg);
//     }
//     if (res.code === 500) {
//       msg.error(res.msg);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }
// //刪除文章
// async function delArticle(row) {
//   const id = row.id;

//   dialog.success({
//     title: "是否刪除",
//     content: "是否刪除分類列表？",
//     positiveText: "確定",
//     negativeText: "取消",
//     maskClosable: false,
//     onPositiveClick: async () => {
//       const res = await AuthArticle.deleteArticleList(id);
//       if (res.code === 403) {
//         msg.error(res.msg);
//       }
//       if (res.code === 500) {
//         msg.error(res.msg);
//       }
//       if (res.code === 200) {
//         msg.success(res.msg);
//         isReload.value = true;
//         //渲染文章
//         loadArticleData();
//       }
//     },
//     onNegativeClick: () => {
//       msg.success("取消成功");
//     },
//     onClose: () => {
//       msg.success("取消成功");
//     },
//     onEsc: () => {
//       msg.success("取消成功");
//     },
//   });
// }

onMounted(() => {
  // //渲染分類
  // loadcateGoryList();
  // //渲染文章
  // loadArticleData();
  ////------重構-------/////
  // //渲染分類
  loadCategoryData();
  // //渲染文章
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
