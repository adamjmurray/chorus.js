const PitchClass = require('./model/pitch-class');
const Pitch = require('./model/pitch');

// TODO: but how do I import them
function symbolFor(midiPitch) {
  const pitchClassName = PitchClass.names()[midiPitch % 12];
  let octave = Math.floor(midiPitch / 12) - 1;
  let neg = '';
  if (octave < 0) {
    neg = '_';
    octave = -octave;
  }
  return `${pitchClassName}${neg}${octave}`
}

const constants = {};
for (let i=0; i<128; i++) {
  global[symbolFor(i)] = new Pitch(i);
}

module.exports = constants;
