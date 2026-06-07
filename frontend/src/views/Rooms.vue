<template>
  <div class="rooms-page page-container">
    <van-nav-bar
      title="房间列表"
      fixed
      placeholder
    />

    <div class="content">
      <van-loading v-if="roomStore.loading" class="loading" color="#6B46C1" />

      <div v-else class="room-list">
        <RoomCard
          v-for="room in rooms"
          :key="room.id"
          :room="room"
        />

        <van-empty v-if="rooms.length === 0" description="暂无房间" />
      </div>
    </div>

    <van-tabbar v-model:active="activeTabbar" route>
      <van-tabbar-item to="/" icon="cluster">剧本</van-tabbar-item>
      <van-tabbar-item to="/rooms" icon="friends-o">房间</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="!roomStore.loading" style="min-height: 200px"></div>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoomStore } from '@/stores/room'
import RoomCard from '@/components/RoomCard.vue'
import { mockRooms } from '@/utils/mock'

const roomStore = useRoomStore()
const activeTabbar = ref(1)
const refreshing = ref(false)

const rooms = computed(() => {
  return roomStore.roomList.length > 0 ? roomStore.roomList : mockRooms
})

const loadRooms = async () => {
  try {
    await roomStore.fetchRoomList()
  } catch (error) {
    console.log('Fetch room list failed, using mock data:', error)
  }
}

const onRefresh = async () => {
  await loadRooms()
  refreshing.value = false
}

onMounted(() => {
  loadRooms()
})
</script>

<style lang="less" scoped>
.rooms-page {
  padding-bottom: 50px;
}

.content {
  padding: 16px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.room-list {
  display: flex;
  flex-direction: column;
}

:deep(.van-tabbar) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
