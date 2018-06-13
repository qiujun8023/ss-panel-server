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
    it('should return "" if key not found', async () => {
      let config = await configService.getByKeyAsync('which-is-not-exist')
      expect(config).to.equal('')
    })

    it('should return default value if key not found', async () => {
      let config = await configService.getByKeyAsync('which-is-not-exist', '123')
      expect(config).to.equal('123')
    })

    it('should return default value with format if key not found', async () => {
      let config = await configService.getByKeyAsync('which-is-not-exist', '123', Number)
      expect(config).to.equal(123)
    })

    it('should return config success', async () => {
      let config = await configService.getByKeyAsync('version')
      expect(config).not.to.equal('')
    })
  })

  describe('updateByKeyAsync', () => {
    it('should return false if key not found', async () => {
      let config = await configService.updateByKeyAsync('which-is-not-exist', 'value')
      expect(config).to.equal(false)
    })

    it('should update config success', async () => {
      let config = await configService.getByKeyAsync('version')
      let res = await configService.updateByKeyAsync('version', config)
      expect(res).to.not.equal(false)
    })
  })
})
