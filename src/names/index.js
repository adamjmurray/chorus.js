const CHORD_TYPES = require('./chord-types');
const PITCH_CLASSES = require('./pitch-classes');
const PITCHES = require('./pitches');
const SCALE_TYPES = require('./scale-types');

module.exports = {
  CHORD_TYPES,
  PITCH_CLASSES,
  PITCHES,
  SCALE_TYPES,
  into(namespace) {
    return Object.assign(namespace, CHORD_TYPES, PITCH_CLASSES, PITCHES, SCALE_TYPES);
  },
};
