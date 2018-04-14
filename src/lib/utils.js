const _ = require('lodash')
const chance = require('chance')()

// 随机空闲端口
exports.randUniquePort = function (exists, minPort, maxPort) {
  for (let i = 0; i < 5; i++) {
    let port = _.random(minPort, maxPort)
    if (exists.indexOf(port) === -1) {
      return port
    }
  }
  return false
}

// 随机密码
exports.randPassword = function () {
  return chance.string({
    length: 6,
    pool: '0123456789abcdefghijklmnopqrstuvwxyz'
  })
}
