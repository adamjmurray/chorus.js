const Scale = require('../model/scale');
const PitchClass = require('../model/pitch-class');
const PITCH_CLASSES = require('./pitch-classes');

const SCALE_TYPES = {
  IONIAN:     [2,2,1,2,2,2,1],
  DORIAN:     [2,1,2,2,2,1,2],
  PHRYGIAN:   [1,2,2,2,1,2,2],
  LYDIAN:     [2,2,2,1,2,2,1],
  MIXOLYDIAN: [2,2,1,2,2,1,2],
  AEOLIAN:    [2,1,2,2,1,2,2],
  LOCRIAN:    [1,2,2,1,2,2,2],
  HARMONIC_MINOR: [2,1,2,2,1,3,1]
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
