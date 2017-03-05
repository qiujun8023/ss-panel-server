'use strict';

// eslint-disable-next-line
process.env.NODE_CONFIG_DIR= __dirname +'/config';
process.env.TZ = 'Asia/Shanghai';

const birthday = require('./cron/birthday');
const ss = require('./cron/ss');

birthday.today.start();
birthday.now.start();

ss.clearTransfer.start();
