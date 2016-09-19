const { mod } = require('../utils');

function findUniqueOctaveOffset(offsets, scaleLength, direction = 1) {
  direction = Math.sign(direction) || 1;
  if (direction < 0) offsets = offsets.slice().reverse();
  let octave = direction;
  while (true) { // eslint-disable-line no-constant-condition
    for (const offset of offsets) {
      const octaveOffset = offset + (octave * scaleLength);
      if (!offsets.includes(octaveOffset)) {
        return octaveOffset;
      }
    }
    octave += direction;
  }
}

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
  constructor(offsets, { scale, root = 0, octave = 4, inversion = 0, shifts } = {}) {
    this.offsets = offsets.slice(); // scale degrees relative to the given root
    this.shifts = shifts; // chromatic shifts for the scale-degree offsets
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
  pitches({ scale = this.scale, root = this.root, octave = this.octave, inversion = this.inversion, shifts = this.shifts, offset = 0, } = {}) {
    const offsets = this.offsetsForInversion(inversion, { scale });
    const pitches = offsets.map(chordPitchOffset =>
      scale.pitch(root + chordPitchOffset + offset, { octave }));
    if (shifts && shifts.length) {
      if (inversion) {
        shifts = shifts.slice(0, offsets.length);
        while (shifts.length < offsets.length) shifts.push(0);
        for (let i = 1; i <= inversion; i++) shifts.push(shifts.shift());
        for (let i = -1; i >= inversion; i--) shifts.unshift(shifts.pop());
      }
      return pitches.map((pitch, index) => pitch.add(shifts[index] || 0));
    }
    return pitches;
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
  pitch(position, { scale = this.scale, root = this.root, octave = this.octave, inversion = this.inversion, shifts = this.shifts, offset = 0 } = {}) {
    const pitches = this.pitches({ scale, root, octave, inversion, shifts, offset });
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
    for (let i =  1; i <= inversion; i++) {
      offsets.push(findUniqueOctaveOffset(offsets, scaleLength));
      offsets.shift();
    }
    for (let i = -1; i >= inversion; i--) {
      offsets.unshift(findUniqueOctaveOffset(offsets, scaleLength, -1));
      offsets.pop();
    }
    return offsets;
  }

  inv(inversion) {
    if (!inversion) return this;
    return new Chord(this.offsets, { scale: this.scale, root: this.root, octave: this.octave, shifts: this.shifts, inversion: inversion });
  }

}

module.exports = Chord;
