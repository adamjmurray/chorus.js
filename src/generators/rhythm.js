'use strict';

/**
 * Iterates over a list of values.
 */
class Rhythm {

  constructor(rhythm, { rate=1/4, duration, relativeDuration=0.99 } = {}) {
    const timeToIntensity = new Map();
    if (typeof rhythm === 'string') {
      [...rhythm.toString()].forEach((char, index) => {
        const time = rate * index;
        switch (char) {
          case 'X':
            timeToIntensity.set(time, 1.0);
            break;
          case 'x':
            timeToIntensity.set(time, 0.5);
            break;
          case '=':
            break;
          case '.':
            timeToIntensity.set(time, 0);
            break;
          default:
        }
      });
    } else {
      let time = 0;
      for (const value of rhythm) {
        timeToIntensity.set(time, 1.0); // TODO: can we somehow indicate this isn't an intensity? use boolean true?
        time += rate * value;
      }
    }
    this.timeToIntensity = timeToIntensity;
    this.duration = duration;
    this.relativeDuration = relativeDuration;
  }

  *[Symbol.iterator]() {
    const times = [...this.timeToIntensity.keys()].sort((a,b) => a - b);
    for (let idx=0; idx < times.length; idx++) {
      const time = times[idx];
      const intensity = this.timeToIntensity.get(time);
      if (intensity) {
        const nextTime = times[idx + 1];
        let duration;
        if (nextTime) {
          duration = this.duration || (nextTime - time) * this.relativeDuration; // TODO: sequenced durations
        } else {
          duration = this.duration || this.rate * this.relativeDuration;
        }
        yield {time, intensity, duration};
      }
    }
  }

}

module.exports = Rhythm;
