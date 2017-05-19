const Sequencer = require('./sequencer');

/**
 * Generates `{time, intensity, duration}` values to control the groove of a {@link Part}.
 * @extends Sequencer
 */
class Rhythm extends Sequencer {

  /**
   * @param {Object} options
   * @param {String|Iterable} options.pattern When a String, it can contain the following characters:
   *   - `"X"` &rarr; accented note
   *   - `"x"` &rarr; normal note
   *   - `"="` &rarr; tie
   *   - `"."` &rarr; rest
   *
   * Each characters' duration is determined by the `pulse` option.
   * NOTE: Other characters are ignored and can be used to improve readability, for example `"X.x.|x==.|..x=|x=X="`
   *
   * When an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable|Iterable}
   * of delta-start times, it represents the time between each note (with the first note always starting immediately).
   * NOTE: Negative numbers can be used as rests, and the absolute value is the time until the next note.
   * @param {Number} [options.pulse=1] The duration in beats of each character in a String `pattern`.
   * Only relevant if the `pattern` option is a String.
   * @param {Iterable} [options.intensities=[0.7]]
   * Determines the note intensities in an Iterable `pattern`. Ignored if the `pattern` option is a String.
   * @param {Iterable} [options.durations=time between notes]
   * Determines the note durations in an Iterable `pattern`. Ignored if the `pattern` option is a String.
   * @param {Iterable} [options.length=pattern length]
   * Overrides the length of this rhythm to be different than the `pattern` length.
   * Useful when this rhythm is `looped` or when using {@link Random.duration}s.
   * @param {Iterable} [options.looped=false] If true, this rhythm will repeat infinitely. Note that delta-start times,
   * intensities, and durations loop independently for Iterable `pattern`s, which creates less repetitive rhythms.
   */
  constructor({ pattern=[], pulse=1, intensities, durations, length, looped=false } = {}) {
    const times = [];
    if (typeof pattern === 'string') {
      length = length || pattern.length * pulse;
      intensities = [];
      durations = [];
      let duration = null;
      let count = 0;
      for (const char of pattern) {
        switch (char) {
          case 'X':
            times.push(pulse * count);
            intensities.push(1);
            if (duration) durations.push(duration); // previous duration
            duration = pulse;
            count++;
            break;
          case 'x':
            times.push(pulse * count);
            intensities.push(0.7);
            if (duration) durations.push(duration); // previous duration
            duration = pulse;
            count++;
            break;
          case '=':
            if (duration) duration += pulse;
            count++;
            break;
          case '.':
            if (duration) durations.push(duration);
            duration = null;
            count++;
            break;
          default:
        }
      }
      if (duration) durations.push(duration);
    }
    else {
      length = length || pattern.map(Math.abs).reduce((a,b) => a + b, 0);
      const legatoDurations = [];
      let time = 0;
      let nextTime;
      for (const value of pattern) {
        nextTime = time + Math.abs(value);
        const duration = (nextTime - time) * Math.sign(value);
        if (duration > 0) {
          times.push(time);
          legatoDurations.push(duration);
        } // else this is a rest
        time = nextTime;
      }
      if (!durations) durations = legatoDurations;
    }
    intensities = intensities || [0.7];
    super({ time: times, intensity: intensities, duration: durations }, { length, looped });
    this.times = times;
    this.intensities = intensities;
    this.durations = durations;
  }

  /**
   * Generates a Rhythm pattern String by evenly distributes the given number of pulses into the given total number of
   * time units. Very similar to a "Euclidean pattern". Use the return value for the constructor's pattern option.
   * @param pulses {number}
   * @param total {number}
   * @param {Object} options
   * @param {Number} [options.shift=0] shifts the pattern (with wrap-around) by the given number of time units
   * @param {Number} [options.rotation=0] shifts the pattern (with wrap-around) to the given pulse index
   * @see https://en.wikipedia.org/wiki/Euclidean_pattern
   */
  static distribute(pulses, total, options={}) {
    const { rotation, shift } = options;
    let pattern = [];
    let count = 0;
    let nextPulse = Math.floor(++count/pulses * total);
    for (let i=1; i<=total; i++) {
      if (i < nextPulse) {
        pattern.push('.'); // rest
      } else {
        pattern.push('x'); // pulse
        nextPulse = Math.floor(++count/pulses * total);
      }
    }
    pattern = pattern.reverse();
    if (rotation) {
      for (let i =  1; i <= rotation; i++) {
        const slicePoint = pattern.indexOf('x', 1);
        if (slicePoint > 0) pattern = pattern.slice(slicePoint).concat(pattern.slice(0, slicePoint));
        else break;
      }
      for (let i = -1; i >= rotation; i--) {
        const slicePoint = pattern.lastIndexOf('x');
        if (slicePoint > 0) pattern = pattern.slice(slicePoint).concat(pattern.slice(0, slicePoint));
        else break;
      }
    }
    if (shift) {
      const slicePoint = shift % pattern.length;
      pattern = pattern.slice(slicePoint).concat(pattern.slice(0, slicePoint));
    }
    return pattern.join('');
  }
}

module.exports = Rhythm;
