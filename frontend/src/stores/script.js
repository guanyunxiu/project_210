import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getScriptList, getScriptDetail, getScriptsByCategory } from '@/api/script'
import { transformScript, transformScriptList } from '@/utils/transform'
import { toBackendCategory } from '@/utils/transform'
import { mockScripts } from '@/utils/mock'

export const useScriptStore = defineStore('script', () => {
  const scriptList = ref([])
  const currentScript = ref(null)
  const loading = ref(false)
  const total = ref(0)

  const categories = [
    { name: '全部', value: '' },
    { name: '恐怖', value: '恐怖' },
    { name: '悬疑', value: '悬疑' },
    { name: '情感', value: '情感' },
    { name: '欢乐', value: '欢乐' },
    { name: '硬核', value: '硬核' }
  ]

  const fetchScriptList = async (params = {}) => {
    loading.value = true
    try {
      const res = await getScriptList(params)
      const data = res.data.list || res.data || []
      scriptList.value = transformScriptList(data)
      total.value = res.data.total || scriptList.value.length
      return res
    } catch (error) {
      console.log('Fetch script list failed, using mock data:', error)
      scriptList.value = mockScripts
      total.value = mockScripts.length
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchScriptDetail = async (id) => {
    loading.value = true
    try {
      const res = await getScriptDetail(id)
      currentScript.value = transformScript(res.data)
      return res
    } catch (error) {
      console.log('Fetch script detail failed, using mock data:', error)
      currentScript.value = mockScripts.find(s => s.id === Number(id)) || mockScripts[0]
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchScriptsByCategory = async (category) => {
    if (!category) {
      return fetchScriptList()
    }
    loading.value = true
    try {
      const backendCategory = toBackendCategory(category)
      const res = await getScriptsByCategory(backendCategory)
      const data = res.data.list || res.data || []
      scriptList.value = transformScriptList(data)
      total.value = res.data.total || scriptList.value.length
      return res
    } catch (error) {
      console.log('Fetch scripts by category failed, using mock data:', error)
      scriptList.value = mockScripts.filter(s => s.category === category)
      total.value = scriptList.value.length
      throw error
    } finally {
      loading.value = false
    }
  }

  const clearCurrentScript = () => {
    currentScript.value = null
  }

  return {
    scriptList,
    currentScript,
    loading,
    total,
    categories,
    fetchScriptList,
    fetchScriptDetail,
    fetchScriptsByCategory,
    clearCurrentScript
  }
})
