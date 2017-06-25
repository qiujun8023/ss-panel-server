'use strict'

const plugins = require('../lib/plugin')

let BASE_PATH = '/api/offers'
let userPlugin = plugins.user()

describe(BASE_PATH, function () {
  before(function* () {
    yield userPlugin.before()
  })

  after(function* () {
    yield userPlugin.after()
  })

  describe('get', function () {
    it('should return offer list', function* () {
      yield api.get(BASE_PATH)
        .use(userPlugin.plugin())
        .expect(200)
    })
  })
})
