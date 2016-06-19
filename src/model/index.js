const PitchClass = require('./pitch-class');
const Pitch = require('./pitch');
const pitchClassNames = PitchClass.names();
const Chord = require('./chord');

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

const SCALE_TYPE = {
  IONIAN:     [2,2,1,2,2,2,1],
  DORIAN:     [2,1,2,2,2,1,2],
  PHRYGIAN:   [1,2,2,2,1,2,2],
  LYDIAN:     [2,2,2,1,2,2,1],
  MIXOLYDIAN: [2,2,1,2,2,1,2],
  AEOLIAN:    [2,1,2,2,1,2,2],
  LOCRIAN:    [1,2,2,1,2,2,2],

  HARMONIC_MINOR: [2,1,2,2,1,3,1]
};
SCALE_TYPE.MAJOR = SCALE_TYPE.IONIAN;
SCALE_TYPE.MINOR = SCALE_TYPE.NATURAL_MINOR = SCALE_TYPE.AEOLIAN;
Object.keys(SCALE_TYPE).forEach(name => Object.freeze(SCALE_TYPE[name]));
Object.freeze(SCALE_TYPE);

const CHORD_TYPE = {
  TRIAD: [0,2,4],
  INV1:  [0,2,5],
  INV2:  [0,3,5],
  SUS2:  [0,1,4],
  SUS4:  [0,2,3],
  FOURFIVE: [0,3,4],
  SEVENTH: [0,2,4,6],
  SEVENTH_INV1: [0,2,4,5],
  SEVENTH_INV2: [0,2,3,5],
  SEVENTH_INV3: [0,1,3,5],
};
Object.keys(CHORD_TYPE).forEach(name => Object.freeze(CHORD_TYPE[name]));
Object.freeze(CHORD_TYPE);

module.exports = {
  PITCH_CLASS,
  PITCH,
  SCALE_TYPE,
  CHORD_TYPE,
  into(namespace) {
    return Object.assign(namespace, PITCH_CLASS, PITCH, SCALE_TYPE, CHORD_TYPE);
  }
};
