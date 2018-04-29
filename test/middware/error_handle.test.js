describe('src/middware/error_handle', () => {
  it('should return 404 if page not found', async () => {
    await request.post('/api')
      .expect('Content-Type', /json/)
      .expect(404)
  })
})
