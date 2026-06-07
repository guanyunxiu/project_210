const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: '',
  db: 0
});

redis.on('connect', () => {
  console.log('Redis 连接成功');
});

redis.on('error', (err) => {
  console.error('Redis 连接失败:', err.message);
});

module.exports = redis;
