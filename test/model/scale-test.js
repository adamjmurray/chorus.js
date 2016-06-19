const assert = require('assert');
const Scale = require('../../src/model/scale');


describe('Scale', () => {
  with(require('../../src/model').into(this)) {
    let scale;
    beforeEach(() => {
      scale = new Scale(D, DORIAN);
    });

    describe('step(index)', () => {
      it("returns the scale's pitch class by index", () => {
        assert.deepEqual(scale.step(0), D);
        assert.deepEqual(scale.step(1), E);
        assert.deepEqual(scale.step(2), F);
        assert.deepEqual(scale.step(3), G);
        assert.deepEqual(scale.step(4), A);
        assert.deepEqual(scale.step(5), B);
        assert.deepEqual(scale.step(6), C);
      });

      it("wraps around in the positive direction", () => {
        assert.deepEqual(scale.step(7), D);
        assert.deepEqual(scale.step(8), E);
        assert.deepEqual(scale.step(9), F);
        assert.deepEqual(scale.step(10), G);
        assert.deepEqual(scale.step(11), A);
        assert.deepEqual(scale.step(12), B);
        assert.deepEqual(scale.step(13), C);
        assert.deepEqual(scale.step(14), D);
      });

      it("wraps around in the negative direction", () => {
        assert.deepEqual(scale.step(-1), C);
        assert.deepEqual(scale.step(-2), B);
        assert.deepEqual(scale.step(-3), A);
        assert.deepEqual(scale.step(-4), G);
        assert.deepEqual(scale.step(-5), F);
        assert.deepEqual(scale.step(-6), E);
        assert.deepEqual(scale.step(-7), D);
        assert.deepEqual(scale.step(-8), C);
      });
    });

    describe('step(index, baseOctave)', () => {
      it("returns a Pitch with the scale's pitch class at the given index and the baseOctave", () => {
        assert.deepEqual(scale.step(0, 4), D4);
        assert.deepEqual(scale.step(1, 4), E4);
        assert.deepEqual(scale.step(2, 4), F4);
        assert.deepEqual(scale.step(3, 4), G4);
        assert.deepEqual(scale.step(4, 4), A4);
        assert.deepEqual(scale.step(5, 4), B4);
        assert.deepEqual(scale.step(6, 4), C5);
      });

      it("adds to the baseOctave when wrapping around in the positive direction", () => {
        assert.deepEqual(scale.step(7, 4), D5);
        assert.deepEqual(scale.step(8, 4), E5);
        assert.deepEqual(scale.step(9, 4), F5);
        assert.deepEqual(scale.step(10, 4), G5);
        assert.deepEqual(scale.step(11, 4), A5);
        assert.deepEqual(scale.step(12, 4), B5);
        assert.deepEqual(scale.step(13, 4), C6);
        assert.deepEqual(scale.step(14, 4), D6);
      });

      it("wraps around in the negative direction", () => {
        assert.deepEqual(scale.step(-1, 4), C4);
        assert.deepEqual(scale.step(-2, 4), B3);
        assert.deepEqual(scale.step(-3, 4), A3);
        assert.deepEqual(scale.step(-4, 4), G3);
        assert.deepEqual(scale.step(-5, 4), F3);
        assert.deepEqual(scale.step(-6, 4), E3);
        assert.deepEqual(scale.step(-7, 4), D3);
        assert.deepEqual(scale.step(-8, 4), C3);
        assert.deepEqual(scale.step(-9, 4), B2);
      });
    });
  }
});
