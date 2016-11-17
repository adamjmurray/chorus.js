const Sequencer = require('./sequencer');
/**
 * A chord progression generator.
 */
class Harmony extends Sequencer {

  /**
   * @param {Object} options
   * @param {Iterable} options.chords - The list of chords.
   * @param {Iterable} [options.durations=[1,1, ...]] - The list of chord durations. A duration of 1 is 1 beat.
   * @param {Boolean} [options.looped=false] - If true, the chords and durations sequences will auto-restart (independently from each other)
   *        for the duration of containing Section.
   */
  constructor({ chords=[], durations, looped=false }={}) {
    durations = (durations || new Array(chords.length || 1).fill(1)).map(Math.abs);
    const length = durations.reduce((a,b) => a + b, 0);
    const times = [];
    let time = 0;
    for (const duration of durations) {
      times.push(time);
      time += duration;
    }
    super({ time: times, chord: chords }, { length, looped });
    this.chords = chords;
    this.durations = durations;
  }
}

module.exports = Harmony;
