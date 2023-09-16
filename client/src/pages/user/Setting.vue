<template>
  <loading class="loadingBar" v-if="isLoading">儲存中...</loading>
  <UserDataCard
    v-else
    :userDatas="userDatas"
    :likeCount="pageInfo.count"
    :isUpdate="true"
  >
    <template #uploadAvatar>
      <upload
        v-model:imgFile="imgFile"
        v-model:previewShow="previewShow"
      ></upload>
    </template>
    <template #update>
      <n-input
        v-model:value="userDatas.email"
        @keydown.enter="isSave"
        type="email"
        placeholder="請輸入郵件"
      />
    </template>
    <template #save>
      <PrimaryButton @click="isSave">
        <template #name>送出</template>
      </PrimaryButton>
    </template>
  </UserDataCard>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserDataCard from "../../components/userCenter/UserDataCard.vue";
import Upload from "../../components/Upload.vue";
import loading from "../../components/common/Loading.vue";
import { transformTime } from "../../utils/transformTime";
import PrimaryButton from "../../components/common/PrimaryButton.vue";

const router = useRouter();
const route = useRoute();
const message = inject("message");
const updateUserForm = ref(null);
const isEdit = ref(false);
const imgFile = ref(null);
const previewShow = ref(false);
const userDatas = reactive({
  id: "",
  avatar: "",
  name: "",
  email: "",
  create_time: "",
});

const isLoading = ref(false);
const onReload = inject("onReload");
import { uploadAvatar, updateUser } from "../../api/userApi";
import { getLikeBlogDatas } from "../../api/userApi";
import { removeToken } from "../../utils/verify";
//驗證取得資料
const getUserData = async () => {
  try {
    if (route.meta.userData) {
      const data = await route.meta.userData;
      userDatas.id = data.user.id;
      userDatas.avatar = data.user.avatar;
      userDatas.name = data.user.account;
      userDatas.email = data.user.email;
      userDatas.create_time = transformTime(data.user.create_time);
      oldAvatar.value = data.user.avatar;
    } else {
      removeToken();
    }
  } catch (error) {}
};

//分頁參數
const pageInfo = reactive({
  page: 1,
  pageSize: 8,
  //列表資料總數
  count: 0,
  //總頁數
  pageCount: 0,
});
const loadLikeBlogs = async () => {
  try {
    const res = await getLikeBlogDatas(pageInfo);
    if (res.status === 200) {
      pageInfo.count = res.data.counts;
      pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
    }
  } catch (error) {
    console.error(error);
  }
};

//儲存
async function isSave() {
  try {
    //頭貼
    isLoading.value = true;
    if (imgFile) {
      const formData = new FormData();
      formData.append("file", imgFile.value);
      const img = await uploadAvatar(formData);
      userDatas.avatar =
        img.data.data.url || import.meta.VITE_YOUR_AVATAR_DEFAULT_URL;
    }

    const res = await updateUser(userDatas);

    if (res.data.data.status === "success") {
      message.success(res.data.data.msg);
      imgFile.value = null;
      previewShow.value = false;
    }
    isLoading.value = false;
    router.push("/userCenter");
  } catch (error) {
    console.log(error);
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
}
const rules = {
  email: [
    {
      required: true,
      validator(rule, val) {
        if (!val) {
          return new Error("請輸入郵件...");
        }
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-z0-9]+$/.test(val)) {
          return new Error("請輸入正確的電子郵件格式...");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
};

onMounted(() => {
  getUserData();
  loadLikeBlogs();
});
</script>

<style lang="scss" scoped>
@import "../../common/style/color.scss";
:deep(.n-upload-dragger),
n-upload :deep(n-upload--dragger-inside) {
  border-radius: 50%;
  width: 9rem;
  height: 8rem;
  border: 2px solid $primary-color;
  overflow: hidden;
  .n-icon {
    font-size: 8rem;
  }
  .n-image {
    width: 9rem;
    height: 8rem;
  }
}

.n-button {
  width: 100%;
  font-size: 2rem;
  padding: 2rem 0;
}
</style>
