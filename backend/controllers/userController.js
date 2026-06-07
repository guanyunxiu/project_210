const { User } = require('../models');

exports.getProfile = async (req, res, next) => {
  try {
    res.success(req.user, '获取成功');
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { nickname, avatar, gender } = req.body;

    const updateData = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (gender !== undefined) updateData.gender = gender;

    await User.update(updateData, { where: { id: req.user.id } });
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'nickname', 'avatar', 'gender']
    });

    res.success(updatedUser, '更新成功');
  } catch (err) {
    next(err);
  }
};
