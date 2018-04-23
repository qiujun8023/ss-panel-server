const config = require('config')
const TrafficService = require('../service/traffic')

const days = config.get('ss.transferLogSaveDays')

module.exports = async () => {
  return TrafficService.deleteByDayAsync(days)
}
