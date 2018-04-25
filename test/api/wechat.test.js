describe('/api/wechat/oauth', () => {
  describe('get', () => {
    it('should throw error with invalid code', async function () {
      this.timeout(20000)
      await request.get('/api/wechat/oauth')
        .query({code: 'invalid code'})
        .expect(400)
    })
  })
})
