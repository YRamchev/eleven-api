const { configure, getLogger } = require('log4js')

configure({
  appenders: {
    console: { type: 'stdout', layout: { type: 'colored' } },
    dateFile: {
      type: 'dateFile',
      filename: `${process.env.LOG_DIR}/${process.env.LOG_FILE}`,
      layout: { type: 'basic' },
      compress: true,
      numBackups: 1,
      keepFileExt: true,
    },
  },

  categories: {
    default: {
      appenders: ['console', 'dateFile'],
      level: process.env.LOG_LEVEL,
    },
  },
})

module.exports = getLogger()
