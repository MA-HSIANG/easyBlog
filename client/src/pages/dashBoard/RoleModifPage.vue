<template>
  <loading class="loadingBar" v-if="isLoading">取得資料中...</loading>
  <div class="dashBoard-container" v-else>
    <div class="role--table-container">
      <n-table
        :bordered="false"
        :single-line="false"
        size="large"
        v-if="!isLoading"
      >
        <thead>
          <tr>
            <th v-for="(data, index) in roleThead" :key="index">
              {{ data.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="data in userDatas" :key="data.id">
            <td>{{ data.id }}</td>
            <td>{{ data.role }}</td>
            <td>{{ data.account }}</td>
            <td>{{ data.email }}</td>
            <td>{{ data.create_time }}</td>
            <td>
              <div class="btn-container">
                <SecondButton @click="updateRoleList(data.id)"
                  >修改</SecondButton
                >
              </div>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>

    <div class="paginator-container">
      <n-pagination
        v-model:page="pageInfo.page"
        :page-count="pageInfo.pageCount"
        @click="getAllUsers"
      />
    </div>

    <!--修改-->
    <n-modal v-model:show="showUpdateModal">
      <n-card
        style="width: 600px"
        title="修改權限"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div>
          <n-select
            v-model:value="updateRoleData.role"
            :options="roleOptions"
          />
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import { useRouter } from "vue-router";
import { thead } from "../../data/dashBoard/roleThead.json";
import loading from "../../components/common/Loading.vue";
import PrimaryButton from "../../components/common/PrimaryButton.vue";
import ImportButton from "../../components/common/ImportButton.vue";
import SecondButton from "../../components/common/SecondButton.vue";

import { getAllUserDatas, updateRole, getRoleSelect } from "../../api/userApi";
import { transformTime } from "../../utils/transformTime";

const router = useRouter();
const msg = inject("message");
const notfiy = inject("notification");
const dialog = inject("dialog");
const isLoading = ref(false);
const userDatas = ref(null);
//表頭
const roleThead = reactive([...thead]);
//送出的資料
const updateRoleData = reactive({
  id: 0,
  role: "",
});
//修改
const showUpdateModal = ref(false);
const updateRoleList = (id) => {
  showUpdateModal.value = !showUpdateModal.value;
  updateRoleData.id = id;
};

//角色選擇表單
const roleOptions = ref(null);
const loadRoleSelect = async () => {
  try {
    const res = await getRoleSelect();
    res.data.data = res.data.data.map((role) => {
      return {
        label: role,
        value: role,
      };
    });
    roleOptions.value = res.data.data;
  } catch (error) {
    console.error(error);
  }
};
//分頁初始值
const pageInfo = reactive({
  page: 1,
  pageSize: 6,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
});
//獲取所有用戶
const getAllUsers = async () => {
  try {
    isLoading.value = true;
    const res = await getAllUserDatas(pageInfo);
    if (res.data.data.status === "success") {
      res.data.data.data = res.data.data.data.map((data) => {
        data.create_time = transformTime(data.create_time);
        return data;
      });
      userDatas.value = res.data.data.data;
      pageInfo.count = res.data.results;
      pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    }
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

//修改
const checkUpdate = async () => {
  try {
    console.log(updateRoleData.role);
    const res = await updateRole(updateRoleData.id, updateRoleData.role);
    if (res.data.data.status === "success") {
      msg.success(res.data.data.msg);
      updateRoleData.id = 0;
      updateRoleData.role = "";
      showUpdateModal.value = false;
      getAllUsers();
    }
  } catch (error) {
    console.error(error);
  }
};
//取消
const closeModal = () => {
  showUpdateModal.value = false;
};
onMounted(() => {
  getAllUsers();
  loadRoleSelect();
});
</script>
<style lang="scss" scoped>
@import "../../common/style/main.scss";
@import "../../common/style/color.scss";
@import "../../common/style/roleModfiRwd.scss";
.dashBoard-container {
  .role--table-container {
    width: 100rem;
    font-size: 1.6rem;

    .n-table {
      width: 100%;
      .btn-container {
        .n-button {
          margin-right: 0.5rem;
        }
      }
      .btn-modal {
        .n-button {
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
    }
  }
  .paginator-container {
    margin-top: 1rem;
  }
}
</style>
