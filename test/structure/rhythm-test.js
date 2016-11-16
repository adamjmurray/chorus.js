const assert = require('assert');
const { Rhythm, Random } = require('../../src');
const { take } = require('../../src/utils');

describe('Rhythm', () => {

  describe('constructor()', () => {
    it('accepts lists of delta-start times for the pattern', () => {
      // Note that times of 0 are ignored:
      assert.deepEqual(new Rhythm({ pattern: [1,1,1,0,1] }).times, [0,1,2,3]);
    });

    it('accepts a String pattern and pulse option', () => {
      // The extra garbage after the last 'x' tests that junk is silently ignored:
      const rhythm = new Rhythm({ pattern: 'X.x=.X==x..=.z', pulse: 1/4 });
      assert.deepEqual(rhythm.times, [0, 0.5, 1.25, 2]);
      assert.deepEqual(rhythm.durations, [1/4, 1/2, 3/4, 1/4]);
      assert.deepEqual(rhythm.intensities, [1, 0.7, 1, 0.7]);
    });

    it('defaults durations to legato durations when pattern is an Array', () => {
      assert.deepEqual(new Rhythm({ pattern: [3,2,1,1] }).durations, [3,2,1,1]);
    });

    it('allows durations to be given as an option when pattern is an Array', () => {
      assert.deepEqual(new Rhythm({ pattern: [3,2,1,1], durations: [1,1,2,1] }).durations, [1,1,2,1]);
    });

    it('allows intensities to be given as an option when pattern is an Array', () => {
      assert.deepEqual(new Rhythm({ pattern: [3,2,1,1], intensities: [0.9,0.7,0.8,1] }).intensities, [0.9,0.7,0.8,1]);
    });

    it('allows Random.intensity()', () => {
      const rhythm = new Rhythm({ pattern: [1,2], intensities: Random.intensity() });
      let bitFlip = 0;
      for (const value of take(rhythm[Symbol.iterator](), 20)) {
        assert.equal(value.duration, bitFlip + 1);
        assert(value.intensity >= 0 && value.intensity < 1);
        bitFlip = (bitFlip + 1) % 2;
      }
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
