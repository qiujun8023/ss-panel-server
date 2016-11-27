const translate = require('../../lib/translate');

require('moder')(__dirname, {
  naming: 'pascal',
  lazy: false,
  exports,
  filter: translate.isTest,
});

exports.User.sync();
exports.Birth.sync();
exports.Setting.sync();
exports.Remind.sync();
exports.Log.sync();

// 用户与生日的关系
exports.User.hasMany(exports.Birth, {
  foreignKey: 'user_id',
  constraints: false,
});
exports.Birth.belongsTo(exports.User, {
  foreignKey: 'user_id',
  constraints: false,
});

// 生日与设置的关系
exports.Birth.hasMany(exports.Setting, {
  foreignKey: 'birth_id',
  constraints: false,
});
exports.Setting.belongsTo(exports.Birth, {
  foreignKey: 'birth_id',
  constraints: false,
});

// 设置与提醒的关系
exports.Setting.hasMany(exports.Remind, {
  foreignKey: 'setting_id',
  constraints: false,
});
exports.Remind.belongsTo(exports.Setting, {
  foreignKey: 'setting_id',
  constraints: false,
});

// 用户与日志的关系
exports.User.hasMany(exports.Log, {
  foreignKey: 'user_id',
  constraints: false,
});
exports.Log.belongsTo(exports.User, {
  foreignKey: 'user_id',
  constraints: false,
});
