'use strict'

process.env.TZ = 'Asia/Shanghai'

require('moment').locale('zh-cn')
require('./cron/clean_log').start()
require('./cron/init_transfer').start()
require('./cron/node_monitor').start()
