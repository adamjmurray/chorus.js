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
  constructor(rhythm, { rate=1/4, durationMod=0.99 } = {}) {
    const times = [];
    const durations = [];
    let intensities;
    if (typeof rhythm === 'string') {
      this.string = rhythm;
      intensities = [];
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
      let nextTime;
      for (const value of rhythm) {
        nextTime = time + (rate * value);
        times.push(time);
        durations.push(nextTime - time);
        time = nextTime;
      }
      intensities = new Array(8).fill(0.7);
    }
    this.times = times;
    this.intensities = intensities || [];
    this.durations = durations;
    this.durationMod = durationMod;
  }

  /**
   * Generates a Rhythm using a Euclidean algorithm. It evenly distributes the given number of pulses into the given
   * total number of time units.
   * @param pulses {number}
   * @param total {number}
   * @param options accepts the same options as the constructor, plus a rotation option
   * @see https://en.wikipedia.org/wiki/Euclidean_rhythm
   * @see https://charlesrthompson.com/2015/02/25/using-euclidean-rhythms-to-create-new-beat-patterns/
   */
  static distribute(pulses, total, options={}) {
    if (!(pulses < total)) throw new Error('pulses must be less than total');
    // This isn't actually the euclidean algorithm (see below for a "real" one), but I believe
    // this simpler Math.floor-based alternative gives the same results (potentially rotated)
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
    // return new Rhythm(rhythmString, options);

    // I think this is a "proper" euclidean rhythm algorithm, as explained here:
    // http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf
    // and here:
    // https://charlesrthompson.com/2015/02/25/using-euclidean-rhythms-to-create-new-beat-patterns/
    // But it does a lot of array concats so it doesn't seem very efficient.
    /*
    const rhythm = new Array(total);
    for (let i=0; i<total; i++) {
      rhythm[i] = [i < pulses ? 'x' : '.'];
    }
    let rests = total - pulses;
    let prev = Math.max(pulses, rests);
    let remainder = Math.min(pulses, rests);
    console.log('init', rhythm);
    while (remainder > 0) {
      console.log([prev, remainder]);
      for (let i=0; i < remainder; i++) {
        rhythm[i] = rhythm[i].concat(rhythm.pop());
      }
      console.log('after pass', rhythm);
      [prev, remainder] = [remainder, prev - remainder];
    }
    console.log('euclidean rhythm', rhythm[0].join(''));
    */
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
