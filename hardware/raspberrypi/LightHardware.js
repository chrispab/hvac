const { Gpio } = require('onoff');
const log = require('../../lib/log');
const config = require('../../lib/config');

const { logic } = config;

// require('../../lib/config');

class LightHardware {
  constructor() {
    // hardware dependent class
    // to
    // 1. get the ambient light state - on/off - threshold for definition set by setSensorThreshold
    // 2. set the light control state - on/off -
    // not necessarily supported by underlying hardware
    // - may be under external - unconnected control
    // 3. get current light control state
    // 3. read the raw sensor light sensor level -
    // 4. set the raw sensor level that dictates if light state is on/off

    // should have ability to R/W  and any other custom funcs
    // such as take reading from custom hardware
    this._state = logic.OFF;// state of hardware controlling the light
    this._sensedState; // the ambient light level determined by LDR sensor
    this._environment = config.envName;
    this._sensorLightDarkThreshold = 300;
    this._level = 500;// initial or used when in dev mode
    this._RCPin = new Gpio(config.pins.LDRPin, 'out');
    if (this._environment === 'production') {
      this._lightControlHardware = new Gpio(config.pins.LightControlPin, 'out');
    }

    // charge it
    log.debug('constructing LightHardware object');
    // this._lightHardware = new LightHardware();
  }

  getLevelRaw() {
    return this._level;
  }

  // get state of a controlled light source
  get state() {
    if (this._environment === 'production') {
      log.debug(`Get LightControlHardware state : ${this._environment} : ${this._state}`);
    } else {
      log.debug(`Get LightControlHardware state : ${this._environment} : ${this._state}`);
    }
    return this._state;
  }

  // set state of controlled light souyrce
  set state(state) {
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

  readLightSensor = () => {
    //     GPIO.setup(RCPin, GPIO.IN)  #set RC pin to hi impedance
    this._RCPin.setDirection('in');
    // allow rc to charge - dependent on ldr resistance
    //     # Count loops until voltage across capacitor reads high on GPIO
    //     measurement = 0
    let count = 0;
    //     while (GPIO.input(RCPin) == GPIO.LOW) and (measurement < 9999):
    //         measurement += 1
    //     return measurement
    while ((this._RCPin.readSync(0) === 0) && count < 9999) {
      count += 1;
    }
    this._level = count;
  };

  get level() {
  // # Function to measure res-cap charge time
  // def RCtime (RCPin):

    if (this._environment === 'production') {
      //     # Discharge capacitor
      //     GPIO.setup(RCPin, GPIO.OUT)
      this._RCPin = new Gpio(config.pins.LDRPin, 'out');
      //     GPIO.output(RCPin, GPIO.LOW)
      this._RCPin.writeSync(logic.OFF);
      //     time.sleep(0.1) #give time for C to discharge
      // runs after 100 mseconds
      setTimeout(this.readLightSensor, 100);

      log.debug(`Get LightHardware level: ${this._environment} : ${this._level}`);
      // this._level = this.getLevelRaw();
    } else {
      log.debug(`Get LightHardware level: ${this._environment} : ${this._level}`);
    }
    return this._level;
  }
}
module.exports = LightHardware;
