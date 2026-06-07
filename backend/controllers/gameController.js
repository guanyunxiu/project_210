const { Room, RoomPlayer, Message, GameRecord, User, ScriptRole, Script } = require('../models');
const redis = require('../config/redis');

exports.getMyRole = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;

    const player = await RoomPlayer.findOne({
      where: { room_id: roomId, user_id: userId },
      include: [{
        model: ScriptRole,
        as: 'role',
        attributes: ['id', 'name', 'description', 'avatar', 'gender']
      }]
    });

    if (!player) {
      return res.error('您不在该房间中', 400);
    }

    if (!player.role_id) {
      return res.error('游戏尚未开始', 400);
    }

    res.success(player.role, '获取成功');
  } catch (err) {
    next(err);
  }
};

exports.sendVote = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const { target_role_id } = req.body;
    const userId = req.user.id;

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.error('房间不存在', 404);
    }

    if (room.status !== 'playing') {
      return res.error('游戏未开始或已结束', 400);
    }

    const player = await RoomPlayer.findOne({
      where: { room_id: roomId, user_id: userId }
    });

    if (!player) {
      return res.error('您不在该房间中', 400);
    }

    if (!target_role_id) {
      return res.error('请选择投票对象', 400);
    }

    const voteKey = `vote:${roomId}:${userId}`;
    await redis.set(voteKey, target_role_id, 'EX', 3600);

    const allPlayers = await RoomPlayer.findAll({
      where: { room_id: roomId }
    });

    const votes = [];
    for (const p of allPlayers) {
      const vote = await redis.get(`vote:${roomId}:${p.user_id}`);
      if (vote) {
        votes.push({ voter_id: p.user_id, target_role_id: vote });
      }
    }

    const voteCount = {};
    votes.forEach(v => {
      voteCount[v.target_role_id] = (voteCount[v.target_role_id] || 0) + 1;
    });

    await Message.create({
      room_id: roomId,
      user_id: userId,
      content: `${req.user.nickname} 进行了投票`,
      type: 'vote'
    });

    res.success({
      my_vote: target_role_id,
      total_votes: votes.length,
      vote_count: voteCount
    }, '投票成功');
  } catch (err) {
    next(err);
  }
};

exports.getVotes = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.error('房间不存在', 404);
    }

    const player = await RoomPlayer.findOne({
      where: { room_id: roomId, user_id: userId }
    });

    if (!player) {
      return res.error('您不在该房间中', 400);
    }

    const allPlayers = await RoomPlayer.findAll({
      where: { room_id: roomId }
    });

    const votes = [];
    for (const p of allPlayers) {
      const vote = await redis.get(`vote:${roomId}:${p.user_id}`);
      if (vote) {
        const user = await User.findByPk(p.user_id, { attributes: ['id', 'nickname', 'avatar'] });
        votes.push({ voter: user, target_role_id: vote });
      }
    }

    const voteCount = {};
    votes.forEach(v => {
      voteCount[v.target_role_id] = (voteCount[v.target_role_id] || 0) + 1;
    });

    res.success({
      votes,
      total_count: votes.length,
      vote_count: voteCount
    }, '获取成功');
  } catch (err) {
    next(err);
  }
};

exports.endGame = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const { winner } = req.body;
    const userId = req.user.id;

    const room = await Room.findByPk(roomId, {
      include: [
        { model: Script, as: 'script' },
        { model: RoomPlayer, as: 'players' }
      ]
    });

    if (!room) {
      return res.error('房间不存在', 404);
    }

    if (room.host_id !== userId) {
      return res.error('只有房主可以结束游戏', 403);
    }

    if (room.status !== 'playing') {
      return res.error('游戏未开始', 400);
    }

    await room.update({ status: 'ended' });

    await GameRecord.create({
      room_id: roomId,
      script_id: room.script_id,
      winner: winner || '未指定',
      end_time: new Date()
    });

    const players = await RoomPlayer.findAll({
      where: { room_id: roomId }
    });
    for (const player of players) {
      await redis.del(`vote:${roomId}:${player.user_id}`);
    }

    await Message.create({
      room_id: roomId,
      user_id: userId,
      content: `游戏结束！获胜者：${winner || '未指定'}`,
      type: 'system'
    });

    res.success({
      room_id: roomId,
      winner: winner || '未指定',
      end_time: new Date()
    }, '游戏已结束');
  } catch (err) {
    next(err);
  }
};
