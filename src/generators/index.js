const Harmony = require('./harmony');
const Rhythm = require('./rhythm');
const Section = require('./section');
const Song = require('./song');
const Part = require('./part');
/**
 * #### Iterators that produce musical patterns which can be played or saved to a MIDI file
 * - {@link Harmony}
 * - {@link Rhythm}
 * - {@link Section}
 * - {@link Song}
 * - {@link Track}
 * @module Generators
 */
module.exports = { Harmony, Rhythm, Section, Song, Part };
