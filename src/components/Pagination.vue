<template>
  <div class="pagination">
    <button 
      class="page-btn" 
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      <span class="page-btn-icon">←</span>
      上一页
    </button>
    
    <!-- 首页按钮 -->
    <button 
      v-if="showFirstButton"
      class="page-number"
      @click="goToPage(1)"
    >
      1
    </button>
    
    <!-- 省略号 -->
    <span v-if="showEllipsisBefore" class="pagination-ellipsis">...</span>
    
    <!-- 页码按钮 -->
    <button 
      v-for="page in visiblePages"
      :key="page"
      class="page-number"
      :class="{ active: page === currentPage }"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>
    
    <!-- 省略号 -->
    <span v-if="showEllipsisAfter" class="pagination-ellipsis">...</span>
    
    <!-- 末页按钮 -->
    <button 
      v-if="showLastButton"
      class="page-number"
      @click="goToPage(totalPages)"
    >
      {{ totalPages }}
    </button>
    
    <button 
      class="page-btn" 
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      下一页
      <span class="page-btn-icon">→</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  maxVisibleButtons: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change'])

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = props.maxVisibleButtons
  
  // 如果总页数小于等于最大可见按钮数，直接显示所有页码
  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
    return pages
  }
  
  // 计算起始页码
  let start = Math.max(2, props.currentPage - Math.floor(maxVisible / 2) + 1)
  
  // 确保有足够的页码显示
  let end = Math.min(props.totalPages - 1, start + maxVisible - 3)
  
  // 调整起始页码，确保有足够的页码显示
  if (end - start + 1 < maxVisible - 2) {
    start = Math.max(2, end - maxVisible + 3)
  }
  
  // 添加中间的页码
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 是否显示首页按钮
const showFirstButton = computed(() => {
  return props.totalPages > props.maxVisibleButtons && visiblePages.value[0] > 2
})

// 是否显示末页按钮
const showLastButton = computed(() => {
  return props.totalPages > props.maxVisibleButtons && visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
})

// 是否显示前面的省略号
const showEllipsisBefore = computed(() => {
  return props.totalPages > props.maxVisibleButtons && visiblePages.value[0] > 2
})

// 是否显示后面的省略号
const showEllipsisAfter = computed(() => {
  return props.totalPages > props.maxVisibleButtons && visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
})
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-dark);
}

.page-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn-icon {
  font-size: 0.75rem;
}

.page-number {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: var(--text-dark);
}

.page-number:hover {
  background-color: #f5f5f5;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-number.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  font-weight: 600;
}

.pagination-ellipsis {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-size: 0.875rem;
}

@media (max-width: 480px) {
  .pagination {
    gap: 0.25rem;
  }
  
  .page-btn {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .page-btn-icon {
    display: none;
  }
  
  .page-number {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}
</style>