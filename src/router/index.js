import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ArticleList from '../views/ArticleList.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import Articles from '../views/Articles.vue'
import Article from '../views/Article.vue'
import Portfolio from '../views/Portfolio.vue'
import Contact from '../views/Contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/articles', name: 'Articles', component: Articles },
  { path: '/articles/:id', name: 'ArticleDetail', component: ArticleDetail },
  { path: '/new-article/:id', name: 'Article', component: Article },
  { path: '/portfolio', name: 'Portfolio', component: Portfolio },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/write-diary',name: 'WriteDiary',component:()=>import("@/views/WriteDiary.vue")}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router