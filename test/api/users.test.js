'use strict'

const expect = require('chai').expect

const plugins = require('../lib/plugin')
const random = require('../lib/random')

let BASE_PATH = '/api/users'
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
    it('should return user list', function* () {
      yield api.get(BASE_PATH)
        .use(userPlugin.plugin())
        .expect(200)
    })
  })

  describe('put', function () {
    it('should return error if user not found', function* () {
      yield api.put(BASE_PATH)
        .use(userPlugin.plugin())
        .send({userId: 'invalid user'})
        .expect(404)
    })

    it('should update user success', function* () {
      let userId = user.userId
      let password = random.getUserPassword()
      let res = yield api.put(BASE_PATH)
        .use(userPlugin.plugin())
        .send({userId, password})
        .expect(200)
      expect(res.body.password).to.equal(password)
    })
  })
})
