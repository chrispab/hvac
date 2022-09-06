const { Gpio } = require('onoff');
const log = require('../../lib/log');
const config = require('../../lib/config');

class LightHardware {
  constructor() {
    // hardware dependent claas
    // to
    // 1. read the ambient light state - on/off
    // 2. set the light state - on/off - not necessarily supported by underlying hardware
    // 3. read the raw sensor light sensor level -
    // 4. set the raw sensor level that dictates if light state is on/off

    // should have ability to R/W  and any other custom funcs
    // such as take reading from custom hardware
    this._RCPin = new Gpio(config.pins.LDRPin, 'out');
    // charge it
    log.debug('constructing LightHardware object');
    // this._lightHardware = new LightHardware();
  }

  getLevelRaw() {
    return 500;
  }

  get state() {
    if (config.envName === 'development') {
      log.debug(`Get LightHardware state DEV: ${this._state}`);
    } else {
      log.debug(`Get LightHardware state PRODUCTION: ${this._state}`);
    }
    return this._state;
  }

  set state(state) {
    if (config.envName === 'development') {
      log.debug(`Set LightHardware state development: ${this._state}`);
    } else {
      log.debug(`Set LightHardware state PRODUCTION: ${this._state}`);
    }
    this._state = state;
  }

  get level() {
  // # Function to measure res-cap charge time
  // def RCtime (RCPin):
  //     # Discharge capacitor
  //     GPIO.setup(RCPin, GPIO.OUT)
    this._RCPin = new Gpio(config.pins.LDRPin, 'out');
    //     GPIO.output(RCPin, GPIO.LOW)
    this._RCPin.writeSync(0);
    //     time.sleep(0.1) #give time for C to discharge

    //     GPIO.setup(RCPin, GPIO.IN)  #set RC pin to hi impedance
    //     # Count loops until voltage across capacitor reads high on GPIO
    //     measurement = 0
    //     while (GPIO.input(RCPin) == GPIO.LOW) and (measurement < 9999):
    //         measurement += 1
    //     return measurement

    if (config.envName === 'development') {
      log.debug(`Get LightHardware level DEV: ${this._state}`);
    } else {
      log.debug(`Get LightHardware level PRODUCTION: ${this._state}`);
      this._state = this.getLevelRaw();
    }
    return this._state;
  }
}
module.exports = LightHardware;
