/**
 * A length of time measured in beats.
 * A {@link Note}'s Duration determines how long it will play.
 */
class Duration {
  constructor(value) {
    /**
     * The duration in beats.
     * @member {number}
     */
    this.value = value;
  }

  /**
   * Prevent changes to this Duration's value
   * @returns {Duration} this Duration
   */
  freeze() {
    return Object.freeze(this);
  }
}

module.exports = Duration;
