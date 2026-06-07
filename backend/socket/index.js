const jwt = require('jsonwebtoken');
const { JWT_SECRET, FRONTEND_ORIGIN } = require('../config');
const { User, Message, Room, RoomPlayer } = require('../models');

const userSocketMap = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
          attributes: ['id', 'nickname', 'avatar']
        });

        if (!user) {
          socket.emit('error', { message: '用户不存在' });
          return;
        }

        socket.user = user;
        userSocketMap.set(user.id, socket.id);
        socket.emit('authenticated', { user });
        console.log(`User ${user.nickname} authenticated with socket ${socket.id}`);
      } catch (err) {
        socket.emit('error', { message: '无效的认证令牌' });
      }
    });

    socket.on('joinRoom', async ({ roomId }) => {
      try {
        if (!socket.user) {
          socket.emit('error', { message: '请先认证' });
          return;
        }

        const room = await Room.findByPk(roomId, {
          include: [
            {
              model: RoomPlayer,
              as: 'players',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'nickname', 'avatar']
                }
              ]
            }
          ]
        });

        if (!room) {
          socket.emit('error', { message: '房间不存在' });
          return;
        }

        const player = room.players.find(p => p.user_id === socket.user.id);
        if (!player) {
          socket.emit('error', { message: '您不在该房间中' });
          return;
        }

        socket.join(`room:${roomId}`);
        socket.currentRoomId = roomId;

        io.to(`room:${roomId}`).emit('playerJoined', {
          user: socket.user,
          players: room.players
        });

        console.log(`User ${socket.user.nickname} joined room ${roomId}`);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('leaveRoom', async ({ roomId }) => {
      try {
        if (!socket.user) return;

        socket.leave(`room:${roomId}`);

        io.to(`room:${roomId}`).emit('playerLeft', {
          userId: socket.user.id,
          user: socket.user
        });

        if (socket.currentRoomId === roomId) {
          socket.currentRoomId = null;
        }

        console.log(`User ${socket.user.nickname} left room ${roomId}`);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('sendMessage', async ({ roomId, content }) => {
      try {
        if (!socket.user) {
          socket.emit('error', { message: '请先认证' });
          return;
        }

        if (!content || !content.trim()) {
          socket.emit('error', { message: '消息内容不能为空' });
          return;
        }

        const player = await RoomPlayer.findOne({
          where: { room_id: roomId, user_id: socket.user.id }
        });

        if (!player) {
          socket.emit('error', { message: '您不在该房间中' });
          return;
        }

        const message = await Message.create({
          room_id: roomId,
          user_id: socket.user.id,
          content: content.trim(),
          type: 'chat'
        });

        const messageWithUser = {
          id: message.id,
          content: message.content,
          type: message.type,
          created_at: message.created_at,
          user: {
            id: socket.user.id,
            nickname: socket.user.nickname,
            avatar: socket.user.avatar
          }
        };

        io.to(`room:${roomId}`).emit('newMessage', messageWithUser);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('playerReady', async ({ roomId, isReady }) => {
      try {
        if (!socket.user) return;

        const player = await RoomPlayer.findOne({
          where: { room_id: roomId, user_id: socket.user.id }
        });

        if (!player) return;

        await player.update({ is_ready: isReady });

        io.to(`room:${roomId}`).emit('playerReadyChanged', {
          userId: socket.user.id,
          is_ready: isReady,
          user: socket.user
        });

        const systemMessage = await Message.create({
          room_id: roomId,
          user_id: socket.user.id,
          content: `${socket.user.nickname} ${isReady ? '已准备' : '取消准备'}`,
          type: 'system'
        });

        io.to(`room:${roomId}`).emit('newMessage', {
          id: systemMessage.id,
          content: systemMessage.content,
          type: systemMessage.type,
          created_at: systemMessage.created_at,
          user: {
            id: socket.user.id,
            nickname: socket.user.nickname,
            avatar: socket.user.avatar
          }
        });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('startGame', async ({ roomId }) => {
      try {
        if (!socket.user) return;

        const room = await Room.findByPk(roomId);
        if (!room || room.host_id !== socket.user.id) return;

        await room.update({ status: 'playing' });

        io.to(`room:${roomId}`).emit('gameStarted', {
          roomId,
          status: 'playing'
        });

        const systemMessage = await Message.create({
          room_id: roomId,
          user_id: socket.user.id,
          content: '游戏开始！',
          type: 'system'
        });

        io.to(`room:${roomId}`).emit('newMessage', {
          id: systemMessage.id,
          content: systemMessage.content,
          type: systemMessage.type,
          created_at: systemMessage.created_at,
          user: {
            id: socket.user.id,
            nickname: socket.user.nickname,
            avatar: socket.user.avatar
          }
        });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('gameEnd', async ({ roomId, winner }) => {
      try {
        if (!socket.user) return;

        const room = await Room.findByPk(roomId);
        if (!room || room.host_id !== socket.user.id) return;

        await room.update({ status: 'ended' });

        io.to(`room:${roomId}`).emit('gameEnded', {
          roomId,
          status: 'ended',
          winner: winner || '未指定'
        });

        const systemMessage = await Message.create({
          room_id: roomId,
          user_id: socket.user.id,
          content: `游戏结束！获胜者：${winner || '未指定'}`,
          type: 'system'
        });

        io.to(`room:${roomId}`).emit('newMessage', {
          id: systemMessage.id,
          content: systemMessage.content,
          type: systemMessage.type,
          created_at: systemMessage.created_at,
          user: {
            id: socket.user.id,
            nickname: socket.user.nickname,
            avatar: socket.user.avatar
          }
        });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      if (socket.user) {
        userSocketMap.delete(socket.user.id);
        console.log(`User ${socket.user.nickname} disconnected`);

        if (socket.currentRoomId) {
          io.to(`room:${socket.currentRoomId}`).emit('playerDisconnected', {
            userId: socket.user.id,
            user: socket.user
          });
        }
      }
      console.log('Socket disconnected:', socket.id);
    });
  });
};
