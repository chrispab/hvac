const Gpio = require('onoff').Gpio;
/**
 * Input pin class
 *  to define io pin properties and methods
 * can be sub classed to customise 
 */
 class PiInputPin {
    #_GPIOPin;
    #_ipPin;
    //create IOPin, with default state of OFF
    constructor(pinNumber, state = OFF) {
      //pass in the hardware depedency
      this._GPIOPin = pinNumber;
      
      //configure as GPIO input pin
      console.log('Creating PiIOPin, GPIO: ' + this._GPIOPin);
      _ipPin = new Gpio(this._GPIOPin, 'in');
    }
    //get/read state of the IOPin
    get state() {
        //read from an input pin

      return this._state;
    }
  
    set state(){
        
    }
    //         #new ldr based routine test
    //         count = RCtime(cfg.getItemValueFromConfig('RCPin')) # Measure timing using GPIO4
  
    //         if ( count > 1000):
    //             lightState = OFF
    //         else:
    //             lightState = ON
  }