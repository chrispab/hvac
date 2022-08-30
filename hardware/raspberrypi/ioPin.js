/**
 * Io pin clas to define io pin properties and methods
 * can be sub classed to customise 
 */
class PiIOPin {
    //create IOPin, with default state of OFF
    constructor(pinNumber, state = OFF) {
      //pass in the hardware depedency
      this._GPIOPin = pinNumber;
      console.log('Creating PiIOPin, GPIO: ' + this._GPIOPin);
      
    }
    //get/read state of the IOPin
    get state() {
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
  