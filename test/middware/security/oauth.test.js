const utils = require('../../lib/utils')

describe('middleware/security/oauth', () => {
  let user
  let adminUser

  before(async () => {
    user = await utils.createTestUserAsync()
    adminUser = await utils.createTestUserAsync({
      isAdmin: true
    })
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
    await utils.removeTestUserAsync(adminUser)
  })

  it('should throw unauthorized error', async () => {
    await request.get('/api/profile').expect(401)
  })

  it('should throw unauthorized error', async () => {
    await request.get('/api/profile')
      .use(utils.setUserSession({userId: -1}))
      .expect(401)
  })

  it('should return profile success', async () => {
    await request.get('/api/profile')
      .use(utils.setUserSession(user))
      .expect(200)
  })

  it('should throw forbidden error', async () => {
    await request.get('/api/users')
      .use(utils.setUserSession(user))
      .expect(403)
  })

  it('should return user list success', async () => {
    await request.get('/api/users')
      .use(utils.setUserSession(adminUser))
      .expect(200)
  })
})
