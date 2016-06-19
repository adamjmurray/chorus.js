const { mod } = require('../utils');

const PITCH_CLASS_VALUES = Object.freeze({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 });

function invalid(string) {
  throw new Error(`Invalid PitchClass name: ${string}`)
}

/**
 * A PitchClass represents a set of all pitches that are octaves apart from each other.
 * A PitchClass and an octave number defines a {@link Pitch}.
 * <br><br>
 * A PitchClass has a value and a name.
 * PitchClasses operate in a "mod 12" modular arithmetic space, where 0, 12, 24, 36, etc are considered equal.
 * The canonical PitchClass values are [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
 * <br><br>
 * The basic PitchClass names are "C", "D", "E", "F", "G", "A", "B".
 * You can construct a PitchClass using a basic name, optionally followed by sharps "#" or flats "b".
 * Sharps and flats increment or decrement the value respectively. See examples below.
 *
 * @example
 * // Constructing by name
 * new PitchClass('C')
 * new PitchClass('Db') // same as PitchClass('C#')
 * new PitchClass('D')  // Same as PitchClass('C##') or PitchClass('Ebb')
 * new PitchClass('Db') // same as PitchClass('D#')
 * new PitchClass('E')
 * new PitchClass('F')
 * new PitchClass('Gb')
 * new PitchClass('G')
 * new PitchClass('Ab')
 * new PitchClass('A')
 * new PitchClass('Bb')
 * new PitchClass('B')
 *
 * // Constructing by value
 * new PitchClass(0) // same as PitchClass('C') or PitchClass(12)
 * new PitchClass(1) // same as PitchClass('Db')
 * ...
 * new PitchClass(11) // same as PitchClass('B')
 *
 * @see https://en.wikipedia.org/wiki/Pitch_class
 * @see https://en.wikipedia.org/wiki/Octave
 */
class PitchClass {

  /**
   * The canonical names of all pitch classes, indexed by their value.
   * Note that some names have aliases. For example: "C#" is equivalent to "Db", and "Fbb" is equivalent to "Eb"
   * @returns {Array}
   */
  static get NAMES() {
    return Object.freeze(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']);
  }

  /**
   * @param nameOrValue {number|string} a PitchClass numerical value or string name.
   */
  constructor(nameOrValue) {
    let value;
    if (typeof nameOrValue === 'number') {
      value = nameOrValue;
    }
    else {
      const string = nameOrValue.toString();
      value = PITCH_CLASS_VALUES[string[0].toUpperCase()];
      if (value == null) invalid(string);
      for (let i = 1; i < string.length; i++) {
        switch (string[i]) {
          case 'b': value--; break;
          case '#': value++; break;
          default: invalid(string);
        }
      }
    }
    /**
     * The number of semitones above C. Used to compute {@link Pitch#value MIDI pitch values}.
     * This is always the canonical value in the range 0-11 (inclusive). Assigning this property will convert to the
     * equivalent canonical value.
     * @member {Number}
     */
    this.value = value;
  }

  set value(v) {
    this._value = mod(Math.round(v), 12);
  }

  get value() {
    return this._value;
  }

  /**
   * The canonical name of this PitchClass. See {@link PitchClass.NAMES}
   * @readonly
   */
  get name() {
    return PitchClass.NAMES[this._value];
  }

  /**
   * Prevent changes to this PitchClass's value
   * @returns {PitchClass} this PitchClass
   */
  freeze() {
    return Object.freeze(this);
  }
}

module.exports = PitchClass;
