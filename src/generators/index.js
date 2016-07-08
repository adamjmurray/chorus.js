const Harmony = require('./harmony');
const Melody = require('./melody');
const Rhythm = require('./rhythm');
const Song = require('./song');
const Track = require('./track');

/**
 * @module Generators
 * @description
 * #### Classes that produce musical patterns which can be played or saved to a MIDI file
 * <br>
 */
module.exports = {

  /** @member {Harmony} Harmony the Harmony class */
  Harmony,

  /** @member {Melody} Melody the Sequencer class */
  Melody,

  /** @member {Rhythm} Rhythm the Rhythm class */
  Rhythm,

  /** @member {Song} Song the Song class */
  Song,

  /** @member {Track} Track the Track class */
  Track,
};

