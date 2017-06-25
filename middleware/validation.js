'use strict'

const config = require('config')
const shimmer = require('shimmer')
const ZSchema = require('z-schema')

const errors = require('../lib/errors')
const logger = require('../lib/logger')

// addtional __data__ field can used with isSwitchOn to return addtional data in unit test
const validator = new ZSchema({assumeAdditional: ['__data__']})

module.exports = {
  request () {
    return function (req, res, next) {
      if (req.swagger.operation) {
        let validateResult = req.swagger.operation.validateRequest(req)
        if (validateResult.errors.length) {
          // TODO: return multiple errors
          let error = validateResult.errors[0]
          let field = error.name
          let reason = error.errors ? error.errors[0].message : error.message
          let message = `Invalid parameter (${field}): ${reason}`
          return next(new errors.BadRequest(message, 'InvalidParameter'))
        }
      }
      next()
    }
  },

  response () {
    return function (req, res, next) {
      if (req.swagger.operation) {
        shimmer.wrap(res, 'json', function (original) {
          return function () {
            // Implementation from https://github.com/apigee-127/sway/blob/59e9b1f1b581e06e12304ac630a3518dffca0dd9/lib/types/operation.js#L285
            let operation = req.swagger.operation
            let realStatusCode = res ? res.statusCode : 'default'
            let response = operation.getResponse(realStatusCode) || operation.getResponse('default')

            if (response && typeof response === 'object') {
              let valid = validator.validate(arguments[0], response.definitionFullyResolved.schema)

              if (!valid) {
                let validateResult = validator.getLastErrors()
                if (config.env === 'test') {
                  throw new errors.SystemError(JSON.stringify(validateResult, null, '  '), 'InvalidResponse')
                } else {
                  logger.error('invalid response format', {
                    result: JSON.stringify(validateResult, null, '  '),
                    method: req.method,
                    url: req.url
                  })
                }
              }
            }
            return original.apply(this, arguments)
          }
        })
      }
      next()
    }
  }
}
