const RelativePitch = require('./relative-pitch');
const { mod } = require('../utils');

function findUniqueOctaveOffset(relativePitches, scaleLength, direction) {
  direction = Math.sign(direction);
  // TODO: do this once in the calling function?
  if (direction < 0) relativePitches = relativePitches.slice().reverse();
  for (let octave=direction; true; octave += direction) { // eslint-disable-line no-constant-condition
    for (const {offset,shift} of relativePitches) {
      const invertedOffset = offset + (octave * scaleLength);
      if (!relativePitches.find(({offset:o,shift:s}) => (o === invertedOffset && s === shift))) {
        return new RelativePitch(invertedOffset, shift);
      }
    }
  }
}

function relativePitchesForInversion(relativePitches, inversion, scaleLength) {
  relativePitches = relativePitches.slice(); // make a copy
  for (let i =  1; i <= inversion; i++) {
    relativePitches.push(findUniqueOctaveOffset(relativePitches, scaleLength, 1));
    relativePitches.shift();
  }
  for (let i = -1; i >= inversion; i--) {
    relativePitches.unshift(findUniqueOctaveOffset(relativePitches, scaleLength, -1));
    relativePitches.pop();
  }
  return relativePitches;
}

/**
 * A chord
 */
class Chord {

  /**
   *
   * @param relativePitches
   * @param inversion
   */
  constructor(relativePitches, inversion=0) {
    relativePitches = relativePitches.map(rp => rp instanceof RelativePitch ? rp : new RelativePitch(rp));
    this.relativePitches = Object.freeze(relativePitches);
    this.inversion = inversion;
    Object.freeze(this);
  }

  /**
   *
   * @param scale
   * @param octave
   * @param inversion
   * @param offset
   * @returns {Array}
   */
  pitches({ scale, octave=4, inversion=this.inversion, offset=0, }={}) {
    const relativePitches = relativePitchesForInversion(this.relativePitches, inversion, scale.length);
    const pitches = relativePitches.map(relativePitch =>
      // Only add the additional offset if it's non-zero offset, because it causes the relativePitch's shift to be lost
      scale.pitch(offset ? relativePitch.add(offset) : relativePitch, { octave }));
    return pitches;
  }

  /**
   *
   * @param position
   * @param inversion
   * @returns {*}
   */
  pitchAt(position, { scale, octave=4, inversion=this.inversion, offset=0 }={}) {
    const pitches = this.pitches({ scale, octave, inversion, offset });
    const pitch = pitches[mod(position, pitches.length)];
    const octaveOffset = Math.floor(position / pitches.length);
    if (octaveOffset !== 0) {
      return pitch.add(octaveOffset * scale.semitones);
    }
    return pitch;
  }

  /**
   * @deprecated
   */
  pitch(position, options) {
    return this.pitchAt(position, options);
  }

  inv(inversion) {
    if (!inversion) return this;
    return new Chord(this.relativePitches, inversion);
  }
}

module.exports = Chord;
