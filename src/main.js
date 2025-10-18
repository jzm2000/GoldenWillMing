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

const target = {
  siteRequest: window.siteRequest
};
let p = new Proxy(target, {
  get(target, prop) {
    return target[prop];
  },
  set(target, prop, value) {
    fetch(location.protocol + "//data.zz.baidu.com/urls?site=www.xqrjw.top&token=j8e2J2csVt86beiR", {
      method: "POST",
      body:JSON.stringify({
        data:location.href
      })
    }).then(res => res.json()).then(data => {
      console.log(data);
    });
    target[prop] = value;
  }
});
window.proxy = p;
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
