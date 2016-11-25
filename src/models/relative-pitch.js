/**
 * A pitch that is relative to a given scale.
 * Normally this is relative to the root of a scale (see Scale.pitchAt() and Scale.pitchClassAt())
 * but it can also be relative to another note in the scale, in the case of the chord.pitchAt() offset option
 */
class RelativePitch {

  /**
   *
   * @param degree the number of scale degrees (pitches in the scale) relative to the base pitch
   * @param shift applies a chromatic shift (AKA an accidental) to allow for pitches outside the scale.
   */
  constructor(degree, shift=0) {
    if (degree.constructor === Object) {
      this.degree = degree.degree || 0;
      this.shift = degree.shift || 0;
    } else {
      this.degree = degree;
      this.shift = shift;
    }
    Object.freeze(this);
  }

  valueOf() {
    return this.degree; // we lose the shift when adding/subtracting the degree
  }

  add(degree) {
    return new RelativePitch(this.degree + degree); // we lose the shift when adding/subtracting the degree
  }
}

module.exports = RelativePitch;
