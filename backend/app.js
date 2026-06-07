const express = require('express');
const http = require('http');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const { PORT, FRONTEND_ORIGIN } = require('./config');
const { sequelize } = require('./models');
require('./config/redis');
const responseMiddleware = require('./middleware/response');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const scriptRoutes = require('./routes/script');
const roomRoutes = require('./routes/room');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST']
  }
});

require('./socket')(io);

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(responseMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/api/health', (req, res) => {
  res.success({ status: 'ok' }, '服务正常');
});

app.use(errorHandler);

const initDatabase = async () => {
  try {
    console.log('正在连接 MySQL...');
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: ''
    });

    console.log('MySQL 连接成功，正在创建数据库...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS script_kill DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    await connection.end();

    console.log('正在同步数据库表结构...');
    await sequelize.authenticate();
    console.log('数据库连接成功');

    await sequelize.sync({ alter: true });
    console.log('数据库表同步完成');

    console.log('正在初始化剧本数据...');
    const initSqlPath = path.join(__dirname, 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    const dbConnection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'script_kill',
      multipleStatements: true
    });

    await dbConnection.query(initSql);
    await dbConnection.end();
    console.log('剧本数据初始化完成');
  } catch (err) {
    console.error('数据库初始化失败:', err.message);
    console.log('如果 MySQL 未启动或配置不同，请手动执行 init.sql');
  }
};

const startServer = async () => {
  await initDatabase();

  server.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 剧本杀组队平台后端服务已启动`);
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`🌐 前端地址: ${FRONTEND_ORIGIN}`);
    console.log(`📡 Socket.IO 已启用`);
    console.log(`========================================\n`);
  });
};

startServer();
