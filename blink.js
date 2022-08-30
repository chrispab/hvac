var Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
//var LED = new Gpio(4, "out"); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms
const useLed = (led, value) => led.writeSync(value);
function blinkLED() {
  //function to start blinking
  if (Gpio.accessible) {
    LED = new Gpio(4, "out");
    if (LED.readSync() === 0) {
      //check the pin state, if the state is 0 (or off)
      LED.writeSync(1); //set pin state to 1 (turn LED on)
    } else {
      LED.writeSync(0); //set pin state to 0 (turn LED off)
    }
  } else{
    LED = {
        writeSync: value => {
          console.log('virtual led now uses value: ' + value);
        }
      };
  }
  useLed(LED, 1);
}

function endBlink() {
  //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds
