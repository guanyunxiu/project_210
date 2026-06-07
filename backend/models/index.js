const sequelize = require('../config/database');
const User = require('./User');
const Script = require('./Script');
const ScriptRole = require('./ScriptRole');
const Room = require('./Room');
const RoomPlayer = require('./RoomPlayer');
const Message = require('./Message');
const GameRecord = require('./GameRecord');

Script.hasMany(ScriptRole, { foreignKey: 'script_id', as: 'roles' });
ScriptRole.belongsTo(Script, { foreignKey: 'script_id', as: 'script' });

Room.belongsTo(Script, { foreignKey: 'script_id', as: 'script' });
Room.belongsTo(User, { foreignKey: 'host_id', as: 'host' });
Room.hasMany(RoomPlayer, { foreignKey: 'room_id', as: 'players' });
Room.hasMany(Message, { foreignKey: 'room_id', as: 'messages' });

RoomPlayer.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
RoomPlayer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
RoomPlayer.belongsTo(ScriptRole, { foreignKey: 'role_id', as: 'role' });

Message.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
Message.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

GameRecord.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
GameRecord.belongsTo(Script, { foreignKey: 'script_id', as: 'script' });

module.exports = {
  sequelize,
  User,
  Script,
  ScriptRole,
  Room,
  RoomPlayer,
  Message,
  GameRecord
};
