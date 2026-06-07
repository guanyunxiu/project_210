import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getRoomList,
  getRoomDetail,
  createRoom,
  joinRoom,
  leaveRoom,
  readyRoom,
  startGame
} from '@/api/room'
import { transformRoom, transformRoomList } from '@/utils/transform'
import { mockRooms } from '@/utils/mock'

export const useRoomStore = defineStore('room', () => {
  const roomList = ref([])
  const currentRoom = ref(null)
  const loading = ref(false)

  const fetchRoomList = async () => {
    loading.value = true
    try {
      const res = await getRoomList()
      const data = res.data.list || res.data || []
      roomList.value = transformRoomList(data)
      return res
    } catch (error) {
      console.log('Fetch room list failed, using mock data:', error)
      roomList.value = mockRooms
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchRoomDetail = async (id) => {
    loading.value = true
    try {
      const res = await getRoomDetail(id)
      currentRoom.value = transformRoom(res.data)
      return res
    } catch (error) {
      console.log('Fetch room detail failed, using mock data:', error)
      currentRoom.value = mockRooms.find(r => r.id === Number(id)) || mockRooms[0]
      throw error
    } finally {
      loading.value = false
    }
  }

  const createRoomAction = async (data) => {
    const res = await createRoom(data)
    currentRoom.value = transformRoom(res.data)
    return res
  }

  const joinRoomAction = async (id, data = {}) => {
    const res = await joinRoom(id, data)
    return res
  }

  const leaveRoomAction = async (id) => {
    const res = await leaveRoom(id)
    if (currentRoom.value?.id === id) {
      currentRoom.value = null
    }
    return res
  }

  const readyRoomAction = async (id) => {
    const res = await readyRoom(id)
    return res
  }

  const startGameAction = async (id) => {
    const res = await startGame(id)
    return res
  }

  const updateRoomFromSocket = (roomData) => {
    currentRoom.value = transformRoom(roomData)
  }

  const updateRoomListFromSocket = (rooms) => {
    roomList.value = transformRoomList(rooms)
  }

  const clearCurrentRoom = () => {
    currentRoom.value = null
  }

  return {
    roomList,
    currentRoom,
    loading,
    fetchRoomList,
    fetchRoomDetail,
    createRoomAction,
    joinRoomAction,
    leaveRoomAction,
    readyRoomAction,
    startGameAction,
    updateRoomFromSocket,
    updateRoomListFromSocket,
    clearCurrentRoom
  }
})
