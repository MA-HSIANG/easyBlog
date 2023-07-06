<template>
  <n-upload
    :max="1"
    list-type="image"
    :default-upload="false"
    @change="handleChange"
    @remove="handleRemove"
    multiple
    :file-list="fileList"
  >
    <n-upload-dragger>
      <div v-if="!previewShow && !oldImg">
        <n-icon size="120" :depth="3"><CloudUploadOutline /></n-icon>
      </div>
      <div v-if="previewShow && !oldImg">
        <n-image width="120" height="120" :src="previewImageUrl"></n-image>
      </div>
      <div v-if="!previewShow && oldImg">
        <n-image width="120" height="120" :src="oldUrl"></n-image>
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup>
import { defineComponent, ref, inject, watchEffect, nextTick } from "vue";
import { useRouter } from "vue-router";
import { NUpload, NUploadDragger, NIcon, NImage } from "naive-ui";
import { useAuthLogin } from "../store/user/auth";
import { useAuthCategory } from "../store/category/operate";
import { useAuthArticle } from "../store/article/list";
import { useAxios } from "../common/useAxios";
import { CloudUploadOutline } from "@vicons/ionicons5";

const $axios = inject("$axios");
const AuthLogin = useAuthLogin();
const AuthArticle = useAuthArticle();
const router = useRouter();
const token = ref("");
const $axiosToken = useAxios(true, token);
const msg = inject("message");

//封面回傳網址
const valueHtml = ref("");

//圖片
const newImage = ref(null);
const oldFile = ref(null);
const previewShow = ref(false);
const oldPreviewShow = ref(false);

const fileList = ref([]);
const emits = defineEmits([
  "update:imgFile",
  "update:oldFile",
  "update:previewShow",
]);
const props = defineProps({
  imgFile: {
    type: [File, Object, String, null],
    default: null,
    required: true,
  },
  oldFile: {
    type: [File, Object, String, null],
    default: null,
    required: true,
  },
  previewShow: {
    type: Boolean,
    default: false,
  },
  checkSave: {
    type: Boolean,
    default: false,
  },
});

//----添加封面
//預覽
const previewImageUrl = ref(null); //新增圖片預覽

//加入預覽
function handleChange(e) {
  newImage.value = e.file.file;
  oldFile.value = e.file.file;
  if (oldFile) {
    emits("update:oldFile", oldFile.value);
  }

  const imgUrl = new FileReader();
  imgUrl.readAsDataURL(newImage.value);
  //讀取預覽
  imgUrl.onload = (e) => {
    previewImageUrl.value = e.target.result;
    emits("update:imgFile", newImage.value);
    emits("update:previewShow", previewShow.value);
    previewShow.value = true;
    oldImg.value = false;
  };
}

//刪除預覽
function handleRemove(e) {
  setTimeout(() => {
    previewShow.value = false;
    oldImg.value = false;
    oldUrl.value = false;
    previewImageUrl.value = "";
    newImage.value = null;
  }, 200);
}
const oldImg = ref(false);
const oldUrl = ref("");
function isShow() {
  //更新載入舊圖片
  if (typeof oldFile.value === "string") {
    previewShow.value = false;
    oldImg.value = true;
    oldUrl.value = oldFile.value;
  } else {
    oldImg.value = false;
  }
}

watchEffect(() => {
  nextTick(() => {
    if (token) {
      token.value = AuthLogin.getToken();
    }
    newImage.value = props.imgFile;
    previewShow.value = props.previewShow;
    oldFile.value = props.oldFile;
    isShow();
  });
});
</script>
