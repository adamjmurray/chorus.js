const assert = require('assert');
const { Rhythm } = require('../../src');

describe('Rhythm', () => {

  describe('distribute()', () => {
    it('generates euclidean rhythms', () => {
      const rhythm = Rhythm.euclidean(5, 13, { rate: 1 });
      assert.equal(rhythm.string, 'x..x..x.x..x.');
      assert.deepEqual(rhythm.times, [0, 3, 6, 8, 11]);
    });
    it('can optionally apply a rotation the resulting rhythm', () => {
      const rhythm = Rhythm.euclidean(5, 13, { rate: 1, rotation: 1 });
      assert.equal(rhythm.string, 'x..x.x..x.x..');
    });
    it('can rotate more than once', () => {
      const rhythm = Rhythm.euclidean(5, 13, { rate: 1, rotation: 2 });
      assert.equal(rhythm.string, 'x.x..x.x..x..');
    });
    it('can rotate in reverse', () => {
      const rhythm = Rhythm.euclidean(5, 13, { rate: 1, rotation: -1 });
      assert.equal(rhythm.string, 'x.x..x..x.x..');
    });
    it('can rotate in reverse more than once', () => {
      const rhythm = Rhythm.euclidean(5, 13, { rate: 1, rotation: -2 });
      assert.equal(rhythm.string, 'x..x.x..x..x.');
    });
  });
});
