const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GameRecord = sequelize.define('GameRecord', {
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
  script_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'scripts',
      key: 'id'
    }
  },
  winner: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'game_records',
  timestamps: false
});

module.exports = GameRecord;
