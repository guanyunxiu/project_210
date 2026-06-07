const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

exports.register = async (req, res, next) => {
  try {
    const { username, password, nickname } = req.body;

    if (!username || !password) {
      return res.error('用户名和密码不能为空', 400);
    }

    if (password.length < 6) {
      return res.error('密码长度不能少于6位', 400);
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.error('用户名已存在', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      nickname: nickname || username
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.success({
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender
      }
    }, '注册成功');
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.error('用户名和密码不能为空', 400);
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.error('用户名或密码错误', 400);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.error('用户名或密码错误', 400);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.success({
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender
      }
    }, '登录成功');
  } catch (err) {
    next(err);
  }
};
