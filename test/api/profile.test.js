'use strict'

const config = require('config')
const expect = require('chai').expect

const plugins = require('../lib/plugin')
const random = require('../lib/random')

let BASE_PATH = '/api/profile'
let userPlugin = plugins.user()

describe(BASE_PATH, function () {
  before(function* () {
    yield userPlugin.before()
  })

  after(function* () {
    yield userPlugin.after()
  })

  describe('get', function () {
    it('should return profile success', function* () {
      yield api.get(BASE_PATH)
        .use(userPlugin.plugin())
        .expect(200)
    })
  })

  describe('put', function () {
    it('should return error whih invalid port', function* () {
      let port = config.ss.maxPort + 1
      let res = yield api.put(BASE_PATH)
        .use(userPlugin.plugin())
        .send({port})
        .expect(400)
      expect(res.body.type).to.equal('BadRequest')
    })

    it('should update profile success', function* () {
      let password = random.getUserPassword()
      let res = yield api.put(BASE_PATH)
        .use(userPlugin.plugin())
        .send({password})
        .expect(200)
      expect(res.body.password).to.equal(password)
    })
  })
})
