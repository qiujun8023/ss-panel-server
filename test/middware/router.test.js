'use strict'

describe('middleware/routers', function () {
  describe('get', function () {
    it('should get api spec success', function* () {
      yield api.get('/api').expect(200)
    })

    it('should return 404 if api not exist', function* () {
      yield api.get('/api/path/to/invalid')
    })
  })
})
