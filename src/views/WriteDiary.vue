<template>
  <div class="write-diary-container">
    <!-- 顶部标题栏 -->
    <header class="write-diary-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">
            <i class="iconfont icon-riji"></i> 写日记
          </h1>
          <div class="header-actions">
            <button class="btn btn-secondary" @click="saveDraft">
              <i class="iconfont icon-bianji"></i> 保存草稿
            </button>
            <button class="btn btn-primary" @click="publishDiary">
              <i class="iconfont icon-fabu"></i> 发布
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="write-diary-main">
      <div class="container">
        <div class="editor-layout">
          <!-- 左侧编辑器 -->
          <div class="editor-panel">
            <!-- 标题输入 -->
            <div class="editor-section">
              <input
                v-model="diaryForm.title"
                type="text"
                placeholder="今天的心情如何？给日记起个标题吧..."
                class="diary-title-input"
                @input="updateExcerpt"
              />
            </div>

            <!-- 内容编辑器 -->
            <div class="editor-section">
              <textarea
                v-model="diaryForm.content"
                placeholder="开始记录你的一天..."
                class="diary-content-input"
                @input="updateExcerpt"
              ></textarea>
            </div>

            <!-- 图片上传区域 -->
            <div class="editor-section">
              <div class="upload-section">
                <label class="upload-label">
                  <i class="iconfont icon-tupian"></i> 添加图片
                  <input type="file" accept="image/*" multiple @change="handleImageUpload" class="upload-input" />
                </label>
                <div class="upload-tip">支持JPG、PNG格式，单张不超过5MB</div>
              </div>

              <!-- 已上传图片预览 -->
              <div v-if="uploadedImages.length > 0" class="images-preview">
                <div 
                  v-for="(image, index) in uploadedImages" 
                  :key="index" 
                  class="image-preview-item"
                >
                  <img :src="image" alt="预览图片" class="preview-image" />
                  <button @click="removeImage(index)" class="remove-image-btn">
                    <i class="iconfont icon-shanchu"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧设置面板 -->
          <div class="settings-panel">
            <!-- 基本信息 -->
            <div class="settings-section">
              <h3 class="settings-title">
                <i class="iconfont icon-xinxi"></i> 基本信息
              </h3>
              
              <!-- 日期选择 -->
              <div class="setting-item">
                <label>日期</label>
                <input 
                  v-model="diaryForm.date" 
                  type="date" 
                  class="setting-input"
                />
              </div>

              <!-- 分类选择 -->
              <div class="setting-item">
                <label>分类</label>
                <select v-model="diaryForm.category" class="setting-select">
                  <option value="">选择分类</option>
                  <option value="1">日常生活</option>
                  <option value="2">学习笔记</option>
                  <option value="3">工作记录</option>
                  <option value="4">旅行见闻</option>
                  <option value="5">心情感悟</option>
                </select>
              </div>
            </div>

            <!-- 情绪和天气标签 -->
            <div class="settings-section">
              <h3 class="settings-title">
                <i class="iconfont icon-xinqing"></i> 情绪标签
              </h3>
              <div class="tags-group">
                <button 
                  v-for="emotion in emotions" 
                  :key="emotion.id"
                  :class="['tag-item', { active: selectedEmotions.includes(emotion.id) }]"
                  @click="toggleEmotion(emotion.id)"
                >
                  {{ emotion.icon }} {{ emotion.name }}
                </button>
              </div>

              <h3 class="settings-title mt-4">
                <i class="iconfont icon-tianqi"></i> 天气标签
              </h3>
              <div class="tags-group">
                <button 
                  v-for="weather in weathers" 
                  :key="weather.id"
                  :class="['tag-item', { active: selectedWeather === weather.id }]"
                  @click="selectWeather(weather.id)"
                >
                  {{ weather.icon }} {{ weather.name }}
                </button>
              </div>
            </div>

            <!-- 自定义标签 -->
            <div class="settings-section">
              <h3 class="settings-title">
                <i class="iconfont icon-biaoqian"></i> 自定义标签
              </h3>
              <div class="tags-input-section">
                <input 
                  v-model="newTag"
                  type="text" 
                  placeholder="输入标签名称"
                  class="tag-input"
                  @keyup.enter="addTag"
                />
                <button @click="addTag" class="add-tag-btn">添加</button>
              </div>
              <div v-if="diaryForm.tags.length > 0" class="custom-tags">
                <span 
                  v-for="(tag, index) in diaryForm.tags" 
                  :key="index"
                  class="custom-tag"
                >
                  #{{ tag }}
                  <button @click="removeTag(index)" class="remove-tag-btn">
                    <i class="iconfont icon-guanbi"></i>
                  </button>
                </span>
              </div>
            </div>

            <!-- 隐私设置 -->
            <div class="settings-section">
              <h3 class="settings-title">
                <i class="iconfont icon-shezhi"></i> 隐私设置
              </h3>
              <div class="privacy-options">
                <label class="privacy-option">
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="public" 
                    v-model="diaryForm.privacy"
                  />
                  <span class="privacy-label">
                    <i class="iconfont icon-gongkai"></i> 公开
                  </span>
                </label>
                <label class="privacy-option">
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="friends" 
                    v-model="diaryForm.privacy"
                  />
                  <span class="privacy-label">
                    <i class="iconfont icon-haoyou"></i> 仅好友可见
                  </span>
                </label>
                <label class="privacy-option">
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="private" 
                    v-model="diaryForm.privacy"
                  />
                  <span class="privacy-label">
                    <i class="iconfont icon-suo"></i> 私密
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="success-toast">
      <i class="iconfont icon-chenggong"></i>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../store/article.js'

const router = useRouter()
const articleStore = useArticleStore()

// 日记表单数据
const diaryForm = reactive({
  title: '',
  content: '',
  excerpt: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  tags: [],
  privacy: 'public',
  images: []
})

// 情绪和天气选项
const emotions = [
  { id: 'happy', name: '开心', icon: '😄' },
  { id: 'excited', name: '兴奋', icon: '🤩' },
  { id: 'grateful', name: '感恩', icon: '🥰' },
  { id: 'calm', name: '平静', icon: '😌' },
  { id: 'sad', name: '难过', icon: '😢' },
  { id: 'angry', name: '生气', icon: '😠' },
  { id: 'tired', name: '疲惫', icon: '😴' },
  { id: 'confused', name: '困惑', icon: '😕' }
]

const weathers = [
  { id: 'sunny', name: '晴天', icon: '☀️' },
  { id: 'cloudy', name: '多云', icon: '☁️' },
  { id: 'rainy', name: '下雨', icon: '🌧️' },
  { id: 'snowy', name: '下雪', icon: '❄️' },
  { id: 'windy', name: '刮风', icon: '💨' },
  { id: 'foggy', name: '雾天', icon: '🌫️' },
  { id: 'stormy', name: '暴风雨', icon: '⛈️' },
  { id: 'night', name: '夜晚', icon: '🌙' }
]

// 选中的情绪和天气
const selectedEmotions = ref([])
const selectedWeather = ref('')
const newTag = ref('')
const uploadedImages = ref([])

// 提示信息
const showSuccess = ref(false)
const successMessage = ref('')

// 更新摘要
function updateExcerpt() {
  if (diaryForm.content) {
    diaryForm.excerpt = diaryForm.content.substring(0, 100) + (diaryForm.content.length > 100 ? '...' : '')
  }
}

// 切换情绪选择
function toggleEmotion(emotionId) {
  const index = selectedEmotions.value.indexOf(emotionId)
  if (index > -1) {
    selectedEmotions.value.splice(index, 1)
  } else {
    selectedEmotions.value.push(emotionId)
  }
}

// 选择天气
function selectWeather(weatherId) {
  selectedWeather.value = selectedWeather.value === weatherId ? '' : weatherId
}

// 添加自定义标签
function addTag() {
  if (newTag.value && !diaryForm.tags.includes(newTag.value) && diaryForm.tags.length < 8) {
    diaryForm.tags.push(newTag.value)
    newTag.value = ''
  }
}

// 移除自定义标签
function removeTag(index) {
  diaryForm.tags.splice(index, 1)
}

// 处理图片上传
function handleImageUpload(event) {
  const files = event.target.files
  if (files) {
    Array.from(files).forEach(file => {
      if (file.size < 5 * 1024 * 1024) { // 5MB限制
        const reader = new FileReader()
        reader.onload = (e) => {
          uploadedImages.value.push(e.target.result)
          diaryForm.images.push(e.target.result)
        }
        reader.readAsDataURL(file)
      }
    })
  }
  // 清空input，以便可以重复选择同一文件
  event.target.value = ''
}

// 移除图片
function removeImage(index) {
  uploadedImages.value.splice(index, 1)
  diaryForm.images.splice(index, 1)
}

// 保存草稿
function saveDraft() {
  if (!diaryForm.title && !diaryForm.content) {
    showSuccessMessage('请输入标题或内容')
    return
  }
  
  // 在实际项目中，这里会调用API保存草稿
  showSuccessMessage('草稿保存成功！')
}

// 发布日记
function publishDiary() {
  if (!diaryForm.title) {
    showSuccessMessage('请输入日记标题')
    return
  }
  
  if (!diaryForm.content) {
    showSuccessMessage('请输入日记内容')
    return
  }
  
  // 创建新日记对象
  const newDiary = {
    id: articleStore.articles.length + 1,
    title: diaryForm.title,
    content: diaryForm.content,
    excerpt: diaryForm.excerpt || diaryForm.content.substring(0, 100) + '...',
    date: diaryForm.date,
    category: diaryForm.category,
    tags: diaryForm.tags,
    privacy: diaryForm.privacy,
    images: diaryForm.images,
    emotions: selectedEmotions.value,
    weather: selectedWeather.value,
    likes: 0,
    comments: 0,
    views: 0
  }
  
  // 在实际项目中，这里会调用API发布日记
  articleStore.articles.unshift(newDiary)
  
  showSuccessMessage('日记发布成功！')
  
  // 3秒后跳转到日记列表页
  setTimeout(() => {
    router.push('/articles')
  }, 1500)
}

// 显示成功消息
function showSuccessMessage(message) {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 2000)
}
</script>

<style lang="scss" scoped>
// 引入全局样式变量
@import url('../styles/base.scss');

.write-diary-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

// 头部样式
.write-diary-header {
  background: linear-gradient(135deg, #ff7e67 0%, #ffac81 100%);
  color: white;
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(255, 126, 103, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.page-title::after {
  content:"";
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

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #f9f871, #ffeb3b);
  color: #333;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(249, 248, 113, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

// 主要内容区样式
.write-diary-main {
  padding: 2rem 0;
}

.editor-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

// 编辑器面板样式
.editor-panel {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out;
}

.editor-section {
  margin-bottom: 2rem;
}

.diary-title-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid var(--border-color);
  padding: 1rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
  outline: none;
  transition: border-color 0.3s ease;
}

.diary-title-input:focus {
  border-color: var(--primary-color);
}

.diary-title-input::placeholder {
  color:#999;
  font-weight: 400;
}

.diary-content-input {
  width: 100%;
  min-height: 300px;
  border: none;
  padding: 1rem 0;
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-dark);
  resize: vertical;
  outline: none;
  font-family: inherit;
}

.diary-content-input::placeholder {
  color: var(--text-light);
}

// 图片上传样式
.upload-section {
  margin-bottom: 1.5rem;
}

.upload-label {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px dashed var(--border-color);
}

.upload-label:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 126, 103, 0.2);
}

.upload-input {
  display: none;
}

.upload-tip {
  margin-top: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.image-preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

// 设置面板样式
.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out;
}

.settings-section:nth-child(2) {
  animation-delay: 0.1s;
}

.settings-section:nth-child(3) {
  animation-delay: 0.2s;
}

.settings-section:nth-child(4) {
  animation-delay: 0.3s;
}

.settings-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.setting-item {
  margin-bottom: 1rem;
}

.setting-item label {
  display: block;
  font-weight: 500;
  color: var(--text-medium);
  margin-bottom: 0.5rem;
}

.setting-input,
.setting-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-dark);
  transition: border-color 0.3s ease;
}

.setting-input:focus,
.setting-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

// 标签组样式
.tags-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.tag-item {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 25px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-medium);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tag-item:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.tag-item.active {
  background: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

// 自定义标签样式
.tags-input-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-dark);
}

.tag-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.add-tag-btn {
  padding: 0 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-tag-btn:hover {
  background: #ff6b50;
}

.custom-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.custom-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.remove-tag-btn:hover {
  background: rgba(255, 126, 103, 0.1);
}

// 隐私设置样式
.privacy-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.privacy-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.privacy-option:hover {
  background: var(--primary-light);
}

.privacy-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.privacy-label {
  font-weight: 500;
  color: var(--text-medium);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

// 成功提示样式
.success-toast {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(46, 204, 113, 0.95);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: slideIn 0.3s ease-out;
  backdrop-filter: blur(10px);
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

@keyframes slideIn {
  from {
    transform: translateX(-50%) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
  
  .settings-panel {
    order: 2;
  }
  
  .editor-panel {
    order: 1;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .tags-group {
    grid-template-columns: 1fr;
  }
  
  .editor-panel,
  .settings-section {
    padding: 1.5rem;
  }
  
  .diary-title-input {
    font-size: 1.5rem;
  }
}
</style>