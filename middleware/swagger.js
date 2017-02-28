'use strict';

const spec = require('../spec');

module.exports = function (api) {
  return function (req, res, next) {
    let operation = api.getOperation(req, req.method);
    req.swagger = {spec, api, operation};
    next();
  };
};
