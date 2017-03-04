const translate = require('../../lib/translate');

require('moder')(__dirname, {
  naming: 'pascal',
  lazy: false,
  exports,
  filter: translate.isTest,
});

exports.User.sync();
exports.Node.sync();
exports.Offer.sync();
