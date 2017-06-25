'use strict'

const {Offer} = require('../../service')

describe('service/offer', function () {
  describe('findOfferAsync', function () {
    it('should return offer list success', function* () {
      yield Offer.findAsync()
    })
  })
})
