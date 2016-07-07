/**
 * A Melody generates note tuples `{time, pitch, intensity, duration}`.
 * The Pitch could be a Number representing a relative pitch (scale degree or chord note depending on the tracks follow mode)
 * or an absolute Pitch
 */
class Melody {

  constructor({pitches, rhythm} = {}) {
    this.pitches = pitches;
    this.rhythm = rhythm;
  }

  *[Symbol.iterator]() {
    const {pitches, rhythm} = this;
    let index = 0;
    for (const event of rhythm) {
      event.pitch = pitches[index++ % pitches.length];
      yield event;
    }
  }
}

module.exports = Melody;
