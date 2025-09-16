<template>
  <div class="home">
    <section class="hero">
      <Navbar v-if="route.name == 'Home'" :color="primaryColor"/>
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

    <div class="bg_cover">
      <section class="featured">
        <div class="container">
          <div class="left-user_info">
            <div class="user-info">
              <div class="user-avatar">
                <img :src="userInfo.avatarUrl" :alt="userInfo.nickName" width="200px" height="200px"/>
              </div>
              <div class="user-name">{{userInfo.nickName}}</div>
              <ul class="user-intro">
                <li>
                  <span>{{ userInfo.diaryNum }}</span>
                  <span>创作</span>
                </li>
                <li>
                  <span>{{ userInfo.likeNum }}</span>
                  <span>点赞</span>
                </li>
                <li>
                  <span>{{ userInfo.fansNum }}</span>
                  <span>粉丝</span>
                </li>

              </ul>
            </div>
          </div>
          <div class="right-diary_list">
            <div class="diary-title">精选日记</div>
            <div class="diary-content">
              <div class="diary-list" v-for="(item) in diaryList" :key="item.id">
                <div class="diary-item">
                  <div class="diary-item-header">
                    <div class="diary-item-avatar">
                      <img :src="item.avatarUrl" :alt="item.nickName" />
                    </div>
                    <div class="diary-item-info">
                      <div class="diary-item-nickname">{{item.nickName}}</div>
                      <div class="diary-item-date">{{formatDate(item.dataTime)}}</div>
                    </div>
                    <div class="diary-item-stats" v-if="item.hot || item.viewCount">
                      <span class="diary-item-hot" v-if="item.hot">🔥</span>
                      <span class="diary-item-views" v-if="item.viewCount">{{item.viewCount}} 浏览</span>
                    </div>
                  </div>
                  <div class="diary-item-title">{{item.title}}</div>
                  <div class="diary-item-content">{{item.content}}</div>
                  <div class="diary-item-footer">
                    <button class="diary-item-like">
                      <i class="iconfont icon-aixin"></i>
                    </button>
                    <button class="diary-item-comment">
                      <i class="iconfont icon-pinglun"></i>
                    </button>
                    <button class="diary-item-share">
                      <i class="iconfont icon-fenxiang"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

    <img src="@/assets/img/banner2.png" alt="" class="mainBanner">
  </div>
</template>

<script setup lang="jsx">
import Navbar from '@/components/Navbar.vue'
import { ref,reactive,onMounted,onUnmounted } from 'vue'
import { useArticleStore } from '../store/article'
import useCssVariables from '@/utils/useCssVariables';
import avatar from "@/assets/img/1.jpg";
const {getVariable} = useCssVariables();

import {useRoute} from 'vue-router';
const articleStore = useArticleStore();
const route = useRoute();
let heroText = ref(null);
let textList = ['天不生我金志明，人间万古如长夜。','日记里藏着时光的秘密。','日记是心灵的镜像，映照出最真实的自己。','日记是成长的刻度，标记着每一步蜕变。'];
let textIndex = 0;
let interval = null;
let timeout = null;
let primaryColor = getVariable('--secondary-color');
const latestArticles = ref(articleStore.getLatestArticles(3));
const hoveredArticle = ref(null)
const diaryList = ref([{id:1,userId:12,title:"精选日记篇",content:"这是精选日记的内容",dataTime:"2025-07-01 12:00:00",nickName:"思念成疾",avatarUrl:avatar,hot:1,viewCount:100,likeNum:10,commentNum:10,shareNum:10}]);
const userInfo = reactive({
  avatarUrl: avatar,
  nickName: '思念成疾',
  createTime: '2025-07-01 12:00:00',
  fansNum: 1000,
  likeNum: 100,
  diaryNum: 110,
  
});

for(let i=0;i<5;i++){
  diaryList.value.push({...diaryList.value[0],id:i+1});
}

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

<style scoped lang="scss">
.home{
  position: relative;
  .mainBanner{
    position: fixed;
    z-index: -1;
    object-fit: cover;
    inset: 0;
    height: 100%;
    width: 100%;
  }
  .bg_cover{
    background-color: rgba(249, 245, 235,0.6);

  }
}
/* Hero Section */
.hero {
  /* background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); */
  // background: url('@/assets/img/banner2.jpg') no-repeat center center;
  background-size: 100%;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  .container{
     position: absolute;
     inset: 0;
     padding: 8rem 0 6rem;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
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
.featured {
  .container {
    display: flex;
    justify-content: space-between;
    column-gap: 1rem;
  }
  .left-user_info{
    width: 300px;
    .user-info {
      background-color: var(--card-bg);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: var(--shadow);
      transition: all 0.3s ease;
      border: 1px solid rgba(0, 0, 0, 0.05);
      text-align: center;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-hover);
      }
      
      .user-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto 1.5rem;
        position: relative;
        border: 4px solid var(--accent-color-light);
        
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
          border-radius: 50%;
          z-index: -1;
          transform: scale(1.05);
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      
      .user-name {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 1.5rem;
        position: relative;
        padding-bottom: 1rem;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
          border-radius: 1.5px;
        }
      }
      
      .user-intro {
        display: flex;
        justify-content: space-around;
        padding: 0;
        margin: 0;
        list-style: none;
        
        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 8px;
          
          &:hover {
            background-color: rgba(67, 97, 238, 0.05);
            transform: translateY(-2px);
          }
          
          span:first-child {
            font-size: var(--font-size-lg);
            font-weight: 700;
            color: var(--primary-color);
          }
          
          span:last-child {
            font-size: var(--font-size-sm);
            color: var(--text-light);
          }
        }
      }
    }
  }
  .right-diary_list{
    flex: 1;
  }
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
  
  /* User info responsive styles */
  .featured .container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .left-user_info {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .user-info {
    padding: 1.5rem !important;
  }
  
  .user-avatar {
    width: 80px !important;
    height: 80px !important;
  }
  
  .user-name {
    font-size: var(--font-size-lg) !important;
    margin-bottom: 1rem !important;
  }
  
  .user-intro li span:first-child {
    font-size: var(--font-size-base) !important;
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
  color: var(--secondary-color);
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
.diary-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-dark);
  position: relative;
  background-color: var(--card-bg);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: inline-block;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  width: 100%;
}


.diary-content {
  // max-width: 800px;
  // margin: 0 auto;
}

.diary-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 1rem;
}

.diary-item {
  background-color: var(--card-bg);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.diary-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
}

.diary-item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.diary-item-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent-color-light);
  flex-shrink: 0;
}

.diary-item-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.diary-item-info {
  flex: 1;
}

.diary-item-nickname {
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}

.diary-item-date {
  font-size: var(--font-size-sm);
  color: var(--text-light);
}

.diary-item-stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--font-size-sm);
  color: var(--text-light);
}

.diary-item-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.diary-item-content {
  font-size: var(--font-size-base);
  color: var(--text-medium);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  text-align: justify;
}

.diary-item-footer {
  display: flex;
  gap: 1rem;
  button{
    color: unset;
  }
}

.diary-item-like,
.diary-item-comment,
.diary-item-share {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.diary-item-like:hover,
.diary-item-comment:hover,
.diary-item-share:hover {
  background-color: var(--bg-color);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .diary-item {
    padding: 1.5rem;
  }
  
  .diary-item-header {
    flex-wrap: wrap;
  }
  
  .diary-item-stats {
    width: 100%;
    justify-content: flex-end;
  }
  
  .diary-title {
    font-size: var(--font-size-xl);
  }
  
  .diary-item-title {
    font-size: var(--font-size-lg);
  }
}
</style>