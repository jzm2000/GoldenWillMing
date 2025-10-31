<template>
  <div class="article-detail-container">
    <!-- 返回按钮 -->    
    <!-- 日记详情卡片 -->
    <div class="article-detail-card">
      <div class="back-button-container">
        <button class="back-button" @click="goBack">
          <i class="iconfont icon-left"></i>
          <span>返回</span>
        </button>
      </div>
      <!-- 日记头部信息 -->
      <div class="article-header">
        <h1 class="article-title">{{ diary.title || '日记标题' }}</h1>
        
        <div class="article-meta">
          <div class="author-info">
            <img
              :src="userInfo.avatar || defaultAvatar" 
              alt="作者头像" 
              class="author-avatar"
            />
            <div class="author-details">
              <span class="author-name">{{ diary.authorName }}</span>
              <span class="publish-date">{{ diary.createdAt }}</span>
            </div>
          </div>
          
          <div class="article-tags">
            <span v-if="diary.category" class="category-tag">{{ diary.categoryName }}</span>
            <span v-for="tag in diary.tags" :key="tag" class="tag-item">#{{ tag }}</span>
          </div>
        </div>
      </div>
      
      <!-- 日记封面图 -->
      <div v-if="diary.imageUrl" class="article-cover">
        <n-image object-fit="cover" :src="$baseURL + diary.imageUrl" alt="日记封面" class="cover-image" />
      </div>
      
      <!-- 日记内容 -->
      <div class="article-content">
        <div v-if="diary.content" v-html="formatContent(diary.content)"></div>
        <div v-else class="placeholder-content">
          空空如也
        </div>
      </div>
      
      <!-- 互动区域 -->
      <div class="article-interactions">
        <button 
          class="interaction-button like-button"
          :class="{ active: isLiked }"
          @click="toggleLike"
        >
          <i :class="['iconfont', isLiked ? 'icon-aixin1' : 'icon-aixin']"></i>
          <span>{{ likeCount }}</span>
        </button>
        
        <button 
          class="interaction-button comment-button"
          @click="focusComment"
        >
          <i class="iconfont icon-pinglun"></i>
          <span>{{ commentCount }}</span>
        </button>
        
        <button class="interaction-button share-button" @click="shareArticle">
          <i class="iconfont icon-share"></i>
          <span>分享</span>
        </button>
        
      </div>
    </div>
    
    <!-- 评论区 -->
    <div class="comments-section">
      <h3 class="comments-title">
        <i class="iconfont icon-pinglun"></i>
        评论区 ({{ commentCount }})
      </h3>
      
      <!-- 评论输入框 -->
      <div class="comment-input-container">
        <img src="/diary.png" alt="用户头像" class="comment-input-avatar" />
        <div class="comment-input-wrapper">
          <n-input
            ref="commentTextarea"
            v-model:value="newComment"
            placeholder="写下你的评论..."
            class="comment-textarea"
            rows="3"
            @blur="handleBlur"
            maxlength="300"
            show-count
            type="textarea"
          ></n-input>
          <div class="comment-actions">
            <EmojiMartVue3 @change="handleEmojiChange">
              <div style="font-size: 21px;cursor: pointer;">
                😊
              </div>
            </EmojiMartVue3>
            <button 
              class="submit-comment-button"
              :disabled="!newComment.trim()"
              @click="submitComment(1)"
            >
              发表评论
            </button>
          </div>
        </div>
      </div>
      <!-- 评论列表 -->
      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <img :src="comment.avatar" alt="评论者头像" class="comment-avatar" />
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.nickName }}</span>
              <span class="comment-time">{{ formatRelativeTime(comment.createdAt) }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <button class="comment-action-button">
                <i class="iconfont icon-aixin"></i>
                <span>{{ comment.likesCount }}</span>
              </button>
              <button class="comment-action-button" @click="toggleReplay(comment)">回复</button>
            </div>
            <div class="replay-count" @click="loadMoreReplay(comment)">
              查看{{ comment.replayNum }}条回复 <DArrowRight style="width: 1em; height: 1em;" />
            </div>
            <!-- 二级回复评论 -->
            <div class="two-level-replay" v-if="comment.replayList?.length > 0">
              <div class="replay-list" v-for="item in comment.replayList" :key="item.id">
                <img :src="comment.avatar" alt="评论者头像" class="comment-avatar" />
                <div class="comment-content-wrapper">
                  <div class="comment-header">
                    <span class="comment-author">{{ item.nickName }}</span>
                    <span class="comment-time">{{ formatRelativeTime(item.createdAt) }}</span>
                  </div>
                  <p class="comment-text">{{ item.content }}</p>
                  <div class="comment-actions">
                    <button class="comment-action-button">
                      <i class="iconfont icon-aixin"></i>
                      <span>{{ item.likesCount }}</span>
                    </button>
                    <button class="comment-action-button" @click="toggleReplay(item,2)">回复</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 底部回复 -->
             <div class="comment-replay-bottom" v-if="comment.isShowReplay">
                <ReplayComment :commentForm="commentForm" @submitComment="submitReplayComment" />
             </div>
          </div>
        </div>
        
        <!-- 暂无评论 -->
        <div v-if="comments.length === 0" class="no-comments">
          <i class="iconfont icon-pinglun"></i>
          <p>暂无评论，快来抢沙发吧！</p>
        </div>
      </div>
    </div>
    
    <!-- 相关推荐 -->
    <!-- <div class="related-articles-section">
      <h3 class="related-articles-title">
        <i class="iconfont icon-tuijian"></i>
        相关推荐
      </h3>
      
      <div class="related-articles-list">
        <div v-for="article in relatedArticles" :key="article.id" class="related-article-item" @click="navigateToArticle(article.id)">
          <img src="@/assets/img/banner2.png" alt="相关日记封面" class="related-article-cover" />
          <div class="related-article-info">
            <h4 class="related-article-title">{{ article.title }}</h4>
            <div class="related-article-meta">
              <span>{{ article.author }}</span>
              <span>{{ formatDate(article.createdAt) }}</span>
              <span><i class="iconfont icon-yanjing_xianshi_o"></i> {{ article.views }}</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user.js';
import { useDiaryStore } from '@/store/diary.js';
import { getDiaryById,getCommentList,addComment } from '@/api/index.js';
import EmojiMartVue3 from '@/components/EmojiMartVue3/EmojiMartVue3.vue'
import defaultAvatar from "@/assets/img/1.jpg"
import ReplayComment from "../Component/ReplayComment.vue"
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const diaryStore = useDiaryStore();

const userInfo = computed(() => userStore.getUserInfo);

// 引用
const commentTextarea = ref(null);

// 日记详情
const diary = ref({
  id:"",
  title: '',
  authorName: '',
  imageUrl: '',
  content: '',
  createdAt: '',
  category: '',
  tags: [],
  imageUrl: '',
  categoryName:''
});
const commentForm = reactive({
  "id": "",
  "userId": '',
  "targetId": '',
  "content": "",
  "parentId": 0,
  "rootId": 0,
  "status": "1",
})
const likeCount = ref(0);
const commentCount = ref(0);
const isLiked = ref(false);
const isBookmarked = ref(false);
const newComment = ref('');
const comments = ref([]);
const relatedArticles = ref([]);
// const defaultAvatar = defaultAvatar;
let cursorIndex = ref(0);
diary.id = route.params.id;

// 获取评论列表

const loadCommentList = async () => {
  let res = await getCommentList({diaryId:diary.id,parentId:commentForm.id || 0});
  if(res.code === 200){
    comments.value = res.data.rows;
    commentCount.value = res.data.total;
  } else {
    comments.value = [];
    commentCount.value = 0;
  }
  }
// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
// 格式化相对时间
const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 30) return `${diffDays}天前`;
  
  return formatDate(dateString);
};
// 格式化内容
const formatContent = (content) => {
  return content
    .replace(/\n/g, '<br/>')
    .replace(/### (.*?)<br\/>/g, '<h3>$1</h3>')
    .replace(/## (.*?)<br\/>/g, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};
// 切换点赞状态
const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};
// 分享文章
const shareArticle = () => {
  alert('分享功能开发中...');
};
// 提交评论
const submitComment = (level = 1) => {
  if ((!newComment.value.trim() && level === 1) || !userInfo.value.id) return;
  console.log(level);
  
  const params = {
    diaryId:diary.id,
    content:level === 1 ? newComment.value.trim() : commentForm.content,
    targetId:commentForm.targetId,
    parentId:commentForm.id || 0,
    rootId:commentForm.rootId || 0,
  };
  const newCommentObj = {
    id: params.id,
    userId: userInfo.value.id,
    avatar: userInfo.value.avatar || defaultAvatar,
    nickName: userInfo.value.nickname || '匿名用户',
    targetId: params.targetId,
    content: params.content,
    parentId: params.parentId,
    rootId: params.rootId,
    status: 1,
    createdAt: new Date().toISOString(),
  };
  if(params.parentId === 0){
      delete params.targetId;
  };
  addComment(params).then(res=>{
    if(res.code === 200){
      newCommentObj.id = res.data;
      console.log(newCommentObj);
      if(level === 1){
        comments.value.unshift(newCommentObj);
      } else {
        let index = comments.value.findIndex(c=>c.id === commentForm.rootId);
        if(index !== -1){
          comments.value[index].replayList = comments.value[index].replayList || [];
          comments.value[index].replayList.unshift(newCommentObj);
          comments.value[index].replayNum++;
        }
      }
      
      commentCount.value++;
      newComment.value = '';
      // loadCommentList();
    } else {
      alert(res.msg);
    }
  })
};
const focusComment = () => {
  commentTextarea.value?.focus();
};

const goBack = () => {
  router.back();
};

const loadDiaryData = async () => {
   let res = await getDiaryById({id:diary.id});
  if(res.code === 200){
    // diary.value = res.data;
    console.log(res);
    Object.assign(diary.value, res.data);
  };
  
  isLiked.value = false;
  isBookmarked.value = false;
};
const loadMoreReplay = async (comment) => {
  if(comment.replayList?.length >= comment.replayCount){
    return;
  }
  let res = await getCommentList({diaryId:diary.id,parentId:comment.id || 0});
  if(res.code === 200){
    comment.replayList = res.data.rows;
    comment.replayCount = res.data.total;
  } else {
    comment.replayList = [];
    comment.replayCount = 0;
  }
}
const handleEmojiChange = (emoji) => {
  newComment.value = newComment.value.slice(0, cursorIndex.value) + emoji + newComment.value.slice(cursorIndex.value);
  // 更新光标位置到插入的emoji后面
  cursorIndex.value = cursorIndex.value + emoji.length;
  // 重新设置焦点和光标位置
  setTimeout(() => {
    commentTextarea.value.focus();
    commentTextarea.value.textareaElRef.selectionStart = cursorIndex.value;
    commentTextarea.value.textareaElRef.selectionEnd = cursorIndex.value;
  }, 0);
};
const handleBlur = (e) => {
  cursorIndex.value = e.target.selectionStart;
};
const toggleReplay = (comment) => {

  Object.assign(commentForm, comment);
  commentForm.parentId = comment.id;
  commentForm.rootId = comment.id || 0;
  // 关闭其他回复框
  if(comment.isShowReplay){
    comments.value.forEach(c => c.isShowReplay = false);
    return;
  };
  comments.value.forEach(c => c.isShowReplay = false);
  comment.isShowReplay = true;
};
// 提交回复评论
const submitReplayComment = (comment) => {
  if (!comment.content.trim() || !userInfo.value.id) return;
  commentForm.targetId = comment.userId;
  commentForm.content = comment.content;
  console.log(comment);
  submitComment(2);
};
onBeforeMount(()=>{

});
// 组件挂载时加载数据
onMounted(() => {
  loadDiaryData();
  loadCommentList();
});
</script>

<style scoped lang="scss">
.article-detail-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: var(--container-padding);
  color: var(--text-color);
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.back-button-container {
  margin-bottom: 1rem;
  
  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    color: var(--text-medium);
    font-size: var(--font-size-base);
    cursor: pointer;
    padding: 0.75rem 1.25rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    &:hover {
      background-color: var(--primary-light);
      color: var(--primary-color);
      border-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(158, 31, 54, 0.1);
    }
    
    i {
      font-size: var(--font-size-lg);
    }
    
    span {
      font-weight: 500;
    }
  }
}

.article-detail-card {
  background-color: var(--card-bg);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
  
  &:hover {
    box-shadow: var(--shadow-hover);
  }
}

.article-header {
  margin-bottom: 1rem;
  
  .article-title {
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 1.5rem;
    line-height: 1.3;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-xl);
    }
  }
  
  .article-meta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    .author-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .author-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--primary-light);
      }
      
      .author-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        
        .author-name {
          font-weight: 600;
          color: var(--text-dark);
        }
        
        .publish-date {
          font-size: var(--font-size-sm);
          color: var(--text-light);
        }
      }
    }
    
    .article-tags {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      
      .category-tag {
        background-color: var(--primary-light);
        color: var(--primary-color);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: var(--font-size-sm);
        font-weight: 500;
      }
      
      .tag-item {
        background-color: var(--secondary-color);
        color: var(--accent-color);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: var(--font-size-sm);
      }
    }
  }
}

.article-cover {
  margin-bottom: 2rem;
  
  :deep(.cover-image){
    width: 100%;
    img{
      width: 100%;
      height: auto;
      border-radius: 16px;
      object-fit: cover;
      max-height: 500px;
      cursor: zoom-in;
    }
  }
}

.article-content {
  font-size: var(--font-size-base);
  line-height: 1.8;
  color: var(--text-medium);
  margin-bottom: 2rem;
  
  h2 {
    font-size: var(--font-size-xl);
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }
  
  h3 {
    font-size: var(--font-size-lg);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--text-dark);
  }
  
  p {
    margin-bottom: 1rem;
    text-align: justify;
  }
  
  .placeholder-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background-color: var(--secondary-color);
    border-radius: 12px;
    opacity: 0.8;
    
    p {
      margin-bottom: 0;
      color: var(--text-light);
      font-style: italic;
    }
  }
}

.article-interactions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  
  .interaction-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 1px solid var(--border-color);
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-size: var(--font-size-base);
    color: var(--text-light);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background-color: rgba(158, 31, 54, 0.05);
      transform: none;
    }
    
    &.active {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
    }
  }
}

.comments-section {
  background-color: var(--card-bg);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  .comments-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .comment-input-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    
    .comment-input-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .comment-input-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      
      .comment-textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        font-size: var(--font-size-base);
        font-family: inherit;
        resize: vertical;
        min-height: 100px;
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(158, 31, 54, 0.1);
        }
      }
      
      .submit-comment-button {
        align-self: flex-end;
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 8px;
        font-size: var(--font-size-base);
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover:not(:disabled) {
          background-color: var(--primary-light);
          transform: translateY(-1px);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
  
  .comments-list {
    .comment-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color);
      
      // &:last-child {
      //   // border-bottom: none;
      //   margin-bottom: 0;
      //   padding-bottom: 0;
      // }
      
      .comment-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .comment-content {
        flex: 1;
        
        .comment-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
          
          .comment-author {
            font-weight: 600;
            color: var(--text-dark);
          }
          
          .comment-time {
            font-size: var(--font-size-sm);
            color: var(--text-light);
          }
        }
        
        .comment-text {
          font-size: var(--font-size-base);
          line-height: 1.6;
          color: var(--text-medium);
          margin-bottom: 0.5rem;
          word-break: break-all;
        }
        
        .comment-actions {
          display: flex;
          gap: 1.5rem;
          
          .comment-action-button {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            background: none;
            border: none;
            font-size: var(--font-size-sm);
            color: var(--text-light);
            cursor: pointer;
            padding: 0.25rem 0;
            i {
              font-size: 1.2rem;
            }
            &:hover {
              color: var(--primary-color);
              transform: none;
            }
          }
        }
      }
    }
    
    .no-comments {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-light);
      
      i {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
        opacity: 0.6;
      }
    }
  }
}

.related-articles-section {
  background-color: var(--card-bg);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: var(--shadow);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  .related-articles-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .related-articles-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .related-article-item {
      display: flex;
      flex-direction: column;
      background-color: var(--secondary-color);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-hover);
      }
      
      .related-article-cover {
        width: 100%;
        height: 180px;
        object-fit: cover;
      }
      
      .related-article-info {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        
        .related-article-title {
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        
        .related-article-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--font-size-sm);
          color: var(--text-light);
          
          span {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
        }
      }
    }
  }
}

.comment-actions{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.replay-count{
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--primary-light);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  width: max-content;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover{
    transform: translateX(4px);
  }
}
.comment-replay-bottom{
  margin-top: 0.75rem;
}
.replay-list{
  display: flex;
  column-gap: 1rem;
  margin-top: 0.75rem;
}
</style>