<template>
  <div class="home">

    <!-- Hero Section -->
    <section class="hero">
      <Navbar v-if="route.name == 'Home'" color="#fff"/>
      <div class="container">
        <div class="hero-content">
          <div class="flex_box">
            <div class="flex_box hero-text-box">
              <span class="hero-text" ref="heroText"></span>
              <span class="line"></span>
            </div>
          </div>
          <div class="hero-buttons">
            <router-link to="/articles" class="btn btn-primary">浏览日记</router-link>
            <router-link to="/about" class="btn btn-secondary">了解更多</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Section -->
    <section class="featured">
      <div class="container">
        <h2 class="section-title">精选主题</h2>
        <div class="featured-cards">
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>前端开发</h3>
            <p>探索Vue、React等现代前端框架的最佳实践</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚙️</div>
            <h3>后端技术</h3>
            <p>分享Node.js、Python等后端开发经验</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>DevOps</h3>
            <p>学习容器化、CI/CD和云原生技术</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Articles Section -->
    <section class="latest-articles">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新日记</h2>
          <router-link to="/articles" class="view-all-link">查看全部</router-link>
        </div>
        <div class="articles-grid">
          <div 
            class="article-card" 
            v-for="article in latestArticles" 
            :key="article.id"
            @mouseenter="onArticleHover(article.id)"
            @mouseleave="onArticleLeave(article.id)"
          >
            <div class="article-image">
              <img :src="`https://picsum.photos/seed/${article.id}/600/400`" :alt="article.title" />
            </div>
            <div class="article-content">
              <div class="article-meta">
                <span class="article-date">{{ formatDate(article.date) }}</span>
                <span class="article-category">{{ article.category }}</span>
              </div>
              <h3>{{ article.title }}</h3>
              <p>{{ article.excerpt }}</p>
              <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }" class="read-more">
                阅读更多 →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content">
          <h2>订阅我的更新</h2>
          <p>获取最新日记和技术资讯，直接发送到您的邮箱</p>
          <form class="newsletter-form">
            <input type="email" placeholder="您的邮箱地址" class="email-input" />
            <button type="submit" class="btn btn-primary">订阅</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="jsx">
import Navbar from '@/components/Navbar.vue'
import { ref,onMounted,onUnmounted } from 'vue'
import { useArticleStore } from '../store/article'
import {useRoute} from 'vue-router';
const articleStore = useArticleStore();
const route = useRoute();
let heroText = ref(null);
let textList = ['天不生我金志明，人间万古如长夜。','日记里藏着时光的秘密。','日记是心灵的镜像，映照出最真实的自己。','日记是成长的刻度，标记着每一步蜕变。'];
let textIndex = 0;
let interval = null;
let timeout = null;
const latestArticles = ref(articleStore.getLatestArticles(3));
const hoveredArticle = ref(null)

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 处理日记卡片悬停效果
const onArticleHover = (id) => {
  hoveredArticle.value = id
}

const onArticleLeave = () => {
  hoveredArticle.value = null
}
// 模拟打字效果
const simulateTyping = (text, element,status = 1,delay = 100) => {
  let index = status == 1 ? 0 : text.length;
  //status 1 标识打字中，0 标识删除中
  interval = setInterval(() => {
    if (status == 0) {
      // clearInterval(interval);
      if (index <= 0) {
        clearInterval(interval);
        textIndex = (textIndex + 1) % textList.length;
        console.log(textIndex)
        timeout =setTimeout(()=>{
          simulateTyping(textList[textIndex], heroText.value,1);
        },1000);
        return;
      };
      index--;
      element.textContent = text.substring(0,index);
    } else {
      if (index >= text.length) {
        clearInterval(interval);
        timeout = setTimeout(()=>{
          simulateTyping(textList[textIndex], heroText.value,0);
        },2000)
        return;
      }
      element.textContent += text[index];
      index++;
    }
  }, delay);
}; 
onMounted(()=>{
  simulateTyping(textList[textIndex], heroText.value)
});
onUnmounted(()=>{
  console.log('unmounted')
  clearInterval(interval);
  clearTimeout(timeout);
})
</script>

<style scoped>
/* Hero Section */
.hero {
  /* background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); */
  background: url('@/assets/img/banner2.jpg') no-repeat center center;
  background-size: 100%;
  color: white;
  position: relative;
  overflow: hidden;
  .container{
     padding: 8rem 0 6rem;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: var(--font-size-5xl);
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: white;
  margin: 0;
}

.hero-content p {
  font-size: var(--font-size-xl);
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.btn-primary {
  background-color: white;
  color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--bg-color);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background-color: white;
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* Section Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 0 1.5rem; */
}

.featured,
.latest-articles {
  padding: 6rem 0;
}

.section-title {
  text-align: center;
  font-size: var(--font-size-3xl);
  margin-bottom: 3rem;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  margin: 1rem auto 0;
  border-radius: 2px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.section-header .section-title::after {
  display: none;
}

.view-all-link {
  color: var(--primary-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

/* Featured Cards */
.featured-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: var(--font-size-xl);
  margin-bottom: 1rem;
}

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
}

.article-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  padding: 1.5rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: var(--font-size-sm);
  color: var(--text-light);
}

.article-date,
.article-category {
  display: inline-block;
}

.article-category {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
}

.article-content h3 {
  font-size: var(--font-size-xl);
  margin-bottom: 1rem;
}

.article-content p {
  margin-bottom: 1.5rem;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.read-more:hover {
  transform: translateX(5px);
}

/* Newsletter Section */
.newsletter {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--accent-color) 100%);
  color: white;
  padding: 5rem 0;
  text-align: center;
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-content h2 {
  color: white;
  margin-bottom: 1rem;
  font-size: var(--font-size-3xl);
}

.newsletter-content p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  font-size: var(--font-size-lg);
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.email-input {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-size: var(--font-size-base);
  width: 100%;
  max-width: 400px;
  outline: none;
}

.email-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.newsletter-form .btn-primary {
  white-space: nowrap;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: var(--font-size-4xl);
  }
  
  .hero-content p {
    font-size: var(--font-size-lg);
  }
  
  .featured-cards,
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .newsletter-form {
    flex-direction: column;
    align-items: center;
  }
}
.hero-text-box{
  margin: 20px auto;
  padding: 16px;
  background: rgba(51, 47, 43, 0.4);
  justify-content: center;
  border-radius: 8px;
}
.hero-text{
  font-size: 20px;
  line-height: 20px;
}
.line{
  height: 20px;
  width: 3px;
  background-color: #fff;
  color: #fff;
  font-size:20px;
  margin-left: 0px;
  animation: hiddenShow 0.7s infinite;
  border-radius: 8px;
  margin-top: 1px;
  margin-left: 3px;
}
@keyframes hiddenShow {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>