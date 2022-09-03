// class Light(object):
//     def __init__(self):
//         logger.info("creating light object")
//         self.state = OFF
//         self.tOn = dt.time()
//         self.tOff = dt.time()

//     #return true if testTime between timeOn and TimeOff, else false if in off period
//     def getLightState(self ):

//         #new ldr based routine test
//         count = RCtime(cfg.getItemValueFromConfig('RCPin')) # Measure timing using GPIO4

//         if ( count > 1000):
//             lightState = OFF
//         else:
//             lightState = ON

//         self.d_state = lightState
//         return self.d_state
const log = require('../lib/log');

class Light {
  constructor(lightHardwareIOPin) {
    // pass in the hardware depedent io pin object
    // should have ability to R/W  and any other custom funcs
    // such as take reading from custom hardware

    console.log('creating light object');
    log.info('constructing light object');
    // set the hardware IO pin object - has methods like set(light ON or OFF),
    // get(current lights state, may include custom hardware routine e.g. using RC LDR pin)
    this._hardwareIOPin = lightHardwareIOPin;
  }

  get state() {
    // Measure timing using GPIO4
    // abstract with intermidiate func from hardware
    // state = getIOPinState(this._hardwareIOPin);
    log.debug(`Get Light state: ${this._state}`);
    return this._state;
  }

  set state(state) {
    // set the light state
    this._state = state;
    log.debug(`Set Light state: ${this._state}`);
    // setIOPinState(this._hardwareIOPin, state);
  }
}
module.exports = Light;
