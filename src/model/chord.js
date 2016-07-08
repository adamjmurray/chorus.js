const utils = require('../utils');

/**
 *
 */
class Chord {

  /**
   *
   * @param scale
   * @param root
   * @param offsets
   */
  constructor(offsets, { scale, degree = 0, octave = 4 } = {}) { // TODO: option for "borrowed" notes from the chromatic scale
    this.offsets = offsets; // scale degrees relative to the given degree
    this.degree = degree; // the scale degree of the root of the chord
    this.scale = scale;
    this.degree = degree;
    this.octave = octave;
  }

  /**
   *
   * @param relativeOctave
   * @returns {Array|*|{}}
   */
  pitches({ scale = this.scale, degree = this.degree, octave = this.octave } = {}) { // TODO: option for inversion number?
    return this.offsets.map(offset =>
      scale.pitch(degree + offset, octave));
  }

  /**
   *
   * @param position
   * @param relativeOctave
   * @returns {*}
   */
  pitch(position, { scale = this.scale, degree = this.degree, octave = this.octave } = {}) { // TODO: option for inversion number?
    const pitches = this.pitches({ scale, degree, octave });
    const pitch = pitches[utils.mod(position, pitches.length)];
    const offset = Math.floor(position / pitches.length);
    if (offset !== 0) {
      return pitch.add(offset * scale.semitones);
    }
    return pitch;
  }

  // TODO: test coverage for this
  inversion(number, { scale = this.scale, degree = this.degree, octave = this.octave } = {}) {
    const offsets = this.offsets.slice(); // make a copy
    const scaleLength = scale.length;
    for (let i =  1; i <= number; i++) offsets.push(offsets.shift() + scaleLength);
    for (let i = -1; i >= number; i--) offsets.unshift(offsets.pop() - scaleLength);
    return new Chord(offsets, { scale, degree, octave });
  }

  // TODO: rename to atDegree()?
  at(degree) {
    return new Chord(this.offsets.slice(), { degree, scale: this.scale, octave: this.octave });
  }

  freeze() {
    Object.freeze(this.offsets);
    if (this.scale) this.scale.freeze();
    return Object.freeze(this);
  }
}

module.exports = Chord;
