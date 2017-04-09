'use strict';

process.env.NODE_CONFIG_DIR = './server/config';
process.env.TZ = 'Asia/Shanghai';

const birthday = require('./cron/birthday');
const ss = require('./cron/ss');

birthday.today.start();
birthday.now.start();

ss.initUserTransfer.start();
ss.cleanTransferLogs.start();
