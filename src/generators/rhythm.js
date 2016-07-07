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
   * @param {Number} [options.duration] duration the duration of all notes
   * @param {Number} [options.relativeDuration=0.99] relativeDuration makes the duration relative to the time-delta's between notes. The default 0.99 is nearly legato.
   */
  constructor(rhythm, { rate=1/4, intensities, durations, durationMod=0.99 } = {}) {
    const times = [];
    if (typeof rhythm === 'string') {
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
    } else {
      let time = 0;
      for (const value of rhythm) {
        times.push(time);
        time += rate * value;
      }
    }
    this.times = times;
    this.intensities = intensities || [];
    this.durations = durations || [];
    this.durationMod = durationMod;
  }

  *[Symbol.iterator]() {
    const { times, intensities, durations, durationMod } = this;
    for (let idx=0; idx < times.length; idx++) {
      const time = times[idx];
      const intensity = intensities[idx % intensities.length];
      const duration = durations[idx % durations.length];
      const data = { time };
      if (intensity) data.intensity = intensity;
      if (duration) data.duration = duration * durationMod;
      yield data;
    }
  }
}

module.exports = Rhythm;
