const { Gpio } = require('onoff');
const log = require('../../lib/log');
const config = require('../../lib/config');

const { logic } = config;
// const OutputPin = require('./OutputPin');

// require('../../lib/config');

class LDRPin {
  constructor(GPIOLDRPinNumber, startState = logic.OFF) {
    // 1. get the ambient light state - on/off - threshold for definition set by setSensorThreshold
    // 3. read the raw sensor light sensor level -
    // 4. set the raw sensor level that dictates if light state is on/off

    // should have ability to R/W  and any other custom funcs
    // such as take reading from custom hardware
    this._state = startState;// state of hardware controlling the light
    // this._sensedState; // the ambient light level determined by LDR sensor
    this._environment = config.envName;
    this._sensorLightDarkThreshold = 300;
    this._level = 500;// initial or used when in dev mode
    this._RCPin = new Gpio(GPIOLDRPinNumber, 'out');
    // if (this._environment === 'production') {
    //   this._lightControlPin = new Gpio(config.pins.LightControlPin, 'out');
    // }
    log.debug('constructing LDRPin object');
  }

  getLevelRaw() {
    return this._level;
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
    while ((this._RCPin.readSync() === 0) && count < 9999) {
      count += 1;
    }
    this._level = count;
  };

  get level() {
    if (this._environment === 'production') {
      //     # Discharge capacitor
      //     GPIO.setup(RCPin, GPIO.OUT)
      this._RCPin = new Gpio(config.pins.LDRPin, 'out');
      //     GPIO.output(RCPin, GPIO.LOW)
      this._RCPin.writeSync(logic.OFF);
      //     time.sleep(0.1) #give time for C to discharge
      // give time for C to discharge - runs after 100 mseconds
      setTimeout(this.readLightSensor, 100);

      log.debug(`Get LightHardware level: ${this._environment} : ${this._level}`);
      // this._level = this.getLevelRaw();
    } else {
      log.debug(`Get LightHardware level: ${this._environment} : ${this._level}`);
      this._level = 500;// dummy value
    }
    return this._level;
  }
}
module.exports = LDRPin;
