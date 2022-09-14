const log = require('../lib/log');
const logic = require('../lib/config');

// const config = require('../lib/config');
const LightHardware = require('../hardware/raspberrypi/LightControlHW');// class not object

class LightSEnsor {
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
    log.debug('constructing light object');
    // this._lightControlH = new LightHardware();
    this._lightSensorHW = new LightSensor();
    this._state = logic.OFF;
  }

  get level() {
    log.debug(`Get Light level: ${this._lightHardware.level()}`);
    this._level = this._lightHardware.level();
    return this._level;
  }
}
module.exports = Light;
