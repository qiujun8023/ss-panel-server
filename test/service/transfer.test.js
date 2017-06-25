'use strict'

const expect = require('chai').expect

const {Transfer} = require('../../service')

describe('service/transfer', function () {
  describe('findStatAsync', function () {
    it('should return transfer stat success', function* () {
      let stat = yield Transfer.findStatAsync()
      expect(stat.length).to.equal(31)
      expect(stat[0]).to.include.keys(['date', 'flowUp', 'flowDown'])
    })
  })
})
