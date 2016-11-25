const RelativePitch = require('./relative-pitch');
const { mod } = require('../utils');

function findUniqueOctaveOffset(relativePitches, scaleLength, direction) {
  direction = Math.sign(direction);
  // TODO: do this once in the calling function?
  if (direction < 0) relativePitches = relativePitches.slice().reverse();
  for (let octave=direction; true; octave += direction) { // eslint-disable-line no-constant-condition
    for (const {degree,shift} of relativePitches) {
      const invertedDegree = degree + (octave * scaleLength);
      if (!relativePitches.find(({degree:d,shift:s}) => (d === invertedDegree && s === shift))) {
        return new RelativePitch(invertedDegree, shift);
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
   * @param position {Number|RelativePitch}
   * @param inversion
   * @returns {*}
   */
  pitch(position, { scale, octave=4, inversion=this.inversion, offset=0 }={}) {
    const shift = position.shift || 0;
    position = position.degree || Number(position);
    const pitches = this.pitches({ scale, octave, inversion, offset });
    const pitch = pitches[mod(position, pitches.length)];
    const octaveOffset = Math.floor(position / pitches.length);
    return pitch.add(octaveOffset * scale.semitones + shift);
  }

  inv(inversion) {
    if (!inversion) return this;
    return new Chord(this.relativePitches, inversion);
  }
}

module.exports = Chord;
