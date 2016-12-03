'use strict';

// eslint-disable-next-line
process.env.NODE_CONFIG_DIR= __dirname +'/config';

let network = require('./cron/network');
let birthday = require('./cron/birthday');

network.flow.start();
birthday.today.start();
birthday.now.start();
