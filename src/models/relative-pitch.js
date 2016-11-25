/**
 * A pitch that's relative to a given scale.
 * The offset represents scale degrees (the pitches in the scale)
 * and the optional shift applies a chromatic shift (AKA an accidental) to allow for pitches outside the scale.
 */
class RelativePitch {

  constructor(offset, shift=0) {
    if (offset.constructor === Object) {
      this.offset = offset.offset || 0;
      this.shift = offset.shift || 0;
    } else {
      this.offset = offset;
      this.shift = shift;
    }
    Object.freeze(this);
  }

  valueOf() {
    return this.offset; // we lose the shift when adding/subtracting the offset
  }

  add(offset) {
    return new RelativePitch(this.offset + offset); // we lose the shift when adding/subtracting the offset
  }
}

module.exports = RelativePitch;
