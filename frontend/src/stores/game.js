import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getGameInfo, sendMessage, endGame } from '@/api/game'
import { getRoomMessages, getMyRole } from '@/api/room'
import { transformMessage, transformMessageList, transformRole, transformRoom } from '@/utils/transform'
import { mockMessages } from '@/utils/mock'

export const useGameStore = defineStore('game', () => {
  const currentGame = ref(null)
  const messages = ref([])
  const myRole = ref(null)
  const loading = ref(false)
  const voteResult = ref(null)

  const fetchGameInfo = async (id) => {
    loading.value = true
    try {
      const res = await getGameInfo(id)
      currentGame.value = transformRoom(res.data)
      return res
    } catch (error) {
      console.log('Fetch game info failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchMessages = async (id) => {
    try {
      const res = await getRoomMessages(id)
      const data = res.data.list || res.data || []
      messages.value = transformMessageList(data)
      return res
    } catch (error) {
      console.log('Fetch messages failed, using mock data:', error)
      messages.value = mockMessages
      throw error
    }
  }

  const fetchMyRole = async (id) => {
    try {
      const res = await getMyRole(id)
      myRole.value = transformRole(res.data)
      return res
    } catch (error) {
      console.log('Fetch my role failed:', error)
      throw error
    }
  }

  const sendMessageAction = async (id, content) => {
    const res = await sendMessage(id, { content })
    return res
  }

  const addMessage = (message) => {
    messages.value.push(transformMessage(message))
  }

  const endGameAction = async (id, data) => {
    const res = await endGame(id, data)
    return res
  }

  const updateGameFromSocket = (gameData) => {
    currentGame.value = transformRoom(gameData)
  }

  const setVoteResult = (result) => {
    voteResult.value = result
  }

  const clearGame = () => {
    currentGame.value = null
    messages.value = []
    myRole.value = null
    voteResult.value = null
  }

  return {
    currentGame,
    messages,
    myRole,
    loading,
    voteResult,
    fetchGameInfo,
    fetchMessages,
    fetchMyRole,
    sendMessageAction,
    addMessage,
    endGameAction,
    updateGameFromSocket,
    setVoteResult,
    clearGame
  }
})
