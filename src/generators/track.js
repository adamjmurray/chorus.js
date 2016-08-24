const Rhythm = require('./rhythm');

/**
 * A Track
 */
class Track {

  constructor({channel, mode, pitches, rhythm, rate=1, octave=4, looped} = {}) {
    this.channel = channel;
    this.mode = mode;
    this.pitches = pitches; // NOTE: these are relative, depends on scale/chords and follow settings
    this.rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, {rate});
    this.octave = octave;
    this.duration = looped ? Infinity : this.rhythm.duration;
    // TODO: support looping
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
