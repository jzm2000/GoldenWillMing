<template>
  <div class="tags-section">
    <h3 class="section-title">热门标签</h3>
    <div class="tags-cloud">
      <span 
        v-for="tag in tags" 
        :key="tag.id"
        class="tag-item"
        @click="toggleTag(tag.id)"
        :class="{ active: selectedTags.includes(tag.id) }"
        :style="getTagStyle(tag.id)"
      >
        #{{ tag.name }}
      </span>
    </div>
    <div v-if="selectedTags.length > 0" class="selected-tags-info">
      已选择 {{ selectedTags.length }} 个标签
      <button class="clear-tags-btn" @click="clearAllTags">
        清除全部
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tags: {
    type: Array,
    required: true
  },
  selectedTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['tag-toggle', 'clear-tags'])

const toggleTag = (tagId) => {
  emit('tag-toggle', tagId)
}

const clearAllTags = () => {
  emit('clear-tags')
}

// 为标签添加一些随机的样式变化，使标签云看起来更生动
const getTagStyle = (tagId) => {
  // 使用tagId作为随机种子，确保每次加载时标签样式一致
  const random = (tagId * 31) % 100 / 100
  
  // 标签大小在0.875rem到1.1rem之间变化
  const fontSize = `calc(0.875rem + ${Math.floor(random * 3) * 0.1}rem)`
  
  // 标签颜色在预设的颜色中选择
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
  const colorIndex = Math.floor(random * colors.length)
  const color = colors[colorIndex]
  
  // 标签悬停效果的缩放倍数
  const scale = 1 + random * 0.1
  
  return {
    fontSize,
    '--tag-color': color,
    '--tag-hover-scale': scale
  }
}
</script>

<style lang="scss" scoped>
.tags-section {
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

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag-item {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  background-color: #f5f5f5;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.tag-item:hover {
  background-color: #e8e8e8;
  transform: translateY(-2px) scale(var(--tag-hover-scale, 1.05));
  border-color: var(--tag-color, #667eea);
}

.tag-item.active {
  background-color: var(--tag-color, var(--accent-color));
  color: white;
  border-color: var(--tag-color, var(--accent-color));
}

.selected-tags-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  font-size: 0.875rem;
  color: var(--text-medium);
}

.clear-tags-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.clear-tags-btn:hover {
  background-color: var(--primary-light);
}

@media (max-width: 768px) {
  .tags-section {
    padding: 1rem;
  }
}
</style>