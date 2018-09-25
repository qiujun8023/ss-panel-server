# Shadowsocks 多用户管理面板

## 说明

### 状态

##### Master

[![Build Status](https://travis-ci.org/qious/ss-panel-server.svg?branch=master)](https://travis-ci.org/qious/ss-panel-server)
[![Coverage Status](https://coveralls.io/repos/github/qious/ss-panel-server/badge.svg?branch=master)](https://coveralls.io/github/qious/ss-panel-server?branch=master)

##### Develop

[![Build Status](https://travis-ci.org/qious/ss-panel-server.svg?branch=develop)](https://travis-ci.org/qious/ss-panel-server)
[![Coverage Status](https://coveralls.io/repos/github/qious/ss-panel-server/badge.svg?branch=develop)](https://coveralls.io/github/qious/ss-panel-server?branch=develop)

### 注意

> 本项目只是管理界面及控制中心，各科学上网节点需要运行下述程序中的任意一种

* [shadowsocks](https://github.com/qious/shadowsocks) : 基于 Python 版本修改而来
* [ss-adapter](https://github.com/qious/ss-adapter) : shadowsocks udp 控制协议适配器

### 特性

- 基于微信企业号/企业微信授权登录
- 新用户授权登录自动分配帐号信息
- 节点异常时会通过 微信企业号/企业微信 发送消息给管理员
- 数据库自动配置、自动升级（v0.5.0之后）
- 前后端分离，完善的 swagger 接口文档（项目运行后浏览器访问 /doc 路径），方便二次开发

### 截图

![效果展示](https://cdn.qiujun.me/image/2018/09/25/5daa1facf56acafb7104aa4079e0fa40.gif)

## 部署

### 使用 Docker + Docker Compose 部署

- 获取工具文件（docker-compose.yml中用到）

```bash
wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
chmod 755 wait-for-it.sh
```

- 配置 docker-compose.yml

```bash
cat > ./docker-compose.yml << \EOF
version: '3'
services:
  redis:
    image: redis:3
    restart: always
    volumes:
      - "./redis:/data"
  mysql:
    image: dnhsoft/mysql-utf8:5.7
    restart: always
    volumes:
      - "./mysql:/var/lib/mysql"
    environment:
      MYSQL_DATABASE: shadowsocks
      MYSQL_USER: shadowsocks
      MYSQL_PASSWORD: password
  server:
    image: qious/ss-panel-server
    restart: always
    depends_on:
      - redis
      - mysql
    environment:
      APP_DEBUG: 'true'
      APP_SERVER_BASE_URL: http://example.com/
      APP_KEYS_1: im a newer secret
      APP_KEYS_2: i like turtle
      APP_REDIS_HOST: redis
      APP_REDIS_PORT: 6379
      APP_REDIS_KEY_PREFIX: 'ss-panel:'
      APP_MYSQL_HOST: mysql
      APP_MYSQL_PORT: 3306
      APP_MYSQL_USER: shadowsocks
      APP_MYSQL_PASSWORD: password
      APP_MYSQL_DATABASE: shadowsocks
      APP_MYSQL_TIMEZONE: 'Asia/Shanghai'
      APP_WECHAT_CORP_ID: wx4e2c2b771c467c9f
      APP_WECHAT_AGENT_ID: 0
      APP_WECHAT_SECRET: secret
    volumes:
      - "./wait-for-it.sh:/app/wait-for-it.sh"
    command: ["./wait-for-it.sh", "-t", "0", "mysql:3306", "--", "node", "index.js"]
  client:
    image: qious/ss-panel-client
    restart: always
    ports:
      - "8888:80"
    depends_on:
      - server
EOF
```

- 运行
```bash
docker-compose up -d
```

- 访问
```
curl http://localhost:8888
```

## 配置文件说明

| 字段   | 描述   |
|:----|:----|
| APP_DEBUG   | 调试模式   |
| APP_SERVER_BASE_URL   | 外部访问地址，形如 https://example.com/   |
| APP_KEYS_1   | 用来加密 Cookie 的随机字符串   |
| APP_KEYS_2   | 用来加密 Cookie 的随机字符串   |
| APP_REDIS_HOST   | Redis 地址   |
| APP_REDIS_PORT   | Redis 端口   |
| APP_REDIS_KEY_PREFIX   | Redis 键前缀   |
| APP_MYSQL_HOST   | MySQL 地址   |
| APP_MYSQL_PORT   | MySQL 端口   |
| APP_MYSQL_USER   | MySQL 用户名   |
| APP_MYSQL_PASSWORD   | MYSQL 密码   |
| APP_MYSQL_DATABASE   | MySQL 数据库名   |
| APP_MYSQL_TIMEZONE   | MySQL 时区   |
| APP_WECHAT_CORP_ID   | 微信 cropId   |
| APP_WECHAT_AGENT_ID   | 微信 agentId   |
| APP_WECHAT_SECRET   | 微信 secret   |

