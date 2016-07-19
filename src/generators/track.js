const Rhythm = require('./rhythm');

/**
 * A Track (this is more like a Phrase though?)
 */
class Track {

  constructor({channel, mode, pitches, rhythm, rate} = {}) {
    this.channel = channel;
    this.mode = mode;
    this.pitches = pitches; // NOTE: these are relative, depends on scale/chords and follow settings
    this.rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, {rate});
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

module.exports = Track;
