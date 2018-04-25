const wechat = require('../../src/lib/wechat')

describe.skip('lib/wechat', () => {
  let token = {
    accessToken: 'abcdefghijklmn',
    expiresIn: 7200
  }

  describe('_getToken', () => {
    it('shoud get token success', (done) => {
      wechat._getToken(done)
    })
  })

  describe('_setToken', () => {
    it('shoud set token success', (done) => {
      wechat._setToken(token, done)
    })
  })
})
