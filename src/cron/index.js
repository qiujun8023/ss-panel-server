const schedule = require('node-schedule')

const redis = require('../lib/redis')
const logger = require('../lib/logger')

const LOCK_TTL = 180
const LOCK_KEY_PREFIX = 'cron:lock:'

const crons = {
  'initialization': {
    exec: require('./initialization'),
    tick: '0 0 0 1 * *',
    job: null
  },
  'monitor': {
    exec: require('./monitor'),
    tick: '*/30 * * * * *',
    job: null
  },
  'scavenger': {
    exec: require('./scavenger'),
    tick: '0 0 * * * *',
    job: null
  }
}

let runJob = (name, tick, exec) => {
  let lockKey = LOCK_KEY_PREFIX + name
  return schedule.scheduleJob(tick, () => {
    return (async () => {
      // 获取锁
      logger.info(`Try to get cron lock '${lockKey}'`)
      let lock = await redis.set(lockKey, '1', 'NX', 'EX', LOCK_TTL)
      if (!lock) {
        logger.warn(`Failed to get distributed lock '${lockKey}'`)
        return false
      }

      // 运行计划任务
      try {
        logger.info('Try to execute cron function')
        await exec()
      } catch (e) {
        logger.error(e)
      }

      // 删除锁
      logger.info('Try to delete the distributed lock')
      await redis.del(lockKey)
    })().catch((e) => logger.error(e))
  })
}

exports.startJob = (name) => {
  let cron = crons[name]
  if (!cron) {
    logger.error(`Job ${name} not found`)
    return false
  }

  if (cron.job) {
    logger.warn(`Job ${name} is already running`)
  }

  logger.info(`Running job ${name}`)
  cron.job = runJob(name, cron.tick, cron.exec)
}

exports.startAllJob = () => {
  for (let name in crons) {
    exports.startJob(name)
  }
}
