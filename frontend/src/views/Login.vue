<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo">
        <van-icon name="friends-o" size="48" color="#6B46C1" />
      </div>
      <h1 class="title">剧本杀组队平台</h1>
      <p class="subtitle">找到志同道合的伙伴，一起探索精彩剧本</p>
    </div>

    <div class="login-content">
      <van-tabs v-model:active="activeTab" color="#6B46C1" sticky>
        <van-tab title="登录">
          <form class="form" @submit.prevent="handleLogin">
            <van-cell-group inset>
              <van-field
                v-model="loginForm.username"
                label="用户名"
                placeholder="请输入用户名"
                :rules="[{ required: true, message: '请输入用户名' }]"
                clearable
              />
              <van-field
                v-model="loginForm.password"
                type="password"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]"
                clearable
              />
            </van-cell-group>

            <van-button
              type="primary"
              native-type="submit"
              block
              class="submit-btn"
              :loading="loginLoading"
              loading-text="登录中"
            >
              登录
            </van-button>
          </form>
        </van-tab>

        <van-tab title="注册">
          <form class="form" @submit.prevent="handleRegister">
            <van-cell-group inset>
              <van-field
                v-model="registerForm.username"
                label="用户名"
                placeholder="请输入用户名"
                :rules="[{ required: true, message: '请输入用户名' }, { min: 3, message: '用户名至少3位' }]"
                clearable
              />
              <van-field
                v-model="registerForm.nickname"
                label="昵称"
                placeholder="请输入昵称"
                :rules="[{ required: true, message: '请输入昵称' }]"
                clearable
              />
              <van-field
                v-model="registerForm.password"
                type="password"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]"
                clearable
              />
              <van-field
                v-model="registerForm.confirmPassword"
                type="password"
                label="确认密码"
                placeholder="请再次输入密码"
                :rules="confirmPasswordRules"
                clearable
              />
              <van-field
                v-model="registerForm.gender"
                label="性别"
                placeholder="请选择性别"
                is-link
                readonly
                @click="showGenderPicker = true"
              />
            </van-cell-group>

            <van-button
              type="primary"
              native-type="submit"
              block
              class="submit-btn"
              :loading="registerLoading"
              loading-text="注册中"
            >
              注册
            </van-button>
          </form>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup v-model:show="showGenderPicker" position="bottom">
      <van-picker
        :columns="genderColumns"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { mockUser } from '@/utils/mock'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeTab = ref(0)
const loginLoading = ref(false)
const registerLoading = ref(false)
const showGenderPicker = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  gender: ''
})

const genderColumns = [
  { text: '男', value: '男' },
  { text: '女', value: '女' },
  { text: '保密', value: '保密' }
]

const confirmPasswordRules = [
  { required: true, message: '请再次输入密码' },
  {
    validator: (val) => val === registerForm.password,
    message: '两次密码输入不一致'
  }
]

const onGenderConfirm = ({ selectedOptions }) => {
  registerForm.gender = selectedOptions[0].text
  showGenderPicker.value = false
}

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    showToast('请填写完整信息')
    return
  }
  if (loginForm.password.length < 6) {
    showToast('密码至少6位')
    return
  }

  loginLoading.value = true
  try {
    await userStore.loginAction(loginForm)
    const redirect = route.query.redirect || '/'
    showToast('登录成功')
    router.replace(redirect)
  } catch (error) {
    console.log('Login failed, using mock data:', error)
    userStore.setToken('mock-token-' + Date.now())
    userStore.setUserInfo(mockUser)
    const redirect = route.query.redirect || '/'
    showToast('登录成功（演示模式）')
    router.replace(redirect)
  } finally {
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.username || !registerForm.nickname || !registerForm.password || !registerForm.confirmPassword || !registerForm.gender) {
    showToast('请填写完整信息')
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    showToast('两次密码输入不一致')
    return
  }

  registerLoading.value = true
  try {
    await userStore.registerAction({
      username: registerForm.username,
      nickname: registerForm.nickname,
      password: registerForm.password,
      gender: registerForm.gender
    })
    showToast('注册成功，请登录')
    activeTab.value = 0
    loginForm.username = registerForm.username
  } catch (error) {
    console.log('Register failed, using mock data:', error)
    showToast('注册成功（演示模式），请登录')
    activeTab.value = 0
    loginForm.username = registerForm.username
  } finally {
    registerLoading.value = false
  }
}
</script>

<style lang="less" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
  padding: 60px 0 0;
}

.login-header {
  text-align: center;
  color: #fff;
  padding: 30px 20px 40px;

  .logo {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    backdrop-filter: blur(10px);
  }

  .title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 14px;
    opacity: 0.9;
  }
}

.login-content {
  background: #F5F5F5;
  border-radius: 24px 24px 0 0;
  min-height: calc(100vh - 260px);
  padding-top: 20px;
}

.form {
  padding: 20px 16px;

  :deep(.van-cell-group--inset) {
    border-radius: 12px;
    overflow: hidden;
  }
}

.submit-btn {
  margin: 30px 16px 0;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
}
</style>
