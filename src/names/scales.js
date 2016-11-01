const Scale = require('../models/scale');
const PitchClass = require('../models/pitch-class');
const PITCH_CLASSES = require('./pitch-classes');

const SCALE_TYPES = {
  CHROMATIC: [1,1,1,1,1,1,1,1,1,1,1,1],
  // 8 pitches per octave:
  OCTATONIC: [2,1,2,1,2,1,2,1],
  OCTATONIC2: [1,2,1,2,1,2,1,2],
  BEBOP_DOMINANT: [2,2,1,2,2,1,1,1],
  BEBOP_DORIAN: [2,1,1,1,2,2,1,2],
  BEBOP_HARMONIC_MINOR: [2,1,2,2,1,2,1,1],
  BEBOP_MAJOR: [2,2,1,2,1,1,2,1],
  BEBOP_MELODIC_MINOR: [2,1,2,2,1,1,2,1],
  // 7 pitches per octave / diatonic scales:
  IONIAN:     [2,2,1,2,2,2,1],
  DORIAN:     [2,1,2,2,2,1,2],
  PHRYGIAN:   [1,2,2,2,1,2,2],
  LYDIAN:     [2,2,2,1,2,2,1],
  MIXOLYDIAN: [2,2,1,2,2,1,2],
  AEOLIAN:    [2,1,2,2,1,2,2],
  LOCRIAN:    [1,2,2,1,2,2,2],
  // 7 pitches per octave / other:
  ACOUSTIC: [2,2,2,1,2,1,2],
  ALTERED: [1,2,1,2,2,2,2],
  BYZANTINE: [1,3,1,2,1,3,1],
  ENIGMATIC: [1,3,2,2,2,1,1],
  FREYGISH: [1,3,1,2,1,2,2],
  HALF_DIMINISHED: [2,1,2,1,2,2,2],
  HARMONIC_MINOR: [2,1,2,2,1,3,1],
  HARMONIC_MAJOR: [2,2,1,2,1,3,1],
  HUNGARIAN: [2,1,3,1,1,2,2],
  HUNGARIAN_MINOR: [2,1,3,1,1,3,1],
  LOCRIAN_MAJOR: [2,2,1,1,2,2,2],
  LYDIAN_AUGMENTED: [2,2,2,2,1,2,1],
  MELODIC_MINOR: [2,1,2,2,2,2,1],
  NEAPOLITAN_MAJOR: [1,2,2,2,2,2,1],
  NEAPOLITAN_MINOR: [1,2,2,2,1,3,1],
  PELOG: [1,2,3,1,1,2,2],
  PERSIAN: [1,3,1,1,2,3,1],
  PHRYGIAN_DOMINANT: [1,3,1,2,1,2,2],
  UKRAINIAN_DORIAN: [2,1,3,1,2,1,2],
  // 6 pitches per octave:
  AUGMENTED: [3,1,3,1,3,1],
  BLUES: [3,2,1,1,3,2],
  OF_HARMONICS: [3,1,1,2,2,3],
  PROMETHEUS: [2,2,2,3,1,2],
  TRITONE: [1,3,2,1,3,2],
  WHOLE_TONE: [2,2,2,2,2,2],
  // 5 pitches per octave:
  PENTATONIC_MAJOR: [2,2,3,2,3],
  PENTATONIC_MINOR: [3,2,2,3,2],
  EGYPTIAN: [2,3,2,3,2],
  HIRAJOSHI: [4,2,1,4,1],
  INSEN: [1,4,2,3,2],
  IWATO: [1,4,1,4,2],
  MAN_GONG: [3,2,3,2,2],
  SAKURA: [1,4,2,1,4],
  SLENDRO: [2,3,2,2,3],
};
SCALE_TYPES.MAJOR = SCALE_TYPES.IONIAN;
SCALE_TYPES.MINOR = SCALE_TYPES.NATURAL_MINOR = SCALE_TYPES.AEOLIAN;

const SCALES = {};
Object.keys(SCALE_TYPES).forEach(type => {
  SCALES[type] = (root) =>
    new Scale(SCALE_TYPES[type], { root });
});

module.exports = Object.freeze(SCALES);
