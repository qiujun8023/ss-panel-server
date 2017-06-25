'use strict'

module.exports = function (data) {
  data.serviceId = data.nodeId
  delete data.nodeId
  return data
}
