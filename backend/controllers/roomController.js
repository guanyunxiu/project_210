const { Op } = require('sequelize');
const { Room, RoomPlayer, Script, User, Message, ScriptRole } = require('../models');

exports.getRoomList = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      where: { status: { [Op.ne]: 'ended' } },
      attributes: ['id', 'name', 'status', 'max_players', 'created_at'],
      include: [
        {
          model: Script,
          as: 'script',
          attributes: ['id', 'name', 'category', 'cover_image', 'player_count', 'difficulty']
        },
        {
          model: User,
          as: 'host',
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: RoomPlayer,
          as: 'players',
          attributes: ['id', 'user_id', 'is_ready', 'is_host']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const result = rooms.map(room => ({
      ...room.toJSON(),
      current_players: room.players.length
    }));

    res.success(result, '获取成功');
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { script_id, name } = req.body;
    const userId = req.user.id;

    if (!script_id) {
      return res.error('请选择剧本', 400);
    }

    const script = await Script.findByPk(script_id);
    if (!script) {
      return res.error('剧本不存在', 404);
    }

    const existingRoom = await RoomPlayer.findOne({
      where: { user_id: userId },
      include: [{
        model: Room,
        as: 'room',
        where: { status: { [Op.ne]: 'ended' } }
      }]
    });

    if (existingRoom) {
      return res.error('您已在其他房间中', 400);
    }

    const room = await Room.create({
      script_id,
      host_id: userId,
      name: name || `${req.user.nickname}的房间`,
      max_players: script.player_count,
      status: 'waiting'
    });

    await RoomPlayer.create({
      room_id: room.id,
      user_id: userId,
      is_ready: false,
      is_host: true
    });

    const roomDetail = await Room.findByPk(room.id, {
      attributes: ['id', 'name', 'status', 'max_players', 'created_at'],
      include: [
        {
          model: Script,
          as: 'script',
          attributes: ['id', 'name', 'category', 'cover_image', 'player_count', 'difficulty', 'duration']
        },
        {
          model: User,
          as: 'host',
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: RoomPlayer,
          as: 'players',
          attributes: ['id', 'is_ready', 'is_host', 'joined_at'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'nickname', 'avatar', 'gender']
          }]
        }
      ]
    });

    res.success(roomDetail, '创建成功');
  } catch (err) {
    next(err);
  }
};

exports.joinRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findByPk(id, {
      include: [
        { model: Script, as: 'script' },
        { model: RoomPlayer, as: 'players' }
      ]
    });

    if (!room) {
      return res.error('房间不存在', 404);
    }

    if (room.status !== 'waiting') {
      return res.error('房间已开始游戏', 400);
    }

    if (room.players.length >= room.max_players) {
      return res.error('房间已满', 400);
    }

    const existingPlayer = room.players.find(p => p.user_id === userId);
    if (existingPlayer) {
      return res.error('您已在该房间中', 400);
    }

    const existingRoom = await RoomPlayer.findOne({
      where: { user_id: userId },
      include: [{
        model: Room,
        as: 'room',
        where: { status: { [Op.ne]: 'ended' } }
      }]
    });

    if (existingRoom) {
      return res.error('您已在其他房间中', 400);
    }

    await RoomPlayer.create({
      room_id: id,
      user_id: userId,
      is_ready: false,
      is_host: false
    });

    await Message.create({
      room_id: id,
      user_id: userId,
      content: `${req.user.nickname} 加入了房间`,
      type: 'system'
    });

    const roomDetail = await Room.findByPk(id, {
      attributes: ['id', 'name', 'status', 'max_players', 'created_at'],
      include: [
        {
          model: Script,
          as: 'script',
          attributes: ['id', 'name', 'category', 'cover_image', 'player_count', 'difficulty', 'duration'],
          include: [{
            model: ScriptRole,
            as: 'roles',
            attributes: ['id', 'name', 'description', 'avatar', 'gender']
          }]
        },
        {
          model: User,
          as: 'host',
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: RoomPlayer,
          as: 'players',
          attributes: ['id', 'is_ready', 'is_host', 'joined_at'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar', 'gender']
            },
            {
              model: ScriptRole,
              as: 'role',
              attributes: ['id', 'name', 'avatar']
            }
          ]
        }
      ]
    });

    res.success(roomDetail, '加入成功');
  } catch (err) {
    next(err);
  }
};

exports.toggleReady = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.error('房间不存在', 404);
    }

    if (room.status !== 'waiting') {
      return res.error('房间已开始游戏', 400);
    }

    const player = await RoomPlayer.findOne({
      where: { room_id: id, user_id: userId }
    });

    if (!player) {
      return res.error('您不在该房间中', 400);
    }

    if (player.is_host) {
      return res.error('房主无需准备', 400);
    }

    const newReadyStatus = !player.is_ready;
    await player.update({ is_ready: newReadyStatus });

    await Message.create({
      room_id: id,
      user_id: userId,
      content: `${req.user.nickname} ${newReadyStatus ? '已准备' : '取消准备'}`,
      type: 'system'
    });

    res.success({ is_ready: newReadyStatus }, newReadyStatus ? '已准备' : '已取消准备');
  } catch (err) {
    next(err);
  }
};

exports.startGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findByPk(id, {
      include: [
        { model: Script, as: 'script', include: [{ model: ScriptRole, as: 'roles' }] },
        { model: RoomPlayer, as: 'players' }
      ]
    });

    if (!room) {
      return res.error('房间不存在', 404);
    }

    if (room.host_id !== userId) {
      return res.error('只有房主可以开始游戏', 403);
    }

    if (room.status !== 'waiting') {
      return res.error('房间已开始游戏', 400);
    }

    if (room.players.length < room.max_players) {
      return res.error('人数不足，无法开始游戏', 400);
    }

    const notReadyPlayers = room.players.filter(p => !p.is_host && !p.is_ready);
    if (notReadyPlayers.length > 0) {
      return res.error('还有玩家未准备', 400);
    }

    const roles = room.script.roles;
    const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

    for (let i = 0; i < room.players.length; i++) {
      await room.players[i].update({ role_id: shuffledRoles[i].id });
    }

    await room.update({ status: 'playing' });

    await Message.create({
      room_id: id,
      user_id: userId,
      content: '游戏开始！请查看自己的角色',
      type: 'system'
    });

    const roomDetail = await Room.findByPk(id, {
      attributes: ['id', 'name', 'status', 'max_players', 'created_at'],
      include: [
        {
          model: Script,
          as: 'script',
          attributes: ['id', 'name', 'category', 'cover_image', 'player_count', 'difficulty', 'duration'],
          include: [{
            model: ScriptRole,
            as: 'roles',
            attributes: ['id', 'name', 'description', 'avatar', 'gender']
          }]
        },
        {
          model: User,
          as: 'host',
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: RoomPlayer,
          as: 'players',
          attributes: ['id', 'is_ready', 'is_host', 'joined_at'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar', 'gender']
            },
            {
              model: ScriptRole,
              as: 'role',
              attributes: ['id', 'name', 'avatar']
            }
          ]
        }
      ]
    });

    res.success(roomDetail, '游戏开始');
  } catch (err) {
    next(err);
  }
};

exports.leaveRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findByPk(id, {
      include: [{ model: RoomPlayer, as: 'players' }]
    });

    if (!room) {
      return res.error('房间不存在', 404);
    }

    const player = await RoomPlayer.findOne({
      where: { room_id: id, user_id: userId }
    });

    if (!player) {
      return res.error('您不在该房间中', 400);
    }

    await player.destroy();

    await Message.create({
      room_id: id,
      user_id: userId,
      content: `${req.user.nickname} 离开了房间`,
      type: 'system'
    });

    const remainingPlayers = await RoomPlayer.count({ where: { room_id: id } });
    if (remainingPlayers === 0) {
      await room.update({ status: 'ended' });
    } else if (player.is_host) {
      const newHost = await RoomPlayer.findOne({ where: { room_id: id } });
      if (newHost) {
        await newHost.update({ is_host: true });
        await room.update({ host_id: newHost.user_id });
        await Message.create({
          room_id: id,
          user_id: newHost.user_id,
          content: `${newHost.user_id} 成为新房主`,
          type: 'system'
        });
      }
    }

    res.success(null, '已离开房间');
  } catch (err) {
    next(err);
  }
};

exports.getRoomDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findByPk(id, {
      attributes: ['id', 'name', 'status', 'max_players', 'created_at'],
      include: [
        {
          model: Script,
          as: 'script',
          attributes: ['id', 'name', 'category', 'cover_image', 'player_count', 'difficulty', 'duration'],
          include: [{
            model: ScriptRole,
            as: 'roles',
            attributes: ['id', 'name', 'description', 'avatar', 'gender']
          }]
        },
        {
          model: User,
          as: 'host',
          attributes: ['id', 'nickname', 'avatar']
        },
        {
          model: RoomPlayer,
          as: 'players',
          attributes: ['id', 'is_ready', 'is_host', 'joined_at'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar', 'gender']
            },
            {
              model: ScriptRole,
              as: 'role',
              attributes: ['id', 'name', 'avatar']
            }
          ]
        }
      ]
    });

    if (!room) {
      return res.error('房间不存在', 404);
    }

    res.success(room, '获取成功');
  } catch (err) {
    next(err);
  }
};

exports.getRoomMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.error('房间不存在', 404);
    }

    const player = await RoomPlayer.findOne({
      where: { room_id: id, user_id: userId }
    });

    if (!player) {
      return res.error('您不在该房间中', 403);
    }

    const messages = await Message.findAll({
      where: { room_id: id },
      attributes: ['id', 'content', 'type', 'created_at'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nickname', 'avatar']
      }],
      order: [['created_at', 'ASC']]
    });

    res.success(messages, '获取成功');
  } catch (err) {
    next(err);
  }
};
