import { io } from 'socket.io-client'
import { useUserStore } from '@/stores/user'

class SocketService {
  constructor() {
    this.socket = null
    this.connected = false
  }

  connect() {
    const userStore = useUserStore()
    if (!userStore.token) {
      return null
    }

    this.socket = io('http://localhost:3005', {
      auth: {
        token: userStore.token
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      this.connected = true
      console.log('Socket connected')
    })

    this.socket.on('disconnect', () => {
      this.connected = false
      console.log('Socket disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }

  getSocket() {
    if (!this.socket || !this.connected) {
      return this.connect()
    }
    return this.socket
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data)
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }
}

export default new SocketService()
