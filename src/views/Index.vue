<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Setting from '@/components/Setting.vue'
import {useRoute} from 'vue-router';
const route = useRoute();

const isSticky = ref(false)


// 处理滚动事件
const handleScroll = () => {
  isSticky.value = window.scrollY >= 100
};


// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
});
</script>

<template>
    <Navbar :class="{ 'sticky': isSticky }"/>
    <main class="main-content" :class="{ 'navbar-sticky': isSticky }">
      <router-view />
    </main>
    <Footer />
    <Setting />
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  min-height: calc(100vh - 60px);
}

/* 为粘性导航栏添加主内容区域的上边距调整 */
.navbar-sticky {
  padding-top: 60px;
}
.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(10px);
  animation: slideDown 0.3s ease;
}
</style>
