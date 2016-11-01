const assert = require('assert');
const { Chord, SCALES, PITCHES, PITCH_CLASSES } = require('../../src');
const { C } = PITCH_CLASSES;

describe('Chord', () => {

  describe('constructor()', () => {
    it('constructs a Chord with the given scale offsets', () => {
      assert.deepEqual(new Chord([0,2,4]).offsets, [0,2,4]);
    });

    it('creates an immutable object', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 1, octave: 3, inversion: 1, shifts: [1] });
      chord.offsets = null;
      chord.scale = null;
      chord.root = null;
      chord.octave = null;
      chord.inversion = null;
      chord.shifts = null;
      let { offsets, scale, root, octave, inversion, shifts } = chord;
      assert.deepEqual(
        { offsets, scale, root, octave, inversion, shifts },
        { offsets: [0,2,4], scale: SCALES.MAJOR(C), root: 1, octave: 3, inversion: 1, shifts: [1] }
      );
      assert.throws(() => { chord.offsets.push(1); }, TypeError);
      assert.throws(() => { chord.shifts.push(2); }, TypeError);
      ({ offsets, scale, root, octave, inversion, shifts } = chord);
      assert.deepEqual(
        { offsets, scale, root, octave, inversion, shifts },
        { offsets: [0,2,4], scale: SCALES.MAJOR(C), root: 1, octave: 3, inversion: 1, shifts: [1] }
      );
    });
  });

  describe('pitches()', () => {
    it('returns the pitches in the chord', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 3 }); // F MAJ chord
      assert.deepEqual(chord.pitches(), [PITCHES.F4, PITCHES.A4, PITCHES.C5]);
    });
  });

  describe('pitch()', () => {
    it('returns a specific pitch in the chord', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 3 }); // F MAJ chord
      assert.deepEqual(chord.pitch(1), PITCHES.A4);
    });
    it('goes to the next octave when it wraps around', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 3 }); // F MAJ chord
      assert.deepEqual(chord.pitch(3), PITCHES.F5);
    });
    it('goes downward for negative numbers', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 3 }); // F MAJ chord
      assert.deepEqual(chord.pitch(-1), PITCHES.C4);
    });
  });

  describe('offsetsForInversion()', () => {
    it('gives the offset for the inverted chord', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 3 }); // F MAJ chord
      assert.deepEqual(chord.offsetsForInversion(1), [2,4,7]);
    });
    it('an inversion of 0 is returns the same intervals', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 3 }); // F MAJ chord
      assert.deepEqual(chord.offsetsForInversion(0), [0,2,4]);
    });
    it('a negative inversion of 0 is returns the same intervals', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 3 }); // F MAJ chord
      assert.deepEqual(chord.offsetsForInversion(-1), [-3,0,2]);
    });
    it('uses the inversion constructed with if none is given', () => {
      const chord = new Chord([0,2,4], { scale: SCALES.MAJOR(C), root: 3, inversion: 1 }); // F MAJ chord first inversion
      assert.deepEqual(chord.offsetsForInversion(), [2,4,7]);
    });
  });

  describe('inversions', () => {
    it('can invert chords with octave doubling upward', () => {
      const chord = new Chord([0,2,4,7], { scale: SCALES.MAJOR(C), root: 0 }).inv(1);
      assert.deepEqual(chord.pitches(), [PITCHES.E4, PITCHES.G4, PITCHES.C5, PITCHES.E5]);
    });

    it('can invert chords with octave doubling downward', () => {
      const chord = new Chord([0,2,4,7], { scale: SCALES.MAJOR(C), root: 0 }).inv(-1);
      assert.deepEqual(chord.pitches(), [PITCHES.G3, PITCHES.C4, PITCHES.E4, PITCHES.G4]);
    });

    it('can invert chords properly in non-heptatonic (7 pitches per octave) scales', () => {
      const chord = new Chord([0,2,3], { scale: SCALES.PENTATONIC_MAJOR(C), root: 0 }).inv(1);
      assert.deepEqual(chord.pitches(), [PITCHES.E4, PITCHES.G4, PITCHES.C5]);
    });

    // TODO:
    // it('can invert chords with octave doubling and shifts upward', () => {
    //   const chord = new Chord([0,2,4,7], { scale: SCALES.MAJOR(C), root: 0, shifts: [1,0,0,0] }).inv(1);
    //   assert.deepEqual(chord.pitches(), [PITCHES.E4, PITCHES.G4, PITCHES.C5, PITCHES.E5]);
    // });
  });
});
