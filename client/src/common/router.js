import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import DashBoard from "../pages/dashBoard/DashBoardPage.vue";
import CateGory from "../pages/dashBoard/CateGoryPage.vue";
import Article from "../pages/dashBoard/ArticlePage.vue";
import DataPanel from "../pages/dashBoard/DataPanel.vue";
import DetailArticle from "../pages/NewDetail.vue";
import ResgistPage from "../pages/ResgistPage.vue";
import UserCenter from "../pages/user/UserCenter.vue";
import Setting from "../pages/user/Setting.vue";
import UserData from "../pages/user/Index.vue";
import LikeList from "../pages/user/LikeList.vue";
import RoleModif from "../pages/dashBoard/RoleModifPage.vue";
import { getBlog } from "../api/blogApi";
const findBlog = async (id) => {
  try {
    const res = await getBlog(id);

    if (res.data.user.data.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    consle.error(e);
  }
};
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { title: "首頁" },
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: DetailArticle,
    beforeEnter: async (to, from, next) => {
      const id = to.params.id;
      if (await findBlog(id)) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,

    meta: { userData: {}, title: "登錄" },
  },
  {
    path: "/resgist",
    name: "resgist",
    component: ResgistPage,
    meta: { title: "註冊" },
  },
  // {
  //   path: "/userCenter",
  //   name: "userCenter",
  //   component: UserCenter,
  //   meta: {
  //     verifyId: "user",
  //     title: "我的空間",
  //   },
  //   children: [
  //     {
  //       path: "/userCenter",
  //       name: "userCenter",
  //       component: UserData,
  //       meta: { title: "個人資料" },
  //     },
  //     {
  //       path: "setting",
  //       name: "setting",
  //       component: Setting,
  //       meta: { title: "設定" },
  //     },
  //     {
  //       path: "myLike",
  //       name: "myLike",
  //       component: LikeList,
  //       meta: { title: "我的點讚" },
  //     },
  //   ],
  // },
  {
    path: "/dashBoard",
    name: "dashBoard",

    meta: {
      verifyId: "admin",
      title: "後台管理",
    },
    component: DashBoard,
    children: [
      {
        path: "/dashBoard",
        name: "dashBoard",
        component: DataPanel,
        meta: { title: "後臺首頁" },
      },
      {
        path: "authorization",
        name: "authorization",
        component: RoleModif,
        meta: { title: "權限管理" },
      },
      {
        path: "category",
        name: "category",
        component: CateGory,
        meta: { title: "分類管理" },
      },
      {
        path: "article",
        name: "article",
        component: Article,
        meta: { title: "文章管理" },
      },
      //user
      {
        path: "userCenter",
        name: "userCenter",
        component: UserData,
        meta: { title: "個人資料" },
      },
      {
        path: "setting",
        name: "setting",
        component: Setting,
        meta: { title: "設定" },
      },
      {
        path: "myLike",
        name: "myLike",
        component: LikeList,
        meta: { title: "我的點讚" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saltRounds) {
    if (to.name === "detail") {
      return { top: 0 };
    }
  },
});

export { router };
