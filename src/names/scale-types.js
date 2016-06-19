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

Object.keys(SCALE_TYPES).forEach(name => Object.freeze(SCALE_TYPES[name]));

module.exports = Object.freeze(SCALE_TYPES);
