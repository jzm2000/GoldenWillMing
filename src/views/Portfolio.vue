<template>
  <div class="portfolio-page">
    <!-- 页面标题 -->
    <div class="hero-section">
      <div class="container">
        <h1 class="page-title">我的作品集</h1>
        <p class="page-subtitle">精选项目展示</p>
        <div class="title-decoration"></div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <div class="container">
        <div class="filter-wrapper">
          <div class="filter-controls">
            <button 
              v-for="filter in filters" 
              :key="filter.id"
              :class="{ active: activeFilter === filter.id }"
              class="filter-button"
              @click="setFilter(filter.id)"
            >
              {{ filter.name }}
            </button>
          </div>
          <div class="sort-controls">
            <select 
              v-model="sortBy" 
              class="sort-select"
              @change="sortProjects"
            >
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
              <option value="name-asc">名称升序</option>
              <option value="name-desc">名称降序</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 作品网格 -->
    <div class="portfolio-section">
      <div class="container">
        <div class="portfolio-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card"
            @click="openProjectDetail(project)"
          >
            <div class="project-card-image-wrapper">
              <img 
                :src="project.images[0]"
                :alt="project.title"
                class="project-card-image"
                loading="lazy"
              />
              <div class="project-card-overlay">
                <div class="project-card-overlay-content">
                  <h3 class="project-card-title">{{ project.title }}</h3>
                  <p class="project-card-description">{{ project.description }}</p>
                  <div class="project-card-actions">
                    <span class="project-card-category">{{ getCategoryName(project.category) }}</span>
                    <button class="project-card-view-button">查看详情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="filteredProjects.length === 0" class="empty-state">
          svg
          <h3>暂无匹配的项目</h3>
          <p>尝试选择其他筛选条件</p>
        </div>
      </div>
    </div>

    <!-- 项目详情模态框 -->
    <div class="project-modal" :class="{ open: isProjectModalOpen }" v-if="isProjectModalOpen">
      <div class="project-modal-backdrop" @click="closeProjectDetail"></div>
      <div class="project-modal-content">
        <button class="project-modal-close" @click="closeProjectDetail">
          svg
        </button>
        
        <div class="project-detail">
          <!-- 项目图片轮播 -->
          <div class="project-images">
            <div class="image-slider">
              <div class="slider-wrapper" :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
                <img 
                  v-for="(image, index) in currentProject.images" 
                  :key="index"
                  :src="image" 
                  :alt="currentProject.title"
                  class="slider-image"
                  loading="lazy"
                />
              </div>
              
              <!-- 轮播控制 -->
              <div class="slider-controls">
                <button 
                  class="slider-button prev"
                  @click="prevImage"
                  :disabled="currentImageIndex === 0"
                >
                  svg
                </button>
                <button 
                  class="slider-button next"
                  @click="nextImage"
                  :disabled="currentImageIndex === currentProject.images.length - 1"
                >
                  svg
                </button>
              </div>
            </div>
            
            <!-- 缩略图导航 -->
            <div class="thumbnails">
              <button 
                v-for="(image, index) in currentProject.images" 
                :key="index"
                :class="{ active: index === currentImageIndex }"
                class="thumbnail"
                @click="setCurrentImage(index)"
              >
                <img :src="image" :alt="`缩略图 ${index + 1}`" class="thumbnail-image" loading="lazy"/>
              </button>
            </div>
          </div>
          
          <!-- 项目信息 -->
          <div class="project-info">
            <div class="project-meta">
              <span class="project-category">{{ getCategoryName(currentProject.category) }}</span>
              <span class="project-date">{{ formatDate(currentProject.date) }}</span>
            </div>
            <h2 class="project-title">{{ currentProject.title }}</h2>
            
            <div class="project-description">
              <p>{{ currentProject.description }}</p>
              <p v-for="paragraph in currentProject.details" :key="paragraph.id">{{ paragraph.text }}</p>
            </div>
            
            <!-- 技术栈 -->
            <div class="project-technologies">
              <h4>技术栈</h4>
              <div class="tech-tags">
                <span v-for="tech in currentProject.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
            </div>
            
            <!-- 项目链接 -->
            <div class="project-links">
              <a 
                v-if="currentProject.links.live" 
                :href="currentProject.links.live" 
                target="_blank" 
                rel="noopener noreferrer"
                class="project-link"
              >
                svg
                在线演示
              </a>
              <a 
                v-if="currentProject.links.github" 
                :href="currentProject.links.github" 
                target="_blank" 
                rel="noopener noreferrer"
                class="project-link github"
              >
                svg
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选器数据
const filters = [
  { id: 'all', name: '全部' },
  { id: 'web', name: '网站开发' },
  { id: 'app', name: '应用开发' },
  { id: 'ui', name: 'UI设计' },
  { id: 'other', name: '其他项目' }
]

// 状态管理
const activeFilter = ref('all')
const sortBy = ref('newest')
const isProjectModalOpen = ref(false)
const currentProject = ref(null)
const currentImageIndex = ref(0)

// 项目数据
const projects = ref([
  {
    id: 1,
    title: "电商平台网站",
    description: "一个功能完整的电商平台，包含商品展示、购物车、订单管理、支付集成等功能。",
    category: "web",
    date: "2023-09-15",
    images: [
      "https://picsum.photos/seed/ecommerce1/800/500",
      "https://picsum.photos/seed/ecommerce2/800/500",
      "https://picsum.photos/seed/ecommerce3/800/500"
    ],
    technologies: ["React", "Node.js", "MongoDB", "Express", "Redux"],
    links: {
      live: "#",
      github: "#"
    },
    details: [
      { id: 1, text: "这个电商平台采用现代前后端分离架构，前端使用React构建用户界面，后端使用Node.js和Express提供RESTful API，MongoDB作为数据库存储商品和用户信息。" },
      { id: 2, text: "平台实现了完整的用户认证系统、商品搜索和筛选功能、购物车管理、订单处理流程以及支付集成。界面设计遵循现代UI/UX原则，确保良好的用户体验。" },
      { id: 3, text: "项目还包含了管理员后台，用于管理商品、订单和用户信息，以及销售数据分析功能。" }
    ]
  },
  {
    id: 2,
    title: "任务管理应用",
    description: "一个直观的任务管理应用，支持团队协作、任务分配、进度跟踪等功能。",
    category: "app",
    date: "2023-07-22",
    images: [
      "https://picsum.photos/seed/task1/800/500",
      "https://picsum.photos/seed/task2/800/500",
      "https://picsum.photos/seed/task3/800/500"
    ],
    technologies: ["Vue3", "Firebase", "Tailwind CSS", "Chart.js"],
    links: {
      live: "#",
      github: "#"
    },
    details: [
      { id: 1, text: "任务管理应用使用Vue3和Composition API构建，利用Firebase提供的实时数据库和认证服务实现数据同步和用户管理。" },
      { id: 2, text: "应用提供看板、列表和日历三种视图模式，用户可以根据自己的偏好选择最适合的任务管理方式。支持任务拖放功能，方便快速调整任务状态。" },
      { id: 3, text: "团队协作功能允许创建和管理项目团队，分配任务，设置截止日期，添加评论和附件，以及生成项目进度报告。" }
    ]
  },
  {
    id: 3,
    title: "个人博客系统",
    description: "一个基于Markdown的个人博客系统，支持日记发布、分类标签、评论等功能。",
    category: "web",
    date: "2023-06-10",
    images: [
      "https://picsum.photos/seed/blog1/800/500",
      "https://picsum.photos/seed/blog2/800/500",
      "https://picsum.photos/seed/blog3/800/500"
    ],
    technologies: ["Next.js", "GraphQL", "Sanity.io", "Vercel"],
    links: {
      live: "#",
      github: "#"
    },
    details: [
      { id: 1, text: "个人博客系统采用Next.js框架构建，支持静态生成和服务端渲染，提高网站性能和SEO表现。" },
      { id: 2, text: "内容管理使用Sanity.io作为无头CMS，通过GraphQL API获取数据，实现了Markdown编辑、日记分类、标签管理、评论功能等。" },
      { id: 3, text: "界面设计简洁现代，响应式布局适配各种设备屏幕，支持深色模式切换，提供良好的阅读体验。" }
    ]
  },
  {
    id: 4,
    title: "健身追踪APP界面",
    description: "一款健身追踪应用的UI设计，包含仪表盘、锻炼记录、营养跟踪等功能界面。",
    category: "ui",
    date: "2023-05-05",
    images: [
      "https://picsum.photos/seed/fitness1/800/500",
      "https://picsum.photos/seed/fitness2/800/500",
      "https://picsum.photos/seed/fitness3/800/500"
    ],
    technologies: ["Figma", "UI/UX设计", "原型设计"],
    links: {
      live: "#",
      github: ""
    },
    details: [
      { id: 1, text: "健身追踪应用UI设计注重用户体验，采用直观的界面布局和清晰的视觉层次，帮助用户轻松记录和追踪健身数据。" },
      { id: 2, text: "设计包含数据可视化图表，直观展示用户的健身进度和成就，激励用户坚持锻炼。色彩方案选择了充满活力的蓝色和橙色，传达健康和活力的品牌形象。" },
      { id: 3, text: "交互设计上，添加了平滑的过渡动画和微交互效果，提升用户体验和界面吸引力。设计稿已转换为可交互原型，用于用户测试和开发参考。" }
    ]
  },
  {
    id: 5,
    title: "天气预报应用",
    description: "一个功能丰富的天气预报应用，提供实时天气、未来预报、空气质量等信息。",
    category: "app",
    date: "2023-04-18",
    images: [
      "https://picsum.photos/seed/weather1/800/500",
      "https://picsum.photos/seed/weather2/800/500",
      "https://picsum.photos/seed/weather3/800/500"
    ],
    technologies: ["Flutter", "Dart", "OpenWeather API", "Hive"],
    links: {
      live: "#",
      github: "#"
    },
    details: [
      { id: 1, text: "天气预报应用使用Flutter框架开发，支持跨平台运行，提供了一致的用户体验。应用集成了OpenWeather API获取实时天气数据和预报信息。" },
      { id: 2, text: "界面设计采用了卡片式布局，直观展示当前天气状况、未来7天预报、每小时预报以及空气质量指数等信息。添加了天气动画效果，增强视觉体验。" },
      { id: 3, text: "应用支持保存多个城市、位置搜索、单位切换等功能，并使用Hive进行本地数据存储，确保在离线状态下也能查看已缓存的天气信息。" }
    ]
  },
  {
    id: 6,
    title: "音乐播放器网页版",
    description: "一个现代化的音乐播放器网页应用，支持播放控制、歌单管理、歌词显示等功能。",
    category: "web",
    date: "2023-03-25",
    images: [
      "https://picsum.photos/seed/music1/800/500",
      "https://picsum.photos/seed/music2/800/500",
      "https://picsum.photos/seed/music3/800/500"
    ],
    technologies: ["React", "Redux Toolkit", "Styled Components", "Web Audio API"],
    links: {
      live: "#",
      github: "#"
    },
    details: [
      { id: 1, text: "音乐播放器网页应用使用React和Redux Toolkit构建，利用Web Audio API实现音频播放和可视化效果。" },
      { id: 2, text: "界面设计参考了主流音乐平台，包含侧边栏导航、主内容区、底部播放控制栏等部分。支持歌单创建和管理、歌曲搜索、播放历史记录等功能。" },
      { id: 3, text: "添加了音频可视化效果、歌词同步显示、暗黑模式切换等增强用户体验的功能。响应式设计适配桌面和移动设备。" }
    ]
  },
  {
    id: 7,
    title: "企业品牌重塑",
    description: "为一家科技初创公司完成的品牌重塑项目，包括logo设计、色彩系统和品牌指南。",
    category: "ui",
    date: "2023-02-10",
    images: [
      "https://picsum.photos/seed/brand1/800/500",
      "https://picsum.photos/seed/brand2/800/500",
      "https://picsum.photos/seed/brand3/800/500"
    ],
    technologies: ["Adobe Illustrator", "Figma", "品牌设计"],
    links: {
      live: "",
      github: ""
    },
    details: [
      { id: 1, text: "为科技初创公司完成的品牌重塑项目，基于公司核心价值观和目标受众，设计了全新的品牌标识和视觉系统。" },
      { id: 2, text: "项目包括logo设计、色彩系统开发、排版规范、图形元素设计等内容。新的品牌形象更加现代、专业，能够更好地传达公司的创新精神和技术实力。" },
      { id: 3, text: "设计了完整的品牌指南，确保在不同应用场景下的品牌一致性。项目成果得到了客户的高度认可，并已应用于公司的产品、网站和营销材料中。" }
    ]
  },
  {
    id: 8,
    title: "数据可视化仪表盘",
    description: "一个用于展示业务数据的可视化仪表盘，支持多种图表类型和交互式数据分析。",
    category: "other",
    date: "2023-01-05",
    images: [
      "https://picsum.photos/seed/dashboard1/800/500",
      "https://picsum.photos/seed/dashboard2/800/500",
      "https://picsum.photos/seed/dashboard3/800/500"
    ],
    technologies: ["Python", "Django", "Plotly", "Pandas"],
    links: {
      live: "#",
      github: "#"
    },
    details: [
      { id: 1, text: "数据可视化仪表盘使用Django框架构建后端，Plotly库创建交互式图表，Pandas进行数据处理和分析。" },
      { id: 2, text: "仪表盘包含多种图表类型，如折线图、柱状图、饼图、热力图等，支持数据筛选、时间范围选择、导出数据等功能。用户可以自定义仪表盘布局，根据自己的需求展示最重要的数据指标。" },
      { id: 3, text: "界面设计简洁明了，重点突出数据内容，同时提供了良好的交互体验。该仪表盘已在实际业务中应用，帮助决策者快速了解业务状况和趋势。" }
    ]
  }
])

// 计算属性：筛选和排序项目
const filteredProjects = computed(() => {
  let result = [...projects.value]
  
  // 筛选
  if (activeFilter.value !== 'all') {
    result = result.filter(project => project.category === activeFilter.value)
  }
  
  // 排序
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case 'name-asc':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'name-desc':
      result.sort((a, b) => b.title.localeCompare(a.title))
      break
  }
  
  return result
})

// 方法
const setFilter = (filterId) => {
  activeFilter.value = filterId
}

const sortProjects = () => {
  // 排序逻辑已在计算属性中实现
}

const openProjectDetail = (project) => {
  currentProject.value = project
  currentImageIndex.value = 0
  isProjectModalOpen.value = true
  // 阻止背景滚动
  document.body.style.overflow = 'hidden'
}

const closeProjectDetail = () => {
  isProjectModalOpen.value = false
  // 恢复背景滚动
  document.body.style.overflow = 'auto'
}

const nextImage = () => {
  if (currentImageIndex.value < currentProject.value.images.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const setCurrentImage = (index) => {
  currentImageIndex.value = index
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

const getCategoryName = (categoryId) => {
  const categoryMap = {
    'web': '网站开发',
    'app': '应用开发',
    'ui': 'UI设计',
    'other': '其他项目'
  }
  return categoryMap[categoryId] || categoryId
}

// 监听模态框关闭事件，处理ESC键
watch(isProjectModalOpen, (newVal) => {
  if (newVal) {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        closeProjectDetail()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }
})


</script>

<style scoped>
.portfolio-page {
  position: relative;
  background-color: var(--bg-color);
}

/* 页面标题区域 */
.hero-section {
  padding: 5rem 0 3rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,181.3C960,160,1056,128,1152,133.3C1248,139,1344,181,1392,202.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>'); */
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.title-decoration {
  width: 60px;
  height: 4px;
  background-color: white;
  border-radius: 2px;
  margin: 0 auto;
}

/* 筛选器区域 */
.filter-section {
  background-color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 80px;
  z-index: 30;
}

.filter-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-button {
  padding: 0.6rem 1.2rem;
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-button:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.sort-controls {
  flex-shrink: 0;
}

.sort-select {
  padding: 0.6rem 1.2rem;
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(45, 120, 210, 0.1);
}

/* 作品网格 */
.portfolio-section {
  padding: 4rem 0;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

/* 项目卡片 */
.project-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.project-card-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.project-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-card-image {
  transform: scale(1.05);
}

.project-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 40%);
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-card-overlay {
  opacity: 1;
}

.project-card-overlay-content {
  color: white;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.project-card:hover .project-card-overlay-content {
  transform: translateY(0);
}

.project-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.project-card-description {
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.9;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.project-card-category {
  padding: 0.3rem 0.8rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.project-card-view-button {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
}

.project-card-view-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--text-secondary);
}

.empty-state svg {
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.empty-state p {
  font-size: 1rem;
  opacity: 0.8;
}

/* 项目详情模态框 */
.project-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.project-modal.open {
  opacity: 1;
  visibility: visible;
}

.project-modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.project-modal-content {
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 0;
  max-width: 1200px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: scale(0.95);
  transition: transform 0.3s ease;
}

.project-modal.open .project-modal-content {
  transform: scale(1);
}

.project-modal-close {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1001;
  backdrop-filter: blur(10px);
}

.project-modal-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* 项目详情内容 */
.project-detail {
  display: flex;
  flex-direction: column;
}

/* 项目图片轮播 */
.project-images {
  width: 100%;
  background-color: var(--card-bg);
}

.image-slider {
  position: relative;
  overflow: hidden;
  height: 500px;
}

.slider-wrapper {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  flex-shrink: 0;
}

.slider-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: none;
}

.slider-button {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  pointer-events: auto;
  backdrop-filter: blur(10px);
}

.slider-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.slider-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 缩略图导航 */
.thumbnails {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  overflow-x: auto;
  justify-content: center;
}

.thumbnails::-webkit-scrollbar {
  height: 4px;
}

.thumbnails::-webkit-scrollbar-track {
  background-color: var(--card-bg);
  border-radius: 2px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 2px;
}

.thumbnail {
  width: 100px;
  height: 75px;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.thumbnail.active {
  border-color: var(--primary-color);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 项目信息 */
.project-info {
  padding: 2rem;
}

.project-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.project-category {
  padding: 0.3rem 0.8rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.project-date {
  color: var(--text-light);
  font-size: 0.9rem;
}

.project-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.project-description {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.project-description p {
  margin-bottom: 1rem;
}

/* 技术栈 */
.project-technologies {
  margin-bottom: 2rem;
}

.project-technologies h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.4rem 0.8rem;
  background-color: var(--card-bg);
  color: var(--text-color);
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid var(--border-color);
}

/* 项目链接 */
.project-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
}

.project-link:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(45, 120, 210, 0.3);
}

.project-link.github {
  background-color: #24292e;
}

.project-link.github:hover {
  background-color: #2b3137;
  box-shadow: 0 5px 15px rgba(36, 41, 46, 0.3);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .portfolio-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .image-slider {
    height: 400px;
  }
  
  .project-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0 2.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .filter-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    justify-content: center;
  }
  
  .sort-controls {
    text-align: center;
  }
  
  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .image-slider {
    height: 300px;
  }
  
  .project-info {
    padding: 1.5rem;
  }
  
  .project-title {
    font-size: 1.5rem;
  }
  
  .project-description {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 3rem 0 2rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .filter-button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .image-slider {
    height: 250px;
  }
  
  .thumbnail {
    width: 80px;
    height: 60px;
  }
  
  .project-modal-close {
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
  }
  
  .project-links {
    flex-direction: column;
  }
}

/* 自定义滚动条 */
.project-modal-content::-webkit-scrollbar {
  width: 8px;
}

.project-modal-content::-webkit-scrollbar-track {
  background-color: var(--card-bg);
}

.project-modal-content::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 4px;
}

.project-modal-content::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-light);
}
</style>