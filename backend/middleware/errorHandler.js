module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return res.error(errors.join(', '), 400);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.error('数据已存在', 400);
  }

  if (err.name === 'JsonWebTokenError') {
    return res.error('无效的认证令牌', 401);
  }

  res.error(err.message || '服务器内部错误', err.status || 500);
};
