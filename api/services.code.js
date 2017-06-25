'use strict'

const {Service} = require('../service')
const format = require('../lib/format')

module.exports = {
  *get (req, res) {
    let {userId} = req.session.user
    let services = yield Service.findAsync(userId)

    for (let i = 0; i < services.length; i++) {
      services[i] = format.service(services[i])
    }

    res.json(services)
  }
}
