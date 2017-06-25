'use strict'

const path = require('path')

const _ = require('lodash')
const config = require('config')

const spec = require('../spec')
const errors = require('../lib/errors')
const express = require('../lib/express')
const translate = require('../lib/translate')

let router = express.Router()

// 返回完整的spec文件
router.get('/api', function (req, res) {
  res.send(req.swagger.spec)
})

// 加载 API 目录下所有路由
for (let uri in spec.paths) {
  let location = translate.toCode(uri)
  let handles = require(location)

  for (let method in handles) {
    let args = handles[method]
    if (_.isArray(args)) {
      args.unshift(uri)
    } else {
      args = [uri, args]
    }
    router[method].apply(router, args)
  }
}

// 抛出API接口的404错误
router.use('/api', function () {
  throw new errors.NotFound('page not found')
})

// 设置前端路径
router.use('/', express.static(config.clientDir))

// API文档
router.use('/doc', express.static(path.resolve(__dirname, '../spec/swagger-renderer')))

// 使用前端路由，所以默认发送前端index页面
router.get('/*', function (req, res) {
  res.sendFile(path.resolve(config.clientDir, 'index.html'))
})

module.exports = () => router
