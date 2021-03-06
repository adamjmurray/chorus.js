const Chord = require('../model/chord');

const CHORD_TYPES = {
  TRIAD: [0,2,4],
  TRIAD_SUS2:  [0,1,4],
  TRIAD_SUS4:  [0,3,4],
  TRIAD_PLUS_8: [0,2,4,7],
  QUARTAL: [0,3,6],
  QUINTAL: [0,4,8],
  SIXTH: [0,2,4,5],
  SEVENTH: [0,2,4,6],
  NINTH: [0,2,4,6,8],
};

/**
 * Built-in chords
 */
const CHORDS = {};
Object.keys(CHORD_TYPES).forEach(type =>
  CHORDS[type] = (root, inversion) =>
    new Chord(CHORD_TYPES[type].map(degree => root + degree), inversion));

module.exports = Object.freeze(CHORDS);
