const chai = require('chai');
const log = require('../lib/log');
const config = require('../lib/config');

const { logic } = config;
const { expect } = chai;
log.level(config.log.level);
const Light = require('../models/LightControl');

const LightControlHW = require(`../hardware/${config.hardware.platform}/LightControlHW`);

describe('Check LightControlHW', () => {
  describe('when creating LightControlHW hardware', () => {
    it('with no params, state should be OFF', () => {
      const TL = new LightControlHW();
      const result = TL.controlState;
      expect(result).to.equal(logic.OFF);
    });
    it('when creasted LightControlHW with ON param, returns ON', () => {
      const TL = new LightControlHW(logic.ON);
      const result = TL.controlState;
      expect(result).to.equal(logic.ON);
    });
  });
  describe('when setting state a LightControlHW', () => {
    it('set state LightControlHW ON should READ ON', () => {
      const TL = new LightControlHW();
      TL.controlState = logic.ON;
      const result = TL.controlState;
      expect(result).to.equal(logic.ON);
    });
  });
});

describe('Check light', () => {
  describe('when creating a Light', () => {
    it('its state should be OFF', () => {
      const TL = new Light();
      const result = TL.state;
      expect(result).to.equal(logic.OFF);
    });
  });
  describe('when setting state a Light', () => {
    it('set state ON should READ ON', () => {
      const TL = new Light();
      TL.state = logic.ON;
      const result = TL.state;
      expect(result).to.equal(logic.ON);
    });
  });
});
