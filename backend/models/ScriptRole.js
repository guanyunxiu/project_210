const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScriptRole = sequelize.define('ScriptRole', {
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
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'neutral'),
    allowNull: false
  }
}, {
  tableName: 'script_roles',
  timestamps: false
});

module.exports = ScriptRole;
