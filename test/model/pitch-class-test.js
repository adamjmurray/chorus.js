const assert = require('assert');
const PitchClass = require('../../src/model/pitch-class');

describe('PitchClass', () => {

  describe('constructor()', () => {
    it("can take a number as an argument to set the value", () => {
      assert.equal(new PitchClass(0).value, 0);
      assert.equal(new PitchClass(1).value, 1);
      assert.equal(new PitchClass(2).value, 2);
    });

    it("sets the value module 12 from a number arguments", () => {
      assert.equal(new PitchClass(11).value, 11);
      assert.equal(new PitchClass(12).value, 0);
      assert.equal(new PitchClass(13).value, 1);
      assert.equal(new PitchClass(24).value, 0);
      assert.equal(new PitchClass(-1).value, 11);
      assert.equal(new PitchClass(-12).value, 0);
    });

    it("rounds floating point values", () => {
      assert.equal(new PitchClass(0.1).value, 0);
      assert.equal(new PitchClass(0.5).value, 1);
      assert.equal(new PitchClass(11.9).value, 0);
    });

    it("can take a string as an argument", () => {
      assert.equal(new PitchClass('C').value, 0);
      assert.equal(new PitchClass('C#').value, 1);
      assert.equal(new PitchClass('Db').value, 1);
      assert.equal(new PitchClass('D').value, 2);
      assert.equal(new PitchClass('D#').value, 3);
      assert.equal(new PitchClass('Eb').value, 3);
      assert.equal(new PitchClass('E').value, 4);
      assert.equal(new PitchClass('E#').value, 5);
      assert.equal(new PitchClass('Fb').value, 4);
      assert.equal(new PitchClass('F').value, 5);
      assert.equal(new PitchClass('F#').value, 6);
      assert.equal(new PitchClass('Gb').value, 6);
      assert.equal(new PitchClass('G').value, 7);
      assert.equal(new PitchClass('G#').value, 8);
      assert.equal(new PitchClass('Ab').value, 8);
      assert.equal(new PitchClass('A').value, 9);
      assert.equal(new PitchClass('A#').value, 10);
      assert.equal(new PitchClass('Bb').value, 10);
      assert.equal(new PitchClass('B').value, 11);
      assert.equal(new PitchClass('B#').value, 0);
      assert.equal(new PitchClass('Cb').value, 11);
    });

    it("supports multiple sharps and flats in a string argument", () => {
      assert.equal(new PitchClass('C##').value, 2);
      assert.equal(new PitchClass('Bbb').value, 9);
    });

    it("supports lowercase string arguments", () => {
      assert.equal(new PitchClass('c').value, 0);
      assert.equal(new PitchClass('eb').value, 3);
      assert.equal(new PitchClass('f#').value, 6);
      assert.equal(new PitchClass('bb').value, 10);
    });

    it("throws an error for invalid string arguments", () => {
      assert.throws(() => new PitchClass('cc').value);
      assert.throws(() => new PitchClass('H').value);
      assert.throws(() => new PitchClass('BB').value); // flats must be lower case
    });

    it("produces an immutable object", () => {
      const pitchClass = new PitchClass(0);
      pitchClass.value = 1;
      pitchClass.name = 'D';
      assert.equal(pitchClass.value, 0);
      assert.equal(pitchClass.name, 'C');
    });

    it('defaults to 12 pitches per octave', () => {
      assert.equal(new PitchClass(0).pitchesPerOctave, 12);
    });

    it('supports other than 12 pitches per octave', () => {
      const pitchClass = new PitchClass(13, { pitchesPerOctave: 14 });
      assert.equal(pitchClass.value, 13);
      assert.equal(pitchClass.name, '13');
      assert.equal(pitchClass.pitchesPerOctave, 14);
    });

    it('mods the value by the pitchesPerOctave', () => {
      const pitchClass = new PitchClass(14, { pitchesPerOctave: 13 });
      assert.equal(pitchClass.value, 1);
      assert.equal(pitchClass.name, '1');
      assert.equal(pitchClass.pitchesPerOctave, 13);
    });
  });

  describe('.value', () => {
    it("is the underlying value", () => {
      assert.equal(new PitchClass(2).value, 2);
    });
  });

  describe('valueOf()', () => {
    it("is the underlying value", () => {
      assert.equal(new PitchClass(3).valueOf(), 3);
    });
  });

  describe('.name', () => {
    it("is the canonical pitch name", () => {
      assert.equal(new PitchClass(1).name, 'Db');
    });
  });

  describe('inspect()', () => {
    it("is the canonical pitch name", () => {
      assert.equal(new PitchClass(3).inspect(), 'Eb');
    });
  });

  describe('add()', () => {
    it("returns a new PitchClass with the sum of the value and the argument", () => {
      const pitchClass = new PitchClass(3).add(5);
      assert(pitchClass instanceof PitchClass);
      assert.equal(pitchClass.value, 8);
    });

    it("does not change the original PitchClass", () => {
      const pitchClass = new PitchClass(3);
      pitchClass.add(5);
      assert.equal(pitchClass.value, 3);
    });

    it("operates modulo 12 like the constructor", () => {
      assert.equal(new PitchClass(3).add(10).value, 1);
      assert.equal(new PitchClass(3).add(-5).value, 10);
    });

    it('maintains pitchesPerOctave', () => {
      const pitchClass = new PitchClass(14, { pitchesPerOctave: 15 }).add(-1);
      assert.equal(pitchClass.value, 13);
      assert.equal(pitchClass.name, '13');
      assert.equal(pitchClass.pitchesPerOctave, 15);
    });
  });
});
