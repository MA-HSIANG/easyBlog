<template>
  <div>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
  </div>
</template>

<script setup>
import {
  defineComponent,
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  defineEmits,
  nextTick,
  inject,
  watchEffect,
} from "vue";

import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { i18nAddResources, i18nChangeLanguage, t } from "@wangeditor/editor";

defineComponent({
  Editor,
  Toolbar,
});
// 添加新语言
i18nAddResources("tw", {
  // 标题
  header: {
    title: "標題",
    text: "正文",
  },
  blockQuote: {
    title: "引用",
  },
  textStyle: {
    bold: "粗體",
  },
});

// 切换为 tw
i18nChangeLanguage("tw");

//時例
const editorRef = shallowRef();

const toolbarConfig = {};
toolbarConfig.excludeKeys = ["uploadVideo"]; //去除菜單

const editorConfig = { placeholder: "請輸入內容..." };
const mode = ref("default");
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
//axios
const $axios = inject("$axios");
// 编辑器回调函数
const handleCreated = (editor) => {
  console.log("created", editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
//建立article.content條件
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const valueHtml = ref("");
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
//文本輸入值
const handleChange = (editor) => {
  emit("update:modelValue", valueHtml.value);
};
//圖片上傳 預計封裝
const serverUrl = "http://localhost:3000";
editorConfig.MENU_CONF = {};
editorConfig.MENU_CONF["uploadImage"] = {
  base64LimitSize: 10 * 1024, // 10kb
  server: `${serverUrl}/upload/rich_editor_upload`,
};
editorConfig.MENU_CONF["insertImage"] = {
  parseImageSrc: (src) => {
    if (src.indexOf("http") !== 0) {
      return `${serverUrl}${src}`;
    }
    return src;
  },
};
// // ajax異步
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = "<p模擬ajax</p>";
//   }, 1500);
// });
</script>

<style lang="scss" scoped></style>
