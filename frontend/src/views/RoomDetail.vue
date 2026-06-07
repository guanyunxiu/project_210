<template>
  <div class="room-detail page-container">
    <van-nav-bar
      title="房间详情"
      left-text="返回"
      left-arrow
      @click-left="handleBack"
      fixed
      placeholder
    />

    <van-loading v-if="loading" class="loading" color="#6B46C1" />

    <div v-else-if="room" class="content">
      <div class="room-header card">
        <div class="room-title-row">
          <h2 class="room-name">{{ room.name }}</h2>
          <span class="status-tag waiting">等待中</span>
        </div>
        <p class="script-info">剧本：{{ room.scriptName }}</p>
      </div>

      <div class="section">
        <h3 class="section-title">玩家列表</h3>
        <div class="players-list">
          <div
            v-for="player in allPlayers"
            :key="player.id || 'empty-' + Math.random()"
            class="player-card card"
            :class="{ 'is-me': isCurrentUser(player) }"
          >
            <div class="player-avatar">
              <van-icon v-if="player.id" name="user-o" size="28" color="#6B46C1" />
              <van-icon v-else name="plus" size="28" color="#ccc" />
            </div>
            <div class="player-info">
              <div class="player-name-row">
                <span class="player-name">
                  {{ player.name || '等待加入' }}
                  <van-tag v-if="player.isOwner" type="primary" size="mini">房主</van-tag>
                  <van-tag v-if="isCurrentUser(player)" type="success" size="mini">我</van-tag>
                </span>
              </div>
              <div class="player-role" v-if="player.id">
                <template v-if="player.roleName">
                  角色：{{ player.roleName }}
                </template>
                <template v-else>
                  <span class="no-role">未选择角色</span>
                </template>
              </div>
              <div class="player-status" v-if="player.id">
                <van-tag
                  :type="player.ready ? 'success' : 'warning'"
                  size="mini"
                >
                  {{ player.ready ? '已准备' : '未准备' }}
                </van-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-actions">
        <template v-if="isOwner">
          <van-button
            block
            size="large"
            type="primary"
            :disabled="!allReady"
            :loading="starting"
            loading-text="开始中"
            @click="handleStartGame"
          >
            {{ allReady ? '开始游戏' : '等待玩家准备' }}
          </van-button>
        </template>
        <template v-else-if="hasJoined">
          <div class="action-row">
            <van-button
              block
              size="large"
              :type="isReady ? 'default' : 'primary'"
              :loading="togglingReady"
              loading-text="处理中"
              @click="toggleReady"
              class="action-btn"
            >
              {{ isReady ? '取消准备' : '准备' }}
            </van-button>
            <van-button
              block
              size="large"
              type="danger"
              plain
              :loading="leaving"
              loading-text="退出中"
              @click="handleLeave"
              class="action-btn"
            >
              退出房间
            </van-button>
          </div>
        </template>
        <template v-else>
          <van-button
            block
            size="large"
            type="primary"
            :loading="joining"
            loading-text="加入中"
            @click="handleJoin"
          >
            加入房间
          </van-button>
        </template>
      </div>
    </div>

    <van-empty v-else description="房间不存在" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useRoomStore } from '@/stores/room'
import { useUserStore } from '@/stores/user'
import socket from '@/utils/socket'
import { mockRooms, mockScripts } from '@/utils/mock'

const router = useRouter()
const route = useRoute()
const roomStore = useRoomStore()
const userStore = useUserStore()

const loading = ref(true)
const joining = ref(false)
const leaving = ref(false)
const togglingReady = ref(false)
const starting = ref(false)
const room = ref(null)

const roomId = computed(() => route.params.id)

const allPlayers = computed(() => {
  if (!room.value) return []
  const players = [...(room.value.players || [])]
  const maxPlayers = room.value.maxPlayers || 6
  while (players.length < maxPlayers) {
    players.push({})
  }
  return players
})

const isOwner = computed(() => {
  if (!room.value || !userStore.userInfo) return false
  return room.value.ownerId === userStore.userInfo.id
})

const hasJoined = computed(() => {
  if (!room.value || !userStore.userInfo) return false
  return room.value.players?.some(p => p.id === userStore.userInfo.id)
})

const currentUserPlayer = computed(() => {
  if (!room.value || !userStore.userInfo) return null
  return room.value.players?.find(p => p.id === userStore.userInfo.id)
})

const isReady = computed(() => {
  return currentUserPlayer.value?.ready || false
})

const allReady = computed(() => {
  if (!room.value?.players) return false
  return room.value.players.length === room.value.maxPlayers &&
    room.value.players.every(p => p.ready)
})

const isCurrentUser = (player) => {
  if (!player.id || !userStore.userInfo) return false
  return player.id === userStore.userInfo.id
}

const loadRoomDetail = async () => {
  loading.value = true
  try {
    await roomStore.fetchRoomDetail(roomId.value)
    room.value = roomStore.currentRoom
  } catch (error) {
    console.log('Fetch room detail failed, using mock data:', error)
    const mockRoom = mockRooms.find(r => r.id === Number(roomId.value))
    if (mockRoom) {
      const script = mockScripts.find(s => s.id === mockRoom.scriptId)
      room.value = { ...mockRoom, script }
    } else {
      room.value = mockRooms[0]
    }
  } finally {
    loading.value = false
  }
}

const initSocket = () => {
  const socketInstance = socket.getSocket()
  if (!socketInstance) return

  socket.emit('joinRoom', { roomId: roomId.value })

  socket.on('roomUpdated', (roomData) => {
    roomStore.updateRoomFromSocket(roomData)
    room.value = roomStore.currentRoom
  })

  socket.on('playerJoined', (player) => {
    showToast(`${player.name} 加入了房间`)
  })

  socket.on('playerLeft', (player) => {
    showToast(`${player.name} 离开了房间`)
  })

  socket.on('playerReady', (player) => {
    showToast(`${player.name} ${player.ready ? '已准备' : '取消准备'}`)
  })

  socket.on('gameStarted', (gameId) => {
    showToast('游戏开始！')
    router.push(`/game/${gameId}`)
  })
}

const handleJoin = async () => {
  joining.value = true
  try {
    await roomStore.joinRoomAction(roomId.value)
    showToast('加入成功')
    await loadRoomDetail()
  } catch (error) {
    console.log('Join room failed, using mock data:', error)
    const newPlayer = {
      id: userStore.userInfo?.id || 2,
      name: userStore.userInfo?.nickname || '玩家',
      avatar: '',
      roleId: null,
      roleName: null,
      ready: false,
      isOwner: false
    }
    room.value.players.push(newPlayer)
    room.value.currentPlayers++
    showToast('加入成功（演示模式）')
  } finally {
    joining.value = false
  }
}

const handleLeave = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要退出房间吗？'
    })
  } catch {
    return
  }

  leaving.value = true
  try {
    await roomStore.leaveRoomAction(roomId.value)
    showToast('已退出房间')
    router.back()
  } catch (error) {
    console.log('Leave room failed, using mock data:', error)
    room.value.players = room.value.players.filter(p => p.id !== userStore.userInfo?.id)
    room.value.currentPlayers--
    showToast('已退出房间（演示模式）')
    router.back()
  } finally {
    leaving.value = false
  }
}

const toggleReady = async () => {
  togglingReady.value = true
  try {
    if (isReady.value) {
      await roomStore.unreadyRoomAction(roomId.value)
    } else {
      await roomStore.readyRoomAction(roomId.value)
    }
    await loadRoomDetail()
  } catch (error) {
    console.log('Toggle ready failed, using mock data:', error)
    const player = room.value.players.find(p => p.id === userStore.userInfo?.id)
    if (player) {
      player.ready = !player.ready
    }
  } finally {
    togglingReady.value = false
  }
}

const handleStartGame = async () => {
  starting.value = true
  try {
    const res = await roomStore.startGameAction(roomId.value)
    showToast('游戏开始')
    router.push(`/game/${res.data.gameId || 1}`)
  } catch (error) {
    console.log('Start game failed, using mock data:', error)
    showToast('游戏开始（演示模式）')
    router.push(`/game/1`)
  } finally {
    starting.value = false
  }
}

const handleBack = async () => {
  if (hasJoined.value) {
    try {
      await showDialog({
        title: '提示',
        message: '确定要退出房间吗？'
      })
      await roomStore.leaveRoomAction(roomId.value)
    } catch {
      return
    }
  }
  router.back()
}

onMounted(() => {
  loadRoomDetail()
  initSocket()
})

onUnmounted(() => {
  socket.emit('leaveRoom', { roomId: roomId.value })
  socket.off('roomUpdated')
  socket.off('playerJoined')
  socket.off('playerLeft')
  socket.off('playerReady')
  socket.off('gameStarted')
  roomStore.clearCurrentRoom()
})
</script>

<style lang="less" scoped>
.room-detail {
  padding-bottom: 120px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.room-header {
  margin: 16px;
  padding: 20px 16px;

  .room-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .room-name {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
  }

  .status-tag {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;

    &.waiting {
      background: rgba(82, 196, 26, 0.1);
      color: #52C41A;
    }
  }

  .script-info {
    font-size: 14px;
    color: #666;
  }
}

.section {
  margin-top: 16px;
  padding: 0 16px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-card {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;

  &.is-me {
    border: 2px solid #6B46C1;
  }

  .player-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .player-info {
    flex: 1;
    min-width: 0;

    .player-name-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;

      .player-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    }

    .player-role {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;

      .no-role {
        color: #999;
      }
    }

    .player-status {
      font-size: 12px;
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  .action-row {
    display: flex;
    gap: 12px;

    .action-btn {
      flex: 1;
    }
  }

  :deep(.van-button--large) {
    height: 48px;
    border-radius: 24px;
  }
}
</style>
