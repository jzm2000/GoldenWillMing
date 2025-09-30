<template>
  <div class="categories-section">
    <h3 class="section-title">日记分类</h3>
    <ul class="categories-list">
      <li 
        class="category-item" 
        :class="{ active: activeCategory === '' }"
        @click="selectCategory('')"
      >
        <span class="category-icon">📋</span>
        <span class="category-name">全部日记</span>
        <span class="category-count">({{ totalCount }})</span>
      </li>
      <li 
        v-for="category in categories" 
        :key="category.id"
        class="category-item" 
        :class="{ active: activeCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.title }}</span>
        <!-- <span class="category-count">({{ getCategoryCount(category.id) }})</span> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  diaries: {
    type: Array,
    required: true
  },
  activeCategory: {
    type: [String,Number],
    default: 'all'
  },
  totalCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['category-change'])

const selectCategory = (categoryId) => {
  emit('category-change', categoryId)
}

const getCategoryCount = (categoryId) => {
  return props.diaries.filter(diary => diary.categoryId === categoryId).length
}
</script>

<style lang="scss" scoped>
.categories-section {
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.categories-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.category-item:hover {
  background-color: #f5f7ff;
  transform: translateX(4px);
}

.category-item.active {
  background-color: var(--primary-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}

.category-item:last-child {
  margin-bottom: 0;
}

.category-icon {
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.category-name {
  flex: 1;
}

.category-count {
  font-size: 0.875rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .categories-section {
    padding: 1rem;
  }
}
</style>