import { createRouter, createWebHistory,createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Index from "../views/Index.vue";
import About from "../views/About.vue";

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
        path: "/article-detail/:id",
        name: "ArticleDetail",
        component: () => import("@/views/ArticleDetail/ArticleDetail.vue"),
      },
      { path: "/portfolio", name: "Portfolio", component: Portfolio },
      { path: "/contact", name: "Contact", component: Contact },
      {
        path: "/write-diary",
        name: "WriteDiary",
        component: () => import("@/views/WriteDiary.vue"),
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/Profile/Profile.vue"),
      },
      {
        path: '/profile-edit',
        name: "ProfileEdit",
        component: () => import("@/views/Profile/ProfileEdit.vue"),
      },
      {
        path: '/test',
        name: "Test",
        component: () => import("@/views/test.vue"),
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
