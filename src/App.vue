<script setup>
import { zhCN, dateZhCN } from 'naive-ui'
import {useRoute} from 'vue-router';
import {useCheckVersion} from "./hooks/useCheckVersion.js";
import { onMounted,ref } from "vue";
const route = useRoute();
const zhCNConfig = {
  ...zhCN,
  date: dateZhCN
}
const { needRefresh, refreshPage,setLocalVersion } = useCheckVersion();
// 用户自己确认是否刷新页面
let isSign = ref(true);

onMounted(()=>{
    if(!import.meta.env.PROD) return;
    setInterval(()=>{
      if(needRefresh.value && isSign.value){
          isSign.value = confirm("发现新版本，是否刷新页面？");
          if(isSign.value){
              setLocalVersion();
              refreshPage();
          }
      }
    },5000);
})

window.addEventListener("click", function (e) {
  let r = 50;
  let x = e.clientX;
  let y = e.clientY;
  let div = document.createElement("div");
  div.classList.add("wave");
  div.style.pointerEvents = "none";
  div.style.background = 'linear-gradient(45deg, var(--primary-color), var(--primary-light))';
  div.style.left = `${x - r}px`;
  div.style.top = `${y - r}px`;
  div.style.width = `${r * 2}px`;
  div.style.height = `${r * 2}px`;
  document.body.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 500);
});
</script>

<template>
  <n-config-provider :locale="zhCNConfig" :date-locale="zhCNConfig.date">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  /* flex: 1; */
  transition: all 0.3s ease;
  min-height: calc(100vh - 205px);
}

/* 为粘性导航栏添加主内容区域的上边距调整 */
.navbar-sticky ~ .main-content {
  padding-top: 80px;
}

</style>
