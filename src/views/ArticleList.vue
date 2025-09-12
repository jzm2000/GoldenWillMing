<template>
  <div class="article-list">
    <h1>日记列表</h1>
    <div class="article-card" v-for="article in articles" :key="article.id">
      <h2>{{ article.title }}</h2>
      <p class="date">{{ article.date }}</p>
      <p class="excerpt">{{ article.excerpt }}</p>
      <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }" class="read-more">阅读全文</router-link>
    </div>
  </div>
</template>

<script setup>
import { useArticleStore } from '../store/article'

const articleStore = useArticleStore()
const articles = articleStore.articles
</script>

<style scoped>
.article-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.article-card {
  border-bottom: 1px solid #e0e0e0;
  padding: 2rem 0;
}

.date {
  color: #666;
  font-size: 0.9rem;
}

.excerpt {
  margin: 1rem 0;
  line-height: 1.6;
}

.read-more {
  display: inline-block;
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}
</style>