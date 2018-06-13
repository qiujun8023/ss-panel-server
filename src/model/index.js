const definition = require('./definition')
const migrate = require('./migrate')
const init = require('./init')

module.exports = {
  init,
  migrate,
  ...definition
}
