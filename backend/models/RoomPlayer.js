const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomPlayer = sequelize.define('RoomPlayer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'script_roles',
      key: 'id'
    }
  },
  is_ready: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_host: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'room_players',
  timestamps: false
});

module.exports = RoomPlayer;
