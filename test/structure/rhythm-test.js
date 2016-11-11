const assert = require('assert');
const { Rhythm } = require('../../src');

describe('Rhythm', () => {

  describe('constructor()', () => {
    it('defaults the rate option to 1/4', () => {
      // Note that times of 0 are ignored:
      assert.deepEqual(new Rhythm([1,1,1,0,1]).times, [0, 1/4, 2/4, 3/4]);
    });

    it('accepts a rhythm string', () => {
      // The extra garbage after the last 'x' tests that junk is silently ignored:
      const rhythm = new Rhythm('X.x=.X==x..=.z');
      assert.deepEqual(rhythm.times, [0, 0.5, 1.25, 2]);
      assert.deepEqual(rhythm.durations, [1/4, 1/2, 3/4, 1/4]);
      assert.deepEqual(rhythm.intensities, [1, 0.7, 1, 0.7]);
    });
  });

  describe('distribute()', () => {
    it('generates euclidean rhythms', () => {
      assert.equal(Rhythm.distribute(5, 13), 'x..x..x.x..x.');
    });

    it('can optionally apply a rotation the resulting rhythm', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: 1 }), 'x..x.x..x.x..');
    });

    it('can rotate more than once', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: 2 }), 'x.x..x.x..x..');
    });

    it('can rotate in reverse', () => {
      assert.equal(Rhythm.distribute(5, 13, {rotation: -1 }), 'x.x..x..x.x..');
    });

    it('can rotate in reverse more than once', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: -2 }), 'x..x.x..x..x.');
    });

    it('generates continuous pulses when pulses == total', () => {
      assert.equal(Rhythm.distribute(10, 10), 'xxxxxxxxxx');
    });

    it('generates continuous pulses when pulses > total', () => {
      assert.equal(Rhythm.distribute(11, 10), 'xxxxxxxxxx');
      assert.equal(Rhythm.distribute(11, 10, { rotation: 1 }), 'xxxxxxxxxx');
      assert.equal(Rhythm.distribute(11, 10, { rotation: -1 }), 'xxxxxxxxxx');
    });

    it('generates no pulses when pulses is 0', () => {
      assert.equal(Rhythm.distribute(0, 10), '..........');
      assert.equal(Rhythm.distribute(0, 10, { rotation: 1 }), '..........');
      assert.equal(Rhythm.distribute(0, 10, { rotation: -1 }), '..........');
    });
  });
});
