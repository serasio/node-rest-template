const PinoLogger = require('pino');
const config = require('../config');

const logger = new PinoLogger({ level: config.LOGGER_LEVEL });

module.exports = {
  logger,
};
