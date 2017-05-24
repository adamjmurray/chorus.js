const Pitch = require('../model/pitch');
const MAX_VALUE = Pitch.MAX_VALUE;

/**
 * Built-in pitches
 */
const PITCHES = {};
for (let i = 0; i <= MAX_VALUE; i++) {
  const pitch = new Pitch(i);
  PITCHES[pitch.name] = pitch;
}

module.exports = Object.freeze(PITCHES);
