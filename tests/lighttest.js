const chai = require('chai');
const log = require('../lib/log');
const config = require('../lib/config');

const { expect } = chai;

console.log(config.log.level);

log.level(config.log.level);
const Light = require('../models/light');

describe('Check light', () => {
  describe('when creating a Light', () => {
    it('its state should be OFF', () => {
      const TL = new Light();
      const result = TL.state;
      expect(result).to.equal('OFF');
    });
  });
  describe('when setting state a Light', () => {
    it('set state ON should READ ON', () => {
      const TL = new Light();
      TL.state = 'ON';
      const result = TL.state;
      expect(result).to.equal('ON');
    });
  });
});
