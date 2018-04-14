const config = require('config')
const Promise = require('bluebird')
const WeChat = require('wechat-enterprise-api')

const redis = require('./redis')

const TOKEN_CACHE_KEY = 'wechat:access_token'

let getToken = function (callback) {
  redis.get(TOKEN_CACHE_KEY, function (err, result) {
    callback(err, JSON.parse(result))
  })
}

let setToken = function (token, callback) {
  let time = token.expiresIn - 600
  let data = JSON.stringify(token)
  redis.setex(TOKEN_CACHE_KEY, time, data, callback)
}

let {corpId, secret, agentId} = config.get('wechat')
let wechat = new WeChat(corpId, secret, agentId, getToken, setToken)
wechat.setOpts({timeout: 15000})
module.exports = Promise.promisifyAll(wechat)
