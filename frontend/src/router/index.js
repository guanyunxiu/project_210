import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页', requiresAuth: true }
  },
  {
    path: '/script/:id',
    name: 'ScriptDetail',
    component: () => import('@/views/ScriptDetail.vue'),
    meta: { title: '剧本详情', requiresAuth: true }
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: () => import('@/views/Rooms.vue'),
    meta: { title: '房间列表', requiresAuth: true }
  },
  {
    path: '/room/:id',
    name: 'RoomDetail',
    component: () => import('@/views/RoomDetail.vue'),
    meta: { title: '房间详情', requiresAuth: true }
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: () => import('@/views/Game.vue'),
    meta: { title: '游戏中', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '剧本杀'
  const userStore = useUserStore()

  if (userStore.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
  }
})

export default router
