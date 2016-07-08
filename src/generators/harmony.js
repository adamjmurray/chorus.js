const Rhythm = require('./rhythm');

/**
 * A chord progression.
 */
class Harmony {

  constructor({chords, rhythm, rate=1}={}) {
    this.chords = chords;
    if (rhythm) {
      this.rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, { rate });
    } else {
      // TODO: maybe instead of this, the Section length can control how long the rhythm goes (it can be [1] by default, and loop)
      rhythm = new Array(chords.length);
      rhythm.fill(1);
      this.rhythm = new Rhythm(rhythm, { rate });
    }
  }

  *[Symbol.iterator]() {
    const {chords, rhythm} = this;
    let index = 0;
    for (const event of rhythm) {
      const chord = chords[index++ % chords.length];
      yield {time: event.time, chord};
    }
  }
}

module.exports = Harmony;
