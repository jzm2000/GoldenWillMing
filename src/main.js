import { createApp } from 'vue'
import App from './App.vue'
import "./api/request.js"
import router from './router'
import pinia from './store'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'normalize.css'
import './style.css'
import './styles/base.scss'
console.log(import.meta.env.MODE);
const app = createApp(App);
app.config.globalProperties.$baseURL = 'http://182.92.135.189';
// 注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
pinia.use(piniaPluginPersistedstate);
app.use(pinia)
app.use(router)
app.mount('#app')
