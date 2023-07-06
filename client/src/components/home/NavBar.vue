<template>
  <div class="nav">
    <div class="nav_container">
      <div @click="toHome">首頁</div>
      <n-popselect
        v-model:value="NavBarselectedCategoryValue"
        :options="NavBarcategoryLists"
        trigger="click"
        @update:value="categorySearch"
      >
        <div v-show="props.open">
          分類 <span>{{ selectedCategoryName }}</span>
        </div>
      </n-popselect>
      <div v-show="!isUserLogined && !isLogined" @click="toResgist">
        登入/註冊
      </div>
      <div v-show="isUserLogined">
        <n-dropdown :options="userDropDown" @select="toUserSelect">
          <n-button>
            <span
              ><n-avatar :src="userAvatar" size="small"></n-avatar
              >{{ userName }}</span
            ></n-button
          >
        </n-dropdown>
      </div>
      <div v-show="isLogined">
        <n-dropdown :options="adminDropDown" @select="toAdminSelect">
          <n-button>
            <span
              ><n-avatar :src="adminAvatar" size="small"></n-avatar
              >{{ adminName }}</span
            ></n-button
          >
        </n-dropdown>
      </div>
    </div>

    <div class="search">
      <n-input
        @keydown.enter="enterKeyword"
        v-model:value="keyword"
        :style="{ width: '15rem' }"
        placeholder="搜尋文章..."
      >
        <template #prefix>
          <n-icon><Search /></n-icon>
        </template>
      </n-input>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, reactive, onMounted, h } from "vue";
import { useRouter } from "vue-router";
import { useAuthCategory } from "../../store/category/operate";
import { useAuthLogin } from "../../store/user/auth";
import { useAuthUserLogin } from "../../store/user/authUser";
import { NPopselect, NInput, NIcon, NDropdown, NAvatar } from "naive-ui";
import {
  Search,
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5";

const router = useRouter();
const authLogin = useAuthLogin();
const authUserLogin = useAuthUserLogin();
const useCategory = useAuthCategory();
const NavBarcategoryLists = ref([]);
const NavBarselectedCategoryValue = ref(0);
//登出刷新
const checkLogined = ref(false);
//發送
const emits = defineEmits(["selectCategory_id", "keyword", "checkLogined"]);
//接收
const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});
const keyword = ref("");
async function loadcateGoryList() {
  const res = await useCategory.ResCategoryList();
  //select
  NavBarcategoryLists.value = res.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
}
//icon
const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};
//選擇到的分類
const selectedCategoryName = computed(() => {
  let selected = NavBarcategoryLists.value.find((list) => {
    return list.value === NavBarselectedCategoryValue.value;
  });

  return selected ? selected.label : "";
});

//分類分類emits
function categorySearch(selectCategory_id) {
  emits("selectCategory_id", selectCategory_id);
}
//搜尋詞
function enterKeyword() {
  emits("keyword", keyword.value);
}

//驗證管理員登入
const isLogined = ref(false);

//驗證登入狀態
async function checkLogin() {
  authLogin.adminToken = authLogin.getToken();
  const res = await authLogin.isLoginIn(authLogin.adminToken);
  if (res.code === 200) {
    isLogined.value = true;
  }
}

//取得管理員資料

const adminName = ref("");
const adminAvatar = ref("");

async function getAdminData() {
  try {
    const res = await authLogin.getAdminDate();
    if (res.data.code) {
      const adminDatas = res.data.results[0];
      adminName.value = adminDatas.account;
      adminAvatar.value = adminDatas.avatar;
    }
  } catch (error) {}
}

//user驗證
const isUserLogined = ref(false);
async function checkUserLogin() {
  const userToken = authUserLogin.getToken();
  const res = await authUserLogin.isLoginIn(userToken);
  if (res.code === 200) {
    isUserLogined.value = true;
  } else {
    isUserLogined.value = false;
  }
}
//取得使用者資料

const userName = ref("");
const userAvatar = ref("");

async function getUserData() {
  try {
    const res = await authUserLogin.getUserData();
    userName.value = res.data.results.account;
    userAvatar.value = res.data.results.headerImg;
  } catch (error) {}
}

//跳轉
function toHome() {
  router.push("/");
}
function toResgist() {
  router.replace("/resgist");
}
function toDashboard() {
  router.replace("/dashBoard");
}
function toUserSelect(key) {
  if (key === "editor") {
    router.push("/userCenter");
  }
  if (key === "logout") {
    authUserLogin.delTokenAndUserData();
    isUserLogined.value = false;
    checkLogined.value = true;
    emits("checkLogined", checkLogined.value);
  }
}
function toAdminSelect(key) {
  if (key === "dashBoard") {
    router.replace("/dashBoard");
  }
  if (key === "logout") {
    authLogin.delToken();
    isLogined.value = false;
    checkLogined.value = true;
    emits("checkLogined", checkLogined.value);
  }
}
//user登入下拉
const userDropDown = reactive([
  {
    label: "編輯資料",
    key: "editor",
    icon: renderIcon(EditIcon),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogoutIcon),
  },
]);
//admin登入下拉
const adminDropDown = reactive([
  {
    label: "後台管理",
    key: "dashBoard",
    icon: renderIcon(EditIcon),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogoutIcon),
  },
]);
onMounted(() => {
  checkLogin();
  checkUserLogin();
  loadcateGoryList();
  getUserData();
  getAdminData();
});
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-top: 0.5px solid black;
  border-bottom: 0.5px solid black;
  flex-wrap: wrap;

  .nav_container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #646763;

    div {
      padding-right: 15px;
      cursor: pointer;
      font-size: 1.2rem;

      &:hover {
        color: #4e96c2;
      }
      span {
        font-size: 14px;
      }
    }
  }
  .search {
    display: flex;
    justify-content: flex-end;
    width: 30%;
    padding: 10px;
  }
}
</style>
