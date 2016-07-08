const MIDIFile = require('./file');
const MIDIIn = require('./in');
const MIDIOut = require('./out');
const Scheduler = require('./scheduler');

/**
 * @module MIDI
 */
module.exports = {
  /** @member {MIDIFile} MIDIFile the MIDIFile class */
  MIDIFile,

  /** @member {MIDIIn} MIDIIn the MIDIIn class */
  MIDIIn,

  /** @member {MIDIOut} MIDIOut the MIDIOut class */
  MIDIOut,

  /** @member {Scheduler} Scheduler the Scheduler class */
  Scheduler,
};
