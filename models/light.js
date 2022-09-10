const log = require('../lib/log');
// const config = require('../lib/config');
const lightHardware = require('../hardware/raspberrypi/LightHardware');// class not object

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
    log.info('constructing light object');
    // this._lightHardware = new LightHardware();
    this._state = 'OFF';
  }

  get state() {
    // Measure timing using GPIO4
    // abstract with intermidiate func from hardware
    // state = getIOPinState(this._hardwareIOPin);
    this._state = lightHardware.state();
    log.info(`Get Light state: ${this._state}`);
    // this._state = this._lightHardware.state();
    return this._state;
  }

  set state(state) {
    // this._lightHardware.state = state;
    lightHardware.state = this._state;
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
