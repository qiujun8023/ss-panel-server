'use strict'

let BASE_PATH = '/api/wechat/oauth'

describe(BASE_PATH, function () {
  describe('get', function () {
    it('should throw error with invalid code', function* () {
      this.timeout(20000)
      yield api.get(BASE_PATH)
        .query({code: 'invalid code'})
        .expect(400)
    })
  })
})
