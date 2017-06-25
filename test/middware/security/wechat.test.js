'use strict'

const plugins = require('../../lib/plugin')

let userPlugin = plugins.user()
let BASE_PATH = '/api/profile'

describe('middleware/security/wechat', function () {
  before(function* () {
    yield userPlugin.before()
  })

  after(function* () {
    yield userPlugin.after()
  })

  it('should throw unauthorized error', function* () {
    yield api.get(BASE_PATH).expect(401)
  })

  it('should return profile', function* () {
    yield api.get(BASE_PATH)
      .use(userPlugin.plugin())
      .expect(200)
  })
})
