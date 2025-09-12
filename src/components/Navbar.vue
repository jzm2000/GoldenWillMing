<template>
  <nav class="navbar" :class="{ 'sticky': isSticky }">
    <div class="container">
      <router-link to="/" class="logo">
        <span class="logo-icon">🌟</span>
        <span class="logo-text">人明日记</span>
      </router-link>

      <!-- 桌面导航 -->
      <div class="nav-links desktop-nav">
        <NavItem to="/" icon="🏠">首页</NavItem>
        <NavItem to="/articles" icon="📝">日记</NavItem>
        <NavItem to="/portfolio" icon="🎨">作品</NavItem>
        <NavItem to="/about" icon="👤">关于</NavItem>
        <NavItem to="/contact" icon="✉️">联系</NavItem>
      </div>

      <!-- 移动端导航切换按钮 -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="菜单">
        <div class="menu-icon" :class="{ 'open': isMobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>

    <!-- 移动端导航菜单 -->
    <div class="mobile-nav-menu" :class="{ 'open': isMobileMenuOpen }" v-show="isMobileMenuOpen">
      <div class="mobile-nav-links">
        <NavItem to="/" icon="🏠" @click="closeMobileMenu" color="#000">首页</NavItem>
        <NavItem to="/articles" icon="📝" @click="closeMobileMenu" color="#000">日记</NavItem>
        <NavItem to="/portfolio" icon="🎨" @click="closeMobileMenu" color="#000">作品</NavItem>
        <NavItem to="/about" icon="👤" @click="closeMobileMenu" color="#000">关于</NavItem>
        <NavItem to="/contact" icon="✉️" @click="closeMobileMenu" color="#000">联系</NavItem>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,withDefaults } from 'vue'
// 子组件：导航项
import { h } from 'vue'
import { RouterLink } from 'vue-router'
const props = withDefaults(defineProps<{
  color?:string
}>(),{
  color:'#000'
})

const NavItem = (prop, { slots }) => {
  const baseClasses = 'nav-item flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300'
  const activeClass = 'bg-primary/10 text-primary font-medium'
  const hoverClass = 'hover:bg-primary/5'

  const handleClick = (navigate, event) => {
    event.preventDefault()
    navigate() // Vue Router 4中的navigate函数不需要参数
  }

  return h(RouterLink, {
    to: prop.to,
    custom: true
  }, {
    default: ({ href, navigate, isActive }) => {
      return h('a', {
        href: href,
        onClick: (event) => handleClick(navigate, event),
        class: `${baseClasses} ${hoverClass} ${isActive ? activeClass : ''}`,
        'aria-current': isActive ? 'page' : undefined
      }, [
        h('div', {
          class: 'flex items-center gap-1.5'
        }, [
          h('span', {
            class: 'nav-item-icon',
          }, prop.icon),
          h('span', { class:'nav-item_text',style:{color:prop.color} }, slots.default?.()) 
        ])
      ])
    }
  })
}

NavItem.props = ['to', 'icon','color']

// 主组件状态
const isSticky = ref(false)
const isMobileMenuOpen = ref(false)

// 处理滚动事件
const handleScroll = () => {
  isSticky.value = window.scrollY > 100
}

// 处理移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // 防止页面滚动
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
:deep(.nav-item_text) {
  color:v-bind('props.color')
}
.navbar {
  padding: 1.25rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  z-index: 100;
}

/* 粘性导航栏样式 */
.navbar.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(10px);
  animation: slideDown 0.3s ease;
  :deep(.nav-item_text){
    color: #000;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 0 1.5rem; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.logo-icon {
  font-size: 1.75rem;
}

.logo-text {
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.logo:hover {
  transform: scale(1.03);
}

/* 桌面导航 */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  .nav-item{
      &::before{
        content:"";
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 0%;
        height: 3px;
        background-color: var(--primary-color);  
        border-radius: 8px;
        transition: width 0.2s ease;
      }
      &:hover{
        &::before{
          width: 100%;
        }
      }
  }
}

.nav-item {
  position: relative;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.95rem;
}
.nav-item-icon {
  font-size: 1.1rem;
}

/* 移动端菜单按钮 */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

.menu-icon {
  position: relative;
  width: 24px;
  height: 20px;
}

.menu-icon span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: var(--text-color);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.menu-icon span:nth-child(1) {
  top: 0;
}

.menu-icon span:nth-child(2) {
  top: 8px;
}

.menu-icon span:nth-child(3) {
  top: 16px;
}

.menu-icon.open span:nth-child(1) {
  top: 8px;
  transform: rotate(45deg);
}

.menu-icon.open span:nth-child(2) {
  opacity: 0;
}

.menu-icon.open span:nth-child(3) {
  top: 8px;
  transform: rotate(-45deg);
}

/* 移动端导航菜单 */
.mobile-nav-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 99;
  height: 100vh;
}

.mobile-nav-menu.open {
  transform: translateX(0);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

.mobile-nav-links .nav-item {
  position: relative;
  font-size: 1.25rem;
  padding: 1rem 1.5rem;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .logo {
    font-size: 1.35rem;
  }
}
</style>