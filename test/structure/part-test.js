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
});
