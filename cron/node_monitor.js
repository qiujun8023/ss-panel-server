'use strict'

const _ = require('lodash')
const config = require('config')
const moment = require('moment')

const cron = require('../lib/cron')
const wechat = require('../lib/wechat')
const {User, Node} = require('../service')

// 节点监控
let _fn = function* () {
  let nodes = yield Node.findAsync({
    activeAt: {
      $ne: null
    }
  })

  for (let node of nodes) {
    let newStatus = {ok: true, activeAt: node.activeAt}
    let oldStatus = (yield Node.getStatusAsync(node.nodeId)) || newStatus

    let message
    let timeDiff = moment().diff(node.activeAt)
    newStatus.ok = timeDiff <= config.ss.maxDowntime
    if (!newStatus.ok && oldStatus.ok) {
      message = `【${node.name}】(ID:${node.nodeId})科学上网服务异常，请及时检查`
    } else if (newStatus.ok && !oldStatus.ok) {
      let long = moment(oldStatus.activeAt).fromNow(true)
      message = `【${node.name}】(ID:${node.nodeId})科学上网服务已恢复，本次服务中断时长 ${long}`
    }

    if (message) {
      let users = yield User.findAsync({is_admin: true})
      let touser = _.map(users, 'userId').join('|')
      yield wechat.sendAsync({touser}, {
        msgtype: 'text',
        text: {
          content: message
        }
      })
    }

    yield Node.setStatusAsync(node.nodeId, newStatus)
  }
}

module.exports = cron('*/30 * * * * *', _fn)
