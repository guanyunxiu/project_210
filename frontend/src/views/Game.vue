<template>
  <div class="game-page">
    <van-nav-bar
      :title="game ? game.scriptName : '游戏中'"
      left-text="返回"
      left-arrow
      @click-left="handleBack"
      fixed
      placeholder
    >
      <template #right>
        <van-button
          size="small"
          type="danger"
          plain
          @click="handleEndGame"
        >
          结束游戏
        </van-button>
      </template>
    </van-nav-bar>

    <van-loading v-if="loading" class="loading" color="#6B46C1" />

    <div v-else class="game-content">
      <div class="game-header">
        <div class="my-role card" v-if="myRole">
          <div class="role-avatar">
            <van-icon
              :name="myRole.gender === '女' ? 'user-o' : 'user-circle-o'"
              size="28"
              :color="myRole.gender === '女' ? '#FF69B4' : '#6B46C1'"
            />
          </div>
          <div class="role-info">
            <p class="role-label">你的角色</p>
            <p class="role-name">{{ myRole.name }}</p>
          </div>
        </div>
      </div>

      <div class="game-body">
        <div class="roles-panel">
          <h4 class="panel-title">角色列表</h4>
          <div class="roles-list">
            <div
              v-for="player in players"
              :key="player.id"
              class="role-item"
              :class="{ 'is-me': player.isMe }"
            >
              <div class="role-avatar-small">
                <van-icon name="user-o" size="20" color="#6B46C1" />
              </div>
              <div class="role-details">
                <p class="player-name text-ellipsis">{{ player.name }}</p>
                <p class="player-role text-ellipsis">{{ player.roleName }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-panel">
          <div class="messages-container" ref="messagesContainer">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-item"
              :class="{ 'is-me': msg.isMe }"
            >
              <div class="message-avatar">
                <van-icon name="user-o" size="24" />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-name">{{ msg.userName }}</span>
                  <span class="message-role">{{ msg.roleName }}</span>
                  <span class="message-time">{{ msg.timestamp }}</span>
                </div>
                <div class="message-bubble">
                  {{ msg.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <van-field
          v-model="inputMessage"
          placeholder="输入消息..."
          class="message-input"
          @keyup.enter="sendMessage"
        />
        <van-button
          type="primary"
          size="normal"
          :disabled="!inputMessage.trim()"
          :loading="sending"
          loading-text="发送中"
          @click="sendMessage"
        >
          发送
        </van-button>
      </div>
    </div>

    <van-dialog
      v-model:show="showEndDialog"
      title="游戏结算"
      show-cancel-button
      @confirm="confirmEndGame"
    >
      <div class="settlement-content">
        <h3>{{ game?.scriptName }}</h3>
        <p class="settlement-desc">感谢参与本次剧本杀游戏！</p>
        <div class="settlement-info">
          <p>游戏时长：约 {{ game?.duration || 180 }} 分钟</p>
          <p>参与人数：{{ players.length }} 人</p>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import socket from '@/utils/socket'
import { mockMessages, mockScripts, mockRooms } from '@/utils/mock'

const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()
const userStore = useUserStore()

const loading = ref(true)
const sending = ref(false)
const inputMessage = ref('')
const showEndDialog = ref(false)
const messagesContainer = ref(null)
const game = ref(null)
const players = ref([])
const myRole = ref(null)
const messages = ref([])

const gameId = computed(() => route.params.id)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const loadGameInfo = async () => {
  loading.value = true
  try {
    const res = await gameStore.fetchGameInfo(gameId.value)
    game.value = res.data
    myRole.value = res.data.myRole
    players.value = res.data.players || []
    messages.value = res.data.messages || []
  } catch (error) {
    console.log('Fetch game info failed, using mock data:', error)
    const mockRoom = mockRooms[0]
    const mockScript = mockScripts.find(s => s.id === mockRoom.scriptId)
    game.value = {
      id: 1,
      scriptName: mockScript.name,
      duration: mockScript.duration
    }
    myRole.value = mockScript.roles[1]
    players.value = mockRoom.players.map((p, i) => ({
      ...p,
      roleName: mockScript.roles[i]?.name || '未知角色',
      isMe: p.id === userStore.userInfo?.id
    }))
    messages.value = mockMessages.map(m => ({
      ...m,
      isMe: m.userId === userStore.userInfo?.id
    }))
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const initSocket = () => {
  const socketInstance = socket.getSocket()
  if (!socketInstance) return

  socket.emit('joinGame', { gameId: gameId.value })

  socket.on('newMessage', (message) => {
    const newMsg = {
      ...message,
      isMe: message.userId === userStore.userInfo?.id
    }
    messages.value.push(newMsg)
    gameStore.addMessage(newMsg)
    scrollToBottom()
  })

  socket.on('gameEnded', (data) => {
    showToast('游戏已结束')
    showEndDialog.value = true
  })
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const content = inputMessage.value.trim()
  inputMessage.value = ''

  const tempMsg = {
    id: Date.now(),
    userId: userStore.userInfo?.id,
    userName: userStore.userInfo?.nickname,
    roleName: myRole.value?.name,
    content,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isMe: true
  }
  messages.value.push(tempMsg)
  scrollToBottom()

  sending.value = true
  try {
    await gameStore.sendMessageAction(gameId.value, content)
    socket.emit('sendMessage', { gameId: gameId.value, content })
  } catch (error) {
    console.log('Send message failed:', error)
  } finally {
    sending.value = false
  }
}

const handleEndGame = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要结束游戏吗？'
    })
    showEndDialog.value = true
  } catch {
    return
  }
}

const confirmEndGame = async () => {
  try {
    await gameStore.endGameAction(gameId.value)
    socket.emit('endGame', { gameId: gameId.value })
    showToast('游戏已结束')
    router.replace('/')
  } catch (error) {
    console.log('End game failed, using mock data:', error)
    showToast('游戏已结束（演示模式）')
    router.replace('/')
  }
}

const handleBack = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要退出游戏吗？'
    })
    socket.emit('leaveGame', { gameId: gameId.value })
    router.back()
  } catch {
    return
  }
}

onMounted(() => {
  loadGameInfo()
  initSocket()
})

onUnmounted(() => {
  socket.emit('leaveGame', { gameId: gameId.value })
  socket.off('newMessage')
  socket.off('gameEnded')
  gameStore.clearGame()
})
</script>

<style lang="less" scoped>
.game-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F5F5;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 12px;
}

.game-header {
  padding: 0 16px;
  flex-shrink: 0;

  .my-role {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 16px;

    .role-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(107, 70, 193, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .role-info {
      .role-label {
        font-size: 12px;
        color: #999;
        margin-bottom: 2px;
      }

      .role-name {
        font-size: 18px;
        font-weight: 600;
        color: #6B46C1;
      }
    }
  }
}

.game-body {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  overflow: hidden;
}

.roles-panel {
  width: 120px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  padding: 12px 8px;
  overflow-y: auto;

  .panel-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    text-align: center;
  }

  .roles-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .role-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px;
    border-radius: 8px;
    background: #f9f9f9;

    &.is-me {
      background: rgba(107, 70, 193, 0.1);
    }

    .role-avatar-small {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .role-details {
      width: 100%;
      text-align: center;

      .player-name {
        font-size: 11px;
        color: #333;
        font-weight: 500;
      }

      .player-role {
        font-size: 10px;
        color: #999;
      }
    }
  }
}

.chat-panel {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  gap: 8px;

  &.is-me {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;
    }

    .message-bubble {
      background: #6B46C1;
      color: #fff;
      border-radius: 12px 12px 4px 12px;
    }
  }

  .message-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #6B46C1;
  }

  .message-content {
    display: flex;
    flex-direction: column;
    max-width: calc(100% - 52px);
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .message-name {
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }

    .message-role {
      font-size: 10px;
      color: #6B46C1;
      background: rgba(107, 70, 193, 0.1);
      padding: 1px 6px;
      border-radius: 8px;
    }

    .message-time {
      font-size: 10px;
      color: #ccc;
    }
  }

  .message-bubble {
    background: #f5f5f5;
    padding: 8px 12px;
    border-radius: 12px 12px 12px 4px;
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    word-break: break-word;
  }
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;

  .message-input {
    flex: 1;

    :deep(.van-field__control) {
      background: #f5f5f5;
      border-radius: 20px;
      padding: 8px 16px;
    }
  }
}

.settlement-content {
  padding: 20px;
  text-align: center;

  h3 {
    font-size: 18px;
    margin-bottom: 12px;
    color: #333;
  }

  .settlement-desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }

  .settlement-info {
    p {
      font-size: 14px;
      color: #999;
      margin-bottom: 8px;
    }
  }
}
</style>
