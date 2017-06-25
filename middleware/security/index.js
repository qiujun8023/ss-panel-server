const translate = require('../../lib/translate')

require('moder')(__dirname, {
  naming: 'camel',
  lazy: false,
  exports,
  filter: translate.isTest
})
