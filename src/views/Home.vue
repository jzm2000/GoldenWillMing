<template>
  <div class="home">
    <section class="hero">
      <!-- <Navbar v-if="route.name == 'Home'" :color="primaryColor"/> -->
      <div class="container">
        <div class="hero-content">
          <div class="flex_box">
            <div class="flex_box hero-text-box">
              <span class="hero-text" ref="heroText"></span>
              <span class="line"></span>
            </div>
          </div>
          <div class="hero-buttons">
            <router-link to="/articles" class="btn btn-primary">前往日记空间</router-link>
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
                <img :src="userInfo.avatar" :alt="userInfo.nickname" width="200px" height="200px"/>
              </div>
              <div class="user-name">{{userInfo.nickname}}</div>
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
            <div class="search-box">
              <GInput placeholder="搜索日记" v-model="searchQuery" />
            </div>
            <div class="date-picker">
              <n-date-picker panel type="date" @update:value="handleDatePickerFocus" />
            </div>
          </div>
          <div class="right-diary_list">
            <div class="diary-title">精选日记</div>
            <div class="diary-content">
              <div class="diary-list" v-for="(item) in diaryList" :key="item.id">
                <div class="diary-item">
                  <div class="diary-item-header">
                    <div class="diary-item-avatar">
                      <img :src="item.avatar || avatar" :alt="item.nickname" />
                    </div>
                    <div class="diary-item-info">
                      <div class="diary-item-nickname">{{item.author_name}}</div>
                      <div class="diary-item-date">{{formatDate(item.created_at)}}</div>
                    </div>
                    <div class="diary-item-stats" v-if="item.hot || item.viewCount">
                      <span class="diary-item-hot" v-if="item.hot">🔥</span>
                      <span class="diary-item-views" v-if="item.viewCount">{{item.viewCount}} 浏览</span>
                    </div>
                  </div>
                  <div class="diary-item-title">{{item.title}}</div>
                  <div class="diary-item-content">{{item.content}}</div>
                  <div class="diary-item-footer">
                    <div class="diary-item-like" @click="likeDiaryHandle(item)">
                      <i :class="['iconfont',item.isLiked ? 'icon-aixin1' : 'icon-aixin']"></i>
                      {{ item.likeNum }}
                    </div>
                    <div class="diary-item-comment" @click="commentDiary(item.id)">
                      <i class="iconfont icon-pinglun"></i>
                      {{ item.commentNum }}
                    </div>
                    <div class="diary-item-view" @click="viewDiary(item.id)">
                      <i class="iconfont icon-yanjing_xianshi_o"></i>
                      {{item.viewCount}}
                    </div>
                  </div>
                  <!-- 评论区 -->
                   
                </div>
              </div>
              <div class="not_diary" v-if="diaryList.length===0">
                <div class="empty-icon">
                  📓
                </div>
                <div class="empty-title">暂无日记</div>
                <div class="empty-subtitle">还没有任何日记内容，来写第一篇吧！</div>
                <button class="empty-button" @click="toWriteDiary">去写日记</button>
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

    <img src="@/assets/img/banner4.png" alt="" class="mainBanner">
  </div>
</template>

<script setup lang="jsx">
import Navbar from '@/components/Navbar.vue'
import { ref,reactive,onMounted,onUnmounted,onBeforeMount } from 'vue'
import { getUserInfo,getPublicDiaryList,likeDiary } from "@/api/index.js";
import { useArticleStore } from '../store/article'
import useCssVariables from '@/utils/useCssVariables';
import avatar from "@/assets/img/1.jpg";
import { useUserStore } from '@/store/user.js';
import { useMessage } from "naive-ui";
import GInput from '@/components/GoldUI/g-input/input.vue'
const message = useMessage();

const userStore = useUserStore();

const {getVariable} = useCssVariables();

import {useRoute,useRouter} from 'vue-router';
const articleStore = useArticleStore();
const route = useRoute();
const router = useRouter();
let heroText = ref(null);
let textList = ['日记里藏着时光的秘密。','日记是心灵的镜像，映照出最真实的自己。','日记是成长的刻度，标记着每一步蜕变。'];
let textIndex = 0;
let interval = null;
let timeout = null;
let primaryColor = getVariable('--secondary-color');
let searchQuery = ref('');
let queryParams = {
  pageSize:10,
  pageNum:1
};
let selectedDate = ref('');
let scrollTop = ref(0);
const hoveredArticle = ref(null)
const diaryList = ref([]);
const userInfo = reactive({
  avatar: avatar,
  nickname: '',
  createTime: '',
  fansNum: 0,
  likeNum: 0,
  diaryNum:0,
});

// 逻辑业务的函数
// 公开日记列表初始化
function initData(){
  getPublicDiaryList({
    userId:userStore.userInfo.id,
    ...queryParams,
    title:searchQuery.value,
  }).then(res=>{
    if(res.code === 200){
      diaryList.value = res.data.rows || [];
    }else {
      message.error(res.msg);
    }
  })
}
// 点赞日记
function likeDiaryHandle(item){
  likeDiary({
    id:item.id,
    userId:userStore.userInfo.id,
    authorId:item.author_id,
    action:item.isLiked ? 'unlike' : 'like'
  }).then(res=>{
    if(res.code==200){
      item.isLiked = item.isLiked ? 0 : 1;
      item.likeNum = item.isLiked ? item.likeNum + 1 : item.likeNum - 1;
    }
  })
};
// 评论日记
function commentDiary(id){
  router.push({
    name:"ArticleDetail",
    params:{
      id:id
    }
  });
};
// 查看日记
function viewDiary(id){

};
function toWriteDiary(){
  router.push({
    path:"write-diary",
  })
}
const handleDatePickerFocus = (e,date) => {
  console.log(date)
};
// 获取用户信息
const getUserInfoHandle = async () => {
  let res = await getUserInfo();
  if(res.code === 200){
    userStore.setUserInfo(res.data);
    Object.keys(userInfo).forEach(key=>{
      userInfo[key] = res.data[key] || 0;
    });
    userInfo.avatar = res.data.avatar || avatar;
  }else {
    message.error(res.msg);
  }
};

// 函数执行
onBeforeMount(async ()=>{
  await getUserInfoHandle();
  initData();
})



//逻辑业务的函数
// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  cursor: pointer;
  border: none;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  z-index: 1;
  gap: 0.75rem;
}

/* 精致的主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.95rem;
  font-weight: 700;
  transform: translateY(0);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(67, 97, 238, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
  }
}

/* 次级按钮 */
.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 50px;
  backdrop-filter: blur(4px);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
  }
}

/* 为"Go to my diary space"按钮添加图标 */
.hero-buttons .btn-primary::before {
  /* 保留原有渐变效果 */
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
}
/* Newsletter按钮特殊样式 */
.newsletter-form .btn-primary {
  background: rgba(255, 255, 255, 0.95);
  color: var(--primary-color);
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
  
  &::before {
    background: white;
  }
  
  &:hover {
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
  }
}

/* Section Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 0 1.5rem; */
}

.featured{
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
      border-radius: 0.75rem;
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
.search-box{
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
  &:hover{
      transform: translateY(-3px);
      box-shadow: var(--shadow-hover);
  }
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
  padding: 0.75rem;
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
  background: var(--card-bg);
  color: var(--text-color);
  position: relative;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: inline-block;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  width: 100%;
  line-height:1;
}

.diary-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 1rem;
}

.diary-item {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.diary-item:hover {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
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
  line-height: 1;
  margin-bottom: 1.5rem;
  text-align: justify;
}

.diary-item-footer {
  display: flex;
  gap: 1rem;
  align-items: center;
  button{
    color: unset;
  }
  .iconfont{
    font-size: 1.5rem;
    line-height: 1;
  }
}

.diary-item-like,
.diary-item-comment,
.diary-item-share,
.diary-item-view {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  line-height: 1;
}

.diary-item-like:hover,
.diary-item-comment:hover,
.diary-item-share:hover,
.diary-item-view:hover {
  background-color: var(--bg-color);
  transform: scale(1.1);
}

.not_diary{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--text-medium);
  background-color:var(--card-bg);
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 260px;
  padding: 2rem;
  text-align: center;
  
  &:hover{
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }
  
  .empty-icon {
    font-size: 2rem;
    color: var(--primary-light);
    margin-bottom: 1rem;
    opacity: 0.6;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1) rotate(5deg);
      opacity: 0.8;
    }
  }
  
  .empty-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
  
  .empty-subtitle {
    font-size: var(--font-size-base);
    color: var(--text-light);
    margin-bottom: 1.5rem;
    max-width: 200px;
  }
  
  .empty-button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(158, 31, 54, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}
.date-picker{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  background-color: #fff;
  border-radius: 0.75rem;
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