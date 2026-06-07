const categoryMap = {
  horror: '恐怖',
  suspense: '悬疑',
  emotion: '情感',
  joy: '欢乐',
  hardcore: '硬核'
}

const difficultyMap = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
}

const genderMap = {
  male: '男',
  female: '女',
  unknown: '未知'
}

const reverseCategoryMap = Object.fromEntries(
  Object.entries(categoryMap).map(([k, v]) => [v, k])
)

const reverseDifficultyMap = Object.fromEntries(
  Object.entries(difficultyMap).map(([k, v]) => [v, k])
)

const reverseGenderMap = Object.fromEntries(
  Object.entries(genderMap).map(([k, v]) => [v, k])
)

export const transformScript = (script) => {
  if (!script) return null
  return {
    id: script.id,
    name: script.name,
    category: categoryMap[script.category] || script.category,
    categoryKey: script.category,
    description: script.description,
    cover: script.cover_image || script.cover,
    players: script.player_count || script.players,
    difficulty: difficultyMap[script.difficulty] || script.difficulty,
    difficultyKey: script.difficulty,
    duration: script.duration,
    roles: script.roles ? script.roles.map(transformRole) : []
  }
}

export const transformRole = (role) => {
  if (!role) return null
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    avatar: role.avatar,
    gender: genderMap[role.gender] || role.gender,
    genderKey: role.gender
  }
}

export const transformRoom = (room) => {
  if (!room) return null
  return {
    id: room.id,
    name: room.name,
    status: room.status,
    scriptId: room.script_id || room.scriptId,
    scriptName: room.script?.name || room.scriptName,
    scriptCover: room.script?.cover_image || room.scriptCover,
    maxPlayers: room.max_players || room.maxPlayers,
    currentPlayers: room.current_players || room.players?.length || 0,
    ownerId: room.host?.id || room.ownerId,
    ownerName: room.host?.nickname || room.ownerName,
    players: room.players ? room.players.map(transformRoomPlayer) : [],
    createdAt: room.created_at || room.createdAt
  }
}

export const transformRoomPlayer = (player) => {
  if (!player) return null
  return {
    id: player.id,
    userId: player.user_id || player.userId,
    name: player.user?.nickname || player.name,
    avatar: player.user?.avatar || player.avatar,
    roleId: player.role_id || player.roleId,
    roleName: player.role?.name || player.roleName,
    ready: player.is_ready || player.ready || false,
    isOwner: player.is_host || player.isOwner || false
  }
}

export const transformUser = (user) => {
  if (!user) return null
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    gender: genderMap[user.gender] || user.gender,
    genderKey: user.gender,
    phone: user.phone,
    createdAt: user.created_at || user.createdAt
  }
}

export const transformMessage = (msg) => {
  if (!msg) return null
  return {
    id: msg.id,
    userId: msg.user_id || msg.userId,
    userName: msg.user?.nickname || msg.userName,
    roleName: msg.role?.name || msg.roleName,
    content: msg.content,
    type: msg.type || 'chat',
    timestamp: msg.created_at || msg.timestamp,
    isMe: msg.is_me || msg.isMe || false
  }
}

export const toBackendCategory = (chineseCategory) => {
  return reverseCategoryMap[chineseCategory] || chineseCategory
}

export const toBackendDifficulty = (chineseDifficulty) => {
  return reverseDifficultyMap[chineseDifficulty] || chineseDifficulty
}

export const toBackendGender = (chineseGender) => {
  return reverseGenderMap[chineseGender] || chineseGender
}

export const transformScriptList = (scripts) => {
  return Array.isArray(scripts) ? scripts.map(transformScript) : []
}

export const transformRoomList = (rooms) => {
  return Array.isArray(rooms) ? rooms.map(transformRoom) : []
}

export const transformMessageList = (messages) => {
  return Array.isArray(messages) ? messages.map(transformMessage) : []
}
