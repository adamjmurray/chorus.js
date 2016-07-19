const { mod } = require('../utils');

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
  // TODO: rename degree to root?
  constructor(offsets, { scale, degree = 0, octave = 4, inversion = 0 } = {}) {
    this.offsets = offsets; // scale degrees relative to the given degree
    this.degree = degree; // the scale degree of the root of the chord
    this.scale = scale;
    this.octave = octave;
    this.inversion = inversion;
  }

  /**
   *
   * @param relativeOctave
   * @returns {Array|*|{}}
   */
  pitches({ scale = this.scale, degree = this.degree, octave = this.octave, inversion = 0 } = {}) {
    inversion += this.inversion; // TODO: maybe rename to relative inversion?
    const offsets = this.offsetsForInversion({ inversion, scale });
    return offsets.map(offset =>
      scale.pitch(degree + offset, octave));
  }

  /**
   *
   * @param position
   * @param relativeOctave
   * @returns {*}
   */
  pitch(position, { scale = this.scale, degree = this.degree, octave = this.octave, inversion = 0 } = {}) {
    const pitches = this.pitches({ scale, degree, octave, inversion });
    const pitch = pitches[mod(position, pitches.length)];
    const octaveOffset = Math.floor(position / pitches.length);
    if (octaveOffset !== 0) {
      return pitch.add(octaveOffset * scale.semitones);
    }
    return pitch;
  }

  /**
   * Change the chord inversion
   * @param number
   */
  // TODO: FIXME: This is the wrong approach! The named chords (TRIAD, etc) should be functions that can
  // either take a root or an object with root, inversion/inv, maybe spacing options,
  inv(number, { scale = this.scale, degree = this.degree, octave = this.octave } = {}) {
    return new Chord(this.offsets, { scale, degree, octave, inversion: number });
  }

  offsetsForInversion({ inversion = this.inversion, scale = this.scale }) {
    if (!inversion) return this.offsets; // 0 means no inversion, treat other falsey values the same
    const offsets = this.offsets.slice(); // make a copy
    const scaleLength = scale.length;
    for (let i =  1; i <= inversion; i++) offsets.push(offsets.shift() + scaleLength);
    for (let i = -1; i >= inversion; i--) offsets.unshift(offsets.pop() - scaleLength);
    return offsets;
  }

  // Something like this might still be useful? Call into offsetForInversion...
  // inversion(number, { scale = this.scale, degree = this.degree, octave = this.octave } = {}) {
  //   if (!number) return this; // 0 means no inversion, treat other falsey values the same
  //   const offsets = this.offsets.slice(); // make a copy
  //   const scaleLength = scale.length;
  //   for (let i =  1; i <= number; i++) offsets.push(offsets.shift() + scaleLength);
  //   for (let i = -1; i >= number; i--) offsets.unshift(offsets.pop() - scaleLength);
  //   return new Chord(offsets, { scale, degree, octave });
  // }

  // TODO: rename to atDegree()? Deprecated?
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
