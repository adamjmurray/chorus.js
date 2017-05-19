const assert = require('assert');
const { Part, Rhythm, Random } = require('../../index');
const { take } = require('../../utils');

describe('Part', () => {

  describe('constructor()', () => {
    it("doesn't blow up when given no arguments", () => {
      assert(new Part());
    });

    it('defaults the rhythm.pulse to 1', () => {
      assert.deepEqual(new Part({ rhythm: [1,2,1] }).rhythm.times, [0,1,3]);
    });

    it('accepts a Rhythm object for the rhythm option', () => {
      const rhythm = new Rhythm();
      assert.equal(new Part({ rhythm }).rhythm, rhythm);
    });

    it('accepts an options object for the rhythm option', () => {
      assert.deepEqual(new Part({ rhythm: { pattern: [1,2,1] } }).rhythm.times, [0,1,3]);
    });

    it('supports Random.pitch() in the pitches list', () => {
      // default Random.pitch() returns 0, 1 or 2
      const part = new Part({ pitches: [-1, Random.pitch()], looped: true });
      const pitches = new Set();
      let even = true;
      take(part[Symbol.iterator](), 100).forEach(({ time, pitch }, idx) => {
        assert.equal(time, idx);
        if (even) {
          assert.equal(pitch, -1);
        } else {
          assert(pitch === 0 || pitch === 1 || pitch === 2);
        }
        pitches.add(pitch);
        even = !even;
      });
      assert.deepEqual([...pitches].sort((a,b)=>a-b), [-1,0,1,2]);
    });
  });

  describe('MODES', () => {
    it('provides constants for the supported part MODES option values', () => {
      assert.equal(Object.keys(Part.MODES).length, 6);
      assert.equal(Part.MODES.ARPEGGIO, 'arpeggio');
      assert.equal(Part.MODES.BASS, 'bass');
      assert.equal(Part.MODES.CHORD, 'chord');
      assert.equal(Part.MODES.CHROMATIC, 'chromatic');
      assert.equal(Part.MODES.LEAD, 'lead');
      assert.equal(Part.MODES.SCALE, 'scale');
    });

    it('is immutable', () => {
      Part.MODES.BASS = 'lead';
      assert.equal(Part.MODES.BASS, 'bass');
      Part.MODES = {};
      assert.equal(Part.MODES.BASS, 'bass');
    });
  });

  describe('[Symbol.iterator]()', () => {
    it("doesn't blow up when constructed with no arguments", () => {
      const part = new Part();
      const iterator = part[Symbol.iterator]();
      assert(iterator.next().done);
    });

    it('loops correctly with non-looped rhythms', () => {
      const part = new Part({ pitches: [0], rhythm: 'X', looped: true });
      assert.deepEqual(
        take(part, 10),
        new Array(10).fill(0).map((_,idx) => ({ time: idx, intensity: 1, duration: 1, pitch: 0 }))
      );
    });
  });
});
