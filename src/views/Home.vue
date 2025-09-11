<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>欢迎来到<span class="text-primary">我的个人博客</span></h1>
          <p>探索技术世界，分享学习心得，记录成长历程</p>
          <div class="hero-buttons">
            <router-link to="/articles" class="btn btn-primary">浏览文章</router-link>
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
          <h2 class="section-title">最新文章</h2>
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
          <p>获取最新文章和技术资讯，直接发送到您的邮箱</p>
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
import { ref } from 'vue'
import { useArticleStore } from '../store/article'
const articleStore = useArticleStore();
console.log(articleStore)
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

// 处理文章卡片悬停效果
const onArticleHover = (id) => {
  hoveredArticle.value = id
}

const onArticleLeave = () => {
  hoveredArticle.value = null
}
</script>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 8rem 0 6rem;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat center bottom;
  background-size: cover;
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
</style>