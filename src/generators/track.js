const Rhythm = require('./rhythm');
const { TimedMultiIterable } = require('../utils');

/**
 * A Track
 */
class Track extends TimedMultiIterable {

  constructor({ channel, mode, pitches, rhythm, rate=1, octave=4, length, looped }={}) {
    rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(rhythm, {rate});
    length = length || rhythm.length;
    super({ time: rhythm, pitch: pitches }, { length, looped });
    this.channel = channel;
    this.mode = mode;
    this.pitches = pitches;
    this.rhythm = rhythm;
    this.octave = octave;
  }
}

module.exports = Track;
