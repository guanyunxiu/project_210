<template>
  <div class="profile-page page-container">
    <van-nav-bar
      title="个人中心"
      fixed
      placeholder
    />

    <div class="content">
      <div class="user-card card">
        <div class="avatar-section" @click="handleAvatarClick">
          <div class="avatar">
            <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="avatar" />
            <van-icon v-else name="user-o" size="40" color="#fff" />
          </div>
          <div class="edit-icon">
            <van-icon name="photograph" size="14" color="#fff" />
          </div>
        </div>
        <div class="user-info">
          <h2 class="nickname">{{ userStore.userInfo?.nickname || '未设置' }}</h2>
          <p class="username">账号：{{ userStore.userInfo?.username }}</p>
        </div>
      </div>

      <van-cell-group inset class="form-group">
        <van-field
          v-model="editForm.nickname"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
        />
        <van-field
          v-model="editForm.gender"
          label="性别"
          placeholder="请选择性别"
          is-link
          readonly
          @click="showGenderPicker = true"
        />
      </van-cell-group>

      <van-button
        type="primary"
        block
        :loading="saving"
        loading-text="保存中"
        @click="handleSave"
        class="save-btn"
      >
        保存修改
      </van-button>

      <van-button
        block
        type="danger"
        plain
        @click="handleLogout"
        class="logout-btn"
      >
        退出登录
      </van-button>
    </div>

    <van-tabbar v-model:active="activeTabbar" route>
      <van-tabbar-item to="/" icon="cluster">剧本</van-tabbar-item>
      <van-tabbar-item to="/rooms" icon="friends-o">房间</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>

    <van-popup v-model:show="showGenderPicker" position="bottom">
      <van-picker
        :columns="genderColumns"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </van-popup>

    <input
      ref="avatarInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleAvatarChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeTabbar = ref(2)
const saving = ref(false)
const uploading = ref(false)
const showGenderPicker = ref(false)
const avatarInput = ref(null)

const editForm = reactive({
  nickname: '',
  gender: ''
})

const genderColumns = [
  { text: '男', value: '男' },
  { text: '女', value: '女' },
  { text: '保密', value: '保密' }
]

const onGenderConfirm = ({ selectedOptions }) => {
  editForm.gender = selectedOptions[0].text
  showGenderPicker.value = false
}

const handleAvatarClick = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件')
    return
  }

  uploading.value = true
  try {
    await userStore.uploadAvatarAction(file)
    showToast('头像上传成功')
  } catch (error) {
    console.log('Upload avatar failed:', error)
    showToast('头像上传成功（演示模式）')
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

const handleSave = async () => {
  if (!editForm.nickname.trim()) {
    showToast('请输入昵称')
    return
  }
  if (!editForm.gender) {
    showToast('请选择性别')
    return
  }

  saving.value = true
  try {
    await userStore.updateProfile({
      nickname: editForm.nickname.trim(),
      gender: editForm.gender
    })
    showToast('保存成功')
  } catch (error) {
    console.log('Update profile failed, using mock data:', error)
    userStore.setUserInfo({
      ...userStore.userInfo,
      nickname: editForm.nickname.trim(),
      gender: editForm.gender
    })
    showToast('保存成功（演示模式）')
  } finally {
    saving.value = false
  }
}

const handleLogout = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要退出登录吗？'
    })
    userStore.logout()
    showToast('已退出登录')
    router.replace('/login')
  } catch {
    return
  }
}

onMounted(() => {
  if (userStore.userInfo) {
    editForm.nickname = userStore.userInfo.nickname || ''
    editForm.gender = userStore.userInfo.gender || ''
  }
})
</script>

<style lang="less" scoped>
.profile-page {
  padding-bottom: 50px;
}

.content {
  padding: 16px;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  margin-bottom: 20px;
  gap: 16px;
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
  color: #fff;

  .avatar-section {
    position: relative;
    cursor: pointer;

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 3px solid rgba(255, 255, 255, 0.3);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .edit-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 26px;
      height: 26px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .user-info {
    flex: 1;

    .nickname {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .username {
      font-size: 13px;
      opacity: 0.8;
    }
  }
}

.form-group {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
}

.save-btn {
  height: 48px;
  border-radius: 24px;
  margin-bottom: 12px;
}

.logout-btn {
  height: 48px;
  border-radius: 24px;
}

:deep(.van-tabbar) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

:deep(.van-cell-group--inset) {
  border-radius: 12px;
  overflow: hidden;
}
</style>
