// const { Gpio } = require('onoff');
const log = require('../../lib/log');
const config = require('../../lib/config');

const { logic } = config;
const OutputPin = require('./bases/OutputPin');

class LightControlHW {
  constructor(startState = logic.OFF) {
    const GPIOLightControlPinNumber = config.pins.LightControlPin;
    log.debug(`Creating LightControlHW, GPIO: ${GPIOLightControlPinNumber},ini: ${startState}`);
    // hardware dependent class
    // to
    // 2. set the light control state - on/off -
    // not necessarily supported by underlying hardware
    // - may be under external - unconnected control
    // 3. get current light control state

    this._state = startState;// state of hardware controlling the light
    // this._environment = config.envName;
    this._lightControlPin = new OutputPin(GPIOLightControlPinNumber, startState);
  }

  // get state of a controlled light source
  get controlState() {
    this._state = this._lightControlPin.state;
    return this._lightControlPin.state;
  }

  // set state of controlled light souyrce
  // not implemented in hardware - extrnal timer control
  set controlState(state) {
    this._lightControlPin.state = state;
    this._state = state;
    log.debug(`Set LightControlHardware state : ${this._environment} : ${this._state}`);
  }
}
module.exports = LightControlHW;
