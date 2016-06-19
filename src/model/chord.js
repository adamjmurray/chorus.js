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
  constructor(scale, root, offsets) { // TODO: option for "borrowed" notes from the chromatic scale
    this.scale = scale;
    this.root = root; // the scale degree of the root of the chord
    this.offsets = offsets; // the list of scale degrees relative to the chord
  }

  /**
   *
   * @param relativeOctave
   * @returns {Array|*|{}}
   */
  pitches(relativeOctave = 0) {
    return this.offsets.map(offset =>
      this.scale.pitch(this.root + offset, relativeOctave));
  }

  /**
   *
   * @param position
   * @param relativeOctave
   * @returns {*}
   */
  pitch(position, relativeOctave = 0) {
    const pitches = this.pitches(relativeOctave);
    const pitch = pitches[utils.mod(position, pitches.length)];
    const offset = Math.floor(position / pitches.length);
    if (offset !== 0) {
      return pitch.add(offset * this.scale.semitones);
    }
    return pitch;
  }

  // TODO: test coverage for this
  inversion(number) {
    const offsets = this.offsets.slice(); // make a copy
    const scaleLength = this.scale.length;
    for (let i =  1; i <= number; i++) offsets.push(degrees.shift() + scaleLength);
    for (let i = -1; i >= number; i--) offsets.unshift(degrees.pop() - scaleLength);
    return new Chord(this.scale, this.root, offsets);
  }

  freeze() {
    return Object.freeze(this);
  }
}

module.exports = Chord;
