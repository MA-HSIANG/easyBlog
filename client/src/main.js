import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./common/router";
import { createPinia } from "pinia";
import "./common/style/main.scss";
import "./common/style/color.scss";
import "./common/style/rwd.scss";
//引入naive的獨立api
import {
  createDiscreteApi,
  create,
  NButton,
  NCard,
  NDropdown,
  NAvatar,
  NTag,
  NPopselect,
  NInput,
  NIcon,
  NThing,
  NSpace,
  NUpload,
  NUploadDragger,
  NImage,
  NDataTable,
  NLayout,
  NMenu,
  NLayoutSider,
  NGrid,
  NGi,
  NGridItem,
  NList,
  NListItem,
  NTable,
  NTabs,
  NTabPane,
  NForm,
  NFormItem,
  NModal,
  NSelect,
  NPagination,
  NScrollbar,
  NEmpty,
  NSpin,
} from "naive-ui";
//引入markdown
import VMdEditor from "@kangc/v-md-editor";
import VMdPreviewHtml from "@kangc/v-md-editor/lib/preview-html";
import "@kangc/v-md-editor/lib/style/preview-html.css";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import zhTW from "@kangc/v-md-editor/lib/lang/zh-TW";
// highlightjs
import hljs from "highlight.js";

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
//引入api
import { verifyId, verifyLoggined } from "./api/authApi";
import { removeToken } from "./utils/verify";

const { message, notification, dialog, loadingBar } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
  "loadingBar",
]);

const app = createApp(App);
const pinia = createPinia();
const naive = create({
  components: [
    NButton,
    NCard,
    NDropdown,
    NAvatar,
    NTag,
    NPopselect,
    NInput,
    NIcon,
    NThing,
    NSpace,
    NUpload,
    NUploadDragger,
    NImage,
    NDataTable,
    NLayout,
    NMenu,
    NLayoutSider,
    NGrid,
    NGi,
    NGridItem,
    NList,
    NListItem,
    NTable,
    NTabs,
    NTabPane,
    NForm,
    NFormItem,
    NModal,
    NSelect,
    NPagination,
    NScrollbar,
    NEmpty,
    NSpin,
  ],
});

app.use(pinia);
app.use(router);
app.use(VMdEditor);
app.use(VMdPreviewHtml);
app.use(naive);

VMdEditor.lang.use("zh-TW", zhTW);
app.provide("message", message);
app.provide("notification", notification);
app.provide("dialog", dialog);
app.provide("loadingBar", loadingBar);

//-------------全局導航 判定登錄狀態
router.beforeEach(async (to, from, next) => {
  try {
    // 檢查登錄狀態
    const res = await verifyLoggined();
    if (res.data.status === "success") {
      to.meta.userData = res.data.data;
      if (to.name === "login" || to.name === "resgist") {
        next("/");
      }
    } else {
      next();
    }
  } catch (error) {
    //尚未登錄狀態
  }
  next();
});
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "easyBlog";
  }
  next();
});

//-------------全局解析守衛
//身分判別
router.beforeResolve(async (to, from, next) => {
  if (to.meta.verifyId === "admin") {
    try {
      const res = await verifyId();
      const idCard = res.data.data.idCard;

      if (idCard === "user") {
        next("/");
      } else {
        next();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          if (error.response.status === 403) {
            message.error(error.response.data.msg);
            next("/resgist");
          }
          if (error.response.status === 419) {
            message.error(error.response.data.msg);
            removeToken();
            next("/resgist");
          }
          if (error.response.status === 401) {
            message.error(error.response.data.msg);
            removeToken();
            next("/resgist");
          }
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  } else {
    next();
  }
});

app.mount("#app");
