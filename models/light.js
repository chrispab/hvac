'use strict';
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

class Light {
  constructor(state = OFF) {
    //pass in the hardware depedency
    console.log('creating light object');
    this._state = state;
  }
  get state() {
    // Measure timing using GPIO4
    // abstract with intermidiate func from hardware
    return this._state;
  }
}
