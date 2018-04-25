
const expect = require('chai').expect

const {Transfer} = require('../../service')

describe('service/transfer', () => {
  describe('findStatAsync', () => {
    it('should return transfer stat success', async () => {
      let stat = await Transfer.findStatAsync()
      expect(stat.length).to.equal(31)
      expect(stat[0]).to.include.keys(['date', 'flowUp', 'flowDown'])
    })
  })
})
