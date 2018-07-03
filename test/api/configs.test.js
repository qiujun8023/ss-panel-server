const utils = require('../lib/utils')

describe('/api/config', () => {
  let user
  let configs

  before(async () => {
    user = await utils.createTestUserAsync({
      isAdmin: true
    })
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
  })

  describe('list', () => {
    it('should return config token list', async () => {
      let res = await request.get('/api/configs')
        .use(utils.setUserSession(user))
        .expect(200)
      configs = res.body
    })
  })

  describe('update', () => {
    it('should return 404 if config not found', async () => {
      await request.put('/api/configs/-1')
        .use(utils.setUserSession(user))
        .send({ value: '-1' })
        .expect(404)
    })

    it('should update config success', async () => {
      await request.put(`/api/configs/${configs[0].configId}`)
        .use(utils.setUserSession(user))
        .send({ value: configs[0].value })
        .expect(200)
    })
  })
})
