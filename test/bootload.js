const supertest = require('supertest')

const app = require('../src/app')
const model = require('../src/model')
const { version } = require('../package.json')

before(async function () {
  this.timeout(15000)

  // 迁移数据库
  await model.migrate(version)

  // 初始化数据库
  await model.init(version)

  global.request = supertest(app.listen())
})
