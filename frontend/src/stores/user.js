import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo, updateUserInfo } from '@/api/user'
import { transformUser } from '@/utils/transform'
import { toBackendGender } from '@/utils/transform'
import { mockUser } from '@/utils/mock'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  const loginAction = async (loginForm) => {
    try {
      const res = await login(loginForm)
      setToken(res.data.token)
      setUserInfo(transformUser(res.data.user))
      return res
    } catch (error) {
      console.log('Login failed:', error)
      throw error
    }
  }

  const registerAction = async (registerForm) => {
    const res = await register(registerForm)
    return res
  }

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      setUserInfo(transformUser(res.data))
      return res
    } catch (error) {
      console.log('Fetch user info failed, using mock data:', error)
      setUserInfo(mockUser)
      throw error
    }
  }

  const updateProfile = async (data) => {
    try {
      const backendData = { ...data }
      if (data.gender) {
        backendData.gender = toBackendGender(data.gender)
      }
      const res = await updateUserInfo(backendData)
      setUserInfo({ ...userInfo.value, ...data })
      return res
    } catch (error) {
      console.log('Update profile failed:', error)
      throw error
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    loginAction,
    registerAction,
    fetchUserInfo,
    updateProfile,
    logout
  }
})
