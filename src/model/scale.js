const PitchClass = require('./pitch-class');
const Pitch = require('./pitch');
const { mod } = require('../utils');

// The raw value for the pitch class that hasn't had modular math applied to "normalize" it,
// so octave offsets can be calculated properly in Scale.pitch()
function pitchValue(scale, relativePitch) {
  const degree = relativePitch.degree || Number(relativePitch);
  let value = Number(scale.root);
  for (let i =  0; i < degree;  i++) value += scale.intervals[i % scale.length];
  for (let i = -1; i >= degree; i--) value -= scale.intervals[mod(i, scale.length)];
  value += relativePitch.shift || 0;
  return value;
}

/**
 * A list of pitch classes, which can be converted to pitches
 *
 * @see https://en.wikipedia.org/wiki/Scale_(music)
 */
class Scale {

  constructor(intervals, root=new PitchClass(0), { pitchValueOffset=0 }={}) {
    if (!(intervals instanceof Array)) throw new TypeError('Scale intervals must be an Array');
    if (!(root instanceof PitchClass)) root = new PitchClass(root);
    // list of integers for the interval distance between consecutive notes of the scale:
    // intervals sum is root.pitchesPerOctave (usually 12) for octave-repeating scales
    this.intervals = Object.freeze(intervals.slice());
    this.root = root; // a pitch class
    this.pitchValueOffset = pitchValueOffset;
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

  /**
   *
   * @param relativePitch {Number|RelativePitch}
   * @returns {PitchClass}
   */
  pitchClass(relativePitch) {
    return new PitchClass(pitchValue(this, relativePitch), { pitchesPerOctave: this.root.pitchesPerOctave });
  }

  /**
   *
   * @param relativePitch {Number|RelativePitch}
   * @param octave {Number}
   * @returns {Pitch}
   */
  pitch(relativePitch, { octave=4 }={}) {
    const value = pitchValue(this, relativePitch);
    const pitchClass = new PitchClass(value, { pitchesPerOctave: this.root.pitchesPerOctave });
    return new Pitch(pitchClass, octave + Math.floor(value / this.root.pitchesPerOctave), {
      pitchValueOffset: this.pitchValueOffset,
    });
  }
}

module.exports = Scale;
