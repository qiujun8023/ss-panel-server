'use strict'

const plugins = require('../../lib/plugin')

let BASE_PATH = '/api/users/detail'
let userPlugin = plugins.user()

describe(BASE_PATH, function () {
  let user

  before(function* () {
    user = yield userPlugin.before({isAdmin: true})
  })

  after(function* () {
    yield userPlugin.after()
  })

  describe('get', function () {
    it('should return error if user not found', function* () {
      yield api.get(BASE_PATH)
        .query({userId: -1})
        .use(userPlugin.plugin())
        .expect(404)
    })

    it('should return user detail', function* () {
      yield api.get(BASE_PATH)
        .query({userId: user.userId})
        .use(userPlugin.plugin())
        .expect(200)
    })
  })
})
