'use strict';

const config = require('config');

const wechat = require('../../lib/wechat')('tick', 'system');
const network = require('../../service/network');

module.exports = {
  *post(req, res) {
    let threshold = req.body.threshold;
    if (threshold === undefined) {
      threshold = config.network.flow.threshold;
    } else {
      threshold = Number(threshold);
    }

    let remind_info = yield network.isFlowAbnormalAsync(config.network.flow.Interface);
    if (!remind_info) {
      res.json({status: 'error'});
      return;
    }

    let speed = remind_info.transmit_diff / (remind_info.time_diff / 1000);
    if (speed < threshold) {
      res.json({status: 'normal'});
      return;
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
    yield wechat.sendAsync(to, message);

    res.send({status: 'abnormal'});
  },
};
