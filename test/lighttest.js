assert = require('assert');
const log = require('../lib/log');

// Tip = require('../models/light.js').Tip; // program to test
const Light = require('../models/light');

// const TL = new Light();
// new unit test
describe('Check light', () => {
  describe('GET  state', () => {
    it('should return OFF', () => {
      const TL = new Light();
      const result = TL.state;
      log.info(`result: ${result}`);

      assert.equal('OFF', result);
    });
  });
  //   log.info(`TL.state: ${TL.state}`);
  //   TL.state = 'ON';
  //   log.info(`TL.state: ${TL.state}`);

  describe('GET  state', () => {
    it('should return ON', () => {
      const TL = new Light();
      TL.state = 'ON';
      const result = TL.state;
      assert.equal('ON', result);
    });
  });
});
