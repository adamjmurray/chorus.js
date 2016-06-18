const PitchClass = require('./pitch-class');
const Pitch = require('./pitch');
const pitchClassNames = PitchClass.names();

function nameForMidiPitch(midiPitch) {
  const pitchClassName = pitchClassNames[midiPitch % 12];
  let octave = Math.floor(midiPitch / 12) - 1;
  let neg = '';
  if (octave < 0) {
    neg = '_';
    octave = -octave;
  }
  return `${pitchClassName}${neg}${octave}`
}

const pitchClasses = {};
for (let i=0; i < 12; i++) {
  pitchClasses[pitchClassNames[i]] = new PitchClass(i).freeze();
}
Object.freeze(pitchClasses);

const pitches = {};
for (let i=0; i < 128; i++) {
  pitches[nameForMidiPitch(i)] = new Pitch(i).freeze();
}
Object.freeze(pitches);

module.exports = {
  pitches,
  pitchClasses,
  inject(namespace) {
    Object.assign(namespace, pitchClasses, pitches);
  }
};
