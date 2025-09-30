<template>
  <div class="diary-space">
    <!-- 页面标题区域 -->
    <header class="diary-header">
      <div class="container">
        <h1 class="diary-title" data-text="我的日记空间">我的日记空间</h1>
        <p class="diary-subtitle">记录生活点滴，珍藏美好回忆</p>
        <div class="diary-stats">
          <span class="stat-item">
            <span class="stat-icon">📝</span>
            <span class="stat-number">{{ totalDiaries }}</span>
            <span class="stat-label">篇日记</span>
          </span>
          <span class="stat-item">
            <span class="stat-icon">📁</span>
            <span class="stat-number">{{ categories.length }}</span>
            <span class="stat-label">个分类</span>
          </span>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="diary-main">
      <div class="container">
        <div class="diary-layout">
          <!-- 侧边栏 - 分类和搜索 -->
          <aside class="diary-sidebar">
            <!-- 搜索框 -->
            <div class="search-section">
              <div class="search-input-wrapper">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="搜索日记内容..." 
                  class="search-input"
                />
                <span class="search-icon">🔍</span>
              </div>
            </div>

            <!-- 分类列表组件 -->
            <CategoryList 
              :categories="categories" 
              :diaries="diaries" 
              :active-category="activeCategory"
              @category-change="onCategoryChange"
            />

            <!-- 标签云组件 -->
            <TagsCloud 
              :tags="tags" 
              :selected-tags="selectedTags"
              @tag-toggle="onTagToggle"
              @clear-tags="clearAllTags"
            />

            <!-- 创建日记按钮 -->
            <div class="create-diary-section" @click="writeNewDiary">
              <button class="create-diary-btn">
                <span class="create-icon">✏️</span>
                写新日记
              </button>
            </div>
          </aside>

          <!-- 主内容 - 日记列表 -->
          <div class="diary-content">
            <!-- 筛选器和排序 -->
            <div class="diary-filters">
              <div class="filters-left">
                <span class="filter-info">
                  共找到 {{ filteredDiaries.length }} 篇日记
                </span>
                <span v-if="activeCategory !== 'all'" class="filter-active">
                  分类: {{ getCategoryName(activeCategory) }}
                </span>
                <span v-if="selectedTags.length > 0" class="filter-active">
                  标签: {{ selectedTags.length }} 个
                </span>
              </div>
              <div class="filters-right">
                <select v-model="sortBy" class="sort-select">
                  <option value="newest">最新优先</option>
                  <option value="oldest">最早优先</option>
                  <option value="popular">最受欢迎</option>
                </select>
                <button @click="resetFilters" class="reset-btn">
                  重置筛选
                </button>
              </div>
            </div>

            <!-- 日记列表 - 使用DiaryCard组件 -->
            <div class="diaries-grid">
              <DiaryCard 
                v-for="diary in diaries" 
                :key="diary.id"
                :diary="diary"
                :categories="categories"
                :tags="tags"
              />
            </div>

            <!-- 空状态 -->
            <div v-if="filteredDiaries.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <h3>暂无符合条件的日记</h3>
              <p class="flex justify-center items-center" style="column-gap:0.5rem;">尝试调整筛选条件或<button class="create-diary-btn small" @click="writeNewDiary">创建新的日记</button></p>
              <button class="create-diary-btn small" @click="resetFilters">
                重置筛选
              </button>
            </div>

            <!-- 分页组件 -->
            <Pagination 
              v-if="filteredDiaries.length > 0"
              :total-pages="totalPages"
              :current-page="queryParams.pageNum"
              @page-change="onPageChange"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- 最近活动区域 -->
    <section class="recent-activities">
      <div class="container">
        <h2 class="section-title">最新消息</h2>
        <div class="activities-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <span class="activity-icon">{{ activity.icon }}</span>
            <span class="activity-text">{{ activity.text }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive,computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/store/article'

import { getDiaryList,categoryList } from "@/api/index.js"

import DiaryCard from '@/components/DiaryCard.vue'
import CategoryList from '@/components/CategoryList.vue'
import TagsCloud from '@/components/TagsCloud.vue'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()
const articleStore = useArticleStore()

// 状态管理
const searchQuery = ref('')
const activeCategory = ref('all')
const selectedTags = ref([])
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(6)
const queryParams = reactive({
  pageSize:10,
  pageNum:1,
});

// 模拟数据 - 实际项目中应该从store获取
const categories = ref([
  { id: 'life', name: '生活随笔', icon: '🌟' },
  { id: 'work', name: '工作记录', icon: '💼' },
  { id: 'study', name: '学习笔记', icon: '📚' },
  { id: 'thought', name: '思想感悟', icon: '💭' },
  { id: 'travel', name: '旅行见闻', icon: '✈️' }
])

const tags = ref([
  { id: 1, name: '日常' },
  { id: 2, name: '思考' },
  { id: 3, name: '学习' },
  { id: 4, name: '成长' },
  { id: 5, name: '快乐' },
  { id: 6, name: '感悟' },
  { id: 7, name: '计划' },
  { id: 8, name: '反思' }
])

const diaries = ref([])

const recentActivities = ref([
  { id: 1, icon: '❤️', text: '张三点赞了你的日记', time: '1小时前' },
  { id: 2, icon: '💬', text: '李四评论了你的日记', time: '3小时前' },
  { id: 3, icon: '📝', text: '你创建了新日记《春日午后的咖啡时光》', time: '昨天' }
])

// 计算属性
const totalDiaries = computed(() => diaries.value.length)

const filteredDiaries = computed(() => {
  let result = diaries.value
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(diary => diary.categoryId === activeCategory.value)
  }
  
  // 按标签筛选
  if (selectedTags.value.length > 0) {
    result = result.filter(diary => 
      selectedTags.value.some(tagId => diary.tags.includes(tagId))
    )
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(diary => 
      diary.title.toLowerCase().includes(query) || 
      diary.excerpt.toLowerCase().includes(query)
    )
  }
  
  // 排序
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case 'popular':
      result.sort((a, b) => b.likes - a.likes)
      break
  }
  
  return result
})

const totalPages = ref(0);

const paginatedDiaries = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredDiaries.value.slice(startIndex, endIndex)
})

// 事件处理方法
const initData = () =>{
  getDiaryList({
    ...queryParams,
    categoryId:activeCategory.value || undefined,
    title:searchQuery.value
  }).then(res=>{
    if(res.code==200){
      diaries.value = res.data.rows;
      totalPages.value = res.data.total;
    }else{
      diaries.value = [];
      totalPages.value = 0;
    }
  })
};

const onCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
  queryParams.pageNum = 1;
  initData();
}
// 获取分类列表
const getCategoryList = async() =>{
  let res = await categoryList();
    if(res.code==200){
      categories.value = res.data;
      activeCategory.value = '';
      initData();
    }else{
      categories.value = [];
    }
}

const onTagToggle = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
  currentPage.value = 1 // 切换标签时重置到第一页
}

const clearAllTags = () => {
  selectedTags.value = []
  currentPage.value = 1 // 清除标签时重置到第一页
}

const onPageChange = (page) => {
  currentPage.value = page
}

const resetFilters = () => {
  searchQuery.value = ''
  activeCategory.value = 'all'
  selectedTags.value = []
  sortBy.value = 'newest'
  currentPage.value = 1
}

const getCategoryName = (categoryId) => {
  if(categoryId==''){
    return '全部'
  };
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.title : '未知'
}
// 事件执行
getCategoryList();



const writeNewDiary = () => {
  router.push({ name: 'WriteDiary',query:{ isEdit:false,categoryId:activeCategory.value } })
}

onMounted(() => {
  articleStore.loadArticles()
})
</script>

<style lang="scss" scoped>
:deep(*) {
  box-sizing: border-box;
}

// 定义一些全局CSS变量
:root {
  --primary-color: #ff7e67;
  --primary-light: #fff5f3;
  --accent-color: #ffac81;
  --secondary-color: #f9f871;
  --text-dark: #333;
  --text-medium: #666;
  --text-light: #999;
  --bg-color: #fffef7;
}

.diary-space {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.diary-header {
  background: linear-gradient(135deg, #ff7e67 0%, #ffac81 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(255, 126, 103, 0.2);
}

// 添加青春气息的装饰元素
.diary-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="25" cy="25" r="5" fill="rgba(255, 255, 255, 0.2)"/%3E%3Ccircle cx="75" cy="25" r="8" fill="rgba(255, 255, 255, 0.2)"/%3E%3Ccircle cx="25" cy="75" r="7" fill="rgba(255, 255, 255, 0.2)"/%3E%3Ccircle cx="75" cy="75" r="6" fill="rgba(255, 255, 255, 0.2)"/%3E%3Ccircle cx="50" cy="50" r="10" fill="rgba(255, 255, 255, 0.2)"/%3E%3C/svg%3E') repeat;
  opacity: 0.4;
  animation: waveMove 20s linear infinite;
}

// 添加波浪装饰
.diary-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: url('data:image/svg+xml,%3Csvg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill="rgba(255, 255, 255, 0.1)" fill-opacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"%3E%3C/path%3E%3C/svg%3E');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.diary-header .container {
  text-align: center;
  position: relative;
  z-index: 1;
}

.diary-title {
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out, floatTitle 5s ease-in-out infinite;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
}

// 标题文字渐变效果
.diary-title::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #f9f871, #ffeb3b, #f9f871);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: -1;
  opacity: 0.7;
  mix-blend-mode: overlay;
  animation: gradientText 3s ease infinite;
}

.diary-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.diary-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  transition: transform 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-item:hover {
  transform: translateY(-5px) scale(1.05);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 1.4rem;
  background: rgba(255, 255, 255, 0.2);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.stat-number {
  font-weight: 800;
  font-size: 1.4rem;
  background: linear-gradient(135deg, #f9f871 0%, #ffeb3b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: gradientText 3s ease infinite;
}

.stat-label {
  font-weight: 500;
  opacity: 0.95;
}

.diary-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 1.3rem;
}

.stat-number {
  font-weight: 700;
  font-size: 1.3rem;
}

.diary-main {
  padding-bottom: 3rem;
}

.diary-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.diary-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.search-section {
  margin-bottom: 2rem;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9e9e9e;
}

.create-diary-section {
  margin-bottom: 2rem;
}

.create-diary-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.create-diary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.create-diary-btn.small {
  width: auto;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.diary-content {
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.diary-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  background-color: white;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.filters-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-info {
  color: var(--text-medium);
}

.filter-active {
  background-color: var(--primary-light);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.filters-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.reset-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #f5f5f5;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.diaries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-out;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.empty-state p {
  font-size: 1rem;
  color: var(--text-medium);
  margin-bottom: 1.5rem;
}

.recent-activities {
  background-color: white;
  padding: 2rem 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 3rem;
  animation: fadeInUp 0.8s ease-out 1s both;
}

.recent-activities .section-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-dark);
  font-size: 1.5rem;
}

.activities-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background-color: #fafafa;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.activity-item:hover {
  background-color: #f5f5f5;
  transform: translateX(5px);
  border-color: var(--primary-light);
}

.activity-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.activity-text {
  flex: 1;
  color: var(--text-dark);
}

.activity-time {
  font-size: 0.875rem;
  color: var(--text-light);
  flex-shrink: 0;
}

// 动画定义
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 标题浮动动画
@keyframes floatTitle {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

// 渐变文字动画
@keyframes gradientText {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// 波浪移动动画
@keyframes waveMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100px 0;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .diary-layout {
    grid-template-columns: 1fr;
  }
  
  .diary-sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .search-section,
  .create-diary-section {
    grid-column: 1 / -1;
  }
  
  .diaries-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .diary-title {
    font-size: 2rem;
  }
  
  .diary-subtitle {
    font-size: 1rem;
  }
  
  .diary-stats {
    gap: 1.5rem;
  }
  
  .diary-sidebar {
    grid-template-columns: 1fr;
  }
  
  .diary-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filters-left,
  .filters-right {
    justify-content: center;
  }
  
  .diaries-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .diary-title {
    font-size: 1.75rem;
  }
  
  .diary-header {
    padding: 2rem 0;
  }
  
  .activities-list {
    padding: 0 1rem;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>