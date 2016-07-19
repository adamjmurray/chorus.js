const PitchClass = require('./pitch-class');
const Pitch = require('./pitch');
const { mod } = require('../utils');

/**
 * A list of pitch classes, which can be converted to pitches
 *
 * @see https://en.wikipedia.org/wiki/Scale_(music)
 */
class Scale {

  constructor(intervals, { root = new PitchClass(0) } = {}) {
    if (!(intervals instanceof Array)) throw new TypeError('Scale intervals must be an Array');
    if (!(root instanceof PitchClass)) throw new TypeError('Scale root must be a PitchClass');
    this.intervals = intervals; // list of integers for the interval distance between consecutive notes of the scale.
    // intervals sum is 12 for octave-repeating scales.
    this.root = root; // a pitch class
    Object.freeze(this);
  }

  get length() {
    return this.intervals.length;
  }

  /**
   * The size of the scale in semitones (keys on a piano keyboard).
   * For most scales, this value will be 12, which means the scale repeats every octave.
   * In other words, when this is 12, if the scale starts on a C, it will end on the next higher C.
   */
  get semitones() {
    return this.intervals.reduce((a,b) => a + b, 0);
  }

  pitch(degree, { root = this.root, octave = 4 } = {}) {
    let pitchClassValue = root + 0; // coerce to a Number using PitchClass.valueOf()
    for (let i =  0; i < degree;  i++) pitchClassValue += this.intervals[i % this.length];
    for (let i = -1; i >= degree; i--) pitchClassValue -= this.intervals[mod(i, this.length)];
    const pitchClass = new PitchClass(pitchClassValue);
    return new Pitch(pitchClass, octave + Math.floor(pitchClassValue / 12));
  }
}

module.exports = Scale;
