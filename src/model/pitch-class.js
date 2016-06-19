const { mod } = require('../utils');

const PITCH_CLASS_VALUES = Object.freeze({
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
});
const PITCH_CLASS_NAMES = Object.freeze(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']);

function invalid(string) {
  throw new Error(`Invalid PitchClass name: ${string}`)
}

/**
 * A PitchClass represents a set of all pitches that are octaves apart from each other.
 * A PitchClass with an octave number can be used to define a {@link Pitch}.
 *
 * @see https://en.wikipedia.org/wiki/Pitch_class
 * @see https://en.wikipedia.org/wiki/Octave
 */
class PitchClass {
  static get NAMES() {
    return PITCH_CLASS_NAMES;
  }

  constructor(nameOrValue) {
    let value;
    let name;
    if (typeof nameOrValue === 'number') {
      value = mod(Math.round(nameOrValue), 12);
      name = PITCH_CLASS_NAMES[value];
    }
    else {
      const string = nameOrValue.toString();
      if (string.length > 3) invalid(string);
      name = string[0].toUpperCase();
      value = PITCH_CLASS_VALUES[name];
      if (value == null) invalid(string);
      for (let i = 1; i < string.length; i++) {
        switch (string[i]) {
          case 'b': value--; break;
          case '#': value++; break;
          default: invalid(string);
        }
        name += string[i];
      }
    }
    this.value = value;
    this.name = name;
  }

  freeze() {
    return Object.freeze(this);
  }
}

module.exports = PitchClass;
