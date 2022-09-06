/*
 * Primary file for the hvac Engine
 */

// Dependencies
const process = require('process');
// eslint-disable-next-line no-unused-vars
// const dotenv = require('dotenv').config();
require('dotenv').config();

// const { Gpio } = require('onoff');
const config = require('./lib/config');
const log = require('./lib/log');
const sensor = require('./lib/sensor');
const transmitter = require('./lib/transmitter');
const blinker = require('./lib/blinker');
const Light = require('./models/light');

log.info('\n\n');
log.info('=======================================\n');
// Create the component parts of the hvac controller
const light = new Light();

//------------------------------------------------------------
const hvac = {};

hvac.init = function init() {
  log.info('--------------------------------------\n\n');
  log.info('Started hvac zone controller');
  // log.debug(`Environment vars: ${process.env.toString()}`);
  log.debug(`config: ${JSON.stringify(config)}`);
  log.info(`Setting Logger level: ${config.log.level}`);
  log.level(config.log.level);

  light.state = 1;
  // blinker.startBlinking();
  transmitter.connect(() => {
    hvac.intervalTimer = setTimeout(() => {
      hvac.measureAndSend();
    });
  });
};

hvac.measureAndSend = function measureAndSend() {
  // log.info('measureAndSend');
  blinker.blinkLED();

  sensor.read((senorErr, measurement) => {
    if (!senorErr) {
      // transmitter.send(measurement, (transmitErr) => {
      //   if (transmitErr) {
      //     log.error(`An error occurred while publishing the measurement. Err: ${transmitErr}`);
      //   } else {
      //     // log.info('Successfull tx to mqtt broker');
      //   }
      // });
    } else {
      log.error(`An error occurred while trying to read the sensor. Err: ${senorErr}`);
    }

    hvac.intervalTimer = setTimeout(() => {
      hvac.measureAndSend();
    }, config.measurement.readInterval * 500);
  });
};

hvac.shutdown = function shutdown() {
  clearInterval(hvac.intervalTimer);
  transmitter.disconnect(() => {
    process.exit();
  });
};

// handling shutdown signals
process.on('SIGINT', () => {
  log.info('Got SIGINT, gracefully shutting down');
  hvac.shutdown();
});

process.on('SIGTERM', () => {
  log.info('Got SIGTERM, gracefully shutting down');
  hvac.shutdown();
});

hvac.init();

module.exports = hvac;
