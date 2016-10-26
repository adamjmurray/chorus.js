/**
 * A chord progression generator.
 */
class Harmony {

  /**
   * @param {Object} options
   * @param {Iterable} options.chords - The list of chords.
   * @param {Number} [options.rate=1] - The relative rate of the duration of each chord.
   * @param {Iterable} [options.durations=[1,1, ...]] - The list of relative durations. A duration of 1 at a rate of 1 is 1 beat.
   * @param {Number} [options.length=sum of durations * rate] - The overall duration in beats of this Harmony sequence.
   * @param {Boolean} [options.looped=false] - If true, the chords and durations sequences will auto-restart (independently from each other)
   *        for the duration of containing Section.
   */
  constructor({chords=[], rate=1, durations, length, looped}={}) {
    this.chords = chords;
    this.rate = Math.abs(rate);
    this.durations = (durations || new Array(chords.length || 1).fill(1)).map(Math.abs);
    this.length = length || this.durations.reduce((a,b) => a + b) * rate;
    this.looped = looped;
    this.times = [];
    let time = 0;
    for (const duration of this.durations) {
      this.times.push(time);
      time += rate * duration;
    }
  }

  *[Symbol.iterator]() {
    let chordDone = false;
    let timeDone = false;
    let chordIter = this.chords[Symbol.iterator]();
    let timeIter = this.times[Symbol.iterator]();
    let timeOffset = 0;
    do {
      let chordNext = chordIter.next();
      let timeNext = timeIter.next();
      if (chordNext.done) {
        chordDone = true;
        chordIter = this.chords[Symbol.iterator]();
        chordNext = chordIter.next();
      }
      if (timeNext.done) {
        timeDone = true;
        timeIter = this.times[Symbol.iterator]();
        timeNext = timeIter.next();
        timeOffset += this.length;
      }
      // if (chordDone && timeDone && !this.looped) break; // TODO: should we always yield one thing?
      yield {time: timeNext.value + timeOffset, chord: chordNext.value};
    } while (this.looped || !chordDone || !timeDone)
  }
}

module.exports = Harmony;
