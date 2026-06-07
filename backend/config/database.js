const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('script_kill', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
  logging: false,
  timezone: '+08:00'
});

module.exports = sequelize;
