const assert = require('assert');
const Scale = require('../../src/model/scale');
const { PITCH_CLASSES, PITCHES, SCALES } = require('../../src/names');

describe('Scale', () => {

  describe('constructor()', () => {
    it("throws a TypeError if the first argument is not an Array", () => {
      assert.throws(() => new Scale(0), TypeError);
    });
    it("throws a TypeError if the root option is not a PitchClass", () => {
      assert.throws(() => new Scale([2,2,2,2,2,2], { root: 0 }), TypeError);
    });
    it("constructs a Scale with the given interval Array and root PitchClass", () => {
      const scale = new Scale([2,2,2,2,2,2], { root: PITCH_CLASSES.C });
      assert.deepEqual(scale.intervals, [2,2,2,2,2,2]);
      assert.deepEqual(scale.root, PITCH_CLASSES.C);
    });
  });

  describe('.length', () => {
    it("is the number of intervals ", () => {
      const scale = new Scale([2,2,2,2,2,2], { root: PITCH_CLASSES.C });
      assert.equal(scale.length, 6);
    });
  });

  describe('.length', () => {
    it("is the sum of the intervals", () => {
      const scale = new Scale([2,2,2,2,2,2], { root: PITCH_CLASSES.C });
      assert.equal(scale.semitones, 12);
    });
  });

  describe('pitch()', () => {
    const scale = SCALES.DORIAN.D;
    it("returns a pitch with the scale's pitch class at the given index", () => {
      assert.deepEqual(scale.pitch(0), PITCHES.D4);
      assert.deepEqual(scale.pitch(1), PITCHES.E4);
      assert.deepEqual(scale.pitch(2), PITCHES.F4);
      assert.deepEqual(scale.pitch(3), PITCHES.G4);
      assert.deepEqual(scale.pitch(4), PITCHES.A4);
      assert.deepEqual(scale.pitch(5), PITCHES.B4);
      assert.deepEqual(scale.pitch(6), PITCHES.C5);
    });
    it("adds to the octave when wrapping around in the positive direction, ", () => {
      assert.deepEqual(scale.pitch(7), PITCHES.D5);
      assert.deepEqual(scale.pitch(8), PITCHES.E5);
      assert.deepEqual(scale.pitch(9), PITCHES.F5);
      assert.deepEqual(scale.pitch(10), PITCHES.G5);
      assert.deepEqual(scale.pitch(11), PITCHES.A5);
      assert.deepEqual(scale.pitch(12), PITCHES.B5);
      assert.deepEqual(scale.pitch(13), PITCHES.C6);
      assert.deepEqual(scale.pitch(14), PITCHES.D6);
    });
    it("subtracts from the octave when wrapping around in the negative direction", () => {
      assert.deepEqual(scale.pitch(-1), PITCHES.C4);
      assert.deepEqual(scale.pitch(-2), PITCHES.B3);
      assert.deepEqual(scale.pitch(-3), PITCHES.A3);
      assert.deepEqual(scale.pitch(-4), PITCHES.G3);
      assert.deepEqual(scale.pitch(-5), PITCHES.F3);
      assert.deepEqual(scale.pitch(-6), PITCHES.E3);
      assert.deepEqual(scale.pitch(-7), PITCHES.D3);
      assert.deepEqual(scale.pitch(-8), PITCHES.C3);
      assert.deepEqual(scale.pitch(-9), PITCHES.B2);
    });
    it("allows octave shifts via an option", () => {
      assert.deepEqual(scale.pitch(0, { octave: 4 }), PITCHES.D4);
      assert.deepEqual(scale.pitch(1, { octave: 5 }), PITCHES.E5);
      assert.deepEqual(scale.pitch(2, { octave: 6 }), PITCHES.F6);
      assert.deepEqual(scale.pitch(3, { octave: 7 }), PITCHES.G7);
      assert.deepEqual(scale.pitch(4, { octave: 3 }), PITCHES.A3);
      assert.deepEqual(scale.pitch(5, { octave: 2 }), PITCHES.B2);
      assert.deepEqual(scale.pitch(6, { octave: 1 }), PITCHES.C2);
    });
    it("can override the root via an option", () => {
      assert.deepEqual(scale.pitch(0, { root: PITCH_CLASSES.C }), PITCHES.C4);
      assert.deepEqual(scale.pitch(1, { root: PITCH_CLASSES.C }), PITCHES.D4);
      assert.deepEqual(scale.pitch(2, { root: PITCH_CLASSES.C }), PITCHES.Eb4);
      assert.deepEqual(scale.pitch(3, { root: PITCH_CLASSES.C }), PITCHES.F4);
      assert.deepEqual(scale.pitch(4, { root: PITCH_CLASSES.C }), PITCHES.G4);
      assert.deepEqual(scale.pitch(5, { root: PITCH_CLASSES.C }), PITCHES.A4);
      assert.deepEqual(scale.pitch(6, { root: PITCH_CLASSES.C }), PITCHES.Bb4);
    });
  });
});
