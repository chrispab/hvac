const { Gpio } = require('onoff');
const config = require('../../../lib/config');
const log = require('../../../lib/log');

const { logic } = config;

/**
 * Input pin class
 *  to define io pin properties and methods
 * can be sub classed to customise
 */
class OutputPin {
  // create IOPin, with default state of OFF
  constructor(GPIOPinNumber, initialState = logic.OFF) {
    log.debug(`Creating output pin, GPIO: ${GPIOPinNumber},ini: ${initialState}`);

    this._environment = config.envName;

    // configure as GPIO op pin
    if (this._environment === 'production') {
      this._pin = new Gpio(GPIOPinNumber, 'out');
      this._pin.writeSync(initialState);
    }
    this._state = initialState;
  }

  // get state of op pin
  get state() {
    if (this._environment === 'production') {
      // may need to implement reading froom real hardware if reqd func
      this._state = this._pin.readSync();
      log.debug(`Get OutputPin state : ${this._environment} : ${this._state}`);
    } else {
      log.debug(`Get OutputPin state : ${this._environment} : ${this._state}`);
    }
    return this._state;
  }

  // set state of op pin
  set state(state) {
    if (this._environment === 'production') {
      // write to hardware to set light on/off
      this._pin.writeSync(state);
      log.debug(`Set OutputPin state : ${this._environment} : ${this._state}`);
    } else {
      // this._state = state;
      log.debug(`Set OutputPin state : ${this._environment} : ${this._state}`);
    }
    this._state = state;
  }
}

module.exports = OutputPin;
