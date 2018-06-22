const configService = require('../service/config')
const trafficService = require('../service/traffic')

module.exports = async () => {
  let days = await configService.getByKeyAsync('transfer-log-save-days')
  return trafficService.deleteByDayAsync(days)
}
