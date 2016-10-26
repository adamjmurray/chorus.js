/**
 * A Rhythm generates `{time, intensity, duration}` tuples (intensity and duration optional depending on constructor properties).
 */
class Rhythm {

  /**
   * @param {String|Iterable} rhythm either a String or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable|Iterable}
   * of delta-start times
   *
   * If it's a String, it can contain the following characters:
   *   - `"X"` - accented note
   *   - `"x"` - normal note
   *   - `"="` - tie
   *   - `"."` - rest
   * Each character's duration is a 'time unit' that is the duration of the rate option.
   *
   * If it's a Iterable of delta-start times, it represents the time between each note (and the start of
   * sequence for the first note). The times are are relative to the rate option.
   *
   * @param {Iterable}
   * @param {Object} options
   * @param {Number} [options.rate=1/4] rate the number of beats each 'time unit' represents (e.g. 1/4 is a quarter of one beat, which is a sixteenth note in common time signatures)
   */
  constructor(rhythm, { rate=1/4, intensities, durations, looped } = {}) {
    this.intensities = intensities;
    this.durations = durations;
    this.looped = looped;
    const times = [];
    if (typeof rhythm === 'string') {
      this.loopDuration = rhythm.length * rate;
      this.string = rhythm;
      intensities = [];
      durations = [];
      let duration = null;
      let count = 0;
      for (const char of rhythm) {
        switch (char) {
          case 'X':
            times.push(rate * count);
            intensities.push(1);
            if (duration) durations.push(duration); // previous duration
            duration = rate;
            count++;
            break;
          case 'x':
            times.push(rate * count);
            intensities.push(0.7);
            if (duration) durations.push(duration); // previous duration
            duration = rate;
            count++;
            break;
          case '=':
            if (duration) duration += rate;
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
      this.loopDuration = rhythm.reduce((a,b) => a + b) * rate; // TODO: needs to Math.abs?
      durations = [];
      let time = 0;
      let nextTime;
      for (const value of rhythm) {
        nextTime = time + (rate * Math.abs(value));
        const duration = (nextTime - time) * Math.sign(value);
        if (duration > 0) {
          times.push(time);
          durations.push(duration);
        } // else this is a rest
        time = nextTime;
      }
    }
    this.times = times;
    if (!this.intensities) this.intensities = intensities || [0.7];
    if (!this.durations) this.durations = durations;

    // TODO: stop relying on this and require section length
    // But, how to handle looping at the track level?
    this.duration = looped ? Infinity : this.loopDuration;
  }

  /**
   * Generates a Rhythm by evenly distributes the given number of pulses into the given total number of time units.
   * Very similar to a "Euclidean rhythm".
   * @param pulses {number}
   * @param total {number}
   * @param options accepts the same options as the constructor, plus a rotation option
   * @see https://en.wikipedia.org/wiki/Euclidean_rhythm
   */
  static distribute(pulses, total, options={}) {
    if (!(pulses < total)) throw new Error('pulses must be less than total');
    const rhythm = [];
    let count = 0;
    let nextPulse = Math.floor(++count/pulses * total);
    for (let i=1; i<=total; i++) {
      if (i < nextPulse) {
        rhythm.push('.'); // rest
      } else {
        rhythm.push('x'); // pulse
        nextPulse = Math.floor(++count/pulses * total);
      }
    }
    let rhythmString = rhythm.reverse().join('');
    if (options.rotation) {
      const rotation = options.rotation;
      for (let i =  1; i <= rotation; i++) {
        const nextX = rhythmString.indexOf('x', 1);
        if (nextX > 0) rhythmString = rhythmString.slice(nextX) + rhythmString.slice(0, nextX);
        else break;
      }
      for (let i = -1; i >= rotation; i--) {
        const prevX = rhythmString.lastIndexOf('x');
        if (prevX > 0) rhythmString = rhythmString.slice(prevX) + rhythmString.slice(0, prevX);
        else break;
      }
    }
    return rhythmString;
  }

  *[Symbol.iterator]() {
    const { times, intensities, durations, looped, loopDuration } = this;
    let idx = 0;
    let timeOffset = 0;
    const hasData = times.length && intensities.length && durations.length;
    while (hasData) {
      const time = timeOffset + times[idx % times.length];
      const intensity = intensities[idx % intensities.length];
      const duration = durations[idx % durations.length];
      yield { time, intensity, duration };
      idx++;
      if (idx % times.length == 0) {
        if (looped) {
          timeOffset += loopDuration;
        } else break;
      }
    }
  }
}

module.exports = Rhythm;
