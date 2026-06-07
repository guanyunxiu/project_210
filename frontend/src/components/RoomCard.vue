<template>
  <div class="room-card card" @click="handleClick">
    <div class="room-header">
      <div class="room-info">
        <h3 class="room-name text-ellipsis">{{ room.name }}</h3>
        <p class="script-name">{{ room.scriptName }}</p>
      </div>
      <div class="room-status">
        <span class="status-tag waiting">等待中</span>
      </div>
    </div>

    <div class="room-body">
      <div class="players">
        <div
          v-for="(player, index) in displayPlayers"
          :key="player.id || index"
          class="player"
        >
          <div class="player-avatar">
            <van-icon v-if="player.name" name="user-o" size="20" />
            <van-icon v-else name="plus" size="20" color="#ccc" />
          </div>
          <span v-if="player.name" class="player-name text-ellipsis">{{ player.name }}</span>
          <span v-else class="empty-slot">空位</span>
        </div>
      </div>
    </div>

    <div class="room-footer">
      <div class="owner">
        <van-icon name="user-o" size="14" color="#6B46C1" />
        <span>房主：{{ room.ownerName }}</span>
      </div>
      <div class="player-count">
        {{ room.currentPlayers }}/{{ room.maxPlayers }}人
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const displayPlayers = computed(() => {
  const players = [...(props.room.players || [])]
  while (players.length < props.room.maxPlayers) {
    players.push({})
  }
  return players.slice(0, 7)
})

const handleClick = () => {
  router.push(`/room/${props.room.id}`)
}
</script>

<style lang="less" scoped>
.room-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 16px 12px;

  .room-info {
    flex: 1;
    min-width: 0;

    .room-name {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #333;
    }

    .script-name {
      font-size: 12px;
      color: #999;
    }
  }

  .status-tag {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;

    &.waiting {
      background: rgba(82, 196, 26, 0.1);
      color: #52C41A;
    }

    &.playing {
      background: rgba(107, 70, 193, 0.1);
      color: #6B46C1;
    }
  }
}

.room-body {
  padding: 0 16px 12px;

  .players {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 48px;

    .player-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
      color: #6B46C1;
    }

    .player-name {
      font-size: 11px;
      color: #666;
      width: 100%;
      text-align: center;
    }

    .empty-slot {
      font-size: 11px;
      color: #ccc;
    }
  }
}

.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #999;

  .owner {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .player-count {
    color: #6B46C1;
    font-weight: 600;
  }
}
</style>
