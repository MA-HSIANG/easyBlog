<template>
  <div>
    <div class="add_btn">
      <add-btn @click="addAdminList"></add-btn>
    </div>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>編號</th>
          <th>帳號</th>
          <th>密碼</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(list, index) in adminLists" :key="index">
          <td>{{ list.id }}</td>
          <td>{{ list.account }}</td>
          <td>{{ list.password }}</td>
          <td>
            <n-space>
              <n-button @click="updateAdminList(list.id)">修改</n-button>
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
        title="新增admin"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <div>新增管理員</div>
        </template>
        <n-space>
          <n-space>
            <div>
              <n-input
                v-model:value="newAdmin.account"
                type="text"
                placeholder="請輸入帳號"
                clearable
              ></n-input>
            </div>
          </n-space>
          <n-space>
            <div>
              <n-input
                v-model:value="newAdmin.password"
                type="password"
                placeholder="請輸入密碼"
                clearable
              ></n-input>
            </div>
          </n-space>
        </n-space>
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
        title="修改"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <div>修改admin</div>
        </template>
        <n-space>
          <n-space>
            <div>
              <n-input
                v-model:value="newAdmin.account"
                type="text"
                placeholder="請輸入帳號"
                clearable
              ></n-input>
            </div>
          </n-space>
          <n-space>
            <div>
              <n-input
                v-model:value="newAdmin.password"
                type="password"
                placeholder="請輸入密碼"
                clearable
              ></n-input>
            </div>
          </n-space>
        </n-space>
        <template #footer>
          <div>
            <n-button @click="checkUpdate">提交</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
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
import {
  NTable,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NCheckbox,
  NButton,
  commonDark,
  NSpace,
  NModal,
} from "naive-ui";
import { useAuthLogin } from "../../store/user/auth";
import { useAuthCategory } from "../../store/category/operate";
import AddBtn from "../../components/common/AddBtn.vue";
import DelBtn from "../../components/common/DelBtn.vue";
const $axios = inject("$axios");
const useCategory = useAuthCategory();
const authLogin = useAuthLogin();
const categoryLists = ref([]);
const router = useRouter();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const loading = inject("loadingBar");

defineComponent({
  NTable,
  NSpace,
  NModal,
  NInput,
  NButton,
});

//加載admin列表
const adminLists = ref([]);
async function loadAdminLists() {
  const res = await authLogin.allAdmin();
  adminLists.value = res;
}

//新增分類
const showAddModal = ref(false);
const newAdmin = reactive({
  account: "",
  password: "",
});
//輸入新增列表
function addAdminList() {
  showAddModal.value = !showAddModal.value;
}
async function checkAdd() {
  const res = await authLogin.addAdmin(newAdmin);

  if (res.code === 200) {
    msg.success(res.msg);
    showAddModal.value = false;
    newAdmin.account = "";
    newAdmin.password = "";
    loadAdminLists();
  }
  if (res.code === 500) {
    msg.error(res.msg);
    showAddModal.value = false;
  }
  if (res.code === 403) {
    msg.error(res.msg);
  }
}
//刪除admin
async function deleteList(id) {
  dialog.success({
    title: "是否刪除",
    content: "是否刪除帳號？",
    positiveText: "確定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: async () => {
      const res = await authLogin.delAdmin(id);
      if (res.code === 403) {
        msg.error(res.msg);
      }
      if (res.code === 500) {
        msg.error(res.msg);
      }
      if (res.code === 200) {
        msg.success(res.msg);
        loadAdminLists();
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
//修改admin
const showUpdateModal = ref(false);
const admin_id = ref("");
function updateAdminList(id) {
  showUpdateModal.value = !showUpdateModal.value;
  admin_id.value = id;
}
//輸入修改列表
async function checkUpdate() {
  const res = await authLogin.updateAdmin(admin_id.value, newAdmin);

  if (res.code === 200) {
    msg.success(res.msg);
    newAdmin.account = "";
    newAdmin.password = "";
    showUpdateModal.value = false;
    loadAdminLists();
  }
  if (res.code === 500) {
    msg.error(res.msg);
    showAddModal.value = false;
  }
  if (res.code === 403) {
    msg.error(res.msg);
  }
}
watchEffect(() => {
  loadAdminLists();
});
</script>

<style lang="scss" scoped>
.add_btn {
  margin-bottom: 1rem;
}
</style>
