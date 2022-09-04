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

const light = new Light(15);

// setTimeout(endBlink, 5000); // stop blinking after 5 seconds
//------------------------------------------------------------
const app = {};

app.init = function init() {
  log.info('Started hvac zone controller');
  // console.log(process.env);
  // log.debug(`Environment vars: ${process.env.toString()}`);
  log.info(`Setting Logger level: ${config.log.level}`);
  log.level(config.log.level);
  // blinker.startBlinking();
  transmitter.connect(() => {
    app.intervalTimer = setTimeout(() => {
      app.measureAndSend();
    });
  });
};

app.measureAndSend = function measureAndSend() {
  // log.info('measureAndSend');
  // log.error('here');
  blinker.blinkLED();
  // light.state = 1;
  // light.state;
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

    app.intervalTimer = setTimeout(() => {
      app.measureAndSend();
    }, config.measurement.readInterval * 500);
  });
};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  transmitter.disconnect(() => {
    process.exit();
  });
};

process.on('SIGINT', () => {
  log.info('Got SIGINT, gracefully shutting down');
  app.shutdown();
});

process.on('SIGTERM', () => {
  log.info('Got SIGTERM, gracefully shutting down');
  app.shutdown();
});

app.init();

module.exports = app;
