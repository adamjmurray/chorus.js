const MIDIFile = require('./file');
const MIDIIn = require('./in');
const MIDIOut = require('./out');
const Scheduler = require('./scheduler');
/**
 * #### Classes for MIDI input and output, in realtime and via files.
 * - {@link MIDIFile}
 * - {@link MIDIIn}
 * - {@link MIDIOut}
 * - {@link Scheduler}
 * @module MIDI
 */
module.exports = { MIDIFile, MIDIIn, MIDIOut, Scheduler };
