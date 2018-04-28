const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')
const userService = require('../../src/service/user')

describe('service/user', () => {
  let user

  describe('createAsync', () => {
    it('should create user success', async () => {
      user = await utils.createTestUserAsync()
    })

    it('should throw exception if username is exist', async () => {
      try {
        await utils.createTestUserAsync({
          username: user.username
        })
      } catch (e) {
        return true
      }
      expect(true).to.equal(false)
    })
  })

  describe('getAsync', () => {
    it('should return null if user not found', async () => {
      let res = await userService.getAsync(-1)
      expect(res).to.equal(null)
    })

    it('should get user success', async () => {
      let res = await userService.getAsync(user.userId)
      expect(res.username).to.equal(user.username)
    })
  })

  describe('getByUserNameAsync', () => {
    it('should get user success', async () => {
      let res = await userService.getByUserNameAsync(user.username)
      expect(res.userId).to.equal(user.userId)
    })
  })

  describe('findAsync', () => {
    it('should return user list success', async () => {
      let users = await userService.findAsync()
      expect(users.length >= 1).to.equal(true)
      let keys = ['userId', 'username', 'port', 'password']
      for (let user of users) {
        user = user.get({ plain: true })
        expect(user).to.include.keys(keys)
      }
    })
  })

  describe('updateAsync', () => {
    it('should return false if user not found', async () => {
      let res = await userService.updateAsync(-1)
      expect(res).to.equal(false)
    })

    it('should update user success', async () => {
      let username = random.getUsername()
      let res = await userService.updateAsync(user.userId, { username })
      expect(res.username).to.equal(username)
      user = res
    })
  })

  describe('updateTrafficAsync', () => {
    it('should return false if user not found', async () => {
      let res = await userService.updateTrafficAsync(-1)
      expect(res).to.equal(false)
    })

    it('should update user traffic success', async () => {
      await userService.updateTrafficAsync(user.userId, 1024, 1024)
      let res = await userService.getAsync(user.userId)
      expect(res.flowUp).to.equal(1024)
      expect(res.flowDown).to.equal(1024)
    })
  })

  describe('initTrafficAsync', () => {
    it('should init user traffic success', async () => {
      await userService.initTrafficAsync({
        userId: user.userId
      })
      let res = await userService.getAsync(user.userId)
      expect(res.flowUp).to.equal(0)
      expect(res.flowDown).to.equal(0)
    })
  })

  describe('removeAsync', () => {
    it('should return false if user not found', async () => {
      let res = await userService.removeAsync(-1)
      expect(res).to.equal(false)
    })

    it('should remove user success', async () => {
      await utils.removeTestUserAsync(user)
      let res = await userService.getAsync(user.userId)
      expect(res).to.equal(null)
    })
  })
})
