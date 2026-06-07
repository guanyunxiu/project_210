export const mockScripts = [
  {
    id: 1,
    name: '惊魂旅馆',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=horror%20hotel%20mystery%20thriller%20dark%20atmosphere&image_size=square',
    category: '恐怖',
    players: 6,
    difficulty: '中等',
    duration: 240,
    description: '在一个偏僻的旅馆中，一场离奇的命案打破了宁静。你们作为住客，需要找出隐藏在人群中的凶手。',
    roles: [
      { id: 1, name: '旅馆老板', gender: '男', description: '经营这家旅馆已有十年' },
      { id: 2, name: '神秘女子', gender: '女', description: '刚入住的神秘客人' },
      { id: 3, name: '退休警察', gender: '男', description: '有着敏锐的洞察力' },
      { id: 4, name: '年轻作家', gender: '女', description: '来这里寻找创作灵感' },
      { id: 5, name: '商人', gender: '男', description: '看起来很有钱' },
      { id: 6, name: '服务员', gender: '女', description: '在旅馆工作了三年' }
    ]
  },
  {
    id: 2,
    name: '迷雾山庄',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mysterious%20mansion%20foggy%20suspense%20detective&image_size=square',
    category: '悬疑',
    players: 5,
    difficulty: '困难',
    duration: 300,
    description: '一座被迷雾笼罩的山庄，主人邀请了五位客人。晚宴上，一声尖叫划破夜空...',
    roles: [
      { id: 1, name: '庄园主', gender: '男', description: '山庄的主人' },
      { id: 2, name: '律师', gender: '女', description: '处理遗产事宜' },
      { id: 3, name: '医生', gender: '男', description: '家庭医生' },
      { id: 4, name: '秘书', gender: '女', description: '庄园主的私人秘书' },
      { id: 5, name: '远亲', gender: '男', description: '多年未见的亲戚' }
    ]
  },
  {
    id: 3,
    name: '樱花树下的约定',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cherry%20blossom%20romantic%20emotional%20love%20story&image_size=square',
    category: '情感',
    players: 6,
    difficulty: '简单',
    duration: 180,
    description: '多年前，樱花树下的约定。多年后，再次相聚，物是人非，感情是否还能延续？',
    roles: [
      { id: 1, name: '林晓', gender: '女', description: '温柔善良的女孩' },
      { id: 2, name: '陈阳', gender: '男', description: '阳光开朗的男孩' },
      { id: 3, name: '苏婉', gender: '女', description: '林晓的闺蜜' },
      { id: 4, name: '李浩', gender: '男', description: '陈阳的兄弟' },
      { id: 5, name: '雨桐', gender: '女', description: '默默喜欢陈阳' },
      { id: 6, name: '子轩', gender: '男', description: '林晓的青梅竹马' }
    ]
  },
  {
    id: 4,
    name: '疯狂马戏团',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=circus%20colorful%20funny%20comedy%20clowns&image_size=square',
    category: '欢乐',
    players: 7,
    difficulty: '简单',
    duration: 150,
    description: '马戏团的表演即将开始，但是团长却不见了。一场充满欢笑的推理冒险开始了！',
    roles: [
      { id: 1, name: '小丑', gender: '男', description: '马戏团的搞笑担当' },
      { id: 2, name: '魔术师', gender: '男', description: '神秘的魔术师' },
      { id: 3, name: '杂技演员', gender: '女', description: '身手矫健' },
      { id: 4, name: '驯兽师', gender: '男', description: '动物们的好朋友' },
      { id: 5, name: '舞者', gender: '女', description: '优雅的舞者' },
      { id: 6, name: '道具师', gender: '男', description: '心灵手巧' },
      { id: 7, name: '主持人', gender: '女', description: '能说会道' }
    ]
  },
  {
    id: 5,
    name: '量子迷局',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20physics%20sci-fi%20mystery%20complex%20brain%20teaser&image_size=square',
    category: '硬核',
    players: 4,
    difficulty: '地狱',
    duration: 360,
    description: '量子实验室中，时空发生了错乱。你们需要在多重时间线中找出真相，修复被打乱的时空。',
    roles: [
      { id: 1, name: '物理学家', gender: '男', description: '量子力学专家' },
      { id: 2, name: 'AI研究员', gender: '女', description: '人工智能专家' },
      { id: 3, name: '时空警察', gender: '男', description: '来自未来' },
      { id: 4, name: '数学家', gender: '女', description: '逻辑天才' }
    ]
  },
  {
    id: 6,
    name: '古宅魅影',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20house%20ghost%20horror%20mystery%20dark&image_size=square',
    category: '恐怖',
    players: 6,
    difficulty: '困难',
    duration: 270,
    description: '传说中的古宅，每到月圆之夜就会传出诡异的声音。你们决定一探究竟...',
    roles: [
      { id: 1, name: '探险家', gender: '男', description: '勇敢无畏' },
      { id: 2, name: '灵媒', gender: '女', description: '能与亡灵沟通' },
      { id: 3, name: '历史学家', gender: '男', description: '研究古宅历史' },
      { id: 4, name: '摄影师', gender: '女', description: '来拍摄灵异照片' },
      { id: 5, name: '道士', gender: '男', description: '精通玄学' },
      { id: 6, name: '医生', gender: '女', description: '随行医护' }
    ]
  }
]

export const mockRooms = [
  {
    id: 1,
    name: '新手友好局',
    scriptId: 3,
    scriptName: '樱花树下的约定',
    status: 'waiting',
    ownerId: 1,
    ownerName: '小明',
    players: [
      { id: 1, name: '小明', avatar: '', roleId: 1, roleName: '林晓', ready: true, isOwner: true },
      { id: 2, name: '小红', avatar: '', roleId: 2, roleName: '陈阳', ready: true, isOwner: false },
      { id: 3, name: '小刚', avatar: '', roleId: null, roleName: null, ready: false, isOwner: false }
    ],
    maxPlayers: 6,
    currentPlayers: 3,
    createdAt: '2024-01-15 10:30'
  },
  {
    id: 2,
    name: '高玩推理局',
    scriptId: 2,
    scriptName: '迷雾山庄',
    status: 'waiting',
    ownerId: 4,
    ownerName: '侦探王',
    players: [
      { id: 4, name: '侦探王', avatar: '', roleId: 1, roleName: '庄园主', ready: true, isOwner: true },
      { id: 5, name: '福尔摩斯', avatar: '', roleId: 2, roleName: '律师', ready: true, isOwner: false }
    ],
    maxPlayers: 5,
    currentPlayers: 2,
    createdAt: '2024-01-15 11:00'
  },
  {
    id: 3,
    name: '欢乐撕逼局',
    scriptId: 4,
    scriptName: '疯狂马戏团',
    status: 'waiting',
    ownerId: 6,
    ownerName: '快乐玩家',
    players: [
      { id: 6, name: '快乐玩家', avatar: '', roleId: 1, roleName: '小丑', ready: true, isOwner: true }
    ],
    maxPlayers: 7,
    currentPlayers: 1,
    createdAt: '2024-01-15 11:30'
  }
]

export const mockMessages = [
  { id: 1, userId: 1, userName: '小明', roleName: '林晓', content: '大家好，我是林晓', timestamp: '14:30:00', isMe: false },
  { id: 2, userId: 2, userName: '小红', roleName: '陈阳', content: '你好呀，我是陈阳', timestamp: '14:30:10', isMe: true },
  { id: 3, userId: 1, userName: '小明', roleName: '林晓', content: '你还记得我们小时候的约定吗？', timestamp: '14:30:25', isMe: false },
  { id: 4, userId: 2, userName: '小红', roleName: '陈阳', content: '当然记得，在樱花树下...', timestamp: '14:30:40', isMe: true },
  { id: 5, userId: 3, userName: '小刚', roleName: '李浩', content: '你们在说什么呢？我也想听听', timestamp: '14:31:00', isMe: false }
]

export const mockUser = {
  id: 1,
  username: 'testuser',
  nickname: '快乐玩家',
  avatar: '',
  gender: '男',
  phone: '13800138000',
  createdAt: '2024-01-01'
}
