<template>
  <div class="contact-page">
    <!-- 页面标题 -->
    <div class="hero-section">
      <div class="container">
        <h1 class="page-title">联系我</h1>
        <p class="page-subtitle">随时与我交流，探讨项目合作机会</p>
        <div class="title-decoration"></div>
      </div>
    </div>

    <!-- 联系信息和表单 -->
    <div class="contact-section">
      <div class="container">
        <div class="contact-content">
          <!-- 联系信息 -->
          <div class="contact-info">
            <h2 class="section-title">联系方式</h2>
            <div class="info-cards">
              <InfoCard 
                icon="email" 
                title="电子邮箱"
                content="contact@example.com"
                link="mailto:contact@example.com"
              />
              <InfoCard 
                icon="phone" 
                title="联系电话"
                content="+86 123 4567 8901"
                link="tel:+8612345678901"
              />
              <InfoCard 
                icon="location" 
                title="工作地点"
                content="北京市海淀区中关村科技园区"
                link="https://maps.google.com"
              />
              <InfoCard 
                icon="time" 
                title="工作时间"
                content="周一至周五 9:00 - 18:00"
              />
            </div>

            <!-- 社交媒体 -->
            <div class="social-media">
              <h3 class="social-title">关注我</h3>
              <div class="social-links">
                <SocialLink 
                  platform="github" 
                  url="#"
                />
                <SocialLink 
                  platform="linkedin" 
                  url="#"
                />
                <SocialLink 
                  platform="twitter" 
                  url="#"
                />
                <SocialLink 
                  platform="dribbble" 
                  url="#"
                />
                <SocialLink 
                  platform="behance" 
                  url="#"
                />
              </div>
            </div>

            <!-- 个人简介 -->
            <div class="contact-bio">
              <div class="bio-image-wrapper">
                <img 
                  src="https://picsum.photos/seed/profile/300/300" 
                  alt="个人照片"
                  class="bio-image"
                />
              </div>
              <div class="bio-content">
                <h3 class="bio-name">张小明</h3>
                <p class="bio-title">前端开发工程师 & UI设计师</p>
                <p class="bio-text">
                  专注于创建优雅、高效的用户界面和体验。无论是网站开发、应用设计还是品牌视觉，我都能提供专业的解决方案。欢迎随时联系我讨论您的项目需求。
                </p>
                <a href="#" class="download-resume">
                  svg
                  下载简历
                </a>
              </div>
            </div>
          </div>

          <!-- 联系表单 -->
          <div class="contact-form-container">
            <h2 class="section-title">发送消息</h2>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">姓名</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name"
                    :class="{ 'error': errors.name }"
                    placeholder="请输入您的姓名"
                    required
                  />
                  <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>
                <div class="form-group">
                  <label for="email">电子邮箱</label>
                  <input 
                    type="email" 
                    id="email"
                    v-model="form.email"
                    :class="{ error: errors.email }"
                    placeholder="请输入您的电子邮箱"
                    required
                  />
                  <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="subject">主题</label>
                <input 
                  type="text" 
                  id="subject"
                  v-model="form.subject"
                  :class="{ error: errors.subject }"
                  placeholder="请输入消息主题"
                  required
                />
                <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
              </div>
              
              <div class="form-group">
                <label for="message">消息内容</label>
                <textarea 
                  id="message"
                  v-model="form.message"
                  :class="{ error: errors.message }"
                  placeholder="请输入您的消息内容..."
                  rows="5"
                  required
                ></textarea>
                <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
              </div>
              
              <div class="form-actions">
                <div class="recaptcha-placeholder">
                  svg
                  <span>通过验证后发送</span>
                </div>
                <button 
                  type="submit" 
                  class="submit-button"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">发送中...</span>
                  <span v-else>发送消息</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功提示模态框 -->
    <div class="success-modal" :class="{ open: isSuccessModalOpen }" v-if="isSuccessModalOpen">
      <div class="success-modal-backdrop" @click="closeSuccessModal"></div>
      <div class="success-modal-content">
        <div class="success-icon">
          svg
        </div>
        <h3 class="success-title">发送成功！</h3>
        <p class="success-message">
          感谢您的留言，我会尽快回复您。
        </p>
        <button class="success-button" @click="closeSuccessModal">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'

// 表单状态
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = ref({})
const isSubmitting = ref(false)
const isSuccessModalOpen = ref(false)

// 表单验证
const validateForm = () => {
  const newErrors = {}
  
  if (!form.value.name.trim()) {
    newErrors.name = '请输入您的姓名'
  }
  
  if (!form.value.email.trim()) {
    newErrors.email = '请输入您的电子邮箱'
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.value.email)) {
    newErrors.email = '请输入有效的电子邮箱地址'
  }
  
  if (!form.value.subject.trim()) {
    newErrors.subject = '请输入消息主题'
  }
  
  if (!form.value.message.trim()) {
    newErrors.message = '请输入消息内容'
  } else if (form.value.message.trim().length < 10) {
    newErrors.message = '消息内容至少需要10个字符'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// 提交表单
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  // 模拟API请求
  setTimeout(() => {
    isSubmitting.value = false
    
    // 重置表单
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    errors.value = {}
    
    // 显示成功提示
    isSuccessModalOpen.value = true
  }, 1500)
}

// 关闭成功模态框
const closeSuccessModal = () => {
  isSuccessModalOpen.value = false
}

// 信息卡片组件

const InfoCard = (props) => {
  const getIconComponent = () => {
    switch (props.icon) {
      case 'email':
        return 'svg'
      case 'phone':
        return 'svg'
      case 'location':
        return 'svg'
      case 'time':
        return 'svg'
      default:
        return null
    }
  }
  
  return h('div', { class: 'info-card' }, [
    h('div', { class: 'info-icon' }, getIconComponent()),
    h('div', { class: 'info-content' }, [
      h('h3', { class: 'info-title' }, props.title),
      h('p', { class: 'info-text' }, 
        props.link ? 
          h('a', {
            href: props.link,
            target: props.link.includes('mailto:') || props.link.includes('tel:') ? '_self' : '_blank',
            rel: 'noopener noreferrer',
            class: 'info-link'
          }, props.content) : 
          h('span', {}, props.content)
      )
    ])
  ])
}

InfoCard.props = ['icon', 'title', 'content', 'link']

// 社交媒体链接组件
const SocialLink = (props) => {
  // 根据平台生成适当的图标
  const getSocialIcon = () => {
    switch (props.platform) {
      case 'github':
        return 'GitHub'
      case 'linkedin':
        return 'LinkedIn'
      case 'twitter':
        return 'Twitter'
      case 'dribbble':
        return 'Dribbble'
      case 'behance':
        return 'Behance'
      default:
        return props.platform
    }
  }
  
  return h('a', {
    href: props.url,
    target: '_blank',
    rel: 'noopener noreferrer',
    class: 'social-link',
    'aria-label': `访问我的${getSocialIcon()}主页`
  }, [
    h('span', { class: 'social-icon' }, getSocialIcon())
  ])
}

SocialLink.props = ['platform', 'url']
   
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
}

/* 页面标题样式 */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 6rem 0 4rem;
  text-align: center;
}

.page-title {
  font-size: var(--font-size-4xl);
  margin-bottom: 1rem;
  color: white;
}

.page-subtitle {
  font-size: var(--font-size-lg);
  max-width: 800px;
  margin: 0 auto 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.title-decoration {
  width: 60px;
  height: 4px;
  background-color: var(--accent-color);
  margin: 0 auto;
  border-radius: 2px;
}

/* 联系信息和表单区域 */
.contact-section {
  padding: 5rem 0;
  background-color: var(--bg-color);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* 联系信息样式 */
.contact-info {
  background-color: var(--card-bg);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  height: fit-content;
}

.section-title {
  font-size: var(--font-size-2xl);
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}

/* 信息卡片样式 */
.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.info-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: rgba(67, 97, 238, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-card:hover {
  background-color: rgba(67, 97, 238, 0.1);
  transform: translateY(-2px);
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.info-text {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  margin-bottom: 0;
}

.info-link {
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.info-link:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

/* 社交媒体样式 */
.social-media {
  margin-bottom: 2.5rem;
}

.social-title {
  font-size: var(--font-size-lg);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* 个人简介样式 */
.contact-bio {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.bio-image-wrapper {
  flex-shrink: 0;
}

.bio-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.bio-content {
  flex: 1;
}

.bio-name {
  font-size: var(--font-size-xl);
  margin-bottom: 0.25rem;
}

.bio-title {
  font-size: var(--font-size-base);
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.bio-text {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  margin-bottom: 1rem;
}

.download-resume {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all 0.3s ease;
}

.download-resume:hover {
  background-color: var(--secondary-color);
  color: white;
  transform: translateY(-1px);
}

/* 联系表单样式 */
.contact-form-container {
  background-color: var(--card-bg);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: var(--font-size-base);
  font-family: inherit;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #e63946;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.error-message {
  font-size: var(--font-size-sm);
  color: #e63946;
  margin-top: -0.25rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.recaptcha-placeholder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-sm);
  color: var(--text-light);
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: var(--font-size-base);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
}

.submit-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

/* 成功提示模态框样式 */
.success-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.3s ease;
}

.success-modal-content {
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--shadow-hover);
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.3s ease;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: rgba(52, 211, 153, 0.1);
  color: #34d399;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
}

.success-title {
  font-size: var(--font-size-2xl);
  margin-bottom: 1rem;
  color: var(--text-color);
}

.success-message {
  font-size: var(--font-size-base);
  color: var(--text-light);
  margin-bottom: 2rem;
}

.success-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: var(--font-size-base);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.success-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-info,
  .contact-form-container {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0 3rem;
  }
  
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .page-subtitle {
    font-size: var(--font-size-base);
  }
  
  .contact-section {
    padding: 3rem 0;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .contact-bio {
    flex-direction: column;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .recaptcha-placeholder {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .contact-info,
  .contact-form-container {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: var(--font-size-xl);
  }
  
  .info-icon {
    width: 40px;
    height: 40px;
  }
}
</style>