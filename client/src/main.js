import { createApp } from "vue";
import "./common/style/common.css";
import App from "./App.vue";
import { router } from "./common/router";
import { createPinia } from "pinia";
import { useAxios } from "./common/useAxios";
//引入naive的獨立api
import { createDiscreteApi, create, NButton, NCard } from "naive-ui";

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
import init from "./data/plugins/init.js";
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
const { message, notification, dialog, loadingBar } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
  "loadingBar",
]);

const app = createApp(App);
const pinia = createPinia();
const naive = create({
  components: [NButton, NCard],
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
app.provide("$axios", useAxios()); //不需要token
app.provide("$init", init);
app.mount("#app");
