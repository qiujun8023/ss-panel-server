const { expect } = require('chai')

const configService = require('../../src/service/config')

describe('service/config', () => {
  let configs

  describe('findAsync', () => {
    it('should return config list with cache success', async () => {
      configs = await configService.findAsync()
      expect(configs.length >= 1).to.equal(true)
    })

    it('should return config list without cache success', async () => {
      configs = await configService.findAsync(false)
      expect(configs.length >= 1).to.equal(true)
    })
  })

  describe('refreshAsync', () => {
    it('should refresh configs success', async () => {
      let res = await configService.refreshAsync()
      expect(res).to.equal(true)
    })
  })

  describe('getAsync', () => {
    it('should retrue null if config not found', async () => {
      let res = await configService.getAsync(-1)
      expect(res).to.equal(null)
    })

    it('shoud return config success', async () => {
      let config = await configService.getAsync(configs[0].configId)
      expect(config.value).to.equal(configs[0].value)
    })
  })

  describe('getByKeyAsync', () => {
    it('should return false if key not found', async () => {
      let config = await configService.getByKeyAsync('which-is-not-exist')
      expect(config).to.equal(false)
    })
    it('should return config success', async () => {
      let config = await configService.getByKeyAsync(configs[0].key)
      expect(config).not.to.equal('')
    })
  })

  describe('updateAsync', () => {
    it('should retrue null if config not found', async () => {
      let res = await configService.updateAsync(-1, {})
      expect(res).to.equal(false)
    })

    it('should update config success', async () => {
      let res1 = await configService.getByKeyAsync('version')
      await configService.updateAsync(configs[0].configId, { value: '-1' })
      let res2 = await configService.getByKeyAsync('version', false)
      expect(res2).to.equal('-1')
      await configService.updateAsync(configs[0].configId, { value: res1 })
      await configService.refreshAsync()
      let res3 = await configService.getByKeyAsync('version')
      expect(res3).to.equal(res1)
    })
  })
})
