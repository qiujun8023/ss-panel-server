const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')

describe('/api/users', () => {
  let user

  before(async () => {
    user = await utils.createTestUserAsync({
      isAdmin: true
    })
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
  })

  describe('list', () => {
    it('should return user list', async () => {
      await request.get('/api/users')
        .use(utils.setUserSession(user))
        .expect(200)
    })
  })

  describe('update', () => {
    it('should return 404 if user not found', async () => {
      await request.put('/api/users/0')
        .use(utils.setUserSession(user))
        .send({})
        .expect(404)
    })

    it('should update user success', async () => {
      let username = random.getUsername()
      let nickname = random.getNickname()
      let password = random.getUserPassword()
      let res = await request.put(`/api/users/${user.userId}`)
        .use(utils.setUserSession(user))
        .send({ username, nickname, password })
        .expect(200)
      expect(res.body.username).to.equal(username)
      expect(res.body.nickname).to.equal(nickname)
      expect(res.body.password).to.equal(password)
    })
  })

  describe('detail', () => {
    it('should return 404 if user not found', async () => {
      await request.get('/api/users/0')
        .use(utils.setUserSession(user))
        .expect(404)
    })

    it('should return user detail', async () => {
      await request.get(`/api/users/${user.userId}`)
        .use(utils.setUserSession(user))
        .expect(200)
    })
  })
})
