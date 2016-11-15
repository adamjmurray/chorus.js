const MidiFile = require('./file');
const MidiIn = require('./midi-in');
const MidiOut = require('./midi-out');
const Scheduler = require('./scheduler');
/**
 * #### Classes for MIDI input and output, in realtime and via files.
 * - {@link MidiFile}
 * - {@link MidiIn}
 * - {@link MidiOut}
 * - {@link Scheduler}
 * @module MIDI
 */
module.exports = { MidiFile, MidiIn, MidiOut, Scheduler };
