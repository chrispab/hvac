const log = require('../lib/log');
const logic = require('../lib/config');
const LightControlHW = require('../hardware/raspberrypi/LightControlHW');// class not object

class LightControl {
  constructor() {
    // 1. read the ambient light state - on/off
    // 2. set the light state - on/off - not necessarily supported by underlying hardware
    log.debug('constructing light object');
    this._lightControlHW = new LightControlHW();
    this._state = logic.OFF;
  }

  get state() {
    log.debug(`Get Light state: ${this._state}`);
    this._state = this._lightControlHW.controlState;
    return this._state;
  }

  set state(state) {
    this._lightControlHW.controlState = state;
    this._state = state;
    log.debug(`Set Light state: ${this._state}`);
  }
}
module.exports = LightControl;
