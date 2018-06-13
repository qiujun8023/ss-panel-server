const { expect } = require('chai')
const utils = require('../../src/lib/utils')

describe('lib/utils', () => {
  describe('randUniquePort', () => {
    it('shoud random unique port success', () => {
      let res = utils.randUniquePort([1, 2, 3], 1, 100)
      expect(res).to.be.below(100).that.to.be.above(1)
      expect([1, 2, 3].indexOf(res)).to.equal(-1)
    })

    it('shoud random unique port failure', () => {
      let res = utils.randUniquePort([1, 2, 3], 1, 3)
      expect(res).to.equal(false)
    })
  })

  describe('randomString', () => {
    it('shoud random string success', () => {
      let res = utils.randomString(80)
      expect(res).to.have.lengthOf(80)
    })
  })

  describe('versionCompare', () => {
    it('should return correct results', () => {
      expect(utils.versionCompare('1.2.3', '1.2.3')).to.equal(0)
      expect(utils.versionCompare('1.23', '1.2.3')).to.equal(1)
      expect(utils.versionCompare('1.23.34', '12.23.34')).to.equal(-1)
      expect(utils.versionCompare('1.2', '12')).to.equal(-1)
    })
  })
})
