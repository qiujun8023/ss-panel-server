const _ = require('lodash')
const chance = require('chance')()

// 随机空闲端口
exports.randUniquePort = (exists, minPort, maxPort) => {
  for (let i = 0; i < 5; i++) {
    let port = _.random(minPort, maxPort)
    if (exists.indexOf(port) === -1) {
      return port
    }
  }
  return false
}

// 随机密码
exports.randomString = (length = 6) => {
  return chance.string({
    length,
    pool: '0123456789abcdefghijklmnopqrstuvwxyz'
  })
}

exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
