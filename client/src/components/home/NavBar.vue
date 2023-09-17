<template>
  <div class="logo-container">
    <a class="link" href="/"> <img src="../../../Logo.svg" alt="" /></a>
  </div>

  <nav
    :class="isOpenNav ? 'open--mobile-nav' : 'close--mobile-nav'"
    class="nav-content"
  >
    <ul>
      <li @click="toHome">首頁</li>

      <n-popselect
        v-model:value="NavBarselectedCategoryValue"
        :options="NavBarcategoryLists"
        trigger="click"
        @update:value="categorySearch"
        placement="bottom-start"
        size="large"
      >
        <div v-show="props.open">
          <li class="mobile-none">{{ NavBarselectedCategoryValue }}</li>
        </div>
      </n-popselect>
      <li v-if="!isLogin" @click="toResgist">註冊</li>
    </ul>
  </nav>

  <div class="searchLogin-container mobile-none">
    <div class="search-container">
      <div class="search-icon">
        <n-icon><Search /></n-icon>
      </div>
      <input
        @keydown.enter="enterKeyword"
        v-model="keyword"
        type="text"
        placeholder="search"
      />
    </div>
    <div class="login-container" v-if="isLogin">
      <div class="nav--avatar-container">
        <img :src="userDatas.avatar" alt="home-avatar" />
      </div>
      <n-dropdown :options="userDropDown" @select="toUserSelect">
        <span>{{ userDatas.name }}</span>
      </n-dropdown>
    </div>

    <nav class="btn-mobile-nav" @click="openMobileNav">
      <n-icon><ReorderThreeOutline /></n-icon>
    </nav>
  </div>
  <div class="mobile--searchLogin-container">
    <div :class="!isMobileSearch ? 'search-container' : 'close-mobileSearch'">
      <div class="search-icon">
        <n-icon><Search /></n-icon>
      </div>
      <input @click="toMobileSearch" placeholder="search" />
    </div>
    <div :class="isMobileSearch ? 'mobile--searchBar' : 'close-mobileSearch'">
      <div class="search-container mobile--searchBar-input">
        <input v-model="keyword" type="text" placeholder="search" />
        <div class="mobile--searchBar-submit" @click="enterKeyword">
          <n-icon><Search /></n-icon>
        </div>
        <div class="mobile--search-closeBtn" @click="closeMobileSearch">
          <n-icon><CloseOutline /></n-icon>
        </div>
      </div>
      <div class="mobile-line"></div>

      <div
        :class="
          !isMobileSearch ? 'close--mobile--tags' : 'mobile--tags-container'
        "
      >
        <n-tag
          v-for="tag in NavBarcategoryLists"
          @click="toTag(tag.value)"
          :color="{
            color: tagColor.color,
            textColor: tagColor.text,
            borderColor: tagColor.borderColor,
          }"
          >{{ tag.label }}</n-tag
        >
      </div>
    </div>
    <div class="login-container" v-if="isLogin">
      <div class="nav--avatar-container">
        <img :src="userDatas.avatar" alt="home-avatar" />
      </div>
      <n-dropdown
        class="nav--user-dropdown"
        :options="userDropDown"
        @select="toUserSelect"
      >
        <span>{{ userDatas.name }}</span>
      </n-dropdown>
    </div>

    <nav class="btn-mobile-nav" @click="openMobileNav">
      <n-icon><ReorderThreeOutline /></n-icon>
    </nav>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  reactive,
  onMounted,
  h,
  inject,
  provide,
  markRaw,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { NIcon } from "naive-ui";
import {
  Search,
  Pencil,
  ReorderThreeOutline,
  CloseOutline,
  PersonCircleOutline as UserIcon,
  LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5";
import { getAllCategorys } from "../../api/categoryApi";
import { useUserStore } from "../../store/user/authSave";
import { verifyLoggined } from "../../api/authApi";
import { removeToken, getToken } from "../../utils/verify";
import PrimaryButton from "../common/PrimaryButton.vue";
const router = useRouter();
const route = useRoute();
const NavBarcategoryLists = ref([]);
const NavBarselectedCategoryValue = ref("分類");
//手機板
const isMobileSearch = ref(false);

//----------props-------------///////

//發送
const emits = defineEmits(["selectCategory_value", "keyword", "handleLogOut"]);
//接收
const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});

//刷新
const onReload = inject("onReload");
const isLogin = ref(false);
//icon
const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};
//暫時使用映射方法 後面改為動態引入....////
const iconMap = {
  Pencil,
  LogoutIcon,
};
// user登入下拉;
const userDropDown = ref([]);
//分頁
const pageInfo = reactive({
  page: 1,
  pageSize: 5,
  pageCount: 0,
  count: 0,
});
/////---------------data-----------------////

const keyword = ref("");
const userDatas = reactive({
  name: "",
  avatar: "",
});
//驗證登入
const verifyLogin = async () => {
  try {
    if (route.meta.userData) {
      const data = await route.meta.userData;

      isLogin.value = true;
      userDropDown.value = data.menu;
      userDatas.name = data.user.account;
      userDatas.avatar = data.user.avatar;
      userDropDown.value = userDropDown.value.map((item) => {
        //圖標轉換成非響應式
        item.icon = markRaw(iconMap[item.icon]);
        item.icon = renderIcon(item.icon);

        return item;
      });
    } else {
      isLogin.value = false;

      removeToken();
    }
  } catch (error) {}
};

//載入列表
const loadCategoryData = async () => {
  const res = await getAllCategorys(pageInfo);

  //categoty select 轉換成符合組件的資料類別
  NavBarcategoryLists.value = res.data.data.data.map((item) => {
    return {
      label: item.name,
      value: item.name,
    };
  });
};
//選擇分類
// const selectedCategoryName = computed(() => {
//   let selected = NavBarcategoryLists.value.find((list) => {
//     return list.value === NavBarselectedCategoryValue.value;
//   });
//   return selected ? selected.value : "";
// });

//分類選擇到emits出去
const categorySearch = (selectCategory_value) => {
  emits("selectCategory_value", selectCategory_value);
  selectCategory_value = "";
};
//搜尋詞emits出去
const enterKeyword = () => {
  emits("keyword", keyword.value);
  keyword.value = "";
  isMobileSearch.value = false;
};
//tag
const toTag = (tag) => {
  emits("selectCategory_value", tag);
  tag = "";
  isMobileSearch.value = false;
};
// //tag 隨機顏色
// const randomColor = () => {
//   // const r = Math.random() * 255;
//   // const g = Math.random() * 255;
//   // const b = Math.random() * 255;
//   const tagColor = "#e0f2fe";
//   return tagColor;
// };
//tag顏色設定
const tagColor = {
  color: "#cbd5e1a1",
  text: "#f8fafc",
  borderColor: "#0284c7",
};
//跳轉
const toHome = () => {
  router.replace("/");
  isOpenNav.value = false;
};
const toResgist = () => {
  router.replace("/resgist");
};
const toDashboard = () => {
  router.replace("/dashBoard");
};

const toUserSelect = async (key) => {
  if (key === "editor") {
    router.push("/userCenter");
  }
  if (key === "dashBoard") {
    router.replace("/dashBoard");
  }
  if (key === "logout") {
    isLogin.value = false;
    emits("handleLogOut", isLogin.value);
    removeToken();
  }
};
//手機
const isOpenNav = ref(false);
const openMobileNav = () => {
  isOpenNav.value = !isOpenNav.value;
  isMobileSearch.value = false;
};
const toMobileSearch = () => {
  isMobileSearch.value = !isMobileSearch.value;
};
const closeMobileSearch = () => {
  isMobileSearch.value = false;
};
onMounted(() => {
  loadCategoryData();
  verifyLogin();
});
</script>

<style lang="scss" scoped>
@import "../../common/style/color.scss";

.logo-container {
  width: 15rem;
  height: 6.7rem;
  img {
    height: 100%;
  }
}

.nav-content {
  ul {
    display: flex;
    align-items: center;
    gap: 2rem;
    color: $primary-light;
    font-size: 2rem;
    cursor: pointer;

    li {
      line-height: 2rem;
      padding: 0.25rem 0.25rem;
      border: 1px solid transparent;
      transition: all 0.3s;
      &:hover {
        color: $font-gray;
        border: 1px solid $primary-light;
        background-color: $primary-light;
      }
    }
  }
}
.searchLogin-container {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  gap: 1.5rem;

  .search-container {
    position: relative;

    input {
      display: inline-block;
      border-radius: 2px;
      outline: none;
      padding: 0.5rem 0.75rem;
      caret-color: $fouce-color;
      padding-left: 2rem;
      &::placeholder {
        font-size: 1.85rem;
        letter-spacing: 0.5px;
        color: $font-gray;
      }
      &:focus {
        border-color: $fouce-color;
        box-shadow: 0 0 5px $fouce-color, 0 0 5px $fouce-color;
      }
    }
    .search-icon {
      position: absolute;
      bottom: 0;
      transform: translate(0, 10%);
      color: $font-gray;
      font-size: 2rem;
    }
  }
  .login-container {
    display: flex;
    gap: 0.75rem;
    cursor: pointer;
    .nav--avatar-container {
      background-color: #fff;
      overflow: hidden;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      img {
        width: 100%;
        height: 100%;
      }
      .nav--user-dropdown {
        .n-dropdown {
          z-index: 999;
        }
      }
    }
    span {
      font-size: 1.8rem;
      font-weight: 300;
      letter-spacing: 0.5px;
      color: $primary-light;
    }
  }
}
</style>
