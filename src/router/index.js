import { createRouter, createWebHistory,createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Index from "../views/Index.vue";
import About from "../views/About.vue";
import ArticleList from "../views/ArticleList.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import Articles from "../views/Articles.vue";
import Article from "../views/Article.vue";
import Portfolio from "../views/Portfolio.vue";
import Contact from "../views/Contact.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
      { path: "/about", name: "About", component: About },
      { path: "/articles", name: "Articles", component: () => import("@/views/Articles.vue") },
      {
        path: "/articles/:id",
        name: "ArticleDetail",
        component: ArticleDetail,
      },
      { path: "/new-article/:id", name: "Article", component: Article },
      { path: "/portfolio", name: "Portfolio", component: Portfolio },
      { path: "/contact", name: "Contact", component: Contact },
      {
        path: "/write-diary",
        name: "WriteDiary",
        component: () => import("@/views/WriteDiary.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
