const CHORD_TYPES = require('./chord-types');
const PITCH_CLASSES = require('./pitch-classes');
const PITCHES = require('./pitches');
const SCALE_TYPES = require('./scale-types');

/**
 * Predefined constants for common musical objects and properties.
 *
 * @module Names
 * @example
 * // Inject all names into the global namespace.
 * // WARNING: This is not safe to do in large/serious projects, however,
 * // it is very convenient when experimenting with this library.
 * require('midikit/names').into(global);
 */
module.exports = {

  /**
   * Common {@link Chord} types defined in terms of scale degree offsets (the third argument to the Chord constructor)
   * <ul>
   *   <li><code>TRIAD</code></li>
   *   <li><code>TRIAD_INV1</code></li>
   *   <li><code>TRIAD_INV2</code></li>
   *   <li><code>TRIAD_SUS2</code></li>
   *   <li><code>TRIAD_SUS4</code></li>
   *   <li><code>QUARTAL</code></li>
   *   <li><code>QUINTAL</code></li>
   *   <li><code>SEVENTH</code></li>
   *   <li><code>SEVENTH_INV1</code></li>
   *   <li><code>SEVENTH_INV2</code></li>
   *   <li><code>SEVENTH_INV3</code></li>
   * </ul>
   * Note: whether a chord such as a triad is major, minor, diminished, or augmented depends on the scale and the root
   * of the chord. This is because chords in midikit are defined in terms of scale degrees, so you don't have to worry
   * about accidentally using notes that aren't part of the scale. If you don't know music theory, don't worry about it!
   * When using scales and chords in midikit, things will tend to sound good by default.
   *
   * @example
   * const { PITCH_CLASSES, SCALE_TYPES, CHORD_TYPES } = require('midikit/names');
   * const { C } = PITCH_CLASSES;
   * const { MAJOR } = SCALE_TYPES;
   * const { TRIAD, SEVENTH } = CHORD_TYPES;
   * const { Scale } = require('midikit/model');
   * const cMajorScale = new Scale(C, MAJOR);
   * const I_CHORD  = new Chord(TRIAD, 0, cMajorScale); // C major triad
   * const IV_CHORD = new Chord(TRIAD, 3, cMajorScale); // F major triad
   * const V7_CHORD = new Chord(SEVENTH, 4, cMajorScale); // G major dominant 7th chord
   * const vi_CHORD = new Chord(TRIAD, 5, cMajorScale); // a minor triad
   * @see https://en.wikipedia.org/wiki/Triad_(music)
   * @see https://en.wikipedia.org/wiki/Suspended_chord
   * @see https://en.wikipedia.org/wiki/Quartal_and_quintal_harmony
   * @see https://en.wikipedia.org/wiki/Seventh_chord
   * @see https://en.wikipedia.org/wiki/Inversion_(music)#Chords
   */
  CHORD_TYPES,

  /**
   * The 12 {@link PitchClass PitchClasses}:
   * <br><br>
   * <code>C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B</code>
   */
  PITCH_CLASSES,

  /**
   * The 128 {@link Pitch Pitches}:
   * <br><br>
   * <code>C_1, Db_1, D_1, Eb_1, E_1, F_1, Gb_1, G_1, Ab_1, A_1, Bb_1, B_1, C0, Db0, D0, ..., Ab8, B8, C9, Cb9, D9, Db9, E9, F9, Gb9, G9</code>
   * <br><br>
   * <code>C_1</code> is the minimum Pitch value of 0 (<code>"_1"</code> means -1 octave number).<br>
   * <code>G9</code> the is maximum Pitch value of 127.
   */
  PITCHES,

  /**
   * Common {@link Scale Scale} types defined in terms of intervals (the second argument to the Scale constructor):
   * <ul>
   *   <li><code>IONIAN</code>, also known as:
   *     <ul>
   *       <li><code>MAJOR</code></li>
   *     </ul>
   *   </li>
   *   <li><code>DORIAN</code></li>
   *   <li><code>PHRYGIAN</code></li>
   *   <li><code>LYDIAN</code></li>
   *   <li><code>MIXOLYDIAN</code></li>
   *   <li><code>AEOLIAN</code>, also known as:
   *     <ul>
   *       <li><code>MINOR</code></li>
   *       <li><code>NATURAL_MINOR</code></li>
   *     </ul>
   *   </li>
   *   <li><code>LOCRIAN</code></li>
   *   <li><code>HARMONIC_MINOR</code></li>
   * </ul>
   *
   * @example
   * const { PITCH_CLASSES, SCALE_TYPES } = require('midikit/names');
   * const { C } = PITCH_CLASSES;
   * const { MAJOR } = SCALE_TYPES;
   * const { Scale } = require('midikit/model');
   * const cMajorScale = new Scale(C, MAJOR);
   *
   * @see https://en.wikipedia.org/wiki/Scale_(music)
   * @see https://en.wikipedia.org/wiki/Mode_(music)#Modern
   * @see https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes
   */
  SCALE_TYPES,

  /**
   * Inject all predefined names into the given Object.
   * @param namespace {Object} the object whose properties will be destructively modified to set all name/values defined here
   */
  into(object) {
    return Object.assign(object, CHORD_TYPES, PITCH_CLASSES, PITCHES, SCALE_TYPES);
  },
};
