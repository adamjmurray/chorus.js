const CHORDS = require('./chords');
const PITCH_CLASSES = require('./pitch-classes');
const PITCHES = require('./pitches');
const SCALES = require('./scales');
const DRUMS = require('./drums');

/**
 * @module names
 * @description
 * #### Predefined constants for common musical objects and properties.
 * @example
 * // Inject all names into the global namespace.
 * // WARNING: This is not safe to do in large/serious projects, however,
 * // it is very convenient when experimenting with this library.
 * require('chorus/names').into(global);
 */
module.exports = {

  /**
   * Built-in {@link Chord} types.
   *
   * <a href="./names_chords.js.html">The available CHORDS types are defined here</a>
   *
   * Note: whether a chord such as a triad is major, minor, diminished, or augmented depends on the scale and the root
   * of the chord. This is because chords in chorus.js are defined in terms of scale degrees, so you don't have to worry
   * about accidentally using notes that aren't part of the scale. If you don't know music theory, don't worry about it!
   * When using scales and chords in chorus.js, things will tend to sound good by default.
   *
   * @example
   * const { CHORDS } = require('chorus');
   * const { TRIAD, SEVENTH } = CHORDS;
   * const I_CHORD  = TRIAD(0);
   * const IV_CHORD = TRIAD(3);
   * const V7_CHORD = SEVENTH(4);
   * const vi_inv1_CHORD = TRIAD(5, 1); // first inversion
   * @see https://en.wikipedia.org/wiki/Triad_(music)
   * @see https://en.wikipedia.org/wiki/Suspended_chord
   * @see https://en.wikipedia.org/wiki/Quartal_and_quintal_harmony
   * @see https://en.wikipedia.org/wiki/Seventh_chord
   * @see https://en.wikipedia.org/wiki/Inversion_(music)#Chords
   */
  CHORDS,

  /**
   * The 12 {@link PitchClass PitchClasses}:
   *
   * `C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B`
   */
  PITCH_CLASSES,

  /**
   * The 128 {@link Pitch Pitches}:
   *
   * `C_1, Db_1, D_1, Eb_1, E_1, F_1, Gb_1, G_1, Ab_1, A_1, Bb_1, B_1, C0, Db0, D0, ..., Ab8, B8, C9, Cb9, D9, Db9, E9, F9, Gb9, G9`
   *
   * `C_1` is the minimum Pitch value of 0 (`"_1"` means -1 octave number).
   *
   * `G9` the is maximum Pitch value of 127.
   */
  PITCHES,

  /**
   * Built-in {@link Scale Scale} types.
   *
   * <a href="./names_scales.js.html">The available SCALES types are defined here</a>.
   *
   * @example
   * const { PITCH_CLASSES, SCALES } = require('chorus');
   * const { C } = PITCH_CLASSES;
   * const { MAJOR } = SCALES;
   * const cMajorScale = MAJOR(C);
   *
   * @see https://en.wikipedia.org/wiki/Scale_(music)
   * @see https://en.wikipedia.org/wiki/Mode_(music)#Modern
   * @see https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes
   */
  SCALES,

  DRUMS,

  /**
   * Inject all predefined names into the given Object.
   * @param namespace {Object} the object whose properties will be destructively modified to set all name/values defined here
   */
  into(object) {
    return Object.assign(object, CHORDS, PITCH_CLASSES, PITCHES, SCALES, DRUMS);
  },
};
