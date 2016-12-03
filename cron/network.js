'use strict';

const config = require('config');

const cron = require('../lib/cron');
const wechat = require('../lib/wechat')('tick', 'shard');
const network = require('../service/network');

let _flow = function* (threshold) {
  if (threshold === undefined) {
    threshold = config.network.flow.threshold;
  }

  let remind_info = yield network.isFlowAbnormalAsync(config.network.flow.Interface);
  if (!remind_info) {
    return false;
  }

  let speed = remind_info.transmit_diff / (remind_info.time_diff / 1000) * 8;
  if (speed < threshold) {
    return false;
  }

  let minutes = (remind_info.time_diff / 1000 / 60).toFixed(2);
  let transmit_diff = network.format('size', remind_info.transmit_diff);
  let transmit_total = network.format('size', remind_info.transmit_total);

  let user = yield network.getFlowRemindAsync();
  let to = {touser: user.join('|')};
  let title = '服务器流量异常提醒';
  let description = `尊敬的管理员您好，系统检测服务器出网流量在 ${minutes} 分钟内` +
                    `共消耗了 ${transmit_diff}，累计使用 ${transmit_total}，请及时处理！`;
  let message = {
    msgtype: 'news',
    news: {
      articles: [{title, description}],
    },
  };

  if (config.env === 'production' && to && message) {
    yield wechat.sendAsync(to, message);
  }

  return true;
};
let flow = cron('0 */3 * * * *', _flow);

module.exports = {
  _flow,
  flow,
};
