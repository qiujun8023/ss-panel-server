const { Op } = require('sequelize')
const moment = require('moment')

const { Traffic, User } = require('../model')
const sequelize = require('../lib/sequelize')

exports.createAsync = async (data) => {
  return Traffic.create(data)
}

exports.findStatAsync = async (where) => {
  let data = await Traffic.findAll({
    where: Object.assign(where || {}, {
      createdAt: {
        [Op.gt]: moment().subtract(31, 'days').toDate()
      }
    }),
    attributes: [
      [sequelize.fn('SUM', sequelize.col('flow_up')), 'flowUp'],
      [sequelize.fn('SUM', sequelize.col('flow_down')), 'flowDown'],
      [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%m-%d'), 'date']
    ],
    group: 'date'
  })

  let res = data.reduce((res, item) => {
    item = item.get({plain: true})
    res[item.date] = {
      date: item.date,
      flowUp: Number(item.flowUp),
      flowDown: Number(item.flowDown)
    }
    return res
  }, {})

  // 填写不存在的日期
  let startDate = moment()
  for (let i = 0; i <= 30; i++) {
    let date = startDate.format('MM-DD')
    if (!res[date]) {
      res[date] = {
        date,
        flowUp: 0,
        flowDown: 0
      }
    }
    startDate.subtract(1, 'day')
  }

  return Object.values(res).sort((a, b) => {
    return a.date > b.date ? 1 : -1
  })
}

exports.findActiveUserAsync = async (nodeId) => {
  let data = await Traffic.findAll({
    attributes: [
      'userId',
      [sequelize.fn('MAX', sequelize.col('traffic.created_at')), 'activedAt']
    ],
    where: {
      nodeId,
      [Op.or]: {
        flowUp: {
          [Op.gte]: 1024
        },
        flowDown: {
          [Op.gte]: 1024
        }
      }
    },
    group: 'userId',
    order: [[sequelize.col('activedAt'), 'DESC']]
  })

  let users = await User.findAll()
  return data.map((item) => {
    item = item.get({ plain: true })
    for (let user of users) {
      if (user.userId === item.userId) {
        return {
          username: user.username,
          nickname: user.nickname,
          activedAt: item.activedAt
        }
      }
    }

    return {
      username: 'unknown',
      nickname: '未知',
      activedAt: item.activedAt
    }
  })
}

exports.deleteByDayAsync = async (days) => {
  let ms = days * 24 * 60 * 60 * 1000
  let ts = (new Date()).getTime() - ms
  return Traffic.destroy({
    where: {
      activedAt: {
        [Op.lt]: new Date(ts)
      }
    }
  })
}
