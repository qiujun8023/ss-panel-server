const supertest = require('supertest')

const app = require('../src/app')
const utils = require('../src/lib/utils')

before(async () => {
  await utils.sleep(1500)
  global.request = supertest(app.listen())
})
