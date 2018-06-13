const _ = require('lodash')
const moment = require('moment')

const wechat = require('../lib/wechat')
const userService = require('../service/user')
const nodeService = require('../service/node')
const configService = require('../service/config')

// 设置语言
moment.locale('zh-cn')

// 判断节点状态
let isStatusOk = (activedAt, maxDowntime) => {
  return moment().diff(activedAt) <= (maxDowntime * 1000)
}

let sendMessage = async (message) => {
  // 查找管理员
  let users = await userService.findAsync({
    isAdmin: true
  })

  // 拼接发送用户
  let touser = _.map(users, 'username').join('|')

  // 发送消息
  await wechat.sendAsync({ touser }, {
    msgtype: 'text',
    text: {
      content: message
    }
  })
}

module.exports = async () => {
  let maxDowntime = await configService.getByKeyAsync('max-downtime', 120, Number)
  let nodes = await nodeService.findAsync()
  for (let node of nodes) {
    if (!node.activedAt) {
      continue
    }

    // 获取新状态
    let newStatus = {
      ok: isStatusOk(node.activedAt, maxDowntime),
      activedAt: node.activedAt
    }

    // 获取旧状态
    let oldStatus = await nodeService.getStatusAsync(node.nodeId)
    if (!oldStatus) {
      oldStatus = newStatus
    }

    // 对比新旧状态
    if (!newStatus.ok && oldStatus.ok) {
      sendMessage(`【${node.name}】(ID:${node.nodeId})科学上网服务异常，请及时检查`)
    } else if (newStatus.ok && !oldStatus.ok) {
      let long = moment(oldStatus.activedAt).fromNow(true)
      sendMessage(`【${node.name}】(ID:${node.nodeId})科学上网服务已恢复，本次服务中断时长 ${long}`)
    }

    // 更新节点状态
    await nodeService.setStatusAsync(node.nodeId, newStatus)
  }
}
