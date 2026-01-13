<template>
  <div class="profile-edit-page">
    <header class="edit-header">
      <div class="container">
        <h1 class="edit-title">编辑资料</h1>
        <p class="edit-subtitle">完善你的个人信息，让更多人了解你</p>
      </div>
    </header>

    <main class="edit-main">
      <div class="container">
        <transition name="form-fade" appear>
          <form class="edit-form" @submit.prevent="handleSubmit">
            <div class="form-grid">
              <!-- 头像编辑 -->
              <div class="form-card avatar-card">
                <h3 class="card-title">头像</h3>
                <div class="avatar-preview">
                  <img :src="form.avatarPreview || defaultAvatar" alt="头像预览" />
                </div>
                <div class="avatar-actions">
                  <label class="upload-btn">
                    选择图片
                    <input type="file" accept="image/*" @change="onAvatarChange" hidden />
                  </label>
                  <button type="button" class="small-btn" @click="resetAvatar" :disabled="!form.avatarPreview">重置</button>
                </div>
                <p class="help-text">建议使用清晰的正方形头像，大小不超过2MB。</p>
              </div>

              <!-- 基本信息 -->
              <div class="form-card info-card">
                <h3 class="card-title">基本信息</h3>
                <div class="form-item">
                  <label class="form-label">昵称</label>
                  <GInput placeholder="请输入你的昵称" v-model="form.nickname" required minlength="2" maxlength="10" />
                </div>
                <div class="form-item">
                  <label class="form-label">邮箱</label>
                  <GInput placeholder="请输入邮箱" v-model="form.email" />
                </div>
                <div class="form-item">
                  <label class="form-label">个人简介</label>
                  <textarea class="g-textarea" rows="4" v-model="form.intro" placeholder="用几句话介绍你自己吧"></textarea>
                </div>
                <div class="form-actions">
                  <button type="submit" class="save-btn">保存修改</button>
                  <button type="button" class="cancel-btn" @click="goBack">取消</button>
                </div>
              </div>
            </div>
          </form>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, onBeforeMount,getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.js'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import { postJson, postForm } from '@/api/request.js'
import { getUserInfo,updateUserInfo,uploadPhoto } from '@/api/index.js'

import GInput from '@/components/GoldUI/g-input/input.vue'
import defaultAvatar from '@/assets/img/1.jpg'

const router = useRouter()
const message = useMessage()
const { proxy } = getCurrentInstance()
const userStore = useUserStore()
const { userInfo: storeUserInfo } = storeToRefs(userStore)

const form = reactive({
  avatarFile: null,
  avatarPreview: '',
  nickname: '',
  email: '',
  intro: ''
})

function syncForm(data) {
  form.nickname = data.nickname || ''
  form.email = data.email || ''
  form.intro = data.intro || ''
  form.avatarPreview = data.avatar || ''
}

async function initUserInfo() {
  const res = await getUserInfo()
  if (res && res.code === 200) {
    userStore.setUserInfo(res.data || {})
    syncForm(res.data || {})
  } else {
    syncForm(storeUserInfo.value || {})
    if (res && res.msg) message.error(res.msg)
  }
}

function onAvatarChange(event) {
  const files = event.target.files
  uploadPhoto({
    file:files[0],
  }).then(res =>{
    console.log(res);
    if(res.code == 200){
      form.avatarPreview = proxy.$baseURL +  res.url;
    }else {
      message.error(res.msg);
      // 清空input
      event.target.value = '';
    }
  })
}

function resetAvatar() {
  form.avatarFile = null
  form.avatarPreview = storeUserInfo.value?.avatar || ''
}

async function handleSubmit() {
  try {
    if(!storeUserInfo.value?.id){
      message.error('用户ID不存在')
      return
    };
    // 先更新文本信息
    const res = await updateUserInfo({
      nickname: form.nickname,
      email: form.email || undefined,
      intro: form.intro || undefined,
      avatar: form.avatarPreview || undefined,
      userId: storeUserInfo.value?.id || ''
    });
    if(res.code!==200){
      return message.error(res.msg || '资料更新失败');
    }
    // 成功后刷新用户信息
    const latest = await getUserInfo()
    if (latest && latest.code === 200) {
      userStore.setUserInfo(latest.data || {})
      message.success('资料更新成功')
      router.push({ name: 'Profile' })
    } else {
      message.success('资料更新成功')
      router.push({ name: 'Profile' })
    }
  } catch (err) {
    message.error(err.message || '保存失败，请稍后重试')
  }
}

function goBack() {
  router.back()
}

onBeforeMount(async () => {
  await initUserInfo()
})
</script>

<style lang="scss" scoped>
.profile-edit-page { animation: pageIn .3s ease; }
@keyframes pageIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

.edit-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: #fff;
  padding: 2rem 0;
  margin-bottom: 1.5rem;
  .container { text-align: center; }
  .edit-title {
    font-size: var(--font-size-3xl);
    font-weight: 800;
    margin-bottom: .25rem;
    background: linear-gradient(90deg, var(--secondary-color), #fff);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    background-size: 200% auto; animation: gradientTitle 3s ease infinite;
  }
  .edit-subtitle { opacity: .9; }
}
@keyframes gradientTitle { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }

.edit-main { padding-bottom: 2rem; }

.form-fade-enter-from, .form-fade-leave-to { opacity: 0; transform: translateY(8px); }
.form-fade-enter-active, .form-fade-leave-active { transition: all .25s ease; }
.form-fade-enter-to, .form-fade-leave-from { opacity: 1; transform: translateY(0); }

.edit-form {
  background: var(--card-bg);
  border-radius: .75rem;
  box-shadow: var(--shadow);
  border: 1px solid rgba(0,0,0,0.05);
  padding: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1rem;
}

.form-card {
  background: #fff;
  border-radius: .75rem;
  box-shadow: var(--shadow);
  border: 1px solid rgba(0,0,0,0.05);
  padding: 1rem;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: .75rem;
}
.avatar-card{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-preview {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: .75rem;
  border: 4px solid var(--accent-color);
  img { width: 100%; height: 100%; object-fit: cover; }
}

.avatar-actions { display: flex; gap: .5rem; align-items: center; }
.upload-btn {
  background-color: var(--primary-color);
  color: #fff; border: none; border-radius: .5rem;
  padding: .5rem 1rem; cursor: pointer; transition: all .3s ease;
}
.upload-btn:hover { background-color: var(--secondary-color); transform: translateY(-1px); }

.help-text { font-size: var(--font-size-mini); color: var(--text-light); margin-top: .5rem; }

.form-item { margin-bottom: .75rem; }
.form-label { display: block; margin-bottom: .25rem; color: var(--text-color); }

.g-textarea {
  width: 100%;
  font-size: var(--font-size-sm);
  border-radius: .25rem; border: 1px solid var(--border-color);
  padding: .5rem; outline: none; transition: all .3s ease;
}
.g-textarea:focus { box-shadow: 0 0 0 3px rgba(102,126,234,0.1); transform: translateY(-1px); }

.form-actions { display: flex; gap: .5rem; margin-top: .75rem; }
.save-btn { background: var(--primary-color); color: #fff; border: none; border-radius: .5rem; padding: .5rem 1rem; cursor: pointer; }
.save-btn:hover { background: var(--secondary-color); transform: translateY(-1px); }
.cancel-btn { background: #fff; color: var(--text-color); border: 1px solid var(--border-color); border-radius: .5rem; padding: .5rem 1rem; cursor: pointer; }
.cancel-btn:hover { background: #f5f5f5; }

@media (max-width: 1024px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
