const Rhythm = require('./rhythm');
const Sequencer = require('./sequencer');

/**
 * A Track (this is more like a Phrase though?)
 */
class Track {

  constructor({channel, follow, pitches, rhythm, rate} = {}) {
    this.channel = channel;
    this.follow = follow;
    // TODO: pitches and rhythm should be coming from a sequencer
    this.pitches = pitches; // NOTE: these are relative, depends on scale/chords and follow settings
    this.rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, {rate});
    this.sequencer = new Sequencer({ pitches, rhythm: this.rhythm });
  }

  // TODO: the pitches are relative. Somehow we need to apply the current chords and follow settings
  *[Symbol.iterator]() {
    yield *this.sequencer[Symbol.iterator]();
  }
}

module.exports = Track;
