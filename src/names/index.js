const CHORD_TYPES = require('./chord-types');
const PITCH_CLASSES = require('./pitch-classes');
const PITCHES = require('./pitches');
const SCALE_TYPES = require('./scale-types');

/**
 * Predefined mappings of string names to model objects.
 *
 * @module Names
 * @example
 * // Inject all names into the global namespace.
 * // This is not safe to do in bigger projects,
 * // but it is very convenient when experimenting with this library.
 * require('midikit/names').into(global);
 */
module.exports = {

  /**
   * Common {@link Chord} types defined in terms of scale degree offsets (the third argument to the Chord constructor)
   * <br><br>
   * TRIAD, INV1, INV2, SUS2, SUS4, FOURFIVE, SEVENTH, SEVENTH_INV1, SEVENTH_INV2, SEVENTH_INV3
   */
  CHORD_TYPES,

  /**
   * All 12 {@link PitchClass PitchClasses}:
   * <br><br>
   * C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
   */
  PITCH_CLASSES,

  /**
   * All 128 {@link Pitch Pitches}:
   * <br><br>
   * C_1, Db_1, D_1, Eb1, ..., B_1, C0, Db1, ..., B8, C9, ..., G9
   * <br><br>
   * (C_1 is min Pitch value 0, G9 is max Pitch value 127. "_1" indicates -1 octave number)
   */
  PITCHES,

  /**
   * Common {@link Scale Scale} types defined in terms of intervals (the second argument to the Scale constructor):
   * <br><br>
   * IONIAN (or MAJOR), DORIAN, PHRYGIAN, LYDIAN, MIXOLYDIAN, AEOLIAN (or MINOR or NATURAL_MINOR), LOCRIAN, HARMONIC_MINOR
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
