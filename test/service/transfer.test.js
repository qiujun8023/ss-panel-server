
const { expect } = require('chai')

const trafficService = require('../../src/service/traffic')

describe('service/transfer', () => {
  describe('findStatAsync', () => {
    it('should return transfer stat success', async () => {
      let stat = await trafficService.findStatAsync()
      expect(stat.length).to.equal(31)
      expect(stat[0]).to.include.keys(['date', 'flowUp', 'flowDown'])
    })
  })
})
