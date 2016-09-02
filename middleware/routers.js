'use strict';

const path = require('path');

const _ = require('lodash');

const spec = require('../spec');
const errors = require('../lib/errors');
const express = require('../lib/express');
const translate = require('../lib/translate');

let router = express.Router();

// 返回完整的spec文件
router.get('/api', function (req, res) {
  res.send(patternPropertiesToProperties(_.clone(req.swagger.spec)));
});

function patternPropertiesToProperties(schema) {
  if (typeof schema === 'object') {
    _.forEach(schema, function (value, key) {
      patternPropertiesToProperties(value);

      if (key === 'patternProperties') {
        schema.properties = schema.properties || {};
        _.forEach(schema.patternProperties, (innerValue, innerKey) => {
          schema.properties[`pattern ${innerKey}`] = innerValue;
          patternPropertiesToProperties(innerValue);
        });
      }

    });
  }

  return schema;
}

// 加载 API 目录下所有路由
for (let uri in spec.paths) {
  let location = translate.toCode(uri);
  let handles = require(location);

  for (let method in handles) {
    let args = handles[method];
    if (_.isArray(args)) {
      args.unshift(uri);
    } else {
      args = [uri, args];
    }
    router[method].apply(router, args);
  }
}

// 抛出API接口的404错误
router.use('/api', function () {
  throw new errors.NotFound('page not found');
});


// API文档
router.use('/doc', express.static(path.resolve(__dirname, '../resource/swagger-renderer')));

// 使用前端路由，后端只发送首页文件
router.get('/doc/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../resource/swagger-renderer/index.html'));
});

module.exports = () => router;
