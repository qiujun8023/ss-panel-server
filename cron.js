'use strict';

// eslint-disable-next-line
process.env.NODE_CONFIG_DIR= __dirname +'/config';
process.env.TZ = 'Asia/Shanghai';

let birthday = require('./cron/birthday');

birthday.today.start();
birthday.now.start();
