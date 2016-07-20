const PitchClass = require('./pitch-class');
const { mod } = require('../utils');

/**
 * A Pitch is an immutable representation of the frequency of a musical note.
 * It consists of a {@link PitchClass} and an octave number.
 * It has an underlying value for MIDI pitch, which supports the range 0 to 127 (inclusive).
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
    let pitchClass;
    if (typeof value === 'number') {
      pitchClass = new PitchClass( mod(Math.round(value), 12) );
      octave = Math.floor(value / 12) - 1;
    }
    else {
      if (value instanceof PitchClass) {
        pitchClass = value;
      }
      else {
        const string = value.toString();
        const matches = /([A-Ga-g][b#]*)([-_]1|[0-9])$/.exec(string);
        if (matches) {
          pitchClass = new PitchClass(matches[1]);
          octave = Number(matches[2].replace('_','-'));
        }
        else {
          pitchClass = new PitchClass(string);
        }
      }
      value = pitchClass.value + 12 * (octave + 1);
    }
    /**
     * @member {PitchClass}
     * @readonly */
    this.pitchClass = pitchClass;
    /**
     * @member {number}
     * @readonly */
    this.octave = octave;
    /**
     * The MIDI pitch value. Should be in the range 0 to 127 (inclusive).
     * @member {number}
     * @readonly */
    this.value = value;
    /**
     * The [canonical name]{@link module:Names.PITCHES} for this Pitch.
     * @member {string}
     * @readonly */
    this.name = `${pitchClass.name}${octave.toString().replace('-', '_')}`;
    Object.freeze(this);
  }

  valueOf() {
    return this.value;
  }

  inspect() {
    return this.name;
  }

  /**
   * Return a new Pitch whose value is the sum of this Pitch's value and the given value
   * @param value {number} the value to add to this Pitch's value
   * @returns {Pitch}
   */
  add(value) {
    return new Pitch(this.value + value);
  }
}

module.exports = Pitch;
