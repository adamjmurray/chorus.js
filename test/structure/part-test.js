const assert = require('assert');
const { Part, Rhythm } = require('../../src');

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
    })
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
    })
  });
});
