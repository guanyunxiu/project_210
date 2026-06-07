<template>
  <div class="home-page page-container">
    <van-nav-bar
      title="剧本列表"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="user-o" size="22" @click="router.push('/profile')" />
      </template>
    </van-nav-bar>

    <van-tabs
      v-model:active="activeCategory"
      color="#6B46C1"
      sticky
      offset-top="46px"
      class="category-tabs"
    >
      <van-tab
        v-for="category in scriptStore.categories"
        :key="category.value || 'all'"
        :title="category.name"
        :name="category.value || ''"
      />
    </van-tabs>

    <div class="content">
      <van-loading v-if="scriptStore.loading" class="loading" color="#6B46C1" />

      <div v-else class="script-list">
        <ScriptCard
          v-for="script in filteredScripts"
          :key="script.id"
          :script="script"
        />

        <van-empty v-if="filteredScripts.length === 0" description="暂无剧本" />
      </div>
    </div>

    <van-tabbar v-model:active="activeTabbar" route>
      <van-tabbar-item to="/" icon="cluster">剧本</van-tabbar-item>
      <van-tabbar-item to="/rooms" icon="friends-o">房间</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useScriptStore } from '@/stores/script'
import ScriptCard from '@/components/ScriptCard.vue'
import { mockScripts } from '@/utils/mock'

const router = useRouter()
const scriptStore = useScriptStore()

const activeCategory = ref('')
const activeTabbar = ref(0)

const filteredScripts = computed(() => {
  return scriptStore.scriptList.length > 0 ? scriptStore.scriptList : mockScripts
})

const handleCategoryChange = async (category) => {
  try {
    await scriptStore.fetchScriptsByCategory(category)
  } catch (error) {
    console.log('Fetch scripts by category failed:', error)
  }
}

watch(activeCategory, (newVal) => {
  handleCategoryChange(newVal)
})

onMounted(async () => {
  try {
    await scriptStore.fetchScriptList()
  } catch (error) {
    console.log('Fetch script list failed, using mock data:', error)
  }
})
</script>

<style lang="less" scoped>
.home-page {
  padding-bottom: 50px;
}

.category-tabs {
  background: #fff;
}

.content {
  padding: 16px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.script-list {
  display: flex;
  flex-direction: column;
}

:deep(.van-tabbar) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

:deep(.van-tabs__nav) {
  padding: 0 8px;
}

:deep(.van-tab) {
  flex: none;
  padding: 0 16px;
}
</style>
