const log = require('../lib/log');
const logic = require('../lib/config');

// const config = require('../lib/config');
const LightHardware = require('../hardware/raspberrypi/LightHardware');// class not object

class Light {
  constructor() {
    // decouple this routine via a defined interface to a hardware dependent claas
    // to
    // 1. read the ambient light state - on/off
    // 2. set the light state - on/off - not necessarily supported by underlying hardware
    // 3. read the raw sensor light sensor level -
    // 4. set the raw sensor level that dictates if light state is on/off

    // should have ability to R/W  and any other custom funcs
    // such as take reading from custom hardware
    // log.level(config.log.level);
    log.error('constructing light object');
    this._lightHardware = new LightHardware();
    this._state = logic.OFF;
  }

  get state() {
    log.debug(`Get Light state: ${this._state}`);
    this._state = this._lightHardware.controlState;
    return this._state;
  }

  set state(state) {
    this._lightHardware.controlState = state;
    this._state = state;
    log.debug(`Set Light state: ${this._state}`);
  }

  get level() {
    log.debug(`Get Light level: ${this._lightHardware.level()}`);
    this._level = this._lightHardware.level();
    return this._level;
  }
}
module.exports = Light;
