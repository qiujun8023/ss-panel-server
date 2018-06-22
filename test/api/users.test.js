const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')
const configService = require('../../src/service/config')

describe('/api/users', () => {
  let user
  let adminUser

  before(async () => {
    adminUser = await utils.createTestUserAsync({
      isAdmin: true
    })
  })

  after(async () => {
    await utils.removeTestUserAsync(adminUser)
  })

  describe('create', () => {
    it('should return 400 if username exist', async () => {
      let username = adminUser.username
      let nickname = random.getNickname()

      await request.post('/api/users')
        .use(utils.setUserSession(adminUser))
        .send({ username, nickname })
        .expect(400)
    })

    it('should create node success', async () => {
      let username = random.getUsername()
      let nickname = random.getNickname()

      let res = await request.post('/api/users')
        .use(utils.setUserSession(adminUser))
        .send({ username, nickname })
        .expect(201)

      user = res.body
      expect(user.username).to.equal(username)
      expect(user.nickname).to.equal(nickname)
    })
  })

  describe('list', () => {
    it('should return user list', async () => {
      await request.get('/api/users')
        .use(utils.setUserSession(adminUser))
        .expect(200)
    })
  })

  describe('update', () => {
    it('should return 404 if user not found', async () => {
      await request.put('/api/users/0')
        .use(utils.setUserSession(adminUser))
        .send({})
        .expect(404)
    })

    it('should return 400 if port not in range', async () => {
      let { maxPort } = await configService.getPortRangeAsync()
      await request.put(`/api/users/0${user.userId}`)
        .use(utils.setUserSession(adminUser))
        .send({
          port: maxPort + 1
        })
        .expect(400)
    })

    it('should return 400 if port or username exist', async () => {
      await request.put(`/api/users/0${user.userId}`)
        .use(utils.setUserSession(adminUser))
        .send({
          port: adminUser.port
        })
        .expect(400)
    })

    it('should update user success', async () => {
      let username = random.getUsername()
      let nickname = random.getNickname()
      let password = random.getUserPassword()
      let res = await request.put(`/api/users/${user.userId}`)
        .use(utils.setUserSession(adminUser))
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
        .use(utils.setUserSession(adminUser))
        .expect(404)
    })

    it('should return user detail', async () => {
      await request.get(`/api/users/${user.userId}`)
        .use(utils.setUserSession(adminUser))
        .expect(200)
    })
  })

  describe('delete', () => {
    it('should delete user success', async () => {
      await request.delete(`/api/users/${user.userId}`)
        .use(utils.setUserSession(adminUser))
        .expect(200)

      await request.delete(`/api/users/${user.userId}`)
        .use(utils.setUserSession(adminUser))
        .expect(404)
    })
  })
})
