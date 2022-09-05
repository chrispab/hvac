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
/// /////////////////////////////////////////
// # Function to measure res-cap charge time
// def RCtime (RCPin):
//     # Discharge capacitor
//     GPIO.setup(RCPin, GPIO.OUT)
//     GPIO.output(RCPin, GPIO.LOW)
//     time.sleep(0.1) #give time for C to discharge
//     GPIO.setup(RCPin, GPIO.IN)  #set RC pin to hi impedance
//     # Count loops until voltage across capacitor reads high on GPIO
//     measurement = 0
//     while (GPIO.input(RCPin) == GPIO.LOW) and (measurement < 9999):
//         measurement += 1
//     return measurement

const log = require('../lib/log');
const config = require('../lib/config');

class Light {
  constructor() {
    // pass in the hardware depedent io pin object
    // should have ability to R/W  and any other custom funcs
    // such as take reading from custom hardware
    // const { LDRPin } = config.pins;
    // console.log('creating light object');
    log.info(`constructing light object, LDR Pin:${config.pins.LDRPin}`);
    // set the hardware IO pin object - has methods like set(light ON or OFF),
    // get(current lights state, may include custom hardware routine e.g. using RC LDR pin)
    this._hardwareIOPin = config.pins.LDRPin;
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
