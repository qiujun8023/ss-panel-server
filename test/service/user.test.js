'use strict'

const expect = require('chai').expect

const {User} = require('../../service')
const utility = require('../lib/utility')
const random = require('../lib/random')

describe('service/user', function () {
  let user

  describe('createAsync', function () {
    it('should add user success', function* () {
      user = yield utility.createTestUserAsync()
      expect(user).to.include.keys(['userId', 'name', 'port', 'password'])
    })
  })

  describe('getAsync', function () {
    it('should return false if user not found', function* () {
      let tmpUser = yield User.getAsync('invalid user')
      expect(tmpUser).to.be.false
    })

    it('should get user success', function* () {
      let tmpUser = yield User.getAsync(user.userId)
      expect(tmpUser.name).to.equal(user.name)
    })
  })

  describe('findUserAsync', function () {
    it('should return user list success', function* () {
      let users = yield User.findAsync()
      expect(users.length >= 1).to.be.true
      expect(users[0]).to.include.keys(['userId', 'name', 'port', 'password'])
    })
  })

  describe('updateUserAsync', function () {
    it('should return false if user not found', function* () {
      let tmpUser = yield User.updateAsync(-1)
      expect(tmpUser).to.be.false
    })

    it('should update user success', function* () {
      let name = random.getUserName()
      let tmpUser = yield User.updateAsync(user.userId, {name})
      expect(tmpUser.name).to.equal(name)
      user.name = name
    })
  })
})
