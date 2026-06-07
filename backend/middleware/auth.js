const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.error('未提供认证令牌', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'nickname', 'avatar', 'gender']
    });

    if (!user) {
      return res.error('用户不存在', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.error('令牌已过期', 401);
    }
    return res.error('无效的认证令牌', 401);
  }
};
