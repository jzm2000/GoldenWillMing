<template>
  <div class="diary-card" @click="navigateToDiary">
    <div class="diary-card-header">
      <span class="diary-date">{{ formatDate(diary.created_at) }}</span>
      <span class="diary-category">{{ getCategoryName() }}</span>
    </div>
    <h3 class="diary-card-title">{{ diary.title }}</h3>
    <p class="diary-card-excerpt">{{ diary.content }}</p>
    <div class="diary-card-footer">
      <div class="diary-card-stats">
        <span class="stat">
          <i :class="['iconfont',diary.isLiked ? 'icon-aixin1' : 'icon-aixin']"></i>
          {{ diary.likeNum }}
        </span>
        <span class="stat">
          <span class="iconfont icon-pinglun"></span>
          {{ diary.comments || 0 }}
        </span>
        <span class="stat">
          <span class="iconfont icon-yanjing_xianshi_o" style="font-size:1.6rem"></span>
          {{ diary.views || 0 }}
        </span>
      </div>
      <div class="diary-card-tags">
        <span 
          v-for="tagId in diary.tags" 
          :key="tagId"
          class="diary-tag"
        >
          #{{ getTagName(tagId) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  diary: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

const navigateToDiary = () => {
  console.log('跳转日记详情');
}

const getCategoryName = () => {
  const category = props.categories.find(cat => cat.id === props.diary.category_id);
  console.log(props.diary);
  return category ? category.title : '未知'
}

const getTagName = (tagId) => {
  const tag = props.tags.find(t => t.id === tagId)
  return tag ? tag.name : ''
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.diary-card {
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.diary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-light);
}

.diary-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

.diary-date {
  font-weight: 500;
}

.diary-category {
  background-color: var(--primary-light);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.8rem;
}

.diary-card-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
  line-height: 1.4;
}

.diary-card-excerpt {
  font-size: 1rem;
  color: var(--text-medium);
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.diary-card-footer {
  margin-top: auto;
}

.diary-card-stats {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.75rem;
}

.diary-card-stats .stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

.diary-card-stats .iconfont {
  font-size: 1.4rem;
}

.diary-card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.diary-tag {
  padding: 0.25rem 0.5rem;
  background-color: #f5f5f5;
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--text-medium);
}

@media (max-width: 768px) {
  .diary-card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .diary-card-title {
    font-size: 1.1rem;
  }
}
</style>