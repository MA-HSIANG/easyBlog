import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import DashBoard from "../dashboard/DashBoard.vue";
import CateGory from "../dashboard/CateGory.vue";
import Article from "../dashboard/Article.vue";
import CreateAdmin from "../dashboard/admin/CreateAdmin.vue";
import DetailArticle from "../pages/DetailArticle.vue";
import ResgistPage from "../pages/ResgistPage.vue";
import UserCenter from "../pages/user/UserCenter.vue";
import Setting from "../pages/user/Setting.vue";
import LikeList from "../pages/user/LikeList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/detail",
    name: "detail",
    component: DetailArticle,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/resgist",
    name: "resgist",
    component: ResgistPage,
  },
  {
    path: "/userCenter",
    name: "userCenter",
    component: UserCenter,
    children: [
      {
        path: "setting",
        name: "setting",
        component: Setting,
      },
      {
        path: "myLike",
        name: "myLike",
        component: LikeList,
      },
    ],
  },
  {
    path: "/dashBoard",
    name: "dashBoard",
    component: DashBoard,
    children: [
      {
        path: "category",
        name: "category",
        component: CateGory,
      },
      {
        path: "article",
        name: "article",
        component: Article,
      },
      {
        path: "createAdmin",
        name: "createAdmin",
        component: CreateAdmin,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes,
});

export { router };
