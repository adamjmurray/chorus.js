const Chord = require('../model/chord');

const CHORD_TYPES = {
  TRIAD: [0,2,4],
  TRIAD_INV1:  [0,2,5],
  TRIAD_INV2:  [0,3,5],
  TRIAD_SUS2:  [0,1,4],
  TRIAD_SUS4:  [0,3,4],
  QUARTAL: [0,3,6],
  QUINTAL: [0,4,8],
  SEVENTH: [0,2,4,6],
  SEVENTH_INV1: [0,2,4,5],
  SEVENTH_INV2: [0,2,3,5],
  SEVENTH_INV3: [0,1,3,5],
};
const CHORDS = {};
Object.keys(CHORD_TYPES).forEach(name => CHORDS[name] = new Chord(CHORD_TYPES[name]).freeze());

module.exports = Object.freeze(CHORDS);
