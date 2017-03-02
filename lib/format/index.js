const translate = require('../translate');

require('moder')(__dirname, {
  naming: 'camel',
  lazy: false,
  exports,
  filter: translate.isTest,
});
