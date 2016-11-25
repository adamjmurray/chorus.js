/**
 * A pitch that is relative to another pitch in a scale or chord.
 * It is converted to a pitch by Scale.pitch() or Chord.pitch()
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

  add(relativePitch) {
    const degree = relativePitch.degree || Number(relativePitch);
    // The added relativePitch's shift supersedes this shift
    // If relativePitch is just a number, we lose the shift
    const shift = relativePitch.shift || 0;
    return new RelativePitch(this.degree + degree, shift);
  }
}

module.exports = RelativePitch;
