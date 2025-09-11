<template>
  <div class="about-page">
    <!-- 页面标题部分 -->
    <section class="about-header">
      <div class="container">
        <h1 class="section-title">关于我</h1>
        <p class="section-subtitle">了解我的故事与技能</p>
        <div class="title-underline"></div>
      </div>
    </section>

    <!-- 个人介绍部分 -->
    <section class="about-intro">
      <div class="container">
        <div class="about-content">
          <div class="profile-image-wrapper">
            <img 
              src="https://picsum.photos/seed/profile/400/400" 
              alt="个人照片"
              class="profile-image"
              loading="lazy"
            />
            <div class="image-border"></div>
          </div>
          
          <div class="about-text">
            <h2 class="about-title">你好，我是<span class="highlight-text">张小明</span></h2>
            <p class="about-description">
              我是一名热爱技术与创作的前端开发者，拥有超过5年的Web开发经验。我专注于创建美观、高效且用户友好的网站和应用程序，不断探索和学习最新的前端技术与设计趋势。
            </p>
            <p class="about-description">
              除了技术开发，我还喜欢摄影、阅读和旅行。这些爱好不仅丰富了我的生活，也为我的设计工作带来了独特的视角和灵感。
            </p>
            
            <div class="social-links">
              <a href="#" class="social-link" aria-label="微博">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 6.5c-0.6-0.8-1.5-1.3-2.5-1.5c-1 0-1.8 0.4-2.4 1.1c-0.6-0.7-1.4-1.1-2.4-1.1c-1.6 0-2.9 1.3-2.9 2.9c0 0 0 0 0 0c0 2.6 3.8 4.6 8.3 5.8v1.7c-0.1 0.7-0.4 1.3-0.8 1.9c-0.3 0.6-0.8 1-1.4 1.2c-0.6 0.2-1.2 0.2-1.8 0.2c-1.6 0-2.9-1.3-2.9-2.9s1.3-2.9 2.9-2.9c0.5 0 0.9 0.2 1.3 0.5c-2.1-0.2-4.2-1.4-5.3-3.3C6.4 10 6 9.2 6 8.3C6 5.9 8.1 3.8 10.6 3.8c2.2 0 4.1 1.4 4.7 3.4c1.4-0.2 2.8-0.6 4.2-1.3V6.5z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4C8.8 23.3 9 23.1 9 22.8C9 22.6 9 22.1 9 21.6v-1.2c-3.3 0.7-4-1.6-4-1.6C3.4 19.2 3 18.7 3 18.7c-1.1-0.8 0.1-0.8 0.1-0.8c1.2 0.1 1.8 1.2 1.8 1.2c1 1.8 2.7 1.3 3.4 1C7.8 20 6.9 19.3 6.6 19c-0.3-0.5-0.7-1.2-0.1-1.2c0.6 0 1.1 0.6 1.1 0.6C7.9 19.8 9.4 20 10.2 20c1 0 1.8-0.8 1.8-0.8c0.6 0 0.6 0.7 0.6 1.2c0 0.7-0.3 1.8-0.7 2.2c0.6 0.5 1.2 1.2 1.2 2.4v3.3c0 0.3 0.2 0.6 0.8 0.5C20.6 21.8 24 17.3 24 12C24 5.4 18.6 0 12 0z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7.6 2C4.6 2 2 4.6 2 7.6C2 10.6 4.6 13.2 7.6 13.2C10.6 13.2 13.2 10.6 13.2 7.6C13.2 4.6 10.6 2 7.6 2zM5.3 9.2c-0.6 0-1.1-0.5-1.1-1.1s0.5-1.1 1.1-1.1s1.1 0.5 1.1 1.1S5.9 9.2 5.3 9.2zM22 8.2v7.6h-3.5v-3.3c0-0.8-0.3-1.6-1.1-2.2c-0.8-0.7-1.9-0.8-2.7-0.3C14.4 10.1 14.2 10.4 14 10.7V15.8H10.5v-8.7h3.6v1c0.5-0.6 1.3-1.1 2.2-1.1c1.1 0 2.1 0.4 2.8 1.3C20.9 7.6 22 7.4 22 8.2z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技能部分 -->
    <section class="skills-section">
      <div class="container">
        <h2 class="section-title">我的技能</h2>
        <p class="section-subtitle">专业领域与技术栈</p>
        <div class="title-underline"></div>
        
        <div class="skills-grid">
          <div class="skill-category">
            <h3 class="skill-category-title">前端开发</h3>
            <div class="skill-bars">
              <SkillBar name="HTML/CSS" level="95" />
              <SkillBar name="JavaScript" level="90" />
              <SkillBar name="Vue.js" level="85" />
              <SkillBar name="React" level="80" />
            </div>
          </div>
          
          <div class="skill-category">
            <h3 class="skill-category-title">设计能力</h3>
            <div class="skill-bars">
              <SkillBar name="UI/UX设计" level="80" />
              <SkillBar name="响应式设计" level="90" />
              <SkillBar name="Figma" level="75" />
              <SkillBar name="动效设计" level="70" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 经历部分 -->
    <section class="experience-section">
      <div class="container">
        <h2 class="section-title">工作经历</h2>
        <p class="section-subtitle">我的职业发展历程</p>
        <div class="title-underline"></div>
        
        <div class="timeline">
          <TimelineItem 
            year="2022 - 至今"
            title="高级前端开发工程师"
            company="科技创新有限公司"
            description="负责公司核心产品的前端架构设计与开发，优化用户体验，引入现代化前端技术栈，提升开发效率。"
          />
          <TimelineItem 
            year="2019 - 2022"
            title="前端开发工程师"
            company="互联网科技有限公司"
            description="参与多个大型Web项目的开发，负责组件库建设，解决跨浏览器兼容性问题，优化前端性能。"
          />
          <TimelineItem 
            year="2017 - 2019"
            title="Web开发工程师"
            company="软件开发有限公司"
            description="负责企业网站和管理系统的开发与维护，学习并应用最新的前端技术。"
          />
        </div>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="contact-section">
      <div class="container">
        <h2 class="section-title">联系我</h2>
        <p class="section-subtitle">随时欢迎与我交流</p>
        <div class="title-underline"></div>
        
        <div class="contact-form-wrapper">
          <form class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">姓名</label>
                <input type="text" id="name" class="form-input" placeholder="请输入您的姓名" required>
              </div>
              <div class="form-group">
                <label for="email">邮箱</label>
                <input type="email" id="email" class="form-input" placeholder="请输入您的邮箱" required>
              </div>
            </div>
            <div class="form-group">
              <label for="subject">主题</label>
              <input type="text" id="subject" class="form-input" placeholder="请输入邮件主题" required>
            </div>
            <div class="form-group">
              <label for="message">留言</label>
              <textarea id="message" class="form-textarea" placeholder="请输入您的留言内容" rows="5" required></textarea>
            </div>
            <button type="submit" class="submit-button">发送消息</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { h } from 'vue'

// 技能条组件
const SkillBar = (props) => {
  // 将百分比转换为进度条宽度
  const width = `${props.level}%`
  
  // 根据技能等级设置颜色
  const getColor = () => {
    if (props.level >= 90) return 'var(--primary-color)'
    if (props.level >= 70) return 'var(--secondary-color)'
    return 'var(--accent-color)'
  }
  
  return h('div', { class: 'skill-bar' }, [
    h('div', { class: 'skill-info' }, [
      h('span', { class: 'skill-name' }, props.name),
      h('span', { class: 'skill-level' }, `${props.level}%`)
    ]),
    h('div', { class: 'skill-progress' }, [
      h('div', {
        class: 'skill-progress-fill',
        style: { width: width, backgroundColor: getColor() }
      })
    ])
  ])
}

SkillBar.props = ['name', 'level']

// 时间线组件
const TimelineItem = (props) => {
  return h('div', { class: 'timeline-item' }, [
    h('div', { class: 'timeline-marker' }),
    h('div', { class: 'timeline-content' }, [
      h('span', { class: 'timeline-year' }, props.year),
      h('h3', { class: 'timeline-title' }, props.title),
      h('span', { class: 'timeline-company' }, props.company),
      h('p', { class: 'timeline-description' }, props.description)
    ])
  ])
}

TimelineItem.props = ['year', 'title', 'company', 'description']
</script>

<style scoped>
.about-page {
  padding-bottom: 3rem;
}

/* 页面标题样式 */
.about-header {
  padding: 4rem 0 2rem;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  position: relative;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  margin: 0 auto;
  border-radius: 2px;
}

/* 个人介绍样式 */
.about-intro {
  padding: 3rem 0;
}

.about-content {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  align-items: center;
  justify-content: center;
}

.profile-image-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  flex-shrink: 0;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.image-border {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 3px solid var(--primary-color);
  border-radius: 50%;
  z-index: 1;
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.about-text {
  max-width: 600px;
}

.about-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.highlight-text {
  color: var(--primary-color);
}

.about-description {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 1.2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--background-secondary);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 技能部分样式 */
.skills-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 0;
  background-color: var(--background-secondary);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.skill-category-title {
  font-size: 1.3rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.skill-bar {
  margin-bottom: 1.2rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skill-name {
  font-weight: 500;
  color: var(--text-color);
}

.skill-level {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.skill-progress {
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-in-out;
}

/* 经历部分样式 */
.experience-section {
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 3rem 0; */
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 2rem auto 0;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background-color: var(--primary-color);
}

.timeline-item {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 3rem;
}

.timeline-marker {
  position: absolute;
  left: -5px;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--primary-color);
  border: 2px solid white;
  box-shadow: 0 0 0 2px var(--primary-color);
}

.timeline-year {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
}

.timeline-title {
  font-size: 1.3rem;
  color: var(--text-color);
  margin-bottom: 0.3rem;
}

.timeline-company {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 0.8rem;
  display: block;
}

.timeline-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 联系方式样式 */
.contact-section {
  /* padding: 3rem 0; */
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--background-secondary);
}

.contact-form-wrapper {
  max-width: 600px;
  margin: 2rem auto 0;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.contact-form {
  width: 100%;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  min-width: 250px;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(45, 120, 210, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(45, 120, 210, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .about-content {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-image-wrapper {
    width: 250px;
    height: 250px;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-group {
    min-width: 100%;
    margin-bottom: 1.5rem;
  }
}
</style>