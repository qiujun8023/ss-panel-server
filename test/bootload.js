const supertest = require('supertest')

const app = require('../src/app')

before(() => {
  global.request = supertest(app.listen())
})
