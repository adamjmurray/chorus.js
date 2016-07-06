const Rhythm = require('./rhythm');

/**
 * A chord progression.
 */
class Harmony {

  constructor({scale, chords, rhythm, rate=1} = {}) {
    this.scale = scale;
    chords.forEach(chord => chord.scale = scale);
    this.chords = chords;
    if (rhythm) {
      this.rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, { rate });
    } else {
      rhythm = new Array(chords.length);
      rhythm.fill(1);
      this.rhythm = new Rhythm(rhythm, { rate });
    }
  }

  *[Symbol.iterator]() {
    let index = 0;
    for (const event of this.rhythm) {
      const chord = this.chords[index++ % this.chords.length];
      yield {time: event.time, chord};
    }
  }
}

module.exports = Harmony;
