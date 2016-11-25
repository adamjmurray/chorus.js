const MidiFile = require('./file');
const MidiIn = require('./midi-in');
const MidiOut = require('./midi-out');
const Scheduler = require('./scheduler');
/**
 * @module midi
 * @description
 * #### Classes for MIDI input and output, in realtime and via files.
 * - {@link MidiFile}
 * - {@link MidiIn}
 * - {@link MidiOut}
 * - {@link Scheduler}
 */
module.exports = { MidiFile, MidiIn, MidiOut, Scheduler };
