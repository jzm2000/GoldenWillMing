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
              :src="diary.authorAvatar || defaultAvatar" 
              alt="作者头像" 
              class="author-avatar"
            />
            <div class="author-details">
              <span class="author-name">{{ diary.authorName || '未知作者' }}</span>
              <span class="publish-date">{{ formatDate(diary.createdAt) || '2023-05-15' }}</span>
            </div>
          </div>
          
          <div class="article-tags">
            <span v-if="diary.category" class="category-tag">{{ diary.category }}</span>
            <span v-for="tag in diary.tags" :key="tag" class="tag-item">#{{ tag }}</span>
          </div>
        </div>
      </div>
      
      <!-- 日记封面图 -->
      <div v-if="diary.coverImage" class="article-cover">
        <img src="@/assets/img/banner5.png" alt="日记封面" class="cover-image" />
      </div>
      
      <!-- 日记内容 -->
      <div class="article-content">
        <div v-if="diary.content" v-html="formatContent(diary.content)"></div>
        <div v-else class="placeholder-content">
          <p>这是一篇精彩的日记内容...</p>
          <p>在这里，作者分享了他们的思考、感受和生活中的美好时刻。</p>
          <p>日记是记录生活、表达情感的重要方式，每一篇日记都承载着独特的记忆和价值。</p>
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
        
        <button class="interaction-button book-button" @click="toggleBookmark">
          <i :class="['iconfont', isBookmarked ? 'icon-shoucang' : 'icon-shoucang1']"></i>
          <span>{{ isBookmarked ? '已收藏' : '收藏' }}</span>
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
          <textarea
            ref="commentTextarea"
            v-model="newComment"
            placeholder="写下你的评论..."
            class="comment-textarea"
            rows="3"
          ></textarea>
          <button 
            class="submit-comment-button"
            :disabled="!newComment.trim()"
            @click="submitComment"
          >
            发表评论
          </button>
        </div>
      </div>
      
      <!-- 评论列表 -->
      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <img :src="comment.avatar" alt="评论者头像" class="comment-avatar" />
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-time">{{ formatRelativeTime(comment.createdAt) }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <button class="comment-action-button">
                <i class="iconfont icon-aixin"></i>
                <span>{{ comment.likes }}</span>
              </button>
              <button class="comment-action-button">回复</button>
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
    <div class="related-articles-section">
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
    </div>
    
    <!-- 底部装饰 -->
    <div class="bottom-decoration"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user.js';
import { useDiaryStore } from '@/store/diary.js';
import { getDiaryById } from '@/api/index.js';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const diaryStore = useDiaryStore();

// 引用
const commentTextarea = ref(null);

// 日记详情
const diary = ref({
  id:"",
  title: '',
  authorName: '',
  authorAvatar: '',
  content: '',
  createdAt: '',
  category: '',
  tags: [],
  coverImage: ''
});
const likeCount = ref(0);
const commentCount = ref(0);
const isLiked = ref(false);
const isBookmarked = ref(false);
const newComment = ref('');
const comments = ref([]);
const relatedArticles = ref([]);
const defaultAvatar = './img/banner2.png';

// 获取日记ID
diary.id = route.params.id;


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
  // 简单的内容格式化，实际项目中可能需要更复杂的处理
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
  // 实际项目中这里应该调用API
};

// 切换收藏状态
const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  // 实际项目中这里应该调用API
};

// 分享文章
const shareArticle = () => {
  // 实际项目中实现分享功能
  alert('分享功能开发中...');
};

// 提交评论
const submitComment = () => {
  if (!newComment.value.trim()) return;
  
  const newCommentObj = {
    id: Date.now(),
    author: '当前用户',
    avatar: defaultAvatar,
    content: newComment.value.trim(),
    createdAt: new Date().toISOString(),
    likes: 0
  };
  
  comments.value.unshift(newCommentObj);
  commentCount.value++;
  newComment.value = '';
  
  // 实际项目中这里应该调用API
};

// 聚焦评论框
const focusComment = () => {
  commentTextarea.value?.focus();
};

// 导航到其他文章
const navigateToArticle = (id) => {
  router.push(`/article-detail/${id}`);
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 模拟加载数据
const loadDiaryData = async () => {
   let res = await getDiaryById({id:diary.id});
  if(res.code === 200){
    // diary.value = res.data;
    console.log(res);
  }
  
  diary.value = {
    title: '春日游记：寻找城市里的小确幸',
    authorName: '小明同学',
    authorAvatar: './img/banner2.png',
    content: '### 春日的早晨\n今天天气特别好，阳光透过窗户洒进房间，让人心情愉悦。决定出门走走，寻找城市里的春天。\n\n### 城市中的绿意\n沿着河边漫步，发现柳树已经抽出了新芽，嫩绿的颜色让人看了就觉得生机盎然。公园里的樱花也开了，粉色的花朵在微风中摇曳，美不胜收。\n\n### 街角的咖啡馆\n走累了，在街角发现一家温馨的咖啡馆。点了一杯手冲咖啡，坐在窗边，看着窗外的行人，享受片刻的宁静。\n\n### 偶遇的小猫\n回家的路上，遇到了一只可爱的流浪猫。它一点也不怕人，乖巧地蹭着我的手，让我忍不住停下脚步陪它玩了一会儿。\n\n今天真是美好的一天，虽然只是简单的散步，但却发现了许多平时忽略的美好。生活中的小确幸，往往就藏在这些平凡的瞬间里。',
    createdAt: '2023-04-15T10:30:00.000Z',
    category: '生活感悟',
    tags: ['春天', '城市漫步', '小确幸'],
    coverImage: '/diary.png'
  };
  
  likeCount.value = 42;
  commentCount.value = 8;
  isLiked.value = false;
  isBookmarked.value = false;
  
  // 模拟评论数据
  comments.value = [
    {
      id: 1,
      author: '小花',
      avatar: '/diary.png',
      content: '写得真好，我也很喜欢春天的气息！',
      createdAt: '2023-04-16T09:15:00.000Z',
      likes: 5
    },
    {
      id: 2,
      author: '大树',
      avatar: '/diary.png',
      content: '那个街角的咖啡馆我也去过，他们家的手冲确实不错！',
      createdAt: '2023-04-16T14:30:00.000Z',
      likes: 3
    }
  ];
  
  // 模拟相关推荐数据
  relatedArticles.value = [
    {
      id: 2,
      title: '夏日午后的一场大雨',
      author: '小雨',
      coverImage: '/diary.png',
      createdAt: '2023-06-10T15:20:00.000Z',
      views: 128
    },
    {
      id: 3,
      title: '秋天的落叶',
      author: '秋风',
      coverImage: '/diary.png',
      createdAt: '2023-10-25T09:45:00.000Z',
      views: 95
    },
    {
      id: 4,
      title: '冬日里的一杯热茶',
      author: '暖阳',
      coverImage: '/diary.png',
      createdAt: '2023-12-20T18:30:00.000Z',
      views: 210
    }
  ];
};

onBeforeMount(()=>{

});
// 组件挂载时加载数据
onMounted(() => {
  loadDiaryData();
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
  margin-bottom: 2rem;
  
  .article-title {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--text-dark);
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
  
  .cover-image {
    width: 100%;
    height: auto;
    border-radius: 16px;
    object-fit: cover;
    max-height: 500px;
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
          background-color: var(--primary-dark);
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
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      
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
          margin-bottom: 0.75rem;
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
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-dark);
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

.bottom-decoration {
  height: 2rem;
}
</style>