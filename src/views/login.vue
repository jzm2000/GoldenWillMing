<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 卡片标题 -->
      <div class="card-header">
        <div class="logo">
          <span class="logo-icon">🌟</span>
          <span class="logo-text">人明日记</span>
        </div>
        <h2 class="card-title">欢迎回来</h2>
        <p class="card-subtitle">登录您的账号继续您的创作之旅</p>
      </div>
      
      <!-- 表单切换选项卡 -->
      <div class="form-tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'login' }"
          @click="switchTab('login')"
        >
          登录
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'register' }"
          @click="switchTab('register')"
        >
          注册
        </button>
      </div>
      
      <!-- 登录表单 -->
      <form v-if="activeTab === 'login'" class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-username" class="form-label">用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input
              type="text"
              id="login-username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              class="form-input"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="login-password" class="form-label">密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              type="password"
              id="login-password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              class="form-input"
              required
            />
          </div>
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="loginForm.rememberMe" />
            <span>记住我</span>
          </label>
          <button type="button" class="forgot-password">忘记密码？</button>
        </div>
        
        <button type="submit" class="submit-button">登录</button>
      </form>
      
      <!-- 注册表单 -->
      <form v-else class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="register-username" class="form-label">用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input
              type="text"
              id="register-username"
              v-model="registerForm.username"
              placeholder="请设置用户名"
              class="form-input"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="register-email" class="form-label">邮箱</label>
          <div class="input-wrapper">
            <span class="input-icon">📧</span>
            <input
              type="email"
              id="register-email"
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              class="form-input"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="register-password" class="form-label">密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              type="password"
              id="register-password"
              v-model="registerForm.password"
              placeholder="请设置密码（至少8位）"
              class="form-input"
              required
              minlength="8"
            />
            <button 
              type="button" 
              class="toggle-password"
              @click="togglePasswordVisibility('register')"
            >
              {{ showRegisterPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="register-confirm-password" class="form-label">确认密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              type="password"
              id="register-confirm-password"
              v-model="registerForm.confirmPassword"
              placeholder="请再次输入密码"
              class="form-input"
              required
            />
          </div>
        </div>
        
        <div class="terms-agreement">
          <label>
            <input type="checkbox" v-model="registerForm.agreeTerms" required />
            <span>我已阅读并同意 <a href="#" class="terms-link">用户协议</a> 和 <a href="#" class="terms-link">隐私政策</a></span>
          </label>
        </div>
        
        <button type="submit" class="submit-button">注册</button>
      </form>
      
      <!-- 第三方登录 -->
      <!-- <div class="divider">
        <span>或使用以下方式登录</span>
      </div>
      
      <div class="social-login">
        <button class="social-button wechat">
          <span class="social-icon">💬</span>
          <span>微信</span>
        </button>
        <button class="social-button qq">
          <span class="social-icon">🐧</span>
          <span>QQ</span>
        </button>
        <button class="social-button github">
          <span class="social-icon">📱</span>
          <span>手机</span>
        </button>
      </div> -->
    </div>
    
    <!-- 页脚 -->
    <footer class="login-footer">
      <p>&copy; 2025 人明日记 版权所有</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 表单状态管理
const activeTab = ref('login');
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
});

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});

// 切换表单选项卡
const switchTab = (tab) => {
  activeTab.value = tab;
};

// 切换密码可见性
const togglePasswordVisibility = (formType) => {
  if (formType === 'login') {
    showLoginPassword.value = !showLoginPassword.value;
  } else {
    showRegisterPassword.value = !showRegisterPassword.value;
  }
};

// 处理登录
const handleLogin = () => {
  // 这里添加实际的登录逻辑
  console.log('登录表单提交:', loginForm);
  
  // 模拟登录成功
  setTimeout(() => {
    alert('登录成功！');
    router.push('/');
  }, 1000);
};

// 处理注册
const handleRegister = () => {
  // 验证密码是否一致
  if (registerForm.password !== registerForm.confirmPassword) {
    alert('两次输入的密码不一致！');
    return;
  }
  
  // 这里添加实际的注册逻辑
  console.log('注册表单提交:', registerForm);
  
  // 模拟注册成功
  setTimeout(() => {
    alert('注册成功！请登录。');
    activeTab.value = 'login';
    // 清空注册表单
    Object.keys(registerForm).forEach(key => {
      registerForm[key] = '';
    });
    registerForm.agreeTerms = false;
  }, 1000);
};
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color);
  position: relative;
  overflow: hidden;
  padding: 2rem;
  
  // 背景装饰
  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
  }
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--primary-light), transparent 70%);
    opacity: 0.5;
  }
  
  .circle-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -100px;
  }
  
  .circle-2 {
    width: 300px;
    height: 300px;
    bottom: -150px;
    left: -150px;
  }
  
  .circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.2;
  }
}

.login-card {
  background-color: var(--card-bg);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: var(--shadow-hover);
  max-width: 500px;
  width: 100%;
  z-index: 1;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  // 卡片装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 2.5rem;
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    
    .logo-icon {
      font-size: 2rem;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
    }
  }
  
  .card-title {
    font-size: var(--font-size-2xl);
    color: var(--text-color);
    margin-bottom: 0.5rem;
  }
  
  .card-subtitle {
    color: var(--text-light);
    font-size: var(--font-size-base);
  }
}

.form-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .tab-button {
    flex: 1;
    padding: 0.75rem;
    background: none;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--text-light);
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
      transform: none;
    }
    
    &.active {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
    }
  }
}

/* 表单通用样式 */
.login-form,
.register-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
  
  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-color);
  }
  
  .input-wrapper {
    position: relative;
    
    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-light);
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem 2.5rem;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      font-size: var(--font-size-base);
      transition: all 0.3s ease;
      background-color: white;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(158, 31, 54, 0.1);
      }
    }
    
    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.25rem;
      color: var(--text-light);
      
      &:hover {
        color: var(--primary-color);
        transform: translateY(-50%) scale(1.1);
        background: none;
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  .remember-me {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    
    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-color);
    }
  }
  
  .forgot-password {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: var(--font-size-base);
    cursor: pointer;
    padding: 0;
    
    &:hover {
      text-decoration: underline;
      transform: none;
      background: none;
    }
  }
}

.terms-agreement {
  margin-bottom: 2rem;
  
  label {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: var(--font-size-sm);
    color: var(--text-light);
    cursor: pointer;
    
    input[type="checkbox"] {
      margin-top: 0.25rem;
      accent-color: var(--primary-color);
    }
    
    .terms-link {
      color: var(--primary-color);
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, var(--primary-color), #b7324c);
  border: none;
  border-radius: 12px;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(158, 31, 54, 0.3);
    background: linear-gradient(45deg, #b7324c, var(--primary-color));
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* 分隔线 */
.divider {
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  
  span {
    background-color: var(--card-bg);
    padding: 0 1rem;
    color: var(--text-light);
    font-size: var(--font-size-sm);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--border-color);
    z-index: 0;
  }
}

/* 社交登录 */
.social-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  .social-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    background: none;
    color: var(--text-light);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
  }
  
  .wechat:hover {
    border-color: #07C160;
    color: #07C160;
  }
  
  .qq:hover {
    border-color: #1DA1F2;
    color: #1DA1F2;
  }
  
  .github:hover {
    border-color: #1877F2;
    color: #1877F2;
  }
}

/* 页脚 */
.login-footer {
  margin-top: 2rem;
  color: var(--text-light);
  font-size: var(--font-size-sm);
  text-align: center;
  z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }
  
  .card-header .logo {
    margin-bottom: 1rem;
    
    .logo-text {
      font-size: 1.25rem;
    }
  }
  
  .card-title {
    font-size: var(--font-size-xl) !important;
  }
  
  .social-login {
    flex-wrap: wrap;
  }
  
  .social-button {
    flex: 1 1 45%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .form-tabs {
    flex-direction: column;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .social-button {
    flex: 1 1 100%;
  }
}
</style>