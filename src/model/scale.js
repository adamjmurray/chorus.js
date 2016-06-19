const PitchClass = require('./pitch-class');
const Pitch = require('./pitch');
const utils = require('../utils');

const DEFAULT_OCTAVE = 4;

/**
 * A list of pitch classes, which can be converted to pitches
 */
class Scale {

  constructor(root, intervals) {
    if (!(root instanceof PitchClass)) throw new TypeError('Scale root must be a PitchClass');
    if (!(intervals instanceof Array)) throw new TypeError('Scale intervals must be an Array');
    this.root = root; // a pitch class
    this.intervals = intervals; // list of integers for the interval distance between consecutive notes of the scale.
    // intervals sum is 12 for octave-repeating scales.
  }

  get length() {
    return this.intervals.length;
  }

  get semitones() {
    return this.intervals.reduce((a,b) => a + b, 0);
  }

  pitch(scaleDegree, relativeOctave = 0) {
    let pitchClassValue = this.root.value; // pitch class value
    for (let i = 0;  i < scaleDegree;  i++) pitchClassValue += this.intervals[i % this.length];
    for (let i = -1; i >= scaleDegree; i--) pitchClassValue -= this.intervals[utils.mod(i, this.length)];
    const pitchClass = new PitchClass(pitchClassValue);
    const octave = DEFAULT_OCTAVE + relativeOctave + Math.floor(pitchClassValue / 12);
    return new Pitch(pitchClass, octave);
  }
}

module.exports = Scale;
