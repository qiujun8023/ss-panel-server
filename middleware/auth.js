'use strict'

const _ = require('lodash')

const ko = require('express-ko')
const securities = require('./security')

module.exports = function (api) {
  const definition = api.definition
  const globalSecurityDef = definition.security || []
  const securityDefinitions = definition.securityDefinitions
  return function* (req, res, done) {
    if (!req.swagger.operation) {
      return done()
    }

    let securitiesDef = req.swagger.operation.security || []
    securitiesDef = securitiesDef.concat(globalSecurityDef)
    let securityHandlers = securitiesDef.map((security) => {
      security = Object.keys(security)[0]
      return securityDefinitions[security]['x-securityHandler']
    })
    securityHandlers = _.uniq(securityHandlers)

    let index = 0
    let next = function (err) {
      // return on first successful authentication
      if (index !== 0 && !err) {
        return done()
      }

      // return last authentication failure
      if (index === securityHandlers.length) {
        return done(err)
      }

      let securityHandler = securities[securityHandlers[index++]]()
      ko(securityHandler)(req, res, next)
    }

    next()
  }
}
