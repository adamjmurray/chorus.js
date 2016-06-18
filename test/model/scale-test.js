const assert = require('assert');
const Scale = require('../../src/model/scale');
const model = require('../../src/model');
const p = model.pitches;
const pc = model.pitchClasses;

describe('Scale', () => {

  let scale;
  beforeEach(() => {
    scale = new Scale(pc.D, [2, 1, 2, 2, 2, 1, 2]);
  });

  describe('step(index)', () => {
    it("returns the scale's pitch class by index", () => {
      assert.deepEqual(scale.step(0), pc.D);
      assert.deepEqual(scale.step(1), pc.E);
      assert.deepEqual(scale.step(2), pc.F);
      assert.deepEqual(scale.step(3), pc.G);
      assert.deepEqual(scale.step(4), pc.A);
      assert.deepEqual(scale.step(5), pc.B);
      assert.deepEqual(scale.step(6), pc.C);
    });

    it("wraps around in the positive direction", () => {
      assert.deepEqual(scale.step( 7), pc.D);
      assert.deepEqual(scale.step( 8), pc.E);
      assert.deepEqual(scale.step( 9), pc.F);
      assert.deepEqual(scale.step(10), pc.G);
      assert.deepEqual(scale.step(11), pc.A);
      assert.deepEqual(scale.step(12), pc.B);
      assert.deepEqual(scale.step(13), pc.C);
      assert.deepEqual(scale.step(14), pc.D);
    });

    it("wraps around in the negative direction", () => {
      assert.deepEqual(scale.step(-1), pc.C);
      assert.deepEqual(scale.step(-2), pc.B);
      assert.deepEqual(scale.step(-3), pc.A);
      assert.deepEqual(scale.step(-4), pc.G);
      assert.deepEqual(scale.step(-5), pc.F);
      assert.deepEqual(scale.step(-6), pc.E);
      assert.deepEqual(scale.step(-7), pc.D);
      assert.deepEqual(scale.step(-8), pc.C);
    });
  });

  describe('step(index, baseOctave)', () => {
    it("returns a pitch with the scale's pitch class at the given index and the baseOctave", () => {
      assert.deepEqual(scale.step(0, 4), p.D4);
      assert.deepEqual(scale.step(1, 4), p.E4);
      assert.deepEqual(scale.step(2, 4), p.F4);
      assert.deepEqual(scale.step(3, 4), p.G4);
      assert.deepEqual(scale.step(4, 4), p.A4);
      assert.deepEqual(scale.step(5, 4), p.B4);
      assert.deepEqual(scale.step(6, 4), p.C5);
    });

    it("adds to the baseOctave when wrapping around in the positive direction", () => {
      assert.deepEqual(scale.step( 7, 4), p.D5);
      assert.deepEqual(scale.step( 8, 4), p.E5);
      assert.deepEqual(scale.step( 9, 4), p.F5);
      assert.deepEqual(scale.step(10, 4), p.G5);
      assert.deepEqual(scale.step(11, 4), p.A5);
      assert.deepEqual(scale.step(12, 4), p.B5);
      assert.deepEqual(scale.step(13, 4), p.C6);
      assert.deepEqual(scale.step(14, 4), p.D6);
    });

    it("wraps around in the negative direction", () => {
      assert.deepEqual(scale.step(-1, 4), p.C4);
      assert.deepEqual(scale.step(-2, 4), p.B3);
      assert.deepEqual(scale.step(-3, 4), p.A3);
      assert.deepEqual(scale.step(-4, 4), p.G3);
      assert.deepEqual(scale.step(-5, 4), p.F3);
      assert.deepEqual(scale.step(-6, 4), p.E3);
      assert.deepEqual(scale.step(-7, 4), p.D3);
      assert.deepEqual(scale.step(-8, 4), p.C3);
      assert.deepEqual(scale.step(-9, 4), p.B2);
    });
  });
});