import axios from 'axios'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 0 && res.code !== 200) {
      showToast(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        const userStore = useUserStore()
        userStore.logout()
        showToast('登录已过期，请重新登录')
      } else if (status === 500) {
        showToast('服务器错误')
      } else {
        showToast(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      showToast('网络连接失败')
    } else {
      showToast('请求失败')
    }
    return Promise.reject(error)
  }
)

export default request
