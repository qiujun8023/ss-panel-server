'use strict'

const _ = require('lodash')
const config = require('config')
const chance = require('chance')()

let {minPort, maxPort, randomPasswordPool} = config.ss

// 随机空闲端口
exports.randUniquePort = function (exists) {
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
  return chance.string({length: 6, pool: randomPasswordPool})
}
