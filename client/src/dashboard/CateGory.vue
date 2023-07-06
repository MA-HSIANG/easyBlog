<template>
  <div>
    <div class="add_btn">
      <add-btn @click="addCategoryList"></add-btn>
    </div>
    <div v-if="isLoading" class="loading">
      <loading>加載中...</loading>
    </div>
    <div class="container">
      <n-table :bordered="true" :single-line="false" v-if="!isLoading">
        <thead>
          <tr>
            <th>編號</th>
            <th>名稱</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(list, index) in categoryLists" :key="index">
            <td>{{ list.id }}</td>
            <td>{{ list.name }}</td>
            <td>
              <n-space>
                <n-button @click="updateCategoryList(list.id)">修改</n-button>
                <del-btn @click="deleteList(list.id)"></del-btn>
              </n-space>
            </td>
          </tr>
        </tbody>
      </n-table>
      <!--添加-->
      <n-modal v-model:show="showAddModal">
        <n-card
          style="width: 600px"
          title="新增類"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <template #header-extra>
            <div>新增分類</div>
          </template>
          <div>
            <n-input
              v-model:value="newCategory"
              type="text"
              placeholder="請輸入名稱"
            ></n-input>
          </div>
          <template #footer>
            <div>
              <n-button @click="checkAdd">提交</n-button>
            </div>
          </template>
        </n-card>
      </n-modal>
      <!--修改-->
      <n-modal v-model:show="showUpdateModal">
        <n-card
          style="width: 600px"
          title="修改類"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <template #header-extra>
            <div>修改分類</div>
          </template>
          <div>
            <n-input
              v-model:value="category_name"
              type="text"
              placeholder="請輸入名稱"
            ></n-input>
          </div>
          <template #footer>
            <div>
              <n-button @click="checkUpdate">提交</n-button>
            </div>
          </template>
        </n-card>
      </n-modal>
    </div>
  </div>
</template>
<script setup>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  inject,
  watchEffect,
} from "vue";
import { useRouter } from "vue-router";
import { NTable, NForm, NFormItem, NInput, NSpace, NModal } from "naive-ui";
import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import Loading from "../components/common/Loading.vue";
import AddBtn from "../components/common/AddBtn.vue";
import DelBtn from "../components/common/DelBtn.vue";
const $axios = inject("$axios");
const useCategory = useAuthCategory();
const authLogin = useAuthLogin();
const router = useRouter();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");
const isLoading = ref(false);
//載入列表
const categoryLists = ref([]);
async function loadcateGoryList() {
  isLoading.value = true;
  const res = await useCategory.ResCategoryList();
  categoryLists.value = res;
  isLoading.value = false;
}

//新增分類
const showAddModal = ref(false);
const newCategory = ref("");
//輸入新增列表
function addCategoryList() {
  showAddModal.value = !showAddModal.value;
}
async function checkAdd() {
  const res = await useCategory.addCategory(newCategory.value);
  if (res.code === 200) {
    msg.success(res.msg);
    showAddModal.value = false;
    loadcateGoryList();
  }
  if (res.code === 500) {
    msg.error(res.msg);
    showAddModal.value = false;
    loadcateGoryList();
  }
  if (res.code === 403) {
    msg.error(res.msg);
  }
}
//刪除列表
async function deleteList(id) {
  dialog.success({
    title: "是否刪除",
    content: "是否刪除分類列表？",
    positiveText: "確定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: async () => {
      const res = await useCategory.delCategory(id);
      if (res.code === 403) {
        msg.error(res.msg);
      }
      if (res.code === 500) {
        msg.error(res.msg);
      }
      if (res.code === 200) {
        msg.success(res.msg);
        loadcateGoryList();
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
//修改列表
const showUpdateModal = ref(false);
const category_name = ref("");
const categoty_id = ref("");
function updateCategoryList(id) {
  showUpdateModal.value = !showUpdateModal.value;
  categoty_id.value = id;
}
//輸入修改列表
async function checkUpdate() {
  const res = await useCategory.updateCategory(
    categoty_id.value,
    category_name.value
  );

  if (res.code === 200) {
    msg.success(res.msg);
    category_name.value = "";
    showUpdateModal.value = false;
    loadcateGoryList();
  }
  if (res.code === 500) {
    msg.error(res.msg);
    showAddModal.value = false;
    loadcateGoryList();
  }
  if (res.code === 403) {
    msg.error(res.msg);
  }
}

watchEffect(() => {
  loadcateGoryList();
});
</script>
<style lang="scss" scoped>
div {
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
  .add_btn {
    margin-bottom: 1rem;
  }
}
</style>
