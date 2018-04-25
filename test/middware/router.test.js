
describe('middleware/router', () => {
  describe('get', () => {
    it('should get api spec success', async () => {
      await request.get('/api').expect(200)
    })

    it('should return 404 if api not exist', async () => {
      await request.get('/api/path/to/invalid')
    })
  })
})
