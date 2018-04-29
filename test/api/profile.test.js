const config = require('config')
const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')

describe('/api/profile', () => {
  let user

  before(async () => {
    user = await utils.createTestUserAsync()
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
  })

  describe('detail', () => {
    it('should return profile success', async () => {
      let res = await request.get('/api/profile')
        .use(utils.setUserSession(user))
        .expect(200)
      expect(res.body.port).to.equal(user.port)
      expect(res.body.password).to.equal(user.password)
    })
  })

  describe('update', () => {
    it('should return error with invalid port', async () => {
      let port = config.get('ss.maxPort') + 1
      let res = await request.put('/api/profile')
        .use(utils.setUserSession(user))
        .send({ port })
        .expect(400)
      expect(res.body.type).to.equal('BadRequest')
    })

    it('should update profile success', async () => {
      let password = random.getUserPassword()
      let res = await request.put('/api/profile')
        .use(utils.setUserSession(user))
        .send({ password })
        .expect(200)
      expect(res.body.password).to.equal(password)
    })

    it('should return port duplication error', async () => {
      let tmpUser = await utils.createTestUserAsync()
      await request.put('/api/profile')
        .use(utils.setUserSession(user))
        .send({ port: tmpUser.port })
        .expect(400)
      await utils.removeTestUserAsync(tmpUser)
    })
  })
})
