<template>
  <div class="article-detail">
    <div v-if="article" class="article-content">
      <h1>{{ article.title }}</h1>
      <p class="date">{{ article.date }}</p>
      <div class="content">
        {{ article.content }}
      </div>
      <router-link to="/articles" class="back-link">← 返回日记列表</router-link>
    </div>
    <div v-else class="not-found">
      <h2>日记未找到</h2>
      <p>抱歉，请求的日记不存在。</p>
      <router-link to="/articles" class="back-link">← 返回日记列表</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useArticleStore } from '../store/article'
import { onMounted } from 'vue'

const route = useRoute()
const articleStore = useArticleStore()
const article = articleStore.getArticleById(Number(route.params.id))

onMounted(() => {
  articleStore.loadArticles()
})
</script>

<style scoped>
.article-detail {
  width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.date {
  color: #666;
  font-size: 0.9rem;
  margin: 1rem 0;
}

.content {
  line-height: 1.8;
  margin: 2rem 0;
  font-size: 1.1rem;
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: #42b983;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.not-found {
  text-align: center;
  padding: 4rem 0;
}
</style>