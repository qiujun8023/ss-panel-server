'use strict';

const sway = require('sway');

const spec = require('../spec');

module.exports = function () {
  return function (req, res, next) {
    sway.create({definition: spec}).then(function (api) {
      req.swagger = {
        spec,
        api,
        operation: api.getOperation(req, req.method),
      };
      next();
    });
  };
};
