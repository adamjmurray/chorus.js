const assert = require('assert');
const { Chord, RelativePitch, SCALES, PITCHES, PITCH_CLASSES } = require('../../src');
const { C } = PITCH_CLASSES;

describe('Chord', () => {

  describe('constructor()', () => {
    it('constructs a Chord with the given scale offsets', () => {
      assert.deepEqual(new Chord([0,2,4]).relativePitches.map(Number), [0,2,4]);
    });

    it('creates an immutable object', () => {
      const chord = new Chord([new RelativePitch(0,1), 2, 4], 1);
      chord.relativePitches = null;
      chord.inversion = null;
      assert.deepEqual(
        { relativePitches: chord.relativePitches.map(Number), inversion: chord.inversion },
        { relativePitches: [0,2,4], inversion: 1 }
      );
      assert.throws(() => { chord.relativePitches.push(1); }, TypeError);
      assert.deepEqual(
        { relativePitches: chord.relativePitches.map(Number), inversion: chord.inversion },
        { relativePitches: [0,2,4], inversion: 1 }
      );
    });
  });

  describe('pitches()', () => {
    it('returns the pitches in the chord', () => {
      const chord = new Chord([3,5,7]);
      assert.deepEqual(chord.pitches({ scale: SCALES.MAJOR(C) }), [PITCHES.F4, PITCHES.A4, PITCHES.C5]);
    });

    it('can invert the chord upward', () => {
      const chord = new Chord([3,5,7]);
      assert.deepEqual(chord.pitches({ scale: SCALES.MAJOR(C), inversion: 1 }), [PITCHES.A4, PITCHES.C5, PITCHES.F5]);
    });

    it('can invert the chord downward', () => {
      const chord = new Chord([3,5,7]);
      assert.deepEqual(chord.pitches({ scale: SCALES.MAJOR(C), inversion: -1 }), [PITCHES.C4, PITCHES.F4, PITCHES.A4]);
    });

    it("doesn't invert the chord with an inversion of 0", () => {
      const chord = new Chord([3,5,7]);
      assert.deepEqual(chord.pitches({ scale: SCALES.MAJOR(C), inversion: 0 }), [PITCHES.F4, PITCHES.A4, PITCHES.C5]);
    });

    it('uses the inversion constructed with if none is given', () => {
      const chord = new Chord([3,5,7], 1);
      assert.deepEqual(chord.pitches({ scale: SCALES.MAJOR(C) }), [PITCHES.A4, PITCHES.C5, PITCHES.F5]);
    });
  });

  describe('pitchAt()', () => {
    it('returns a specific pitch in the chord', () => {
      const chord = new Chord([3,5,7]);
      assert.deepEqual(chord.pitchAt(1, { scale: SCALES.MAJOR(C) }), PITCHES.A4);
    });
    it('goes to the next octave when it wraps around', () => {
      const chord = new Chord([3,5,7]);
      assert.deepEqual(chord.pitchAt(3, { scale: SCALES.MAJOR(C) }), PITCHES.F5);
    });
    it('goes downward for negative numbers', () => {
      const chord = new Chord([3,5,7]);
      assert.deepEqual(chord.pitchAt(-1, { scale: SCALES.MAJOR(C) }), PITCHES.C4);
    });

    it('supports relative pitches with shifts', () => {
      const chord = new Chord([{offset:1, shift:-1},3,5])
      const scale = SCALES.MINOR(C);
      assert.deepEqual(chord.pitchAt(0, { scale }), PITCHES.Db4);
      assert.deepEqual(chord.pitchAt(1, { scale }), PITCHES.F4);
    });

    it("does not maintain a relative pitch's shift when an offset is applied", () => {
      const chord = new Chord([{offset:1, shift:-1},3,5]);
      const scale = SCALES.MINOR(C);
      assert.deepEqual(chord.pitchAt(0, { scale, offset: 1 }), PITCHES.Eb4);
    });
  });

  describe('.inv()', () => {
    it('can invert a chord upward', () => {
      const chord = new Chord([0,2,4]);
      const scale = SCALES.MAJOR(C);
      assert.deepEqual(chord.inv(1).pitches({ scale }), [PITCHES.E4, PITCHES.G4, PITCHES.C5]);
      assert.deepEqual(chord.inv(2).pitches({ scale }), [PITCHES.G4, PITCHES.C5, PITCHES.E5]);
      assert.deepEqual(chord.inv(3).pitches({ scale }), [PITCHES.C5, PITCHES.E5, PITCHES.G5]);
      assert.deepEqual(chord.inv(4).pitches({ scale }), [PITCHES.E5, PITCHES.G5, PITCHES.C6]);
    });

    it('can invert a chord downward', () => {
      const chord = new Chord([0,2,4]);
      const scale = SCALES.MAJOR(C);
      assert.deepEqual(chord.inv(-1).pitches({ scale }), [PITCHES.G3, PITCHES.C4, PITCHES.E4]);
      assert.deepEqual(chord.inv(-2).pitches({ scale }), [PITCHES.E3, PITCHES.G3, PITCHES.C4]);
      assert.deepEqual(chord.inv(-3).pitches({ scale }), [PITCHES.C3, PITCHES.E3, PITCHES.G3]);
      assert.deepEqual(chord.inv(-4).pitches({ scale }), [PITCHES.G2, PITCHES.C3, PITCHES.E3]);
    });

    it('has no effect when the inversion is 0', () => {
      const chord = new Chord([0,2,4,7]);
      assert.deepEqual(
        chord.inv(0).pitches({ scale: SCALES.MAJOR(C) }),
        [PITCHES.C4, PITCHES.E4, PITCHES.G4, PITCHES.C5]
      );
    });

    it('can invert chords with octave doubling upward', () => {
      const chord = new Chord([0,2,4,7]);
      assert.deepEqual(
        chord.inv(1).pitches({ scale: SCALES.MAJOR(C) }),
        [PITCHES.E4, PITCHES.G4, PITCHES.C5, PITCHES.E5]
      );
    });

    it('can invert chords with octave doubling downward', () => {
      const chord = new Chord([0,2,4,7]);
      assert.deepEqual(
        chord.inv(-1).pitches({ scale: SCALES.MAJOR(C) }),
        [PITCHES.G3, PITCHES.C4, PITCHES.E4, PITCHES.G4]
      );
    });

    it('can invert chords properly in non-heptatonic (7 pitches per octave) scales', () => {
      const chord = new Chord([0,2,3]);
      assert.deepEqual(
        chord.inv(1).pitches({ scale: SCALES.PENTATONIC_MAJOR(C) }),
        [PITCHES.E4, PITCHES.G4, PITCHES.C5]
      );
    });

    it('can invert chords with octave doubling and shifts upward', () => {
      const chord = new Chord([{ offset:0, shift:1 }, 2, 4, 7]);
      assert.deepEqual(
        chord.inv(1).pitches({ scale: SCALES.MAJOR(C) }),
        [PITCHES.E4, PITCHES.G4, PITCHES.C5, PITCHES.Db5]
      );
    });
  });
});
