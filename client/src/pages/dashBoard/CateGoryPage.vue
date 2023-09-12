<template>
  <loading class="loadingBar" v-if="isLoading">資料加載中...</loading>
  <div class="dashBoard-container" v-else>
    <div class="add-container">
      <PrimaryButton @click="addCategoryModal"></PrimaryButton>
    </div>
    <div class="category--table-container">
      <n-table
        :bordered="false"
        :single-line="false"
        size="large"
        v-if="!isLoading"
      >
        <thead>
          <tr>
            <th v-for="(data, index) in categoryThead" :key="index">
              {{ data.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(list, index) in categoryLists" :key="index">
            <td>{{ list.id }}</td>
            <td>{{ list.name }}</td>
            <td>
              <div class="btn-container btn-modal">
                <SecondButton @click="updateCategoryList(list.id)"
                  >修改</SecondButton
                >
                <ImportButton
                  @click="deleteCategoryList(list.id)"
                ></ImportButton>
              </div>
            </td>
          </tr>
        </tbody>
      </n-table>
      <div class="paginator-container">
        <n-pagination
          v-model:page="pageInfo.page"
          :page-count="pageInfo.pageCount"
          @click="loadCategoryData"
        />
      </div>
    </div>
    <!--添加-->
    <n-modal v-model:show="showAddModal">
      <n-card
        style="width: 600px"
        title="新增分類"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div>
          <n-input
            v-model:value="newCategory"
            placeholder="請輸入名稱"
            @keydown.enter.prevent
          ></n-input>
        </div>
        <template #footer>
          <div class="btn-modal">
            <PrimaryButton @click="checkAdd">
              <template #name> 提交 </template>
            </PrimaryButton>
            <SecondButton @click="closeModal">
              <template #name> 取消 </template>
            </SecondButton>
          </div>
        </template>
      </n-card>
    </n-modal>
    <!--修改-->
    <n-modal v-model:show="showUpdateModal">
      <n-card
        style="width: 600px"
        title="修改分類"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div>
          <n-input
            v-model:value="category_name"
            placeholder="請輸入名稱"
            @keydown.enter.prevent
          ></n-input>
        </div>
        <template #footer>
          <div class="btn-modal">
            <PrimaryButton @click="checkUpdate">
              <template #name> 提交 </template>
            </PrimaryButton>
            <SecondButton @click="closeModal">
              <template #name> 取消 </template>
            </SecondButton>
          </div>
        </template>
      </n-card>
    </n-modal>
    <!--刪除-->
    <n-modal v-model:show="showDeleteModal">
      <n-card
        style="width: 600px"
        title="刪除分類"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="deleteModal-container">
          <h1>確定刪除分類?</h1>
        </div>
        <template #footer>
          <div class="btn-modal">
            <SecondButton @click="closeModal">
              <template #name> 取消 </template>
            </SecondButton>
            <ImportButton @click="checkDelete">
              <template #name> 確定 </template>
            </ImportButton>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import { useRouter } from "vue-router";
import { thead } from "../../data/dashBoard/categoryThead.json";
import loading from "../../components/common/Loading.vue";
import PrimaryButton from "../../components/common/PrimaryButton.vue";
import ImportButton from "../../components/common/ImportButton.vue";
import SecondButton from "../../components/common/SecondButton.vue";
import {
  getAllCategorys,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../api/categoryApi";
import { removeToken } from "../../utils/verify";
const router = useRouter();
const message = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");

const isLoading = ref(false);

// 載入表頭
const categoryThead = reactive([...thead]);
//載入列表
const categoryLists = ref([]);
//新增
const showAddModal = ref(false);
const newCategory = ref("");
//修改
const showUpdateModal = ref(false);
const category_name = ref("");
const categoty_id = ref("");
const updateCategoryList = (id) => {
  showUpdateModal.value = !showUpdateModal.value;
  categoty_id.value = id;
};
//刪除
const showDeleteModal = ref(false);
const deleteCategoryList = (id) => {
  showDeleteModal.value = !showDeleteModal.value;
  categoty_id.value = id;
};
//分頁
const pageInfo = reactive({
  page: 1,
  pageSize: 5,
  pageCount: 0,
  count: 0,
});
const loadCategoryData = async () => {
  try {
    isLoading.value = true;
    const res = await getAllCategorys(pageInfo);

    categoryLists.value = res.data.data.data;
    pageInfo.count = res.data.results.length;
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const addCategoryModal = () => (showAddModal.value = !showAddModal.value);
//新增
const checkAdd = async () => {
  try {
    const res = await createCategory(newCategory.value);
    if (res.data.data.status === "success") {
      message.success(res.data.data.msg);
      showAddModal.value = false;
      newCategory.value = "";
      loadCategoryData();
    }
  } catch (error) {
    console.error(error);
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
//刪除
const checkDelete = async () => {
  try {
    const res = await deleteCategory(categoty_id.value);
    if (res.status === 204) {
      showDeleteModal.value = false;
      message.success("刪除成功");
      loadCategoryData();
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

//修改
const checkUpdate = async () => {
  try {
    const res = await updateCategory(categoty_id.value, category_name.value);
    if (res.data.data.status === "success") {
      message.success(res.data.data.msg);
      category_name.value = "";
      showUpdateModal.value = false;
      loadCategoryData();
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
//取消
const closeModal = () => {
  showAddModal.value = false;
  showUpdateModal.value = false;
  showDeleteModal.value = false;
};
onMounted(() => {
  loadCategoryData();
});
</script>
<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/categoryRwd.scss";
.add-container {
  margin-bottom: 1rem;
  .n-button {
    width: 8rem;
  }
}
.category--table-container {
  width: 100rem;
  .n-table {
    width: 100%;
    .btn-container {
      .n-button {
        margin-right: 0.5rem;
      }
    }
  }
}

.btn-modal {
  .n-button {
    font-size: 1.6rem;
    margin-right: 0.5rem;
  }
}
.deleteModal-container {
  h1 {
    font-size: 2.2rem;
    font-weight: 600;
    color: $font-black;
    letter-spacing: 1.2px;
  }
}
.paginator-container {
  margin-top: 1rem;
}
</style>
