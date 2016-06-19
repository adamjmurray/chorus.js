const PitchClass = require('./pitch-class');
const { mod } = require('../utils');

/**
 * A Pitch represents a MIDI pitch value in the range 0 to 127 (inclusive).
 * Every Pitch has a {@link PitchClass} and an octave number.
 * A {@link Note}'s Pitch determines the frequency of the note.
 *
 * @example
 * // The following are equivalent:
 * new Pitch(60);
 * new Pitch(new PitchClass('C'), 4);
 * new Pitch(new PitchClass('C')); // default octave is 4
 * new Pitch('C4');
 * new Pitch('C', 4);
 * new Pitch('C'); // default octave is 4
 */
class Pitch {

  /**
   * The maximum pitch value supported by MIDI: 127. Note the minimum value is 0.
   */
  static get MAX_VALUE() {
    return 127;
  }

  /**
   * @param {number|PitchClass|string} value - The numeric pitch value, or a PitchClass, or a string of the pitch class name and optional octave. See examples below.
   * @param {number} [octave=4] - The octave to use when the first argument is a PitchClass or a string without the octave. The octave should be in the range -1 to 9 (inclusive) to avoid invalid pitch values.
   */
  constructor(value, octave = 4) {
    if (typeof value === 'number') {
      /** @member {number} */
      this.value = value;
    }
    else {
      let pitchClass;
      if (value instanceof PitchClass) {
        pitchClass = value;
      }
      else {
        const string = value.toString();
        const matches = /(.*)(-?[0-9]+)$/.exec(string);
        if (matches) {
          pitchClass = new PitchClass(matches[1]);
          octave = Number(matches[2]);
        }
        else {
          pitchClass = new PitchClass(string);
        }
      }
      this.value = pitchClass.value + 12 * (octave + 1);
    }
  }

  /**
   * @member {PitchClass}
   * @readonly
   */
  get pitchClass() {
    return new PitchClass(mod(Math.round(this.value), 12));
  }

  /**
   * @member {number}
   * @readonly
   */
  get octave() {
    return Math.floor(this.value / 12) - 1;
  }

  // TODO: deprecated
  get midiValue() {
    return this.value;
  }

  /**
   * Return a new Pitch whose value is the sum of this Pitch's value and the given value
   * @param value {number} the value to add to this Pitch's value
   * @returns {Pitch}
   */
  add(value) {
    return new Pitch(this.value + value);
  }

  /**
   * Prevent changes to this Pitch's value
   * @returns {Pitch} this Pitch
   */
  freeze() {
    this.pitchClass.freeze();
    return Object.freeze(this);
  }
}

module.exports = Pitch;
