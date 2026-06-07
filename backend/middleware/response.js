module.exports = (req, res, next) => {
  res.success = (data = null, message = 'success') => {
    res.json({
      code: 0,
      message,
      data
    });
  };

  res.error = (message = 'error', code = 1, data = null) => {
    res.json({
      code,
      message,
      data
    });
  };

  next();
};
