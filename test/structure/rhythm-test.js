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

    it('allows length to be overridden when pattern is a String', () => {
      const rhythm = new Rhythm({ pattern: 'Xx', length: 4, looped: true });
      assert.deepEqual(take(rhythm, 4), [
        { time: 0, intensity: 1, duration: 1 },
        { time: 1, intensity: 0.7, duration: 1 },
        { time: 4, intensity: 1, duration: 1 },
        { time: 5, intensity: 0.7, duration: 1 },
      ]);
    });

    it('allows length to be overridden when pattern is an Array', () => {
      const rhythm = new Rhythm({ pattern: [1,1], length: 4, looped: true });
      assert.deepEqual(take(rhythm, 4), [
        { time: 0, intensity: 0.7, duration: 1 },
        { time: 1, intensity: 0.7, duration: 1 },
        { time: 4, intensity: 0.7, duration: 1 },
        { time: 5, intensity: 0.7, duration: 1 },
      ]);
    });

    it('supports Random.intensity() in the intensities list', () => {
      const rhythm = new Rhythm({ pattern: [1,2], intensities: [1,Random.intensity()], looped: true });
      let even = true;
      let previousIntensity = null;
      let expectedTime = 0;
      for (const { time, duration, intensity} of take(rhythm[Symbol.iterator](), 20)) {
        assert.equal(time, expectedTime);
        if (even) {
          assert.equal(duration, 1);
          assert.equal(intensity, 1);
          expectedTime += 1;
        } else {
          assert.equal(duration, 2);
          assert(intensity >= 0 && intensity < 1);
          expectedTime += 2;
        }
        assert(intensity !== previousIntensity);
        previousIntensity = intensity;
        even = !even;
      }
    });

    it('supports Random.duration() in the durations list', () => {
      // default Random.duration() returns 1, 2, 3 or 4
      const rhythm = new Rhythm({ pattern: [1], durations: [4,Random.duration()], length: 8, looped: true });
      const durations = new Set();
      let even = true;
      take(rhythm[Symbol.iterator](), 100).forEach(({ time, intensity, duration }, idx) => {
        assert.equal(time, 8 * idx);
        assert.equal(intensity, 0.7);
        assert(duration === 1 || duration === 2 || duration === 3 || duration === 4);
        if (even) assert.equal(duration, 4);
        durations.add(duration);
        even = !even;
      });
      assert.deepEqual([...durations].sort((a,b)=>a-b), [1,2,3,4]);
    });
  });

  describe('distribute()', () => {
    it('generates euclidean rhythms', () => {
      assert.equal(Rhythm.distribute(5, 13), 'x..x..x.x..x.');
    });

    it('can optionally shift the pattern', () => {
      assert.equal(Rhythm.distribute(5, 13, { shift: 1 }), '..x..x.x..x.x');
    });

    it('can shift more than once', () => {
      assert.equal(Rhythm.distribute(5, 13, { shift: 2 }), '.x..x.x..x.x.');
      assert.equal(Rhythm.distribute(5, 13, { shift: 15 }), '.x..x.x..x.x.');
    });

    it('can shift in reverse', () => {
      assert.equal(Rhythm.distribute(5, 13, { shift: -1 }), '.x..x..x.x..x');
    });

    it('can shift in reverse more than once', () => {
      assert.equal(Rhythm.distribute(5, 13, { shift: -2 }), 'x.x..x..x.x..');
      assert.equal(Rhythm.distribute(5, 13, { shift: -15 }), 'x.x..x..x.x..');
    });

    it('can optionally apply a rotation the resulting rhythm', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: 1 }), 'x..x.x..x.x..');
    });

    it('can rotate more than once', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: 2 }), 'x.x..x.x..x..');
      assert.equal(Rhythm.distribute(5, 13, { rotation: 7 }), 'x.x..x.x..x..');
    });

    it('can rotate in reverse', () => {
      assert.equal(Rhythm.distribute(5, 13, {rotation: -1 }), 'x.x..x..x.x..');
    });

    it('can rotate in reverse more than once', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: -2 }), 'x..x.x..x..x.');
      assert.equal(Rhythm.distribute(5, 13, { rotation: -7 }), 'x..x.x..x..x.');
    });

    it('can rotate and shift', () => {
      assert.equal(Rhythm.distribute(5, 13, { rotation: 2, shift: -1 }), '.x.x..x.x..x.');
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
