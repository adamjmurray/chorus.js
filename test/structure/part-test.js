const assert = require('assert');
const { Part, Rhythm } = require('../../src');

describe('Part', () => {

  describe('constructor()', () => {
    it("doesn't blow up when given no arguments", () => {
      assert(new Part());
    });

    it('defaults the rhythm.rate to 1', () => {
      assert.deepEqual(new Part({rhythm: [1,2,1]}).rhythm.times, [0,1,3]);
    });

    it('accepts a Rhythm object for the rhythm option', () => {
      const rhythm = new Rhythm();
      assert.equal(new Part({rhythm}).rhythm, rhythm);
    });
  });
});
