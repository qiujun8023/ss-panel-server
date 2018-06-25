const { expect } = require('chai')

const configService = require('../../src/service/config')

describe('service/config', () => {
  describe('findAsync', () => {
    it('should return config list with cache success', async () => {
      let configs = await configService.findAsync()
      expect(configs.length >= 1).to.equal(true)
    })

    it('should return config list without cache success', async () => {
      let configs = await configService.findAsync(false)
      expect(configs.length >= 1).to.equal(true)
    })
  })

  describe('getByKeyAsync', () => {
    it('should return false if key not found', async () => {
      let config = await configService.getByKeyAsync('which-is-not-exist')
      expect(config).to.equal(false)
    })
    it('should return config success', async () => {
      let config = await configService.getByKeyAsync('version')
      expect(config).not.to.equal('')
    })
  })
})
