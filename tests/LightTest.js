const chai = require('chai');
const log = require('../lib/log');
const config = require('../lib/config');

const { logic } = config;

const { expect } = chai;

console.log(config.log.level);

log.level(config.log.level);
const Light = require('../models/Light');

// console.log(config.hardware.platform);
// console.log(logic);
const LightHardware = require(`../hardware/${config.hardware.platform}/LightHardware`);

// describe('Testing', () => {
describe('Check light hardware', () => {
  describe('when creating Light hardware', () => {
    it('with no params, state should be OFF', () => {
      const TL = new LightHardware();
      const result = TL.controlState;
      expect(result).to.equal(logic.OFF);
      // console.log(logic.OFF);
      // log.error(`logic OFF = ${logic.OFF}`);
      log.error(`when creating a Light is OFF = ${result}`);
    });
    it('when creasted with ON param, returns ON', () => {
      const TL = new LightHardware(logic.ON);
      const result = TL.controlState;
      expect(result).to.equal(logic.ON);
      // console.log(logic.OFF);
      // log.error(`logic OFF = ${logic.OFF}`);
      log.error(`when creating a Light with ON constructor = ${result}`);
    });
  });
  describe('when setting state a Light', () => {
    it('set state ON should READ ON', () => {
      const TL = new LightHardware();
      TL.controlState = logic.ON;
      const result = TL.controlState;
      expect(result).to.equal(logic.ON);
      log.error(`when setting state a Lighton logic = ${result}`);
    });
  });
});

describe('Check light', () => {
  describe('when creating a Light', () => {
    it('its state should be OFF', () => {
      const TL = new Light();
      const result = TL.state;
      expect(result).to.equal(logic.OFF);
      log.error(`when creating a Light on logic = ${result}`);
    });
  });
  describe('when setting state a Light', () => {
    it('set state ON should READ ON', () => {
      const TL = new Light();
      TL.state = logic.ON;
      const result = TL.state;
      expect(result).to.equal(logic.ON);
      log.error(`when setting state a Lighton logic = ${result}`);
    });
  });
});
