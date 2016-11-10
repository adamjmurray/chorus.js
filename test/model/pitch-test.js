const assert = require('assert');
const Pitch = require('../../src/models/pitch');
const PitchClass = require('../../src/models/pitch-class');
const { PITCH_CLASSES } = require('../../src/names');

describe('PitchClass', () => {

  describe('constructor()', () => {
    it("can take a number as an argument to set the value", () => {
      assert.equal(new Pitch(0).value, 0);
      assert.equal(new Pitch(1).value, 1);
      assert.equal(new Pitch(2).value, 2);
    });

    it("can take a PitchClass as an argument and defaults the octave to 4", () => {
      const pitch = new Pitch(PITCH_CLASSES.C);
      assert.deepEqual(pitch.pitchClass, PITCH_CLASSES.C);
      assert.equal(pitch.octave, 4);
      assert.equal(pitch.value, 60);
    });

    it("can take a PitchClass as an argument and octave as the second argument", () => {
      const pitch = new Pitch(PITCH_CLASSES.C, 3);
      assert.deepEqual(pitch.pitchClass, PITCH_CLASSES.C);
      assert.equal(pitch.octave, 3);
      assert.equal(pitch.value, 48);
    });

    it("supports a PitchClass name string as an argument and defaults the octave to 4", () => {
      const pitch = new Pitch('C');
      assert.deepEqual(pitch.pitchClass, PITCH_CLASSES.C);
      assert.equal(pitch.octave, 4);
      assert.equal(pitch.value, 60);
    });

    it("can take a Pitch name string as an argument", () => {
      const pitch = new Pitch('C5');
      assert.deepEqual(pitch.pitchClass, PITCH_CLASSES.C);
      assert.equal(pitch.octave, 5);
      assert.equal(pitch.value, 72);
    });

    it("supports negative octaves when using a string argument", () => {
      const pitch = new Pitch('Db-1');
      assert.deepEqual(pitch.pitchClass, PITCH_CLASSES.Db);
      assert.equal(pitch.octave, -1);
      assert.equal(pitch.value, 1);
    });

    it("supports negative octaves with underscore for consistency with PITCH_CLASSES", () => {
      const pitch = new Pitch('F#_1');
      assert.deepEqual(pitch.pitchClass, PITCH_CLASSES.Gb);
      assert.equal(pitch.octave, -1);
      assert.equal(pitch.value, 6);
    });

    it("produces an immutable object", () => {
      const pitch = new Pitch(PITCH_CLASSES.C, 3);
      pitch.pitchClass = PITCH_CLASSES.D;
      pitch.octave = 4;
      pitch.value = 1;
      pitch.name = 'D';
      assert.deepEqual(pitch.pitchClass, PITCH_CLASSES.C);
      assert.equal(pitch.octave, 3);
      assert.equal(pitch.value, 48);
      assert.equal(pitch.name, 'C3');
    });

    it("throws an error if the string argument is invalid", () => {
      assert.throws(() => new Pitch('H4'));
    });

    it('supports other than 12 pitches per octave', () => {
      const pitch = new Pitch(new PitchClass(15, 20), 3);
      assert.equal(pitch.value, 95);
      assert.equal(pitch.name, '95');
    });
  });

  describe('.value', () => {
    it("is the Pitch.value", () => {
      assert.equal(new Pitch(53).value, 53);
    });
  });

  describe('valueOf()', () => {
    it("is the Pitch.value", () => {
      assert.equal(new Pitch(60).valueOf(), 60);
    });
  });

  describe('.name', () => {
    it("is the Pitch.name", () => {
      assert.equal(new Pitch(72).name, 'C5');
    });
  });

  describe('inspect()', () => {
    it("is the Pitch.name", () => {
      assert.equal(new Pitch('G6').inspect(), 'G6');
    });

    it("is the canonical name", () => {
      assert.equal(new Pitch('F##6').inspect(), 'G6');
    });
  });

  describe('add()', () => {
    it("returns a new Pitch with the sum of the value and the argument", () => {
      const pitch = new Pitch(30).add(5);
      assert(pitch instanceof Pitch);
      assert.equal(pitch.value, 35);
    });

    it("does not change the original Pitch", () => {
      const pitch = new Pitch(30);
      pitch.add(5);
      assert.equal(pitch.value, 30);
    });

    it('maintains pitchesPerOctave', () => {
      const pitch = new Pitch(new PitchClass(15, 20), 3).add(-20);
      assert.equal(pitch.value, 75);
      assert.equal(pitch.name, '75');
      assert.equal(pitch.pitchClass.pitchesPerOctave, 20);
    });
  });
});
