const PitchClass = require('./pitch-class');
const Pitch = require('./pitch');
const utils = require('../utils');

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
    this.length = intervals.length;
  }

  step(index, baseOctave) {
    const wantsPitchClass = baseOctave == null;
    let pitchClassValue = this.root.value; // pitch class value
    for (let i = 0; i < index; i++) {
      pitchClassValue += this.intervals[i % this.length];
    }
    for (let i = -1; i >= index; i--) {
      pitchClassValue -= this.intervals[utils.mod(i, this.length)];
    }
    const pitchClass = new PitchClass(pitchClassValue);
    if (wantsPitchClass) return pitchClass;
    const octave = baseOctave + Math.floor(pitchClassValue / 12);
    return new Pitch(pitchClass, octave);
  }
}

module.exports = Scale;
