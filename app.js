'use strict';

// eslint-disable-next-line
process.env.NODE_CONFIG_DIR= __dirname +'/config';
process.env.TZ = 'Asia/Shanghai';

const http = require('http');

const config = require('config');
const bodyParser = require('body-parser');

const express = require('./lib/express');
const mws = require('./middleware');

let app = express();
let server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// 加载 Session
app.use(mws.session());

// 加载swagger
app.use(mws.swagger());

// 加载参数与返回值校验
app.use(mws.validation.request());
app.use(mws.validation.response());

// 加载测试组件
app.use(mws.switch());

// 加载权限校验
app.use(mws.auth());

// 加载路由
app.use(mws.routers());

// 错误处理
app.use(mws.errorHandle());

if (!module.parent) {
  let port = process.env.PORT || config.port;
  let host = process.env.HOST || config.host;
  server.listen(port, host);

  // eslint-disable-next-line
  console.log(`Server listen on ${config.protocol}://${host}:${port}`);
} else {
  module.exports = server;
}
