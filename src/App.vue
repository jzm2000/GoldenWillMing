<script setup>
import {useRoute} from 'vue-router';
const route = useRoute();
</script>

<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
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
