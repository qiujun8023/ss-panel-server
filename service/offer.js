'use strict'

const models = require('../model')

const OfferModel = models.Offer

// 获取赞助信息
exports.findAsync = function* () {
  let offers = yield OfferModel.findAll()

  let res = []
  for (let offer of offers) {
    res.push(offer.get({plain: true}))
  }

  return res
}
