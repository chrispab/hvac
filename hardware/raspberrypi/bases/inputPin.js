const Gpio = require('onoff').Gpio;
const { logic } = config;

/**
 * Input pin class
 *  to define io pin properties and methods
 * can be sub classed to customise 
 */
 class InputPin {
    #_GPIOPin;
    #_ipPin;
    //create IOPin, with default state of OFF
    constructor(GPIOPinNumber) {
      //pass in the hardware depedency
      // this._pin = pinNumber;
      
      //configure as GPIO input pin
      console.log('Creating nput pin, GPIO: ' + GPIOPinNumber);
      this._pin = new Gpio(GPIOPinNumber, 'in');
    }
    //get/read state of the IOPin
    get state() {
      return this._pin.readSync();
    }
  
    set state(){
        
    }

  }