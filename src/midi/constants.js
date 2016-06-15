// TODO: maybe make the * constants be the constants in this file (the MIDI constants), and remove the BYTE suffix
// Make these other constants EVENT constants
module.exports = Object.freeze({
  NOTE_OFF: 0x80,
  NOTE_ON: 0x90,
  NOTE_AFTERTOUCH: 0xA0,
  CONTROLLER: 0xB0,
  PROGRAM_CHANGE: 0xC0,
  CHANNEL_AFTERTOUCH: 0xD0,
  PITCH_BEND: 0xE0,
});
