const assert = require('assert');
const Scale = require('../../src/model/scale');


describe('Scale', () => {
  with(require('../../src/model').into(this)) {
    let scale;
    beforeEach(() => {
      scale = new Scale(D, DORIAN);
    });

    describe('step(index, baseOctave)', () => {
      it("returns a pitch with the scale's pitch class at the given index", () => {
        assert.deepEqual(scale.step(0), D4);
        assert.deepEqual(scale.step(1), E4);
        assert.deepEqual(scale.step(2), F4);
        assert.deepEqual(scale.step(3), G4);
        assert.deepEqual(scale.step(4), A4);
        assert.deepEqual(scale.step(5), B4);
        assert.deepEqual(scale.step(6), C5);
      });

      it("allows octave shifts via an optional second argument", () => {
        assert.deepEqual(scale.step(0, 0), D4);
        assert.deepEqual(scale.step(1, 1), E5);
        assert.deepEqual(scale.step(2, 2), F6);
        assert.deepEqual(scale.step(3, 3), G7);
        assert.deepEqual(scale.step(4, -1), A3);
        assert.deepEqual(scale.step(5, -2), B2);
        assert.deepEqual(scale.step(6, -3), C2);
      });

      it("adds to the octave when wrapping around in the positive direction, ", () => {
        assert.deepEqual(scale.step(7), D5);
        assert.deepEqual(scale.step(8), E5);
        assert.deepEqual(scale.step(9), F5);
        assert.deepEqual(scale.step(10), G5);
        assert.deepEqual(scale.step(11), A5);
        assert.deepEqual(scale.step(12), B5);
        assert.deepEqual(scale.step(13), C6);
        assert.deepEqual(scale.step(14), D6);
      });

      it("subtracts from the octave when wrapping around in the negative direction", () => {
        assert.deepEqual(scale.step(-1), C4);
        assert.deepEqual(scale.step(-2), B3);
        assert.deepEqual(scale.step(-3), A3);
        assert.deepEqual(scale.step(-4), G3);
        assert.deepEqual(scale.step(-5), F3);
        assert.deepEqual(scale.step(-6), E3);
        assert.deepEqual(scale.step(-7), D3);
        assert.deepEqual(scale.step(-8), C3);
        assert.deepEqual(scale.step(-9), B2);
      });
    });
  }
});
