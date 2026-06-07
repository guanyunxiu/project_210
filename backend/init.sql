-- 创建数据库
CREATE DATABASE IF NOT EXISTS script_kill DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE script_kill;

-- 清空已有数据
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE script_roles;
TRUNCATE TABLE scripts;
SET FOREIGN_KEY_CHECKS = 1;

-- 插入剧本数据
INSERT INTO scripts (id, name, category, description, cover_image, player_count, difficulty, duration, created_at) VALUES
(1, '午夜凶铃', 'horror', '一个关于一盘诅咒录像带的恐怖故事，看过录像带的人都会在7天后死亡。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=horror%20movie%20poster%20dark%20atmosphere&image_size=portrait_4_3', 5, 'hard', 240, NOW()),
(2, '无人生还', 'suspense', '十个陌生人被邀请到一座孤岛上，然后一个接一个地死去...', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mystery%20island%20old%20mansion%20foggy&image_size=portrait_4_3', 8, 'hard', 300, NOW()),
(3, '后来的我们', 'emotion', '关于青春、爱情和遗憾的故事。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=romantic%20couple%20sunset%20city&image_size=portrait_4_3', 6, 'easy', 180, NOW()),
(4, '欢乐斗地主', 'joy', '一场意外的斗地主比赛，却隐藏着惊天秘密。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20casino%20cards%20happy&image_size=portrait_4_3', 6, 'easy', 150, NOW()),
(5, '达芬奇密码', 'hardcore', '卢浮宫博物馆馆长被人杀害，身边留下了一连串的密码...', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mona%20lisa%20painting%20mystery%20code&image_size=portrait_4_3', 7, 'hard', 360, NOW()),
(6, '鬼吹灯', 'horror', '一群盗墓者进入了一座千年古墓，却发现了更可怕的东西...', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20tomb%20dark%20cave%20torch&image_size=portrait_4_3', 6, 'medium', 240, NOW()),
(7, '白夜行', 'suspense', '一对男女跨越多年的悬疑故事，真相在最后一刻才揭开。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=night%20city%20rain%20neon&image_size=portrait_4_3', 6, 'hard', 300, NOW()),
(8, '那些年', 'emotion', '一群高中同学的青春回忆，那些年我们一起追过的女孩。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=high%20school%20students%20sunshine%20youth&image_size=portrait_4_3', 6, 'easy', 180, NOW()),
(9, '疯狂的石头', 'joy', '一块价值连城的翡翠引发的一连串搞笑故事。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=green%20jade%20comedy%20chinese%20style&image_size=portrait_4_3', 6, 'easy', 150, NOW()),
(10, '盗梦空间', 'hardcore', '一群能够进入他人梦境窃取秘密的盗贼，这次任务是植入一个想法。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dream%20city%20bending%20 surreal&image_size=portrait_4_3', 6, 'hard', 300, NOW());

-- 插入角色数据
INSERT INTO script_roles (script_id, name, description, avatar, gender) VALUES
-- 剧本1: 午夜凶铃
(1, '浅川玲子', '女记者，调查诅咒录像带事件的真相。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20female%20reporter%20professional&image_size=square', 'female'),
(1, '高山龙司', '玲子的前夫，大学教授。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20male%20professor%20serious&image_size=square', 'male'),
(1, '山村贞子', '传说中的女鬼，拥有超能力。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ghost%20girl%20long%20hair%20white%20dress&image_size=square', 'female'),
(1, '伊熊平八郎', '贞子的父亲，精神病医生。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20japanese%20male%20doctor&image_size=square', 'male'),
(1, '浅川阳一', '玲子的儿子，也看过录像带。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20boy%20child%20scared&image_size=square', 'male'),

-- 剧本2: 无人生还
(2, '劳伦斯·沃格雷夫', '退休法官，富有正义感。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20judge%20wig%20serious&image_size=square', 'male'),
(2, '维拉·克莱索恩', '女教师，曾经当过家庭教师。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=english%20lady%20teacher%20elegant&image_size=square', 'female'),
(2, '菲利普·隆巴德', '雇佣兵，冷酷无情。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soldier%20mercenary%20tough%20guy&image_size=square', 'male'),
(2, '艾米莉·布伦特', '老处女，严格的教徒。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20maid%20strict%20woman&image_size=square', 'female'),
(2, '威廉·布洛尔', '前警察，现在做私家侦探。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=detective%20police%20man&image_size=square', 'male'),
(2, '阿姆斯特朗医生', '医生，有酗酒问题。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=doctor%20middle%20aged%20man&image_size=square', 'male'),
(2, '安东尼·马斯顿', '年轻的富二代，放荡不羁。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rich%20young%20man%20handsome&image_size=square', 'male'),
(2, '罗杰斯太太', '女仆，负责岛上的仆人。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=maid%20servant%20woman&image_size=square', 'female'),

-- 剧本3: 后来的我们
(3, '林见清', '北漂青年，有梦想的程序员。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20programmer%20casual&image_size=square', 'male'),
(3, '方小晓', '见清的女朋友，乐观开朗。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20girl%20smile&image_size=square', 'female'),
(3, '见清父亲', '传统的父亲，希望儿子稳定。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20chinese%20father%20kind&image_size=square', 'male'),
(3, '小晓闺蜜', '小晓的好朋友，性格直率。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20girl%20fashion&image_size=square', 'female'),
(3, '见清室友', '见清的大学室友。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20guy%20funny&image_size=square', 'male'),
(3, '房东大姐', '出租屋的房东。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20chinese%20woman%20landlord&image_size=square', 'female'),

-- 剧本4: 欢乐斗地主
(4, '王大锤', '普通上班族，运气极差。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20comedy%20guy%20funny%20face&image_size=square', 'male'),
(4, '小美', '大锤的女朋友，精明能干。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20pretty%20girl%20smart&image_size=square', 'female'),
(4, '老板', '公司老板，抠门小气。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20boss%20fat%20man&image_size=square', 'male'),
(4, '秘书', '老板的秘书，妖娆妩媚。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20secretary%20sexy%20lady&image_size=square', 'female'),
(4, '保安', '小区保安，热心肠。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20security%20guard%20uniform&image_size=square', 'male'),
(4, '外卖小哥', '外卖配送员，神秘人物。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20delivery%20guy%20helmet&image_size=square', 'male'),

-- 剧本5: 达芬奇密码
(5, '罗伯特·兰登', '哈佛大学宗教符号学教授。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professor%20harvard%20smart%20man&image_size=square', 'male'),
(5, '索菲·奈芙', '法国密码破译专家。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=french%20female%20police%20smart&image_size=square', 'female'),
(5, '雷·提彬', '英国皇家历史学家，圣杯追寻者。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20british%20gentleman%20scholar&image_size=square', 'male'),
(5, '塞拉斯', '白化病修道士，杀手。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=monk%20albino%20mysterious&image_size=square', 'male'),
(5, '贝祖·法希', '法国警察局局长。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=french%20police%20chief%20man&image_size=square', 'male'),
(5, '雅克·索尼埃', '卢浮宫博物馆馆长。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=museum%20curator%20old%20man&image_size=square', 'male'),
(5, '李伊', '提彬的仆人。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=butler%20servant%20man&image_size=square', 'male'),

-- 剧本6: 鬼吹灯
(6, '胡八一', '退役军人，摸金校尉。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20adventurer%20tough%20guy&image_size=square', 'male'),
(6, '王凯旋', '胡八一的发小，胖子。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20fat%20guy%20funny&image_size=square', 'male'),
(6, 'Shirley杨', '美籍华裔考古学家。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20american%20female%20archaeologist&image_size=square', 'female'),
(6, '大金牙', '古董商人，奸商。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20antique%20dealer%20old%20man&image_size=square', 'male'),
(6, '英子', '内蒙古向导。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mongolian%20girl%20guide&image_size=square', 'female'),
(6, '陈教授', '考古队教授。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20chinese%20professor%20archaeology&image_size=square', 'male'),

-- 剧本7: 白夜行
(7, '桐原亮司', '当铺老板的儿子，沉默寡言。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20young%20man%20mysterious&image_size=square', 'male'),
(7, '唐泽雪穗', '优雅美丽的女人，隐藏着秘密。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20beautiful%20woman%20elegant&image_size=square', 'female'),
(7, '笹垣润三', '追查案件的老刑警。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20japanese%20detective%20police&image_size=square', 'male'),
(7, '园村友彦', '亮司的同学。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20young%20man%20student&image_size=square', 'male'),
(7, '栗原典子', '药剂师。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20female%20pharmacist&image_size=square', 'female'),
(7, '高宫诚', '雪穗的丈夫。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20businessman%20salaryman&image_size=square', 'male'),

-- 剧本8: 那些年
(8, '柯景腾', '调皮捣蛋的学生。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=taiwanese%20high%20school%20boy%20student&image_size=square', 'male'),
(8, '沈佳宜', '品学兼优的女生。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=taiwanese%20high%20school%20girl%20good%20student&image_size=square', 'female'),
(8, '谢明和', '柯景腾的好友，喜欢沈佳宜。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=taiwanese%20boy%20student%20fat&image_size=square', 'male'),
(8, '胡家玮', '柯景腾的好友。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=taiwanese%20boy%20student%20funny&image_size=square', 'male'),
(8, '廖英宏', '柯景腾的好友。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=taiwanese%20boy%20student%20tall&image_size=square', 'male'),
(8, '李小华', '沈佳宜的闺蜜。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=taiwanese%20high%20school%20girl%20cute&image_size=square', 'female'),

-- 剧本9: 疯狂的石头
(9, '包世宏', '工艺品厂保卫科长。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20security%20chief%20middle%20aged&image_size=square', 'male'),
(9, '道哥', '小偷三人组老大。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20thief%20leader%20funny&image_size=square', 'male'),
(9, '黑皮', '小偷三人组成员，愣头青。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20young%20thief%20stupid%20guy&image_size=square', 'male'),
(9, '小军', '小偷三人组成员，技术宅。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20young%20thief%20skinny%20guy&image_size=square', 'male'),
(9, '谢小盟', '厂长的儿子，花花公子。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20playboy%20rich%20kid&image_size=square', 'male'),
(9, '菁菁', '道哥的女朋友。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20girl%20pretty%20fashion&image_size=square', 'female'),

-- 剧本10: 盗梦空间
(10, '柯布', '盗梦者，经验丰富。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=leonardo%20dicaprio%20man%20serious&image_size=square', 'male'),
(10, '阿里阿德涅', '筑梦师，年轻的天才建筑师。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20female%20architect%20creative&image_size=square', 'female'),
(10, '亚瑟', '前哨者，负责研究目标人物。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=british%20gentleman%20smart%20man&image_size=square', 'male'),
(10, '伊姆斯', '伪装者，可以伪装成任何人。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=actor%20man%20charming&image_size=square', 'male'),
(10, '优素福', '药剂师，负责配制镇静剂。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=indian%20pharmacist%20chemist&image_size=square', 'male'),
(10, '斋藤', '日本商人，任务委托人。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20businessman%20rich&image_size=square', 'male');

-- 剧本11: 情书（2人剧本）
INSERT INTO scripts (id, name, category, description, cover_image, player_count, difficulty, duration, created_at) VALUES
(11, '情书', 'emotion', '一张跨越时空的情书，连接了两个陌生人的命运。在这个快节奏的时代，你们能否找到属于自己的真爱？', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=love%20letter%20romantic%20vintage&image_size=portrait_4_3', 2, 'easy', 120, NOW());

-- 剧本11的角色
INSERT INTO script_roles (script_id, name, description, avatar, gender) VALUES
(11, '陈默', '性格内向的书店店员，喜欢阅读和写作。某天收到了一封神秘的情书。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shy%20young%20man%20bookstore%20gentle&image_size=square', 'male'),
(11, '林小雨', '活泼开朗的插画师，对生活充满热情。她一直在寻找那个能听懂她心声的人。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cheerful%20young%20girl%20artist%20smile&image_size=square', 'female');
