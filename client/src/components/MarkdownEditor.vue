<template>
  <v-md-editor
    v-model="valueHtml"
    @change="handleChange"
    height="400px"
    :disabled-menus="[]"
    @upload-image="handleUploadImage"
  ></v-md-editor>
</template>

<script setup>
import { ref, nextTick, onMounted, watchEffect, inject } from "vue";
import { useAxios } from "../common/useAxios";
import { useAuthLogin } from "../store/user/auth";
const authLogin = useAuthLogin();
const token = ref("");
const $axiosToken = useAxios(true, token);
const valueHtml = ref("");
const $init = inject("$init");
//建立article.content條件
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);

//輸入框默認值
onMounted(() => {
  nextTick(() => {
    valueHtml.value = props.modelValue;
  });
});
watchEffect(() => {
  valueHtml.value = props.modelValue;
});
function handleChange(text, html) {
  valueHtml.value = text;
  emit("update:modelValue", valueHtml.value);
}
async function handleUploadImage(event, insertImage, files) {
  //server Url
  const serverUrl = $init.renderUrl;
  // const serverUrl = "https://blog-server-6lno.onrender.com"; //網域上傳
  // 創建一個 FormData 物件
  const formData = new FormData();
  // 將文件添加到 FormData 物件
  formData.append("file", files[0]);
  const res = await $axiosToken.post(
    `/upload2/_token/rich_editor_upload2`,
    formData
  );
  const imgUrl = res.data.data.url;

  insertImage({
    url: `${serverUrl}${imgUrl}`,
    desc: valueHtml.value,
  });
}
watchEffect(() => {
  if (token) {
    token.value = authLogin.getToken();
  }
});
</script>
