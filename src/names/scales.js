const Scale = require('../models/scale');
const PitchClass = require('../models/pitch-class');
const PITCH_CLASSES = require('./pitch-classes');

const SCALE_TYPES = {
  // 8 pitches per octave:
  OCTATONIC: [2,1,2,1,2,1,2,1],
  OCTATONIC2: [1,2,1,2,1,2,1,2],
  BEBOP_DOMINANT: [2,2,1,2,2,1,1,1],
  // TODO: more bebop scales: https://en.wikipedia.org/wiki/Bebop_scale
  // 7 pitches per octave:
  IONIAN:     [2,2,1,2,2,2,1],
  DORIAN:     [2,1,2,2,2,1,2],
  PHRYGIAN:   [1,2,2,2,1,2,2],
  LYDIAN:     [2,2,2,1,2,2,1],
  MIXOLYDIAN: [2,2,1,2,2,1,2],
  AEOLIAN:    [2,1,2,2,1,2,2],
  LOCRIAN:    [1,2,2,1,2,2,2],
  HARMONIC_MINOR: [2,1,2,2,1,3,1],
  HARMONIC_MAJOR: [2,2,1,2,1,3,1],
  ACOUSTIC: [2,2,2,1,2,1,2],
  ALGERIAN: [2,1,3,1,1,3,1],
  ALGERIAN_FULL: [2,1,3,1,1,3,1,2,1,2,2,1,3,1], // https://en.wikipedia.org/wiki/Algerian_scale
  ALTERED: [1,2,1,2,2,2,2],
  BYZANTINE: [1,3,1,2,1,3,1],
  ENIGMATIC: [1,3,2,2,2,1,1],
  FREYGISH: [1,3,1,2,1,2,2],
  // TODO: GYPSY, etc... https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes
  // 6 pitches per octave:
  WHOLE_TONE: [2,2,2,2,2,2],
  AUGMENTED: [3,1,3,1,3,1],
  PROMETHEUS: [2,2,2,3,1,2],
  BLUES: [3,2,1,1,3,2],
  // 5 pitches per octave:
  PENTATONIC_MAJOR: [2,2,3,2,3],
  PENTATONIC_MINOR: [3,2,2,3,2],
  // TODO: more pentatonic scales: https://en.wikipedia.org/wiki/Pentatonic_scale
};
SCALE_TYPES.MAJOR = SCALE_TYPES.IONIAN;
SCALE_TYPES.MINOR = SCALE_TYPES.NATURAL_MINOR = SCALE_TYPES.AEOLIAN;

const SCALES = {};
Object.keys(SCALE_TYPES).forEach(type => {
  const scalesOfType = {};
  for (const name of PitchClass.NAMES) {
    const root = PITCH_CLASSES[name];
    const scale = new Scale(SCALE_TYPES[type], { root });
    scalesOfType[root] = scale;
    scalesOfType[root.name] = scale;
  }
  SCALES[type] = scalesOfType;
});

module.exports = Object.freeze(SCALES);
