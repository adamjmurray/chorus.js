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

const PITCH_CLASS = {};
for (let i=0; i < 12; i++) {
  PITCH_CLASS[pitchClassNames[i]] = new PitchClass(i).freeze();
}
Object.freeze(PITCH_CLASS);

const PITCH = {};
for (let i=0; i < 128; i++) {
  PITCH[nameForMidiPitch(i)] = new Pitch(i).freeze();
}
Object.freeze(PITCH);

const SCALE = {
  IONIAN:     [2,2,1,2,2,2,1],
  DORIAN:     [2,1,2,2,2,1,2],
  PHRYGIAN:   [1,2,2,2,1,2,2],
  LYDIAN:     [2,2,2,1,2,2,1],
  MIXOLYDIAN: [2,2,1,2,2,1,2],
  AEOLIAN:    [2,1,2,2,1,2,2],
  LOCRIAN:    [1,2,2,1,2,2,2],

  HARMONIC_MINOR: [2,1,2,2,1,3,1]
};
SCALE.MAJOR = SCALE.IONIAN;
SCALE.MINOR = SCALE.NATURAL_MINOR = SCALE.AEOLIAN;
Object.keys(SCALE).forEach(name => Object.freeze(SCALE[name]));
Object.freeze(SCALE);

module.exports = {
  PITCH_CLASS,
  PITCH,
  SCALE,
  into(namespace) {
    return Object.assign(namespace, PITCH_CLASS, PITCH, SCALE);
  }
};
