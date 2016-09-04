'use strict';

// eslint-disable-next-line
process.env.NODE_CONFIG_DIR= __dirname +'/config';

const http = require('http');

const config = require('config');
const bodyParser = require('body-parser');

const express = require('./lib/express');
const session = require('./middleware/session');
const swagger = require('./middleware/swagger');
const validation = require('./middleware/validation');
const routers = require('./middleware/routers');
const error_handle = require('./middleware/error_handle');

let app = express();
let server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// 加载 Session
app.use(session());

// 加载swagger
app.use(swagger());

// 加载参数与返回值校验
app.use(validation.request());
app.use(validation.response());

// 加载路由
app.use(routers());

// 错误处理
app.use(error_handle());

if (!module.parent) {
  let port = process.env.PORT || config.port;
  let host = process.env.HOST || config.host;
  server.listen(port, host);

  // eslint-disable-next-line
  console.log(`Server listen on ${config.protocol}://${host}:${port}`);
} else {
  module.exports = server;
}
