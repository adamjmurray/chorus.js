const PitchClass = require('../models/pitch-class');
const names = PitchClass.NAMES;
const PITCH_CLASSES = {};
for (let i = 0; i < names.length; i++) {
  PITCH_CLASSES[names[i]] = new PitchClass(i);
}

module.exports = Object.freeze(PITCH_CLASSES);
