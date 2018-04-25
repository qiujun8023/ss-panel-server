
const {Offer} = require('../../service')

describe('service/offer', () => {
  describe('findAsync', () => {
    it('should return offer list success', async () => {
      await Offer.findAsync()
    })
  })
})
