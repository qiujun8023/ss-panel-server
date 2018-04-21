const fs = require('fs')
const path = require('path')

const Router = require('koa-router')

const swagger = require('../swagger')

const routes = new Router({prefix: '/api'})
const BASE_PATH = path.join(__dirname, '../api')

// 加载单个 API
let loadApi = (operationId) => {
  let [fileName, method] = operationId.replace(/\./g, '/').split('#', 2)
  let filePath = path.join(BASE_PATH, fileName + '.js')

  // 代码文件存在性检查
  if (!fs.existsSync(filePath)) {
    throw new Error(`api file not found in ${filePath}`)
  }

  // 加载代码文件
  let handles = require(filePath)
  if (method && !handles[method]) {
    throw new Error(`api method not found in ${filePath}#${method}`)
  }

  return method ? handles[method] : handles
}

// 加载所有 API
for (let uri in swagger.paths) {
  let resources = swagger.paths[uri]
  for (let method in resources) {
    let {operationId} = resources[method]
    let route = uri.replace(/{(.*?)}/g, ':$1')
    routes[method](route, loadApi(operationId))
  }
}

module.exports = routes
