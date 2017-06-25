'use strict'

const {Service} = require('../../service')
const errors = require('../../lib/errors')
const format = require('../../lib/format')

module.exports = {
  *get (req, res) {
    let {userId} = req.session.user
    let {serviceId} = req.query

    let service = yield Service.getAsync(userId, serviceId)
    if (!service) {
      throw new errors.NotFound('未找到相关服务')
    }

    res.json(format.service(service))
  }
}
