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
