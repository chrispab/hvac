class LightHWIO {
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

  //         #new ldr based routine test
  //         count = RCtime(cfg.getItemValueFromConfig('RCPin')) # Measure timing using GPIO4

  //         if ( count > 1000):
  //             lightState = OFF
  //         else:
  //             lightState = ON
}
