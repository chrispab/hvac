const { Gpio } = require('onoff'); // include onoff to interact with the GPIO
const log = require('./log');
// const config = require('./config');

//-----------------------------------------------------
// include onoff to interact with the GPIO
const LED = new Gpio(4, 'out'); // use GPIO pin 4, and specify that it is output
// const blinkInterval = setInterval(blinker.blinkLED, 250); // run the blinkLED  every 250ms
const blinker = {};
blinker.LED = LED;

blinker.blinkInterval = 250;

blinker.startBlinking = function startBlinking() {
//   LED = new Gpio(4, 'out');
  log.error(' start blinking');
  blinker.blinkInterval = setInterval(blinker.blinkLED, 1000); // run the blinkLED very 250ms
};

blinker.blinkLED = function blinkLED() { // function to  blink
//   log.error('blink');
  if (blinker.LED.readSync() === 0) { // check the pin state, if the state is 0 (or off)
    blinker.LED.writeSync(1); // set pin state to 1 (turn LED on)
  } else {
    blinker.LED.writeSync(0); // set pin state to 0 (turn LED off)
  }
};

blinker.endBlink = function endBlink() { // function to stop blinking
  clearInterval(blinker.blinkInterval); // Stop blink intervals
  blinker.LED.writeSync(0); // Turn LED off
  blinker.LED.unexport(); // Unexport GPIO to free resources
};
module.exports = blinker;
