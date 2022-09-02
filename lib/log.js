/*
 * Logging wrapper
 */
// const logger = require('pino')({ prettyPrint: true });

const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

const log = {};

log.info = function info(message) {
  // logger.level = 10;
  logger.info(message);
};

log.error = function error(message) {
  logger.error(message);
};

log.debug = function debug(message) {
  logger.debug(message);
};

// set loggging level
log.level = function level(loglevel) {
  // logger.info(loglevel);
  logger.level = loglevel;
};

module.exports = log;
