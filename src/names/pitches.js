const Pitch = require('../models/pitch');
const MAX_VALUE = Pitch.MAX_VALUE;
const PITCH_CLASS_NAMES = require('../models/pitch-class').NAMES;

// TODO: rework this into Pitch.toString() or pitch.name
function nameForMidiPitch(midiPitch) {
  const pitchClassName = PITCH_CLASS_NAMES[midiPitch % 12];
  let octave = Math.floor(midiPitch / 12) - 1;
  let neg = '';
  if (octave < 0) {
    neg = '_';
    octave = -octave;
  }
  return `${pitchClassName}${neg}${octave}`
}

const PITCHES = {};
for (let i = 0; i <= MAX_VALUE; i++) {
  PITCHES[nameForMidiPitch(i)] = new Pitch(i);
}

module.exports = Object.freeze(PITCHES);
