const { Script, ScriptRole } = require('../models');

const categoryMap = {
  'horror': 'horror',
  'suspense': 'suspense',
  'emotion': 'emotion',
  'joy': 'joy',
  'hardcore': 'hardcore',
  '恐怖': 'horror',
  '悬疑': 'suspense',
  '情感': 'emotion',
  '欢乐': 'joy',
  '硬核': 'hardcore'
};

exports.getScriptList = async (req, res, next) => {
  try {
    const scripts = await Script.findAll({
      attributes: ['id', 'name', 'category', 'description', 'cover_image', 'player_count', 'difficulty', 'duration'],
      order: [['created_at', 'DESC']]
    });

    res.success(scripts, '获取成功');
  } catch (err) {
    next(err);
  }
};

exports.getScriptDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const script = await Script.findByPk(id, {
      attributes: ['id', 'name', 'category', 'description', 'cover_image', 'player_count', 'difficulty', 'duration'],
      include: [{
        model: ScriptRole,
        as: 'roles',
        attributes: ['id', 'name', 'description', 'avatar', 'gender']
      }]
    });

    if (!script) {
      return res.error('剧本不存在', 404);
    }

    res.success(script, '获取成功');
  } catch (err) {
    next(err);
  }
};

exports.getScriptsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const mappedCategory = categoryMap[category] || category;

    const validCategories = ['horror', 'suspense', 'emotion', 'joy', 'hardcore'];
    if (!validCategories.includes(mappedCategory)) {
      return res.error('无效的分类', 400);
    }

    const scripts = await Script.findAll({
      where: { category: mappedCategory },
      attributes: ['id', 'name', 'category', 'description', 'cover_image', 'player_count', 'difficulty', 'duration'],
      order: [['created_at', 'DESC']]
    });

    res.success(scripts, '获取成功');
  } catch (err) {
    next(err);
  }
};
