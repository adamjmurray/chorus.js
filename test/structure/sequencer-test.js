const assert = require('assert');
const Sequencer = require('../../structure/sequencer');

describe('Sequencer', () => {

  describe('constructor()', () => {
    it('defaults iterablesByName to an empty object', () => {
      assert.deepEqual(new Sequencer().iterablesByName, {});
    });
  });
});
