const translate = require('../../lib/translate');

require('moder')(__dirname, {
  naming: 'pascal',
  lazy: false,
  exports,
  filter: translate.isTest,
});

exports.Time.sync();
exports.Speed.sync();
exports.FlowRemind.sync();
