const pino = require('pino')
const config = require('config')

let env = config.get('env')
module.exports = pino({
  prettyPrint: true,
  level: env === 'test' ? 'warn' : 'info'
})
