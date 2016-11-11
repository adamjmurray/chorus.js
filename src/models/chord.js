const { mod } = require('../utils');

function findUniqueOctaveOffset(offsetsAndShifts, scaleLength, direction) {
  direction = Math.sign(direction);
  if (direction < 0) offsetsAndShifts = offsetsAndShifts.slice().reverse();
  for (let octave=direction; true; octave += direction) { // eslint-disable-line no-constant-condition
    for (const [offset,shift] of offsetsAndShifts) {
      const invertedOffset = offset + (octave * scaleLength);
      if (!offsetsAndShifts.find(([o,s]) => (o === invertedOffset && s === shift))) {
        return [invertedOffset,shift];
      }
    }
  }
}

function offsetsAndShiftsForInversion(offsets, shifts, inversion, scaleLength) {
  offsets = offsets.slice(); // make a copy
  shifts = (shifts || []).slice(0, offsets.length);
  if (shifts.length < offsets.length) {
    shifts = shifts.concat(new Array(offsets.length - shifts.length).fill(0));
  }
  const offsetsAndShifts = offsets.map((offset, index) => [offset, shifts[index]]);
  for (let i =  1; i <= inversion; i++) {
    offsetsAndShifts.push(findUniqueOctaveOffset(offsetsAndShifts, scaleLength, 1));
    offsetsAndShifts.shift();
  }
  for (let i = -1; i >= inversion; i--) {
    offsetsAndShifts.unshift(findUniqueOctaveOffset(offsetsAndShifts, scaleLength, -1));
    offsetsAndShifts.pop();
  }
  return offsetsAndShifts;
}

/**
 * A chord
 */
class Chord {

  /**
   *
   * @param offsets - a list of scale offsets (Numbers) and/or scale offsets + chromatic shifts (duples of Numbers)
   * @param scale
   * @param root
   * @param octave
   * @param inversion
   */
  constructor(offsets, { scale, root = 0, octave = 4, inversion = 0, shifts } = {}) {
    this.offsets = Object.freeze(offsets.slice()); // scale degrees relative to the given root
    this.shifts = shifts ? Object.freeze(shifts.slice()) : shifts; // chromatic shifts for the scale-degree offsets
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
    const offsetsAndShifts = offsetsAndShiftsForInversion(this.offsets, shifts, inversion, scale.length);
    const pitches = offsetsAndShifts.map(([invertedOffset, invertedShift]) =>
      scale.pitch(root + invertedOffset + offset, { octave }).add(invertedShift));
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

  inv(inversion) {
    if (!inversion) return this;
    return new Chord(this.offsets, { scale: this.scale, root: this.root, octave: this.octave, shifts: this.shifts, inversion: inversion });
  }

}

module.exports = Chord;
