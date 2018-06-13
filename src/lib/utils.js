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

// 版本号比较
exports.versionCompare = (v1, v2) => {
  if (v1 === v2) {
    return 0
  }

  let v1Arr = v1.split('.')
  let v2Arr = v2.split('.')
  let len = Math.max(v1Arr.length, v2Arr.length)
  for (let i = 0; i < len; i++) {
    let v1i = ~~v1Arr[i]
    let v2i = ~~v2Arr[i]
    if (v1i !== v2i) {
      return v1i > v2i ? 1 : -1
    }
  }

  return 0
}
