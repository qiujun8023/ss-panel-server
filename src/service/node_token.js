const _ = require('lodash')

const utils = require('../lib/utils')
const { NodeToken } = require('../model')

// 获取Token
exports.getAsync = async (tokenId) => {
  return NodeToken.findById(tokenId)
}

// 产生不重复的Token
exports.genAsync = async () => {
  let nodeTokens = await NodeToken.findAll()
  let tokens = _.map(nodeTokens, 'token')
  for (let i = 0; i < 5; i++) {
    let token = utils.randomString(32)
    if (tokens.indexOf(token) === -1) {
      return token
    }
  }
  return false
}

// 创建Token
exports.createAsync = async (data) => {
  if (!data.token) {
    let token = await exports.genAsync()
    if (!token) {
      return false
    }

    data.token = token
  }
  return NodeToken.create(data)
}

// 查询Token
exports.findAsync = async (where) => {
  return NodeToken.findAll({ where })
}

// 更新Token
exports.updateAsync = async (tokenId, data) => {
  let token = await NodeToken.findById(tokenId)
  if (!token) {
    return false
  }

  return token.update(data)
}

// 检查 Toekn 是否有效并更新活跃时间
exports.isValidAsync = async (nodeId, token) => {
  let nodeToken = await NodeToken.findOne({
    where: {
      nodeId,
      token
    }
  })
  if (!nodeToken) {
    return false
  }

  // 更新活跃时间
  await nodeToken.update({
    activedAt: new Date()
  }, {
    silent: true
  })

  return true
}

exports.removeAsync = async (nodeTokenId) => {
  let nodeToken = await NodeToken.findById(nodeTokenId)
  if (!nodeToken) {
    return false
  }
  return nodeToken.destroy()
}
