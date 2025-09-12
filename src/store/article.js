import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [
      {
        id: 1,
        title: 'Vue3组合式API入门教程',
        excerpt: '探索Vue3新特性带来的开发体验提升',
        content: '详细介绍Vue3组合式API的使用方法和优势...',
        date: '2023-06-15'
      },
      {
        id: 2,
        title: 'Pinia状态管理最佳实践',
        excerpt: '如何在Vue项目中高效使用Pinia进行状态管理',
        content: 'Pinia作为Vuex的替代方案，提供了更简洁的API...',
        date: '2023-06-10'
      },
      {
        id: 3,
        title: 'Vue Router4路由守卫应用',
        excerpt: '掌握路由守卫实现复杂权限控制',
        content: 'Vue Router4的导航守卫可以帮助我们控制页面访问权限...',
        date: '2023-06-05'
      }
    ]
  }),
  getters: {
    getLatestArticles: (state) => (count) => {
      return state.articles.slice(0, count)
    },
    getArticleById: (state) => (id) => {
      return state.articles.find(article => article.id === id)
    }
  },
  actions: {
    loadArticles() {
      // 实际项目中可替换为API请求
      console.log('加载日记数据')
    }
  }
})