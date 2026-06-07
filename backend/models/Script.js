const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Script = sequelize.define('Script', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('horror', 'suspense', 'emotion', 'joy', 'hardcore'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cover_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  player_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'scripts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Script;
