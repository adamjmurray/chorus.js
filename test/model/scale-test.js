const assert = require('assert');
const Scale = require('../../model/scale');
const PitchClass = require('../../model/pitch-class');
const { PITCH_CLASSES, PITCHES, SCALES } = require('../../names');

describe('Scale', () => {

  describe('constructor()', () => {
    it("throws a TypeError if the first argument is not an Array", () => {
      assert.throws(() => new Scale(0), TypeError);
    });

    it("constructs a Scale with the given interval Array and root PitchClass", () => {
      const scale = new Scale([2,2,2,2,2,2], PITCH_CLASSES.C);
      assert.deepEqual(scale.intervals, [2,2,2,2,2,2]);
      assert.deepEqual(scale.root, PITCH_CLASSES.C);
    });

    it("attempts to convert the root option to a PitchClass", () => {
      const scale = new Scale([2,2,2,2,2,2], 0);
      assert.deepEqual(scale.intervals, [2,2,2,2,2,2]);
      assert.deepEqual(scale.root, PITCH_CLASSES.C);
    });

    it("produces an immutable object", () => {
      const scale = new Scale([2,2,2,2,2,2], PITCH_CLASSES.C);
      scale.intervals = [1,1,1,1,1,1];
      scale.root = PITCH_CLASSES.D;
      assert.deepEqual(scale.intervals, [2,2,2,2,2,2]);
      assert.deepEqual(scale.root, PITCH_CLASSES.C);
      assert.throws(() => { scale.intervals.push(2); }, TypeError);
      assert.deepEqual(scale.intervals, [2,2,2,2,2,2]);
    });
  });

  describe('.length', () => {
    it("is the number of intervals ", () => {
      const scale = new Scale([2,2,2,2,2,2], PITCH_CLASSES.C);
      assert.equal(scale.length, 6);
    });
  });

  describe('.semitones', () => {
    it("is the sum of the intervals", () => {
      const scale = new Scale([2,2,2,2,2,2], PITCH_CLASSES.C);
      assert.equal(scale.semitones, 12);
    });
  });

  describe('pitchClass()', () => {
    const scale = SCALES.DORIAN(PITCH_CLASSES.D);
    it("returns the PitchClass at the given index within the scale", () => {
      assert.deepEqual(scale.pitchClass(0), PITCH_CLASSES.D);
      assert.deepEqual(scale.pitchClass(1), PITCH_CLASSES.E);
      assert.deepEqual(scale.pitchClass(2), PITCH_CLASSES.F);
      assert.deepEqual(scale.pitchClass(3), PITCH_CLASSES.G);
      assert.deepEqual(scale.pitchClass(4), PITCH_CLASSES.A);
      assert.deepEqual(scale.pitchClass(5), PITCH_CLASSES.B);
      assert.deepEqual(scale.pitchClass(6), PITCH_CLASSES.C);
    });

    it("wraps around in the positive direction, ", () => {
      assert.deepEqual(scale.pitchClass(7), PITCH_CLASSES.D);
      assert.deepEqual(scale.pitchClass(8), PITCH_CLASSES.E);
      assert.deepEqual(scale.pitchClass(9), PITCH_CLASSES.F);
      assert.deepEqual(scale.pitchClass(10), PITCH_CLASSES.G);
      assert.deepEqual(scale.pitchClass(11), PITCH_CLASSES.A);
      assert.deepEqual(scale.pitchClass(12), PITCH_CLASSES.B);
      assert.deepEqual(scale.pitchClass(13), PITCH_CLASSES.C);
      assert.deepEqual(scale.pitchClass(14), PITCH_CLASSES.D);
    });

    it("wraps around in the negative direction, ", () => {
      assert.deepEqual(scale.pitchClass(-1), PITCH_CLASSES.C);
      assert.deepEqual(scale.pitchClass(-2), PITCH_CLASSES.B);
      assert.deepEqual(scale.pitchClass(-3), PITCH_CLASSES.A);
      assert.deepEqual(scale.pitchClass(-4), PITCH_CLASSES.G);
      assert.deepEqual(scale.pitchClass(-5), PITCH_CLASSES.F);
      assert.deepEqual(scale.pitchClass(-6), PITCH_CLASSES.E);
      assert.deepEqual(scale.pitchClass(-7), PITCH_CLASSES.D);
      assert.deepEqual(scale.pitchClass(-8), PITCH_CLASSES.C);
    });

    it('supports relative pitch arguments', () => {
      assert.deepEqual(scale.pitchClass({ degree:0, shift:0 }), PITCH_CLASSES.D);
      assert.deepEqual(scale.pitchClass({ degree:0, shift:1 }), PITCH_CLASSES.Eb);
      assert.deepEqual(scale.pitchClass({ degree:0, shift:-1 }), PITCH_CLASSES.Db);
      assert.deepEqual(scale.pitchClass({ degree:0, shift:2 }), PITCH_CLASSES.E);
      assert.deepEqual(scale.pitchClass({ degree:0, shift:-2 }), PITCH_CLASSES.C);
      assert.deepEqual(scale.pitchClass({ degree:1, shift:1 }), PITCH_CLASSES.F);
      assert.deepEqual(scale.pitchClass({ degree:1, shift:-1 }), PITCH_CLASSES.Eb);
      assert.deepEqual(scale.pitchClass({ degree:-1, shift:1 }), PITCH_CLASSES.Db);
      assert.deepEqual(scale.pitchClass({ degree:-1, shift:-1 }), PITCH_CLASSES.B);
      assert.deepEqual(scale.pitchClass({ degree:7, shift:1 }), PITCH_CLASSES.Eb);
    });

    it('supports other than 12 pitches per octave', () => {
      const microtonalScale = new Scale([3,2,3,3,2,3,3], new PitchClass(0));
      assert.equal(microtonalScale.pitchClass(0), 0);
      assert.equal(microtonalScale.pitchClass(1), 3);
      assert.equal(microtonalScale.pitchClass(2), 5);
      assert.equal(microtonalScale.pitchClass(8), 22%19);
      assert.equal(microtonalScale.pitchClass(8), 41%19);
      assert.equal(microtonalScale.pitchClass(-1), 16);
      assert.equal(microtonalScale.pitchClass(-3), 11);
      assert.equal(microtonalScale.pitchClass(-3), 30%19);
    });
  });

  describe('pitch()', () => {
    const scale = SCALES.DORIAN(PITCH_CLASSES.D);
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

    it('supports relative pitch arguments', () => {
      assert.deepEqual(scale.pitch({ degree:0, shift:0 }), PITCHES.D4);
      assert.deepEqual(scale.pitch({ degree:0, shift:1 }), PITCHES.Eb4);
      assert.deepEqual(scale.pitch({ degree:0, shift:-1 }), PITCHES.Db4);
      assert.deepEqual(scale.pitch({ degree:0, shift:2 }), PITCHES.E4);
      assert.deepEqual(scale.pitch({ degree:0, shift:-2 }), PITCHES.C4);
      assert.deepEqual(scale.pitch({ degree:1, shift:1 }), PITCHES.F4);
      assert.deepEqual(scale.pitch({ degree:1, shift:-1 }), PITCHES.Eb4);
      assert.deepEqual(scale.pitch({ degree:-1, shift:1 }), PITCHES.Db4);
      assert.deepEqual(scale.pitch({ degree:-1, shift:-1 }), PITCHES.B3);
      assert.deepEqual(scale.pitch({ degree:7, shift:1 }), PITCHES.Eb5);
    });

    it('supports other than 12 pitches per octave', () => {
      const microtonalScale = new Scale([3,2,3,3,2,3,3], 0);
      assert.equal(microtonalScale.pitch(0, {octave: -1}), 0);
      assert.equal(microtonalScale.pitch(1, {octave: -1}), 3);
      assert.equal(microtonalScale.pitch(2, {octave: -1}), 5);
      assert.equal(microtonalScale.pitch(8, {octave: -1}), 22);
      assert.equal(microtonalScale.pitch(8, {octave: 0}), 41);
      assert.equal(microtonalScale.pitch(-1, {octave: 0}), 16);
      assert.equal(microtonalScale.pitch(-3, {octave: 0}), 11);
      assert.equal(microtonalScale.pitch(-3, {octave: 1}), 30);
    });

    it("passes the microtonal option pitchValueOffset to constructed Pitches", () => {
      const microtonalScale = new Scale([3,2,3,3,2,3,3], 0, {pitchValueOffset: 10});
      assert.equal(microtonalScale.pitch(0, {octave: -1}), 10);
      assert.equal(microtonalScale.pitch(1, {octave: -1}), 13);
      assert.equal(microtonalScale.pitch(2, {octave: -1}), 15);
      assert.equal(microtonalScale.pitch(8, {octave: -1}), 32);
      assert.equal(microtonalScale.pitch(8, {octave: 0}), 51);
      assert.equal(microtonalScale.pitch(-1, {octave: 0}), 26);
      assert.equal(microtonalScale.pitch(-3, {octave: 0}), 21);
      assert.equal(microtonalScale.pitch(-3, {octave: 1}), 40);
    });
  });
});
