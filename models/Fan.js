// class Fan(object):

//     def __init__(self):
//         logger.info("Creating fan")
//         self.state = OFF
//         self.prev_fan_millis = 0  # last time vent state updated
//         self.fan_on_delta = cfg.getItemValueFromConfig('fan_on_t')  # vent on time
//         self.fan_off_delta = cfg.getItemValueFromConfig('fan_off_t')  # vent off time

//     def control(self, current_millis):
//         logger.info('==fan ctl==')
//         # if fan off, we must wait for the interval to expire before turning it on
//         logger.info('==current millis: %s' % (current_millis))
//         logger.info('==current fan state: %s' % (self.state))
//         if self.state == OFF:
//             # if time is up, so change the state to ON
//             if current_millis - self.prev_fan_millis >= self.fan_off_delta:
//                 self.state = ON
//                 logger.info("..FAN ON")
//                 self.prev_fan_millis = current_millis
//         # else if fanState is ON
//         else:
//             # time is up, so change the state to LOW
//             if (current_millis - self.prev_fan_millis) >= self.fan_on_delta:
//                 self.state = OFF
//                 logger.info("..FAN OFF")
//                 self.prev_fan_millis = current_millis
//         return
const log = require('../lib/log');
const logic = require('../lib/config');

// const config = require('../lib/config');
const FanHardware = require('../hardware/raspberrypi/FanHardware');// class not object

class Fan {
  constructor() {
    log.error('constructing fan object');
    this._lightHardware = new LightHardware();
    this._state = logic.OFF;
  }

  get state() {
    log.debug(`Get Light state: ${this._state}`);
    this._state = this._lightHardware.controlState;
    return this._state;
  }

  set state(state) {
    this._lightHardware.controlState = state;
    this._state = state;
    log.debug(`Set Light state: ${this._state}`);
  }

  get level() {
    log.debug(`Get Light level: ${this._lightHardware.level()}`);
    this._level = this._lightHardware.level();
    return this._level;
  }
}
module.exports = Light;
