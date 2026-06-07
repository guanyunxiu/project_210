const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  script_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'scripts',
      key: 'id'
    }
  },
  host_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('waiting', 'playing', 'ended'),
    defaultValue: 'waiting'
  },
  max_players: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'rooms',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Room;
