const { mod } = require('../utils');

/**
 * A chord
 */
class Chord {

  /**
   *
   * @param scale
   * @param root
   * @param offsets
   * @param octave
   * @param inversion
   */
  constructor(offsets, { scale, root = 0, octave = 4, inversion = 0 } = {}) {
    this.offsets = offsets.slice(); // scale degress relative to the given root
    this.scale = scale;
    this.root = root; // the scale degree of the root of the chord
    this.octave = octave;
    this.inversion = inversion;
    Object.freeze(this);
  }

  /**
   *
   * @param scale
   * @param root
   * @param octave
   * @param inversion
   * @param offset
   * @returns {Array|*|{}}
   */
  pitches({ scale = this.scale, root = this.root, octave = this.octave, inversion = this.inversion, offset = 0 } = {}) {
    const offsets = this.offsetsForInversion(inversion, { scale });
    return offsets.map(chordPitchOffset =>
      scale.pitch(root + chordPitchOffset + offset, { octave }));
  }

  /**
   *
   * @param position
   * @param scale
   * @param root
   * @param octave
   * @param inversion
   * @param offset
   * @returns {*}
   */
  pitch(position, { scale = this.scale, root = this.root, octave = this.octave, inversion = this.inversion, offset = 0 } = {}) {
    const pitches = this.pitches({ scale, root, octave, inversion, offset });
    const pitch = pitches[mod(position, pitches.length)];
    const octaveOffset = Math.floor(position / pitches.length);
    if (octaveOffset !== 0) {
      return pitch.add(octaveOffset * scale.semitones);
    }
    return pitch;
  }

  offsetsForInversion(inversion = this.inversion, { scale = this.scale } = {}) {
    if (!inversion) return this.offsets; // 0 means no inversion, treat other falsey values the same
    const offsets = this.offsets.slice(); // make a copy
    const scaleLength = scale.length;
    for (let i =  1; i <= inversion; i++) offsets.push(offsets.shift() + scaleLength);
    for (let i = -1; i >= inversion; i--) offsets.unshift(offsets.pop() - scaleLength);
    return offsets;
  }

  inv(inversion) {
    if (!inversion) return this;
    return new Chord(this.offsets, { scale: this.scale, root: this.root, octave: this.octave, inversion: inversion });
  }

}

module.exports = Chord;
