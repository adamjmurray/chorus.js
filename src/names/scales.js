const Scale = require('../model/scale');
const PitchClass = require('../model/pitch-class');
const PITCH_CLASSES = require('./pitch-classes');
const SCALE_TYPES = require('./scale-types');

const SCALES = {};
Object.keys(SCALE_TYPES).forEach(type => {
  const scalesOfType = {};
  for (const name of PitchClass.NAMES) {
    const root = PITCH_CLASSES[name];
    const scale = new Scale(SCALE_TYPES[type], { root }).freeze();
    scalesOfType[root] = scale;
    scalesOfType[root.name] = scale;
  }
  SCALES[type] = scalesOfType;
});

module.exports = Object.freeze(SCALES);
