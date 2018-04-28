const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')
const userService = require('../../src/service/user')

describe('service/user', () => {
  let user

  describe('createAsync', () => {
    it('should add user success', async () => {
      user = await utils.createTestUserAsync()
      expect(user).to.include.keys(['userId', 'name', 'port', 'password'])
    })
  })

  describe('getAsync', () => {
    it('should return false if user not found', async () => {
      let tmpUser = await userService.getAsync('invalid user')
      expect(tmpUser).to.equal(false)
    })

    it('should get user success', async () => {
      let tmpUser = await userService.getAsync(user.userId)
      expect(tmpUser.name).to.equal(user.name)
    })
  })

  describe('findAsync', () => {
    it('should return user list success', async () => {
      let users = await userService.findAsync()
      expect(users.length >= 1).to.equal(false)
      expect(users[0]).to.include.keys(['userId', 'name', 'port', 'password'])
    })
  })

  describe('updateAsync', () => {
    it('should return false if user not found', async () => {
      let tmpUser = await userService.updateAsync(-1)
      expect(tmpUser).to.equal(false)
    })

    it('should update user success', async () => {
      let name = random.getUserName()
      let tmpUser = await userService.updateAsync(user.userId, {name})
      expect(tmpUser.name).to.equal(name)
      user.name = name
    })
  })

  describe('removeAsync', () => {
    it('should return false if user not found', async () => {
      let tmpUser = await userService.removeAsync(-1)
      expect(tmpUser).to.equal(false)
    })

    it('should remove user success', async () => {
      await utils.removeTestUserAsync(user)
      let tmpUser = await userService.getAsync(user.userId)
      expect(tmpUser).to.equal(false)
    })
  })
})
