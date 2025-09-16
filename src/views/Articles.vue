<template>
  <div class="articles-page">
    <div class="nav-section">
      <h1 class="title">日记空间</h1>
    </div> 
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/store/article'

const router = useRouter()

onMounted(() => {

})


</script>

<style lang="scss" scoped>
.articles-page{
  width: 1200px;
  margin: 0 auto;
}
</style>