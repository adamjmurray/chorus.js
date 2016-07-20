const assert = require('assert');
const { Chord, SCALES, PITCHES } = require('../../src');

describe('Chord', () => {

  describe('constructor()', () => {
    it('constructs a Chord with the given scale offsets', () => {
      assert.deepEqual(new Chord([0,2,4]).offsets, [0,2,4]);
    });
  });

  describe('pitches()', () => {
    it('returns the pitches in the chord', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR.C, root: 3 }); // F MAJ chord
      assert.deepEqual(chord.pitches(), [PITCHES.F4, PITCHES.A4, PITCHES.C5]);
    });
  });

  describe('pitch()', () => {
    it('returns a specific pitch in the chord', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR.C, root: 3 }); // F MAJ chord
      assert.deepEqual(chord.pitch(1), PITCHES.A4);
    });
    it('goes to the next octave when it wraps around', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR.C, root: 3 }); // F MAJ chord
      assert.deepEqual(chord.pitch(3), PITCHES.F5);
    });
    it('goes downward for negative numbers', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR.C, root: 3 }); // F MAJ chord
      assert.deepEqual(chord.pitch(-1), PITCHES.C4);
    });
  });

  describe('offsetsForInversion()', () => {
    it('gives the offset for the inverted chord', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR.C, root: 3 }); // F MAJ chord
      assert.deepEqual(chord.offsetsForInversion(1), [2,4,7]);
    });
    it('an inversion of 0 is returns the same intervals', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR.C, root: 3 }); // F MAJ chord
      assert.deepEqual(chord.offsetsForInversion(0), [0,2,4]);
    });
    it('a negative inversion of 0 is returns the same intervals', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR.C, root: 3 }); // F MAJ chord
      assert.deepEqual(chord.offsetsForInversion(-1), [-3,0,2]);
    });
  });
});
