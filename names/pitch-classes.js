const PitchClass = require('../model/pitch-class');
const names = PitchClass.NAMES;

/**
 * Built-in pitch classes
 */
const PITCH_CLASSES = {};
for (let i = 0; i < names.length; i++) {
  PITCH_CLASSES[names[i]] = new PitchClass(i);
}

module.exports = Object.freeze(PITCH_CLASSES);
