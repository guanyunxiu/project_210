<template>
  <div class="script-detail page-container">
    <van-nav-bar
      title="剧本详情"
      left-text="返回"
      left-arrow
      @click-left="router.back()"
      fixed
      placeholder
    />

    <van-loading v-if="loading" class="loading" color="#6B46C1" />

    <div v-else-if="script" class="content">
      <div class="script-cover">
        <img :src="script.cover" :alt="script.name" />
        <div class="cover-mask"></div>
        <div class="script-info">
          <h1 class="script-name">{{ script.name }}</h1>
          <div class="script-tags">
            <span class="tag">{{ script.category }}</span>
            <span class="tag">{{ script.difficulty }}</span>
          </div>
        </div>
      </div>

      <div class="info-card card">
        <div class="info-row">
          <div class="info-item">
            <van-icon name="friends-o" size="18" color="#6B46C1" />
            <span class="info-label">人数</span>
            <span class="info-value">{{ script.players }}人</span>
          </div>
          <div class="info-item">
            <van-icon name="clock-o" size="18" color="#6B46C1" />
            <span class="info-label">时长</span>
            <span class="info-value">{{ formatDuration(script.duration) }}</span>
          </div>
          <div class="info-item">
            <van-icon name="star-o" size="18" color="#6B46C1" />
            <span class="info-label">难度</span>
            <span class="info-value">{{ script.difficulty }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">剧本简介</h3>
        <div class="card description-card">
          <p class="description">{{ script.description }}</p>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">角色列表</h3>
        <div class="roles-list">
          <div
            v-for="role in script.roles"
            :key="role.id"
            class="role-card card"
          >
            <div class="role-avatar">
              <van-icon
                :name="role.gender === '女' ? 'user-o' : 'user-circle-o'"
                size="32"
                :color="role.gender === '女' ? '#FF69B4' : '#6B46C1'"
              />
            </div>
            <div class="role-info">
              <div class="role-name">
                {{ role.name }}
                <span class="role-gender">{{ role.gender }}</span>
              </div>
              <p class="role-desc">{{ role.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-action">
        <van-button
          type="primary"
          block
          size="large"
          :loading="creating"
          loading-text="创建中"
          @click="handleCreateRoom"
        >
          创建房间
        </van-button>
      </div>
    </div>

    <van-empty v-else description="剧本不存在" />

    <van-dialog
      v-model:show="showCreateDialog"
      title="创建房间"
      show-cancel-button
      :before-close="onBeforeCreate"
    >
      <div class="dialog-content">
        <van-field
          v-model="roomForm.name"
          label="房间名"
          placeholder="请输入房间名"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useScriptStore } from '@/stores/script'
import { useRoomStore } from '@/stores/room'
import { mockScripts } from '@/utils/mock'

const router = useRouter()
const route = useRoute()
const scriptStore = useScriptStore()
const roomStore = useRoomStore()

const loading = ref(true)
const creating = ref(false)
const showCreateDialog = ref(false)
const script = ref(null)

const roomForm = reactive({
  name: ''
})

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

const loadScriptDetail = async () => {
  const id = route.params.id
  try {
    const res = await scriptStore.fetchScriptDetail(id)
    script.value = res.data
  } catch (error) {
    console.log('Fetch script detail failed, using mock data:', error)
    const mockScript = mockScripts.find(s => s.id === Number(id))
    script.value = mockScript || mockScripts[0]
  } finally {
    loading.value = false
  }
}

const handleCreateRoom = () => {
  roomForm.name = `${script.value.name}-${Math.floor(Math.random() * 1000)}号房`
  showCreateDialog.value = true
}

const onBeforeCreate = async (action) => {
  if (action !== 'confirm') {
    return true
  }

  if (!roomForm.name.trim()) {
    showToast('请输入房间名')
    return false
  }

  creating.value = true
  try {
    const res = await roomStore.createRoomAction({
      scriptId: script.value.id,
      name: roomForm.name.trim()
    })
    showToast('创建成功')
    router.push(`/room/${res.data.id}`)
    return true
  } catch (error) {
    console.log('Create room failed, using mock data:', error)
    showToast('创建成功（演示模式）')
    router.push(`/room/1`)
    return true
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  loadScriptDetail()
})

onUnmounted(() => {
  scriptStore.clearCurrentScript()
})
</script>

<style lang="less" scoped>
.script-detail {
  padding-bottom: 100px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.script-cover {
  position: relative;
  width: 100%;
  height: 280px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cover-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  }

  .script-info {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    color: #fff;

    .script-name {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .script-tags {
      display: flex;
      gap: 8px;

      .tag {
        background: rgba(107, 70, 193, 0.9);
        color: #fff;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
      }
    }
  }
}

.info-card {
  margin: -30px 16px 0;
  position: relative;
  z-index: 10;
  padding: 20px 0;

  .info-row {
    display: flex;
    justify-content: space-around;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    .info-label {
      font-size: 12px;
      color: #999;
    }

    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }
}

.section {
  margin-top: 20px;
  padding: 0 16px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
}

.description-card {
  padding: 16px;

  .description {
    font-size: 14px;
    line-height: 1.8;
    color: #666;
  }
}

.roles-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-card {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;

  .role-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .role-info {
    flex: 1;
    min-width: 0;

    .role-name {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #333;

      .role-gender {
        font-size: 12px;
        font-weight: normal;
        color: #999;
        margin-left: 8px;
      }
    }

    .role-desc {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }
  }
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  :deep(.van-button--large) {
    height: 48px;
    border-radius: 24px;
  }
}

.dialog-content {
  padding: 10px 16px;
}
</style>
