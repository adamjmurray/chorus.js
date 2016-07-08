const Chord = require('../model/chord');
const CHORD_TYPES = require('./chord-types');

const CHORDS = {};
Object.keys(CHORD_TYPES).forEach(type => {
  const chordsOfType = [];
  // TODO: if we add microtonal support maybe go up to degree 36 for 36-TET (BUT, the chord types probably don't make sense for non 12-TET)
  for (let degree=0; degree<=12; degree++) {
    chordsOfType.push(new Chord(CHORD_TYPES[type], { degree }).freeze());
  }
  CHORDS[type] = chordsOfType;
});

module.exports = Object.freeze(CHORDS);
