<template>
  <UserDataCard
    :userDatas="userDatas"
    :likeCount="pageInfo.count"
  ></UserDataCard>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { removeToken } from "../../utils/verify";
import { transformTime } from "../../utils/transformTime";
import { uploadAvatar, updateUser } from "../../api/userApi";
import UserDataCard from "../../components/userCenter/UserDataCard.vue";
import Upload from "../../components/Upload.vue";
import { getLikeBlogDatas } from "../../api/userApi";
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
    if (error.response.status === 419) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
    }
    if (error.response.status === 403) {
      message.error(error.response.data.msg);
      router.replace("/resgist");
    }
    if (error.response.status === 401) {
      message.error(error.response.data.msg);
      removeToken();
      router.replace("/resgist");
    }
  }
};

//編輯
const editor = () => {
  isEdit.value = true;
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
        img.data.data.url ||
        "http://localhost:3000/upload/avatar/defaultUser.jpg";
    }

    const res = await updateUser(userDatas);
    console.log(res);
    if (res.data.data.status === "success") {
      msg.success(res.data.data.msg);
      imgFile.value = null;
      previewShow.value = false;
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
      msg.error(error.response.data.msg);
    }
  }

  isEdit.value = false;
  isLoading.value = false;
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
