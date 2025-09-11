<template>
  <div class="articles-page">
    <!-- 页面标题部分 -->
    <section class="articles-header">
      <div class="container">
        <h1 class="section-title">文章列表</h1>
        <p class="section-subtitle">探索我的技术分享与思考</p>
        <div class="title-underline"></div>
      </div>
    </section>

    <!-- 文章筛选器 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-wrapper">
          <div class="filter-tabs">
            <button 
              class="filter-tab" 
              :class="{ active: activeFilter === 'all' }" 
              @click="activeFilter = 'all'"
            >
              全部文章
            </button>
            <button 
              class="filter-tab" 
              :class="{ active: activeFilter === 'frontend' }" 
              @click="activeFilter = 'frontend'"
            >
              前端开发
            </button>
            <button 
              class="filter-tab" 
              :class="{ active: activeFilter === 'design' }" 
              @click="activeFilter = 'design'"
            >
              设计
            </button>
            <button 
              class="filter-tab" 
              :class="{ active: activeFilter === 'career' }" 
              @click="activeFilter = 'career'"
            >
              职业发展
            </button>
          </div>
          
          <div class="search-container">
            <input 
              type="text" 
              class="search-input" 
              placeholder="搜索文章..." 
              v-model="searchQuery"
              @input="debouncedSearch"
            />
            svg
          </div>
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="articles-list-section">
      <div class="container">
        <div class="articles-grid" v-if="filteredArticles.length > 0">
          <div 
            v-for="article in filteredArticles" 
            :key="article.id" 
            class="article-card"
            @click="navigateToArticle(article.id)"
          >
            <div class="article-image-wrapper">
              <img 
                :src="article.imageUrl"
                :alt="article.title"
                class="article-image"
                loading="lazy"
              />
              <div 
                class="article-category"
                :style="{ backgroundColor: getCategoryColor(article.category)}"
              >
                {{ getCategoryLabel(article.category) }}
              </div>
            </div>
            
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-meta">
                <div class="article-date">
                  svg
                  {{ formatDate(article.date) }}
                </div>
                <div class="article-read-time">
                  svg
                  {{ article.readTime }}
                </div>
                <div class="article-views">
                  svg
                  {{ article.views }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-articles">
          svg
          <p>暂无符合条件的文章</p>
          <button class="reset-button" @click="resetFilters">重置筛选条件</button>
        </div>
      </div>
    </section>

    <!-- 分页 -->
    <section class="pagination-section" v-if="totalPages > 1">
      <div class="container">
        <div class="pagination">
          <button 
            class="pagination-button"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            svg
            上一页
          </button>
          
          <div class="pagination-numbers">
            <button 
              v-for="page in visiblePages"
              :key="page"
              class="pagination-number"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-button"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            下一页
            svg
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/store/article'

const router = useRouter()
const articleStore = useArticleStore()

// 状态管理
const activeFilter = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6)
const searchTimeout = ref(null)

// 模拟文章数据
const articles = ref([
  {
    id: 1,
    title: "Vue3 Composition API完全指南",
    excerpt: "深入探索Vue3的Composition API，了解如何使用setup函数、响应式数据和生命周期钩子构建现代化的Vue应用。",
    category: "frontend",
    date: "2023-10-15",
    readTime: "12分钟",
    imageUrl: "https://picsum.photos/seed/vue3/800/500",
    views: 1243
  },
  {
    id: 2,
    title: "CSS Grid布局实战技巧",
    excerpt: "掌握CSS Grid布局系统，学习如何创建复杂的二维布局，让网页设计更加灵活和响应式。",
    category: "frontend",
    date: "2023-09-28",
    readTime: "8分钟",
    imageUrl: "https://picsum.photos/seed/cssgrid/800/500",
    views: 876
  },
  {
    id: 3,
    title: "UI设计中的色彩理论",
    excerpt: "了解色彩心理学和色彩搭配原则，提升你的UI设计水平，创建具有情感共鸣的用户界面。",
    category: "design",
    date: "2023-09-10",
    readTime: "10分钟",
    imageUrl: "https://picsum.photos/seed/color/800/500",
    views: 654
  },
  {
    id: 4,
    title: "前端性能优化实战",
    excerpt: "从网络请求、资源加载、渲染性能等多个维度，全面解析前端性能优化的实用技巧。",
    category: "frontend",
    date: "2023-08-22",
    readTime: "15分钟",
    imageUrl: "https://picsum.photos/seed/performance/800/500",
    views: 1567
  },
  {
    id: 5,
    title: "设计师与开发者的有效沟通",
    excerpt: "探讨设计师与开发者之间的协作模式和沟通技巧，打造高效的产品开发流程。",
    category: "career",
    date: "2023-08-05",
    readTime: "7分钟",
    imageUrl: "https://picsum.photos/seed/communication/800/500",
    views: 432
  },
  {
    id: 6,
    title: "TypeScript高级类型系统",
    excerpt: "深入学习TypeScript的高级类型特性，包括泛型、条件类型、映射类型等，提升代码质量和可维护性。",
    category: "frontend",
    date: "2023-07-18",
    readTime: "14分钟",
    imageUrl: "https://picsum.photos/seed/typescript/800/500",
    views: 1123
  },
  {
    id: 7,
    title: "用户体验设计原则",
    excerpt: "学习现代UX设计的核心原则，了解如何创建直观、易用且令人愉悦的用户体验。",
    category: "design",
    date: "2023-07-01",
    readTime: "9分钟",
    imageUrl: "https://picsum.photos/seed/ux/800/500",
    views: 789
  },
  {
    id: 8,
    title: "前端工程师职业发展路径",
    excerpt: "探讨前端工程师的职业发展方向和成长路径，帮助你规划自己的技术生涯。",
    category: "career",
    date: "2023-06-15",
    readTime: "11分钟",
    imageUrl: "https://picsum.photos/seed/career/800/500",
    views: 956
  }
])

// 计算属性
const filteredArticles = computed(() => {
  let filtered = articles.value
  
  // 按分类筛选
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(article => article.category === activeFilter.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.excerpt.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / itemsPerPage.value)
})

const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredArticles.value.slice(startIndex, endIndex)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisible - 1)
  
  // 调整起始页，确保显示足够的页码
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// 方法
const navigateToArticle = (id) => {
  router.push(`/article/${id}`)
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

const getCategoryLabel = (category) => {
  const labels = {
    frontend: '前端开发',
    design: '设计',
    career: '职业发展'
  }
  return labels[category] || category
}

const getCategoryColor = (category) => {
  const colors = {
    frontend: 'var(--primary-color)',
    design: 'var(--secondary-color)',
    career: 'var(--accent-color)'
  }
  return colors[category] || 'var(--text-color)'
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const resetFilters = () => {
  activeFilter.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
}

const debouncedSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1 // 搜索时重置到第一页
  }, 500)
}

// 监听筛选条件变化，重置页码
const watchFilters = () => {
  currentPage.value = 1
}

// 组件挂载时执行
onMounted(() => {
  // 这里可以添加实际的数据获取逻辑
  console.log('Articles page mounted')
})


</script>

<style scoped>
.articles-page {
  padding-bottom: 3rem;
}

/* 页面标题样式 */
.articles-header {
  padding: 4rem 0 2rem;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  position: relative;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  margin: 0 auto;
  border-radius: 2px;
}

/* 筛选器样式 */
.filter-section {
  padding: 2rem 0;
  background-color: var(--background-secondary);
}

.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-tab:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.filter-tab.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.search-container {
  position: relative;
  max-width: 300px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.7rem 2.5rem 0.7rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(45, 120, 210, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

/* 文章列表样式 */
.articles-list-section {
  padding: 3rem 0;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.article-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.article-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image {
  transform: scale(1.05);
}

.article-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.3rem 0.8rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.article-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-excerpt {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.article-date,
.article-read-time,
.article-views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 无文章提示 */
.no-articles {
  text-align: center;
  padding: 4rem 0;
}

.no-articles svg {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-articles p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.reset-button {
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.reset-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

/* 分页样式 */
.pagination-section {
  padding: 2rem 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.pagination-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.pagination-button:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.pagination-number:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination-number.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .filter-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .search-container {
    max-width: none;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .article-meta {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .article-image-wrapper {
    height: 180px;
  }
  
  .article-content {
    padding: 1.25rem;
  }
  
  .article-title {
    font-size: 1.2rem;
  }
}
</style>