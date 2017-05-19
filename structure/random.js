/* eslint no-constant-condition: off */

/**
 * A collection of
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*|generator functions}
 * that yield random values for use in other [Structure](./module-Structure.html) classes.
 */
class Random {

  /**
   * Don't use. All functions in this class are static.
   * @ignore
   */
  constructor() {}

  /**
   * Randomly yield an integer suitable for relative pitches in a {@link Part}.
   *
   * The default min and max work well with 3-note chords when the part's {@link Part|mode} is `arpeggio`.
   * @param {Object} options
   * @param {Number} [options.min=0] minimum possible value (inclusive)
   * @param {Number} [options.max=2] maximum possible value (inclusive)
   */
  static *pitch({ min=0, max=2 }={}) {
    const range = max - min + 1; // + 1 includes the max value
    while (true) yield Math.floor(min + range*Math.random());
  }

  /**
   * Randomly yield a floating point number suitable for intensity values in a {@link Rhythm}.
   * @param {Object} options
   * @param {Number} [options.min=0] minimum possible value (inclusive)
   * @param {Number} [options.max=1] maximum possible value (exclusive)
   */
  static *intensity({ min=0, max=1 }={}) {
    const range = max - min;
    while (true) yield min + range*Math.random();
  }

  /**
   * Randomly yield an integer suitable for durations values in a {@link Rhythm}.
   *
   * First a random integer value between `min` and `max` is calculated, then it's multiplied by the `multiplier`.
   *
   * NOTE: Random durations are currently *not* supported by Harmony.durations or Rhythm.pattern.
   * @param {Object} options
   * @param {Number} [options.min=1] minimum possible value (inclusive)
   * @param {Number} [options.max=4] maximum possible value (inclusive)
   * @param {Number} [options.multiplier=1] scales the random value
   */
  static *duration({ min=1, max=4, multiplier=1 }={}) {
    const range = max - min + 1; // + 1 includes the max value
    while (true) yield Math.floor(min + range*Math.random()) * multiplier;
  }

  /**
   * Randomly yield one of the given values.
   * @param {Array} choices the values to randomly yield
   */
  static *choice(choices) {
    const count = choices.length;
    while (true) yield choices[Math.floor(count*Math.random())];
  }

  /**
   * Randomly yield one of the given values with a probability distribution determined by the given weights.
   * @param {Array} choices the values to randomly yield
   * @param {Array} weights the relative weights for the corresponding values.
   * @example
   * weightedChoice([10,20,30], [1,2,1])
   * // 10 is yielded 25% of the time
   * // 20 is yielded 50% of the time
   * // 30 is yielded 25% of the time
   */
  static *weightedChoice(choices, weights) {
    const count = choices.length;
    const totalWeight = weights.reduce((a,b) => a + b, 0);
    while (true) {
      const target = totalWeight * Math.random();
      let i = 0;
      let sum = 0;
      while (i < count) {
        sum += (weights[i] || 0);
        if (sum >= target) break;
        i++;
      }
      yield choices[i]
    }
  }
}

module.exports = Random;