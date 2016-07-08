const assert = require('assert');
const Scale = require('../../src/model/scale');
const names = require('../../src/names');

describe('Scale', () => {
  with(names.into(this)) {
    let scale;
    beforeEach(() => {
      scale = new Scale(names.SCALE_TYPES.DORIAN, { root: D });
    });

    describe('step()', () => {
      it("returns a pitch with the scale's pitch class at the given index", () => {
        assert.deepEqual(scale.pitch(0), D4);
        assert.deepEqual(scale.pitch(1), E4);
        assert.deepEqual(scale.pitch(2), F4);
        assert.deepEqual(scale.pitch(3), G4);
        assert.deepEqual(scale.pitch(4), A4);
        assert.deepEqual(scale.pitch(5), B4);
        assert.deepEqual(scale.pitch(6), C5);
      });

      it("allows octave shifts via a option", () => {
        assert.deepEqual(scale.pitch(0, { octave: 4 }), D4);
        assert.deepEqual(scale.pitch(1, { octave: 5 }), E5);
        assert.deepEqual(scale.pitch(2, { octave: 6 }), F6);
        assert.deepEqual(scale.pitch(3, { octave: 7 }), G7);
        assert.deepEqual(scale.pitch(4, { octave: 3 }), A3);
        assert.deepEqual(scale.pitch(5, { octave: 2 }), B2);
        assert.deepEqual(scale.pitch(6, { octave: 1 }), C2);
      });

      it("adds to the octave when wrapping around in the positive direction, ", () => {
        assert.deepEqual(scale.pitch(7), D5);
        assert.deepEqual(scale.pitch(8), E5);
        assert.deepEqual(scale.pitch(9), F5);
        assert.deepEqual(scale.pitch(10), G5);
        assert.deepEqual(scale.pitch(11), A5);
        assert.deepEqual(scale.pitch(12), B5);
        assert.deepEqual(scale.pitch(13), C6);
        assert.deepEqual(scale.pitch(14), D6);
      });

      it("subtracts from the octave when wrapping around in the negative direction", () => {
        assert.deepEqual(scale.pitch(-1), C4);
        assert.deepEqual(scale.pitch(-2), B3);
        assert.deepEqual(scale.pitch(-3), A3);
        assert.deepEqual(scale.pitch(-4), G3);
        assert.deepEqual(scale.pitch(-5), F3);
        assert.deepEqual(scale.pitch(-6), E3);
        assert.deepEqual(scale.pitch(-7), D3);
        assert.deepEqual(scale.pitch(-8), C3);
        assert.deepEqual(scale.pitch(-9), B2);
      });
    });
  }
});
