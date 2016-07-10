const Rhythm = require('./rhythm');
const Melody = require('./melody');

/**
 * A Track (this is more like a Phrase though?)
 */
class Track {

  constructor({channel, mode, pitches, rhythm, rate} = {}) {
    this.channel = channel;
    this.mode = mode;
    this.pitches = pitches; // NOTE: these are relative, depends on scale/chords and follow settings
    this.rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, {rate});
    this.sequencer = new Melody({ pitches, rhythm: this.rhythm });
  }

  *[Symbol.iterator]() {
    yield *this.sequencer[Symbol.iterator]();
  }
}

module.exports = Track;
