const { Gpio } = require('onoff');

const { logic } = config;

/**
 * Input pin class
 *  to define io pin properties and methods
 * can be sub classed to customise
 */
class OutPin {
  // create IOPin, with default state of OFF
  constructor(GPIOPinNumber, state = logic.OFF) {
    // configure as GPIO op pin
    console.log(`Creating nput pin, GPIO: ${GPIOPinNumber}`);
    this._pin = new Gpio(GPIOPinNumber, 'out');
  }

  // get state of op pin
  get controlState() {
    if (this._environment === 'production') {
      log.debug(`Get LightControlHardware state : ${this._environment} : ${this._state}`);
    } else {
      log.debug(`Get LightControlHardware state : ${this._environment} : ${this._state}`);
    }
    return this._state;
  }

  // set state of op pin
  set controlState(state) {
    if (this._environment === 'production') {
      this._state = state;
      // write to hardware to set light on/off
      this._lightControlHardware.writeSync(state);
      this._state = state;
      log.debug(`Set LightControlHardware state : ${this._environment} : ${this._state}`);
    } else {
      this._state = state;
      log.debug(`Set LightControlHardware state : ${this._environment} : ${this._state}`);
    }
  }
}
