const Rhythm = require('./rhythm');

/**
 * A chord progression.
 */
class Harmony {

  constructor({chords=[], rhythm, rate=1, looped}={}) {
    this.chords = chords;
    if (rhythm) {
      this.rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, { rate });
    } else {
      rhythm = new Array(chords.length);
      rhythm.fill(1);
      this.rhythm = new Rhythm(rhythm, { rate });
    }
    this.looped = looped;
    this.loopDuration = this.rhythm.duration;
    this.duration = looped ? Infinity : this.loopDuration;
  }

  *[Symbol.iterator]() {
    let chordDone = false;
    let rhythmDone = false;
    let chordIter = this.chords[Symbol.iterator]();
    let rhythmIter = this.rhythm[Symbol.iterator]();
    let timeOffset = 0;
    while (true) { // eslint-disable-line no-constant-condition
      let chordNext = chordIter.next();
      let rhythmNext = rhythmIter.next();
      if (chordNext.done) {
        chordDone = true;
        chordIter = this.chords[Symbol.iterator]();
        chordNext = chordIter.next();
      }
      if (rhythmNext.done) {
        rhythmDone = true;
        rhythmIter = this.rhythm[Symbol.iterator]();
        rhythmNext = rhythmIter.next();
        timeOffset += this.loopDuration;
      }
      if (chordDone && rhythmDone && !this.looped) break;
      const event = rhythmNext.value;
      const chord = chordNext.value;
      yield {time: event.time + timeOffset, chord};
    }
  }
}

module.exports = Harmony;
