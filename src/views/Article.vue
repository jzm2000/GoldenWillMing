<template>
  <div class="article-detail-page">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      
      返回列表
    </button>

    <!-- 文章内容 -->
    <article class="article-content">
      <div class="container">
        <!-- 文章头部 -->
        <header class="article-header">
          <div class="article-meta">
            <span class="article-category">{{ article.categoryLabel }}</span>
            <span class="article-date">{{ formatDate(article.date) }}</span>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-info">
            <div class="author-info">
              <img 
                src="https://picsum.photos/seed/author/100/100" 
                alt="作者头像"
                class="author-avatar"
              />
              <div>
                <h3 class="author-name">张小明</h3>
                <p class="author-title">前端开发工程师</p>
              </div>
            </div>
            <div class="article-stats">
              <div class="stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6V12L16 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ article.readTime }}</span>
              </div>
              <div class="stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ article.views }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- 文章特色图 -->
        <div class="featured-image-wrapper">
          <img 
            :src="article.imageUrl" 
            :alt="article.title"
            class="featured-image"
            loading="lazy"
          />
        </div>

        <!-- 文章正文 -->
        <div class="article-body">
          <div v-html="article.content" class="prose"></div>
        </div>

        <!-- 文章标签 -->
        <div class="article-tags">
          <span class="tags-label">标签：</span>
          <div class="tags-list">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <!-- 文章操作 -->
        <div class="article-actions">
          <button class="action-button like-button" @click="toggleLike">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5C4.44772 21 4 20.5523 4 20V10C4 9.44772 4.44772 9 5 9H19C19.5523 9 20 9.44772 20 10V20C20 20.5523 19.5523 21 19 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 9V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V9M13 14L15 16L18 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ likes }}</span>
          </button>
          <button class="action-button share-button" @click="shareArticle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5C4 9.46243 6.46243 7 9.5 7H14.5C17.5376 7 20 9.46243 20 12.5C20 15.5376 17.5376 18 14.5 18H9.5C6.46243 18 4 15.5376 4 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 12H15.01M9 5L7 7L9 9M9 19L7 17L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            分享
          </button>
        </div>

        <!-- 相关文章 -->
        <section class="related-articles">
          <h3 class="related-title">相关文章</h3>
          <div class="related-grid">
            <div 
              v-for="related in relatedArticles" 
              :key="related.id" 
              class="related-article-card"
              @click="navigateToArticle(related.id)"
            >
              <div class="related-image-wrapper">
                <img 
                  :src="related.imageUrl"
                  :alt="related.title"
                  class="related-image"
                  loading="lazy"
                />
              </div>
              <h4 class="related-title">{{ related.title }}</h4>
              <p class="related-excerpt">{{ related.excerpt }}</p>
              <div class="related-date">{{ formatArticleDate(related.date) }}</div>
            </div>
          </div>
        </section>

        <!-- 评论区 -->
        <section class="comments-section">
          <h3 class="comments-title">评论 ({{ comments.length }})</h3>
          
          <!-- 评论表单 -->
          <div class="comment-form">
            <img 
              src="https://picsum.photos/seed/user/100/100" 
              alt="用户头像"
              class="comment-avatar"
            />
            <div class="comment-input-wrapper">
              <textarea 
                class="comment-textarea"
                placeholder="写下你的评论..."
                v-model="newComment"
                @keydown.enter.ctrl="submitComment"
              ></textarea>
              <div class="comment-form-actions">
                <span class="comment-hint">Ctrl+Enter 发送评论</span>
                <button 
                  class="submit-comment-button"
                  :disabled="!newComment.trim()"
                  @click="submitComment"
                >
                  发送评论
                </button>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id">
              <div class="comment-item">
                <div class="comment-header">
                  <img 
                    :src="comment.author.avatar"
                    :alt="comment.author.name"
                    class="comment-avatar"
                  />
                  <div class="comment-author-info">
                    <h4 class="comment-author-name">{{ comment.author.name }}</h4>
                    <span class="comment-date">{{ formatCommentDate(comment.date) }}</span>
                  </div>
                </div>
                <div class="comment-content">
                  {{ comment.content }}
                </div>
                <div class="comment-actions">
                  <button 
                    class="comment-action like-action"
                    :class="{ liked: comment.isLiked }"
                    @click="toggleCommentLike(comment.id)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ comment.likes }}</span>
                  </button>
                  <button 
                    class="comment-action reply-action"
                    @click="replyToComment(comment)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M10 9V5a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3v-4M14 15l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    回复
                  </button>
                </div>
                
                <div class="replies-list" v-if="comment.replies && comment.replies.length > 0">
                  <div v-for="reply in comment.replies" :key="reply.id">
                    <div class="comment-item">
                      <div class="comment-header">
                        <img 
                          :src="reply.author.avatar"
                          :alt="reply.author.name"
                          class="comment-avatar"
                        />
                        <div class="comment-author-info">
                          <h4 class="comment-author-name">{{ reply.author.name }}</h4>
                          <span class="comment-date">{{ formatCommentDate(reply.date) }}</span>
                        </div>
                      </div>
                      <div class="comment-content">
                        {{ reply.content }}
                      </div>
                      <div class="comment-actions">
                        <button 
                          class="comment-action like-action"
                          :class="{ liked: reply.isLiked }"
                          @click="toggleCommentLike(reply.id)"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <span>{{ reply.likes }}</span>
                        </button>
                        <button 
                          class="comment-action reply-action"
                          @click="replyToComment(reply)"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M10 9V5a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3v-4M14 15l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          回复
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>

    <!-- 文章目录 -->
    <aside class="article-toc" :class="{ expanded: isTocExpanded }">
      <div class="toc-wrapper">
        <div class="toc-header">
          <h3>文章目录</h3>
          <button 
            class="toc-toggle" 
            @click="toggleToc"
            aria-label="切换目录"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <nav class="toc-nav">
          <ul class="toc-list">
            <li v-for="(item, index) in tocItems" :key="index" class="toc-item">
              <a 
                :href="`#${item.id}`"
                :class="{ active: item.active }"
                @click="scrollToSection(item.id)"
                class="toc-link"
              >
                {{ item.title }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- 分享弹窗 -->
    <div class="share-modal" :class="{ open: isShareModalOpen }" v-if="isShareModalOpen">
      <div class="share-modal-backdrop" @click="closeShareModal"></div>
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>分享文章</h3>
          <button class="share-modal-close" @click="closeShareModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="share-modal-body">
          <p class="share-modal-title">{{ article.title }}</p>
          <div class="share-links">
            <a href="#" class="share-link weibo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 6.5c-0.6-0.8-1.5-1.3-2.5-1.5c-1 0-1.8 0.4-2.4 1.1c-0.6-0.7-1.4-1.1-2.4-1.1c-1.6 0-2.9 1.3-2.9 2.9c0 0 0 0 0 0c0 2.6 3.8 4.6 8.3 5.8v1.7c-0.1 0.7-0.4 1.3-0.8 1.9c-0.3 0.6-0.8 1-1.4 1.2c-0.6 0.2-1.2 0.2-1.8 0.2c-1.6 0-2.9-1.3-2.9-2.9s1.3-2.9 2.9-2.9c0.5 0 0.9 0.2 1.3 0.5c-2.1-0.2-4.2-1.4-5.3-3.3C6.4 10 6 9.2 6 8.3C6 5.9 8.1 3.8 10.6 3.8c2.2 0 4.1 1.4 4.7 3.4c1.4-0.2 2.8-0.6 4.2-1.3V6.5z" fill="currentColor"/>
              </svg>
              微博
            </a>
            <a href="#" class="share-link wechat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
              微信
            </a>
            <a href="#" class="share-link qq">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18.5 12C18.5 15.5899 15.5899 18.5 12 18.5C8.41015 18.5 5.5 15.5899 5.5 12C5.5 8.41015 8.41015 5.5 12 5.5C15.5899 5.5 18.5 8.41015 18.5 12ZM12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM9.5 14C9.224 14 9 13.776 9 13.5C9 13.224 9.224 13 9.5 13C9.776 13 10 13.224 10 13.5C10 13.776 9.776 14 9.5 14ZM14.5 14C14.224 14 14 13.776 14 13.5C14 13.224 14.224 13 14.5 13C14.776 13 15 13.224 15 13.5C15 13.776 14.776 14 14.5 14ZM12 8C10.343 8 9 9.343 9 11H15C15 9.343 13.657 8 12 8Z" fill="currentColor"/>
              </svg>
              QQ
            </a>
            <a href="#" class="share-link copy">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 3V5M8 19V21M16 3V5M16 19V21M3 8H5M21 8H19M3 16H5M21 16H19M15 3C16.1046 3 17 3.89543 17 5V19C17 20.1046 16.1046 21 15 21H9C7.89543 21 7 20.1046 7 19V5C7 3.89543 7.89543 3 9 3H15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              复制链接
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/store/article'

const route = useRoute()
const router = useRouter()
const params = router.params;
const articleStore = useArticleStore()

// 状态管理
const isLoading = ref(true)
const article = ref({
  id: parseInt(params.id),
  title: "Vue3 Composition API完全指南",
  excerpt: "深入探索Vue3的Composition API，了解如何使用setup函数、响应式数据和生命周期钩子构建现代化的Vue应用。",
  category: "frontend",
  categoryLabel: "前端开发",
  date: "2023-10-15",
  readTime: "12分钟",
  imageUrl: "https://picsum.photos/seed/vue3/1200/600",
  views: 1243,
  author: {
    name: "张小明",
    title: "前端开发工程师",
    avatar: "https://picsum.photos/seed/author/100/100"
  },
  tags: ["Vue3", "Composition API", "前端开发", "JavaScript"],
  content: `
    <h2 id="introduction">1. 什么是Vue3 Composition API？</h2>
    <p>Vue3的Composition API是一组新的API，提供了更灵活的方式来组织和复用组件逻辑。它主要由setup函数、响应式数据、计算属性、生命周期钩子等组成，相比于Vue2的选项API，Composition API更加适合处理复杂的组件逻辑。</p>
    
    <h2 id="setup">2. Setup函数</h2>
    <p>setup函数是Composition API的入口点，它在组件实例创建之前执行，接收两个参数：props和context。在setup函数中定义的变量和函数可以通过return语句暴露给模板使用。</p>
    
    <pre><code class="language-javascript">
    export default {
      props: {
        title: String
      },
      setup(props) {
        console.log(props.title)
        
        return {
          // 暴露给模板的变量和函数
        }
      }
    }
    </code></pre>
    
    <h2 id="reactive-data">3. 响应式数据</h2>
    <p>Vue3提供了几种创建响应式数据的方式：</p>
    
    <h3>3.1 ref</h3>
    <p>ref函数用于创建一个响应式的引用，它可以包装任何类型的数据。在JavaScript中使用时需要通过.value访问，在模板中则不需要。</p>
    
    <pre><code class="language-javascript">
    import { ref } from 'vue'
    
    const count = ref(0)
    console.log(count.value) // 0
    count.value++ // 响应式更新
    </code></pre>
    
    <h3>3.2 reactive</h3>
    <p>reactive函数用于创建一个响应式的对象，它只能用于对象类型的数据，不能用于基本类型。</p>
    
    <pre><code class="language-javascript">
    import { reactive } from 'vue'
    
    const state = reactive({
      count: 0,
      message: 'Hello Vue3'
    })
    
    state.count++ // 响应式更新
    </code></pre>
    
    <h3>3.3 computed</h3>
    <p>computed函数用于创建计算属性，它会根据依赖的响应式数据自动更新。</p>
    
    <pre><code class="language-javascript">
    import { ref, computed } from 'vue'
    
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    console.log(doubleCount.value) // 0
    count.value = 1
    console.log(doubleCount.value) // 2
    </code></pre>
    
    <h2 id="lifecycle">4. 生命周期钩子</h2>
    <p>Composition API提供了一系列生命周期钩子函数，可以在setup函数中使用：</p>
    
    <pre><code class="language-javascript">
    import { onMounted, onUnmounted } from 'vue'
    
    setup() {
      onMounted(() => {
        console.log('组件挂载完成')
      })
      
      onUnmounted(() => {
        console.log('组件卸载完成')
      })
    }
    </code></pre>
    
    <h2 id="composables">5. 组合式函数 (Composables)</h2>
    <p>组合式函数是Composition API最大的亮点之一，它允许我们将相关的逻辑封装成可复用的函数。</p>
    
    <pre><code class="language-javascript">
    // useCounter.js
    import { ref, computed } from 'vue'
    
    export function useCounter(initialValue = 0) {
      const count = ref(initialValue)
      const doubleCount = computed(() => count.value * 2)
      
      const increment = () => count.value++
      const decrement = () => count.value--
      const reset = () => count.value = initialValue
      
      return {
        count,
        doubleCount,
        increment,
        decrement,
        reset
      }
    }
    
    // 在组件中使用
    import { useCounter } from './useCounter'
    
    setup() {
      const { count, increment, decrement } = useCounter(10)
      
      return {
        count,
        increment,
        decrement
      }
    }
    </code></pre>
    
    <h2 id="best-practices">6. 最佳实践</h2>
    <p>在使用Composition API时，建议遵循以下最佳实践：</p>
    
    <ul>
      <li>按逻辑相关性组织代码，而不是按选项类型</li>
      <li>使用组合式函数封装可复用逻辑</li>
      <li>合理使用ref和reactive，优先使用ref</li>
      <li>避免在setup函数中使用this</li>
      <li>为复杂的组合式函数提供明确的类型定义</li>
    </ul>
    
    <h2 id="conclusion">7. 总结</h2>
    <p>Vue3的Composition API为我们提供了一种更加灵活和强大的方式来构建Vue组件。通过合理使用setup函数、响应式数据、计算属性、生命周期钩子和组合式函数，我们可以编写出更加清晰、可维护和可复用的代码。</p>
    
    <p>无论是处理简单的UI组件还是复杂的业务逻辑，Composition API都能够帮助我们更好地组织和管理代码，提高开发效率和代码质量。</p>
  `
})

const likes = ref(42)
const isLiked = ref(false)
const newComment = ref('')
const comments = ref([
  {
    id: 1,
    author: {
      name: "小李",
      avatar: "https://picsum.photos/seed/user1/100/100"
    },
    content: "非常感谢分享！Composition API确实比Options API更加灵活，特别是在处理复杂组件时。",
    date: "2023-10-16T10:30:00",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 2,
        author: {
          name: "张小明",
          avatar: "https://picsum.photos/seed/author/100/100"
        },
        content: "是的，我也觉得Composition API在逻辑复用方面做得非常好。",
        date: "2023-10-16T11:15:00",
        likes: 5,
        isLiked: false
      }
    ]
  },
  {
    id: 3,
    author: {
      name: "小王",
      avatar: "https://picsum.photos/seed/user2/100/100"
    },
    content: "请问在实际项目中，您是如何决定何时使用Composition API而不是Options API的？",
    date: "2023-10-15T16:45:00",
    likes: 8,
    isLiked: false,
    replies: []
  }
])

const relatedArticles = ref([
  {
    id: 2,
    title: "CSS Grid布局实战技巧",
    excerpt: "掌握CSS Grid布局系统，学习如何创建复杂的二维布局，让网页设计更加灵活和响应式。",
    category: "frontend",
    date: "2023-09-28",
    imageUrl: "https://picsum.photos/seed/cssgrid/400/250"
  },
  {
    id: 6,
    title: "TypeScript高级类型系统",
    excerpt: "深入学习TypeScript的高级类型特性，包括泛型、条件类型、映射类型等，提升代码质量和可维护性。",
    category: "frontend",
    date: "2023-07-18",
    imageUrl: "https://picsum.photos/seed/typescript/400/250"
  },
  {
    id: 4,
    title: "前端性能优化实战",
    excerpt: "从网络请求、资源加载、渲染性能等多个维度，全面解析前端性能优化的实用技巧。",
    category: "frontend",
    date: "2023-08-22",
    imageUrl: "https://picsum.photos/seed/performance/400/250"
  }
])

// 目录相关状态
const isTocExpanded = ref(true)
const tocItems = ref([
  { id: 'introduction', title: '1. 什么是Vue3 Composition API？', active: false },
  { id: 'setup', title: '2. Setup函数', active: false },
  { id: 'reactive-data', title: '3. 响应式数据', active: false },
  { id: 'lifecycle', title: '4. 生命周期钩子', active: false },
  { id: 'composables', title: '5. 组合式函数 (Composables)', active: false },
  { id: 'best-practices', title: '6. 最佳实践', active: false },
  { id: 'conclusion', title: '7. 总结', active: false }
])

// 分享弹窗状态
const isShareModalOpen = ref(false)

// 方法
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

const formatCommentDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}秒前`
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)}天前`
  } else {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('zh-CN', options)
  }
}

// 格式化文章日期
const formatArticleDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

const goBack = () => {
  router.back()
}

const navigateToArticle = (id) => {
  router.push(`/article/${id}`)
}

const toggleLike = () => {
  if (isLiked.value) {
    likes.value--
  } else {
    likes.value++
  }
  isLiked.value = !isLiked.value
}

const submitComment = () => {
  if (!newComment.value.trim()) return
  
  const newCommentObj = {
    id: Date.now(),
    author: {
      name: "访客",
      avatar: "https://picsum.photos/seed/user/100/100"
    },
    content: newComment.value.trim(),
    date: new Date().toISOString(),
    likes: 0,
    isLiked: false,
    replies: []
  }
  
  comments.value.unshift(newCommentObj)
  newComment.value = ''
}

const replyToComment = (comment) => {
  newComment.value = `@${comment.author.name} `
  // 滚动到评论框
  const commentTextarea = document.querySelector('.comment-textarea')
  if (commentTextarea) {
    commentTextarea.focus()
  }
}

const toggleCommentLike = (commentId) => {
  const findCommentById = (commentList) => {
    for (const comment of commentList) {
      if (comment.id === commentId) {
        return comment
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = findCommentById(comment.replies)
        if (found) return found
      }
    }
    return null
  }
  
  const comment = findCommentById(comments.value)
  if (comment) {
    if (comment.isLiked) {
      comment.likes--
    } else {
      comment.likes++
    }
    comment.isLiked = !comment.isLiked
  }
}

const toggleToc = () => {
  isTocExpanded.value = !isTocExpanded.value
}

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: 'smooth'
    })
  }
}

const shareArticle = () => {
  isShareModalOpen.value = true
}

const closeShareModal = () => {
  isShareModalOpen.value = false
}

// 监听滚动更新目录高亮
const handleScroll = () => {
  const scrollPosition = window.scrollY + 150
  
  for (let i = tocItems.value.length - 1; i >= 0; i--) {
    const element = document.getElementById(tocItems.value[i].id)
    if (element && element.offsetTop <= scrollPosition) {
      tocItems.value.forEach(item => {
        item.active = false
      })
      tocItems.value[i].active = true
      break
    }
  }
}

// 组件挂载时执行
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始检查
  
  // 模拟加载数据
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

// 组件卸载时执行
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.article-detail-page {
  position: relative;
  padding-bottom: 3rem;
}

/* 返回按钮 */
.back-button {
  position: fixed;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  background-color: white;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 50;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 文章内容 */
.article-content {
  padding-top: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* 文章头部 */
.article-header {
  margin-bottom: 2rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.article-category {
  padding: 0.3rem 0.8rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.article-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.article-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.article-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.author-title {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.article-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 特色图 */
.featured-image-wrapper {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.featured-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* 文章正文 */
.article-body {
  margin-bottom: 2rem;
}

.prose {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-color);
}

.prose h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  position: relative;
  padding-bottom: 0.5rem;
}

.prose h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}

.prose h3 {
  font-size: 1.35rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.prose p {
  margin-bottom: 1.5rem;
}

.prose ul {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose pre {
  background-color: var(--background-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.prose code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  background-color: var(--background-secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}

/* 文章标签 */
.article-tags {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.tags-label {
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.4rem 0.8rem;
  background-color: var(--background-secondary);
  color: var(--text-color);
  border-radius: 20px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: var(--primary-color);
  color: white;
}

/* 文章操作 */
.article-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background-color: white;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-button:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.like-button.liked {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 相关文章 */
.related-articles {
  margin-bottom: 3rem;
}

.related-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.related-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.related-article-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.related-article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.related-image-wrapper {
  height: 150px;
  overflow: hidden;
}

.related-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.related-article-card:hover .related-image {
  transform: scale(1.05);
}

.related-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-excerpt {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 1rem 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0 1rem 1rem;
}

/* 评论区 */
.comments-section {
  margin-top: 3rem;
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.comments-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}

/* 评论表单 */
.comment-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--background-secondary);
  border-radius: 12px;
}

.comment-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-input-wrapper {
  flex: 1;
}

.comment-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(45, 120, 210, 0.1);
}

.comment-form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.comment-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.submit-comment-button {
  padding: 0.6rem 1.2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.submit-comment-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.submit-comment-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 评论列表 */
.comments-list {
  space-y: 1.5rem;
}

.comment-item {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.comment-author-info {
  flex: 1;
}

.comment-author-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.comment-content {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.comment-actions {
  display: flex;
  gap: 1.5rem;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  background-color: transparent;
  color: var(--text-secondary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.comment-action:hover {
  background-color: var(--background-secondary);
  color: var(--text-color);
}

.like-action.liked {
  color: var(--primary-color);
}

/* 回复列表 */
.replies-list {
  margin-top: 1.5rem;
  margin-left: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* 文章目录 */
.article-toc {
  position: fixed;
  top: 120px;
  right: 2rem;
  width: 280px;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 40;
}

.article-toc:not(.expanded) {
  transform: translateX(calc(100% + 1rem));
}

.toc-wrapper {
  padding: 1.5rem;
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.toc-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.toc-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.toc-toggle:hover {
  background-color: var(--background-secondary);
  color: var(--text-color);
}

.toc-list {
  list-style: none;
  padding: 0;
}

.toc-item {
  margin-bottom: 0.75rem;
}

.toc-link {
  display: block;
  padding: 0.5rem 0.8rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  line-height: 1.4;
}

.toc-link:hover {
  background-color: var(--background-secondary);
  color: var(--text-color);
}

.toc-link.active {
  background-color: var(--primary-color);
  color: white;
}

/* 分享弹窗 */
.share-modal {
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

.share-modal.open {
  opacity: 1;
  visibility: visible;
}

.share-modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.share-modal-content {
  position: relative;
  background-color: white;
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.share-modal.open .share-modal-content {
  transform: scale(1);
}

.share-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.share-modal-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.share-modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.share-modal-close:hover {
  background-color: var(--background-secondary);
  color: var(--text-color);
}

.share-modal-body {
  padding: 1.5rem;
}

.share-modal-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.share-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.share-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.share-link:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.share-link.weibo:hover {
  background-color: #e6162d;
  border-color: #e6162d;
}

.share-link.wechat:hover {
  background-color: #07c160;
  border-color: #07c160;
}

.share-link.qq:hover {
  background-color: #12b7f5;
  border-color: #12b7f5;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .article-toc {
    width: 250px;
  }
}

@media (max-width: 992px) {
  .article-toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .back-button {
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 0.9rem;
    font-size: 0.85rem;
  }
  
  .article-title {
    font-size: 1.75rem;
  }
  
  .article-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
  
  .comment-form {
    flex-direction: column;
  }
  
  .comment-avatar {
    align-self: flex-start;
  }
  
  .replies-list {
    margin-left: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .article-title {
    font-size: 1.5rem;
  }
  
  .prose h2 {
    font-size: 1.5rem;
  }
  
  .share-links {
    grid-template-columns: 1fr;
  }
}
</style>