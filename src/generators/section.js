const Track = require('./track');
const Harmony = require('./harmony');

/**
 * A Song section
 */
class Section {

  constructor({harmony, tracks=[], duration} = {}) {
    this.harmony = harmony instanceof Harmony ? harmony : new Harmony(harmony);
    this.tracks = tracks.map(t => t instanceof Track ? t : new Track(t));
    this.duration = duration;
    // TODO: option to have the harmony "wrap around"? Or should we be using a Cycle... hmmm...
  }

}

module.exports = Song;
