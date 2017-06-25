'use strict'

const wechat = require('../../lib/wechat')

describe('lib/wechat', function () {
  let token = {
    accessToken: 'abcdefghijklmn',
    expiresIn: 7200
  }

  describe('_getToken', function () {
    it('shoud get token success', function (done) {
      wechat._getToken(done)
    })
  })

  describe('_setToken', function () {
    it('shoud set token success', function (done) {
      wechat._setToken(token, done)
    })
  })
})
