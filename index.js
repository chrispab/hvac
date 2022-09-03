/*
 * Primary file for the Workflow Engine
 */

// Dependencies
const process = require('process');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

const { Gpio } = require('onoff');
const config = require('./lib/config');
const log = require('./lib/log');
const sensor = require('./lib/sensor');
const transmitter = require('./lib/transmitter');

//-----------------------------------------------------
// include onoff to interact with the GPIO
const LED = new Gpio(4, 'out'); // use GPIO pin 4, and specify that it is output
// const blinkInterval = setInterval(blinkLED, 250); // run the blinkLED function every 250ms
const Light = require('./models/light');

const light = new Light(15);

function blinkLED() { // function to start blinking
  // log.info('blink');
  if (LED.readSync() === 0) { // check the pin state, if the state is 0 (or off)
    LED.writeSync(1); // set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); // set pin state to 0 (turn LED off)
  }
}

function endBlink() { // function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

// setTimeout(endBlink, 5000); // stop blinking after 5 seconds
//------------------------------------------------------------
const app = {};

app.init = function init() {
  log.info('Started hvac zone controller');
  // console.log(process.env);
  // log.debug(`Environment vars: ${process.env.toString()}`);
  log.info(`Setting Logger level: ${config.log.level}`);
  log.level(config.log.level);

  transmitter.connect(() => {
    app.intervalTimer = setTimeout(() => {
      app.measureAndSend();
    });
  });
};

app.measureAndSend = function measureAndSend() {
  // log.info('measureAndSend');
  blinkLED();
  light.state = 1;
  light.state;
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
    }, config.measurement.readInterval * 10000);
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
