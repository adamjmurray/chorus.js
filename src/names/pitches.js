const Pitch = require('../model/pitch');
const MAX_VALUE = Pitch.MAX_VALUE;
const PITCH_CLASS_NAMES = require('../model/pitch-class').NAMES;

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
for (let i = 0; i < MAX_VALUE; i++) {
  PITCHES[nameForMidiPitch(i)] = new Pitch(i).freeze();
}

module.exports = Object.freeze(PITCHES);
