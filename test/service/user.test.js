
const expect = require('chai').expect

const {User} = require('../../service')
const utility = require('../lib/utility')
const random = require('../lib/random')

describe('service/user', () => {
  let user

  describe('createAsync', () => {
    it('should add user success', async () => {
      user = await utility.createTestUserAsync()
      expect(user).to.include.keys(['userId', 'name', 'port', 'password'])
    })
  })

  describe('getAsync', () => {
    it('should return false if user not found', async () => {
      let tmpUser = await User.getAsync('invalid user')
      expect(tmpUser).to.be.false
    })

    it('should get user success', async () => {
      let tmpUser = await User.getAsync(user.userId)
      expect(tmpUser.name).to.equal(user.name)
    })
  })

  describe('findAsync', () => {
    it('should return user list success', async () => {
      let users = await User.findAsync()
      expect(users.length >= 1).to.be.true
      expect(users[0]).to.include.keys(['userId', 'name', 'port', 'password'])
    })
  })

  describe('updateAsync', () => {
    it('should return false if user not found', async () => {
      let tmpUser = await User.updateAsync(-1)
      expect(tmpUser).to.be.false
    })

    it('should update user success', async () => {
      let name = random.getUserName()
      let tmpUser = await User.updateAsync(user.userId, {name})
      expect(tmpUser.name).to.equal(name)
      user.name = name
    })
  })

  describe('removeAsync', () => {
    it('should return false if user not found', async () => {
      let tmpUser = await User.removeAsync(-1)
      expect(tmpUser).to.be.false
    })

    it('should remove user success', async () => {
      await utility.removeTestUserAsync(user)
      let tmpUser = await User.getAsync(user.userId)
      expect(tmpUser).to.be.false
    })
  })
})
