const { TimedMultiIterable } = require('../utils');
/**
 * A chord progression generator.
 */
class Harmony extends TimedMultiIterable {

  /**
   * @param {Object} options
   * @param {Iterable} options.chords - The list of chords.
   * @param {Number} [options.rate=1] - The relative rate of the duration of each chord.
   * @param {Iterable} [options.durations=[1,1, ...]] - The list of relative durations. A duration of 1 at a rate of 1 is 1 beat.
   * @param {Number} [options.length=sum of durations * rate] - The overall duration in beats of this Harmony sequence.
   * @param {Boolean} [options.looped=false] - If true, the chords and durations sequences will auto-restart (independently from each other)
   *        for the duration of containing Section.
   */
  constructor({ chords=[], rate=1, durations, length, looped }={}) {
    rate = Math.abs(rate);
    durations = (durations || new Array(chords.length || 1).fill(1)).map(Math.abs);
    length = length || durations.reduce((a,b) => a + b) * rate;
    const times = [];
    let time = 0;
    for (const duration of durations) {
      times.push(time);
      time += rate * duration;
    }
    super({ time: times, chord: chords }, { length, looped });
    this.chords = chords;
    this.rate = rate;
    this.durations = durations;
  }
}

module.exports = Harmony;
