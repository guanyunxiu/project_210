<template>
  <div class="script-card card" @click="handleClick">
    <div class="card-image">
      <img :src="script.cover" :alt="script.name" />
      <span class="category-tag">{{ script.category }}</span>
    </div>
    <div class="card-content">
      <h3 class="card-title text-ellipsis">{{ script.name }}</h3>
      <div class="card-info">
        <div class="info-item">
          <van-icon name="friends-o" size="14" />
          <span>{{ script.players }}人</span>
        </div>
        <div class="info-item">
          <van-icon name="star-o" size="14" />
          <span>{{ script.difficulty }}</span>
        </div>
        <div class="info-item">
          <van-icon name="clock-o" size="14" />
          <span>{{ formatDuration(script.duration) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  script: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

const handleClick = () => {
  router.push(`/script/${props.script.id}`)
}
</script>

<style lang="less" scoped>
.script-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.card-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .category-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 10px;
    background: rgba(107, 70, 193, 0.9);
    color: #fff;
    font-size: 12px;
    border-radius: 12px;
    backdrop-filter: blur(4px);
  }
}

.card-content {
  padding: 12px 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.card-info {
  display: flex;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;

  .van-icon {
    color: #6B46C1;
  }
}
</style>
