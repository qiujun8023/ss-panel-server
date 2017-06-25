'use strict'

const {Offer} = require('../service/')
const format = require('../lib/format')

module.exports = {
  *get (req, res) {
    let result = []
    let offers = yield Offer.findAsync()
    for (let offer of offers) {
      result.push(format.offer(offer))
    }
    res.json(result)
  }
}
