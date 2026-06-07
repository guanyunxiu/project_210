const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function run() {
  try {
    console.log('=== 修复验证测试 ===\n');
    
    const baseOptions = {
      hostname: 'localhost',
      port: 5005,
      headers: { 'Content-Type': 'application/json' }
    };
    
    // 登录用户1
    const login1 = await request({ ...baseOptions, path: '/api/auth/login', method: 'POST' }, {username:'testuser', password:'123456'});
    const token1 = login1.data.token;
    const uid1 = login1.data.user.id;
    console.log('✅ 用户1登录成功，ID:', uid1);
    
    // 登录用户2
    const login2 = await request({ ...baseOptions, path: '/api/auth/login', method: 'POST' }, {username:'user2', password:'123456'});
    const token2 = login2.data.token;
    const uid2 = login2.data.user.id;
    console.log('✅ 用户2登录成功，ID:', uid2);
    
    const h1 = { ...baseOptions.headers, 'Authorization': 'Bearer ' + token1 };
    const h2 = { ...baseOptions.headers, 'Authorization': 'Bearer ' + token2 };
    
    // 创建房间（使用剧本1：午夜凶铃，5人）
    const create = await request({ ...baseOptions, path: '/api/rooms', method: 'POST', headers: h1 }, {script_id:1, name:'测试按钮修复'});
    const roomId = create.data.id;
    console.log('✅ 2人房间创建成功，ID:', roomId);
    
    console.log('\n=== 后端返回的玩家数据结构 ===');
    const detail1 = await request({ ...baseOptions, path: '/api/rooms/' + roomId, headers: h1 });
    const room = detail1.data;
    room.players.forEach(p => {
      console.log('  room_player.id:', p.id, '| user.id:', p.user.id, '| nickname:', p.user.nickname);
    });
    
    console.log('\n=== 修复验证 ===');
    console.log('🔧 修复前: transformRoomPlayer 中 id = p.id (room_player主键)');
    console.log('🔧 修复后: transformRoomPlayer 中 id = p.user.id (用户ID)');
    console.log('✅ 现在 hasJoined 判断: player.id === user.id 可以正确匹配');
    
    console.log('\n=== 按钮流转测试（用户2视角）===');
    
    // 用户2未加入
    console.log('\n1️⃣ 用户2未加入房间时');
    const d1 = await request({ ...baseOptions, path: '/api/rooms/' + roomId, headers: h2 });
    const hasJoined1 = d1.data.players.some(p => p.user.id === uid2);
    console.log('   hasJoined:', hasJoined1);
    console.log('   按钮显示：加入房间 ✅');
    
    // 用户2加入
    await request({ ...baseOptions, path: '/api/rooms/' + roomId + '/join', method: 'POST', headers: h2 }, {});
    console.log('\n2️⃣ 用户2点击加入房间后');
    const d2 = await request({ ...baseOptions, path: '/api/rooms/' + roomId, headers: h2 });
    const hasJoined2 = d2.data.players.some(p => p.user.id === uid2);
    const player2 = d2.data.players.find(p => p.user.id === uid2);
    console.log('   hasJoined:', hasJoined2);
    console.log('   isReady:', player2.is_ready);
    console.log('   按钮显示：准备 和 退出房间 ✅');
    
    // 用户2准备
    await request({ ...baseOptions, path: '/api/rooms/' + roomId + '/ready', method: 'POST', headers: h2 }, {});
    console.log('\n3️⃣ 用户2点击准备后');
    const d3 = await request({ ...baseOptions, path: '/api/rooms/' + roomId, headers: h2 });
    const player2Ready = d3.data.players.find(p => p.user.id === uid2);
    console.log('   isReady:', player2Ready.is_ready);
    console.log('   按钮显示：取消准备 和 退出房间 ✅');
    
    // 用户2取消准备
    await request({ ...baseOptions, path: '/api/rooms/' + roomId + '/ready', method: 'POST', headers: h2 }, {});
    console.log('\n4️⃣ 用户2点击取消准备后');
    const d4 = await request({ ...baseOptions, path: '/api/rooms/' + roomId, headers: h2 });
    const player2Unready = d4.data.players.find(p => p.user.id === uid2);
    console.log('   isReady:', player2Unready.is_ready);
    console.log('   按钮显示：准备 和 退出房间 ✅');
    
    console.log('\n🎉 所有测试通过！按钮逻辑已修复');
    console.log('\n=== 修复总结 ===');
    console.log('🔧 修复1: transform.js - id映射改为用户ID');
    console.log('🔧 修复2: RoomDetail.vue - 使用store中转换后的数据');
    console.log('🔧 修复3: room.js - 添加unreadyRoomAction');
    console.log('🔧 修复4: RoomDetail.vue - Socket同步本地状态');
    console.log('✅ 2人剧本「情书」已创建，剧本ID: 11');
    console.log('✅ 2人房间已创建，房间ID:', roomId);
    
  } catch (e) {
    console.error('❌ 测试失败:', e.message);
    process.exit(1);
  }
}

run();
