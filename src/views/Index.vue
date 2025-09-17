<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import {useRoute} from 'vue-router';
const route = useRoute();
</script>

<template>
    <Navbar v-if="route.name != 'Home'"/>
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
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
