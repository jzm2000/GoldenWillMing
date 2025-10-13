<template>
  <div class="profile-page">
    <header class="profile-hero">
      <div class="hero-bg">
        <svg class="hero-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(255, 255, 255, 0.25)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div class="container hero-content">
        <h1 class="hero-title">个人主页</h1>
        <p class="hero-subtitle">记录生活，分享心情</p>
        <div class="hero-stats">
          <span class="stat-chip">
            <span class="icon">📝</span>
            <span class="num">{{ userInfo.diaryNum || 0 }}</span>
            <span class="label">创作</span>
          </span>
          <span class="stat-chip">
            <span class="icon">❤️</span>
            <span class="num">{{ userInfo.likeNum || 0 }}</span>
            <span class="label">获赞</span>
          </span>
          <span class="stat-chip">
            <span class="icon">🌟</span>
            <span class="num">{{ userInfo.fansNum || 0 }}</span>
            <span class="label">粉丝</span>
          </span>
        </div>
        <div class="hero-cta">
          <button class="small-btn" @click="toWriteDiary">写新日记</button>
          <button class="small-btn outline" @click="openEditUserInfo">编辑资料</button>
        </div>
      </div>
    </header>

    <main class="profile-main">
      <div class="container profile-container">
        <aside class="profile-sidebar">
          <transition name="card-pop" appear>
          <div class="user-card">
            <div class="user-avatar">
              <img :src="userInfo.avatar || defaultAvatar" :alt="userInfo.nickname || '用户头像'">
            </div>
            <div class="user-name">{{ userInfo.nickname || '未命名用户' }}</div>
            <p class="user-bio">{{ userInfo.bio || '这个人很低调，还没有写简介。' }}</p>
            <ul class="user-stats">
              <li>
                <span class="num">{{ userInfo.diaryNum || 0 }}</span>
                <span class="label">创作</span>
              </li>
              <li>
                <span class="num">{{ userInfo.likeNum || 0 }}</span>
                <span class="label">获赞</span>
              </li>
              <li>
                <span class="num">{{ userInfo.fansNum || 0 }}</span>
                <span class="label">粉丝</span>
              </li>
            </ul>
            <div class="user-actions">
              <button class="small-btn" title="编辑资料" @click="openEditUserInfo">
                <i class="iconfont icon-bianji" style="margin-right:6px;"></i>编辑资料
              </button>
            </div>
          </div>
          </transition>

          <div class="search-box">
            <GInput placeholder="搜索我的日记..." v-model="searchQuery" @change="onSearch"/>
          </div>

          <div class="quick-info">
            <div class="info-item">
              <span class="label">加入时间</span>
              <span class="value">{{ userInfo.createTime || '未记录' }}</span>
            </div>
            <div class="info-item">
              <span class="label">邮箱</span>
              <span class="value">{{ userInfo.email || '未绑定' }}</span>
            </div>
          </div>
        </aside>

        <section class="profile-content">
          <div class="content-header">
            <h2>我的日记</h2>
            <div class="content-tools">
              <button class="small-btn" @click="toWriteDiary">写新日记</button>
            </div>
          </div>

          <transition-group name="list-fade" tag="div" class="diaries-grid">
            <DiaryCard
              v-for="diary in diaries"
              :key="diary.id"
              :diary="diary"
              :categories="categories"
              :tags="tags"
            />
          </transition-group>

          <div v-if="diaries.length === 0" class="empty-state">
            <div class="empty-icon">📓</div>
            <h3>还没有日记</h3>
            <p>开始书写你的第一篇心情吧！</p>
            <button class="small-btn" @click="toWriteDiary">去写日记</button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.js'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import { getUserInfo, getDiaryList, categoryList } from '@/api/index.js'

import DiaryCard from '@/components/DiaryCard.vue'
import GInput from '@/components/GoldUI/g-input/input.vue'
import defaultAvatar from '@/assets/img/1.jpg'

const router = useRouter()
const message = useMessage()

const userStore = useUserStore()
const { userInfo: storeUserInfo } = storeToRefs(userStore)

const userInfo = reactive({
  avatar: defaultAvatar,
  nickname: '',
  bio: '',
  createTime: '',
  email: '',
  diaryNum: 0,
  likeNum: 0,
  fansNum: 0
})

const searchQuery = ref('')
const diaries = ref([])
const categories = ref([])
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

const queryParams = reactive({
  pageSize: 9,
  pageNum: 1
})

function syncUserInfo(data) {
  Object.assign(userInfo, {
    avatar: data.avatar || defaultAvatar,
    nickname: data.nickname || '',
    bio: data.bio || '',
    createTime: data.createTime || '',
    email: data.email || '',
    diaryNum: data.diaryNum || 0,
    likeNum: data.likeNum || 0,
    fansNum: data.fansNum || 0
  })
}

async function initUserInfo() {
  const res = await getUserInfo()
  if (res && res.code === 200) {
    userStore.setUserInfo(res.data || {})
    syncUserInfo(res.data || {})
  } else {
    syncUserInfo(storeUserInfo.value || {})
    if (res && res.msg) message.error(res.msg)
  }
}

async function initCategories() {
  const res = await categoryList()
  if (res && res.code === 200) {
    categories.value = res.data || []
  } else {
    categories.value = []
  }
}

async function initDiaries(isSearch = false) {
  if (isSearch) queryParams.pageNum = 1
  const res = await getDiaryList({
    ...queryParams,
    title: searchQuery.value || undefined
  })
  if (res && res.code === 200) {
    diaries.value = res.data?.rows || []
  } else {
    diaries.value = []
  }
}

function onSearch() {
  initDiaries(true)
}

function toWriteDiary() {
  router.push({ name: 'WriteDiary', query: { isEdit: false } })
}

function openEditUserInfo() {
  router.push({ name: 'ProfileEdit' })
}

onBeforeMount(async () => {
  await initUserInfo()
  await initCategories()
  await initDiaries()
})
</script>
<style lang="scss" scoped>
.profile-hero {
  position: relative;
  background: radial-gradient(1200px 600px at 10% -20%, rgba(255,255,255,0.2), transparent 60%),
              linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: #fff;
  padding: 3.5rem 0 5rem;
  margin-bottom: 2rem;
  overflow: hidden;
  isolation: isolate;
  &::before, &::after {
    content: '';
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.35;
    animation: floatBlob 12s ease-in-out infinite;
    z-index: 0;
  }
  &::before { background: #ffffff40; top: -60px; left: -80px; }
  &::after { background: #00000020; bottom: -80px; right: -120px; animation-delay: 2.5s; }
  .container { position: relative; z-index: 1; }
}
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-wave { position: absolute; bottom: 0; left: 0; width: 100%; height: 120px; animation: waveScroll 10s linear infinite; }

.hero-content { text-align: center; }
.hero-title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  margin-bottom: .5rem;
  letter-spacing: -0.5px;
  text-shadow: 0 3px 6px rgba(0,0,0,0.12);
  background: linear-gradient(120deg, var(--secondary-color), #ffffff);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  background-size: 200% auto; animation: gradientTitle 3s ease infinite;
}
.hero-subtitle {
  opacity: .95;
  display: inline-block;
  background: linear-gradient(90deg, rgba(255,255,255,.85), rgba(255,255,255,.65), rgba(255,255,255,.85));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  background-size: 300% 100%;
  animation: shimmer 4s ease-in-out infinite;
}

.hero-stats {
  display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;
}
.stat-chip {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .5rem .9rem; border-radius: 999px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.25);
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 20px rgba(0,0,0,.12);
  transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
}
.stat-chip:hover { transform: translateY(-3px) scale(1.03); background: rgba(255,255,255,.18); box-shadow: 0 10px 28px rgba(0,0,0,.18); }
.stat-chip .icon { font-size: 1.1rem; }
.stat-chip .num { font-weight: 800; }
.stat-chip .label { opacity: .9; font-size: var(--font-size-sm); }

.hero-cta { display: flex; justify-content: center; gap: .6rem; margin-top: 1rem; }
.small-btn.outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,.6); }
.small-btn.outline:hover { background: rgba(255,255,255,.12); }

@keyframes floatBlob {
  0% { transform: translate(0,0) scale(1); }
  33% { transform: translate(20px,-15px) scale(1.05); }
  66% { transform: translate(-12px,18px) scale(0.98); }
  100% { transform: translate(0,0) scale(1); }
}
@keyframes waveScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-30px); }
}
@keyframes shimmer {
  0% { background-position: 0% 0; }
  50% { background-position: 100% 0; }
  100% { background-position: 0% 0; }
}

.profile-container {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.profile-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: var(--shadow);
  border: 1px solid rgba(0,0,0,0.05);
  text-align: center;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
  }
  .user-avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid var(--accent-color);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  .user-name {
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .user-bio {
    font-size: var(--font-size-sm);
    color: var(--text-light);
    margin-bottom: 1rem;
  }
  .user-stats {
    display: flex;
    justify-content: space-around;
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      .num {
        font-weight: 700;
        color: var(--primary-color);
      }
      .label {
        font-size: var(--font-size-mini);
        color: var(--text-light);
      }
    }
  }
  .user-actions {
    display: flex;
    justify-content: center;
  }
}

.search-box {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }
}

.quick-info {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  border: 1px solid rgba(0,0,0,0.05);
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
  .info-item {
    display: flex;
    justify-content: space-between;
    .label {
      color: var(--text-light);
    }
    .value {
      color: var(--text-color);
      font-weight: 500;
    }
  }
}

.profile-content {
  flex: 1;
  .content-header {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: var(--shadow);
    border: 1px solid rgba(0,0,0,0.05);
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      margin: 0;
      font-size: var(--font-size-xl);
    }
    .content-tools {
      display: flex;
      gap: 0.5rem;
    }
  }
}

.diaries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  background-color: #fff;
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  border: 1px solid rgba(0,0,0,0.05);
  .empty-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.7;
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    color: var(--text-light);
    margin-bottom: 1rem;
  }
}

@media (max-width: 1024px) {
  .profile-container {
    flex-direction: column;
  }
  .profile-sidebar {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
  }
}

/* transitions & animations */
.profile-page { animation: fadeInUpPage .4s ease; }
@keyframes fadeInUpPage { from { opacity:0; transform: translateY(12px);} to { opacity:1; transform: none;} }

.card-pop-enter-from, .card-pop-leave-to { opacity: 0; transform: translateY(10px) scale(0.98); }
.card-pop-enter-active, .card-pop-leave-active { transition: all .3s ease; }
.card-pop-enter-to, .card-pop-leave-from { opacity: 1; transform: translateY(0) scale(1); }

.list-fade-enter-from, .list-fade-leave-to { opacity: 0; transform: translateY(8px); }
.list-fade-enter-active, .list-fade-leave-active { transition: all .25s ease; }
.list-fade-enter-to, .list-fade-leave-from { opacity: 1; transform: translateY(0); }
.list-fade-move { transition: transform .25s ease; }

.hero-title {
  background: linear-gradient(120deg, var(--secondary-color), #ffffff);
  background-clip: text; -webkit-background-clip: text; color: transparent;
  background-size: 200% auto; animation: gradientTitle 3s ease infinite;
}
@keyframes gradientTitle {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

</style>