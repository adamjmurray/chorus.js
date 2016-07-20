const assert = require('assert');
const Chord = require('../../src/models/chord');

describe('Chord', () => {

  describe('constructor()', () => {
    it('constructs a Chord with the given scale offsets', () => {
      assert.deepEqual(new Chord([0,2,4]).offsets, [0,2,4]);
    });
  });
});
